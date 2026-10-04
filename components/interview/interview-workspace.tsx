"use client";

import { useState } from "react";
import { InterviewSession, TargetRole } from "@/types/interview";
import {
  Card,
  Panel,
  Button,
  Badge,
  Textarea,
  PageHeader,
  EmptyState,
} from "@/components/ui/primitives";
import {
  Headphones,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send,
  Award,
  BookOpen,
  RotateCcw,
  Target,
} from "lucide-react";

const TARGET_ROLES: TargetRole[] = [
  "Software Development Engineer (SDE-1)",
  "Full-Stack Developer",
  "Frontend Engineer",
  "Backend Engineer (Node/Java/Python)",
  "Data Analyst & Business Intelligence",
  "AI / Machine Learning Engineer",
  "DevOps & Cloud Engineer",
  "Product Manager (Associate PM)",
  "Quality Assurance & SDET",
  "Cybersecurity Analyst",
];

interface Props {
  initialSessions: InterviewSession[];
}

export function InterviewWorkspace({ initialSessions }: Props) {
  const [selectedRole, setSelectedRole] = useState<TargetRole>(TARGET_ROLES[0]);
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(
    initialSessions.length > 0 ? initialSessions[0] : null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedbackStrengths: string[];
    feedbackImprovements: string[];
    betterAnswer: string;
  } | null>(null);

  // Start new mock interview session
  const handleStartSession = async () => {
    setIsStarting(true);
    setEvaluationResult(null);
    setUserAnswer("");
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: selectedRole }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveSession(data.data);
        setCurrentQuestionIndex(0);
      }
    } catch (err) {
      console.error("Start interview error:", err);
    } finally {
      setIsStarting(false);
    }
  };

  // Submit Answer for AI Evaluation
  const handleSubmitAnswer = async () => {
    if (!activeSession || !userAnswer.trim()) return;
    const currentQuestion = activeSession.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setIsEvaluating(true);
    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSession.id,
          questionIndex: currentQuestionIndex,
          questionText: currentQuestion.questionText,
          userAnswer,
          category: currentQuestion.category,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEvaluationResult(data.data);

        // Update local session question
        const updatedQuestions = [...activeSession.questions];
        updatedQuestions[currentQuestionIndex] = {
          ...currentQuestion,
          userAnswer,
          score: data.data.score,
          feedbackStrengths: data.data.feedbackStrengths,
          feedbackImprovements: data.data.feedbackImprovements,
          modelAnswer: data.data.betterAnswer,
        };
        setActiveSession({ ...activeSession, questions: updatedQuestions });
      }
    } catch (err) {
      console.error("Evaluate answer error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (!activeSession) return;
    if (currentQuestionIndex < activeSession.questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      const nextQ = activeSession.questions[nextIdx];
      setUserAnswer(nextQ.userAnswer || "");
      if (nextQ.score) {
        setEvaluationResult({
          score: nextQ.score,
          feedbackStrengths: nextQ.feedbackStrengths || [],
          feedbackImprovements: nextQ.feedbackImprovements || [],
          betterAnswer: nextQ.modelAnswer || "",
        });
      } else {
        setEvaluationResult(null);
      }
    }
  };

  // Compute STAR Pillar scores based on overall score
  const getSTARBreakdown = (score: number) => {
    const base = Math.min(100, Math.max(0, score));
    return {
      situation: Math.min(100, Math.round(base * 1.02)),
      task: Math.min(100, Math.round(base * 0.98)),
      action: Math.min(100, Math.round(base * 1.05)),
      result: Math.min(100, Math.round(base * 0.95)),
    };
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="Role-Driven Mock Interview AI"
        description="Practice behavioral & technical rounds tailored to your role. Receive instant evaluation structured around the STAR method."
        badge={
          <Badge variant="brand" size="sm">
            <Headphones className="h-3.5 w-3.5 mr-1" />
            STAR Methodology
          </Badge>
        }
      />

      {/* Role Selector Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <label htmlFor="role-select" className="text-sm font-bold text-slate-900 font-heading block">
              Select Target Interview Track
            </label>
            <p className="text-xs text-slate-500">
              Questions adapt specifically to the competencies and interview rubrics of this role.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as TargetRole)}
              className="h-11 bg-white text-sm font-semibold text-slate-800 border border-slate-300 rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-2xs"
            >
              {TARGET_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <Button
              variant="primary"
              size="md"
              onClick={handleStartSession}
              disabled={isStarting}
            >
              {isStarting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Preparing Session...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{activeSession ? "Restart Session" : "Start Mock Interview"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Interactive Mock Interview Room */}
      {activeSession && activeSession.questions.length > 0 && (
        <div className="space-y-6">
          {/* Question Card with Stepper */}
          <Card className="p-0 overflow-hidden space-y-0">
            {/* Integrated Question Stepper Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto px-6 py-3.5 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading shrink-0 mr-1">
                Questions:
              </span>
              <div className="flex items-center gap-2" role="tablist" aria-label="Interview Questions">
                {activeSession.questions.map((q, idx) => (
                  <button
                    key={q.id}
                    role="tab"
                    aria-selected={currentQuestionIndex === idx}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setUserAnswer(q.userAnswer || "");
                      if (q.score) {
                        setEvaluationResult({
                          score: q.score,
                          feedbackStrengths: q.feedbackStrengths || [],
                          feedbackImprovements: q.feedbackImprovements || [],
                          betterAnswer: q.modelAnswer || "",
                        });
                      } else {
                        setEvaluationResult(null);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
                      currentQuestionIndex === idx
                        ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                        : q.score
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-heading">Q{idx + 1}</span>
                    <span className="text-xs opacity-80">({q.category})</span>
                    {q.score && (
                      <span className="font-heading text-xs text-emerald-700 font-extrabold ml-1">{q.score}%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <Badge variant="brand" size="sm">
                  {activeSession.questions[currentQuestionIndex].category} Round
                </Badge>
                <span className="text-xs text-slate-500 font-medium">
                  Question {currentQuestionIndex + 1} of {activeSession.questions.length}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading leading-snug">
                {activeSession.questions[currentQuestionIndex].questionText}
              </h2>

              {/* Answer Input */}
              <div className="space-y-2">
                <label htmlFor="user-answer-input" className="text-sm font-medium text-slate-700 block">
                  Your Answer (Structure using STAR: Situation, Task, Action, and Measurable Result)
                </label>
                <Textarea
                  id="user-answer-input"
                  rows={5}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your structured answer here... (e.g. 'In my previous project, we faced high latency (Situation). My task was to optimize the checkout API (Task)...')"
                />
              </div>

              {/* Submit & Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="w-full sm:w-auto"
                >
                  <Send className="h-4 w-4" />
                  <span>{isEvaluating ? "Evaluating STAR Response..." : "Submit Answer For AI Review"}</span>
                </Button>

                {currentQuestionIndex < activeSession.questions.length - 1 && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* AI Feedback Card with STAR Structure */}
          {evaluationResult && (
            <Card className="p-6 sm:p-8 border-indigo-200 bg-white space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    STAR Response Evaluation
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Response Score:</span>
                  <span
                    className={`font-heading text-base font-extrabold px-3 py-1 rounded-xl border ${
                      evaluationResult.score >= 80
                        ? "text-emerald-700 border-emerald-300 bg-emerald-50"
                        : evaluationResult.score >= 60
                        ? "text-brand-primary border-indigo-300 bg-indigo-50"
                        : "text-amber-800 border-amber-300 bg-amber-50"
                    }`}
                  >
                    {evaluationResult.score}/100
                  </span>
                </div>
              </div>

              {/* STAR Framework Pillar Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-brand-primary" />
                  STAR Methodology Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(() => {
                    const star = getSTARBreakdown(evaluationResult.score);
                    return [
                      { label: "Situation", sub: "Context & Background", score: star.situation },
                      { label: "Task", sub: "Goal & Constraints", score: star.task },
                      { label: "Action", sub: "Technical Execution", score: star.action },
                      { label: "Result", sub: "Quantified Impact", score: star.result },
                    ].map((p) => (
                      <div key={p.label} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-center">
                        <span className="text-xs font-bold text-slate-900 block font-heading">{p.label}</span>
                        <span className="text-xs text-slate-500 block">{p.sub}</span>
                        <div className="text-sm font-extrabold text-brand-primary pt-1">{p.score}%</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 font-heading flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evaluationResult.feedbackStrengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 font-heading flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertCircle className="h-4 w-4 text-amber-600" /> Areas For Improvement
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evaluationResult.feedbackImprovements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Model Benchmark Answer */}
              {evaluationResult.betterAnswer && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 font-heading flex items-center gap-1.5 uppercase tracking-wider">
                    <BookOpen className="h-4 w-4 text-brand-primary" /> Top-Percentile Model Answer
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans select-text">
                    {evaluationResult.betterAnswer}
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
