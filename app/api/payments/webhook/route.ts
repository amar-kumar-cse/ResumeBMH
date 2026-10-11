import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/razorpay";
import { repository } from "@/lib/db/repository";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing x-razorpay-signature header." },
        { status: 400 }
      );
    }

    const rawBody = await req.text();

    const isValid = paymentService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("Unauthorized webhook attempt rejected: invalid signature");
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    // 1. Handle successful payment events (order.paid or payment.captured)
    if (eventType === "order.paid" || eventType === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const razorpayOrderId = orderEntity?.id || paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id || "webhook_captured";

      if (razorpayOrderId) {
        const order = await repository.getOrderByRazorpayId(razorpayOrderId);
        if (order && order.status !== "paid") {
          await repository.confirmPaymentAndUpgradePro(
            razorpayOrderId,
            razorpayPaymentId,
            { billingCycle: order.billingCycle }
          );
          console.log(`Webhook successfully fulfilled Pro subscription for user ${order.userId} on order ${razorpayOrderId}`);
        }
      }
    }

    // 2. Handle failed payments (payment.failed)
    if (eventType === "payment.failed") {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      if (razorpayOrderId) {
        await repository.markOrderFailed(razorpayOrderId);
        console.warn(`Webhook marked order ${razorpayOrderId} as failed.`);
      }
    }

    // 3. Handle refunds (refund.processed, refund.created, payment.refunded)
    if (eventType === "refund.processed" || eventType === "refund.created" || eventType === "payment.refunded") {
      const refundEntity = event.payload?.refund?.entity;
      const paymentEntity = event.payload?.payment?.entity;
      const paymentId = refundEntity?.payment_id || paymentEntity?.id;

      if (paymentId) {
        await repository.markOrderRefunded(paymentId);
        console.warn(`Webhook processed refund for payment ${paymentId}; downgraded user to free plan.`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: "Internal webhook processing error." },
      { status: 500 }
    );
  }
}
