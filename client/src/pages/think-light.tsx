import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ProgressIndicator } from "@/components/progress-indicator";
import { DecisionStep } from "@/components/decision-step";
import { LessonStep } from "@/components/lesson-step";
import { ProblemStep } from "@/components/problem-step";
import { IdeaStep } from "@/components/idea-step";
import { CompletionStep } from "@/components/completion-step";
import { HistorySidebar } from "@/components/history-sidebar";
import { Lightbulb, ArrowLeft, ArrowRight } from "lucide-react";
import { InsertSession, Session } from "@shared/schema";

type Step = "decision" | "content" | "idea" | "completion";

export default function ThinkLight() {
  const [currentStep, setCurrentStep] = useState<Step>("decision");
  const [sessionData, setSessionData] = useState<Partial<InsertSession>>({
    type: "lesson",
    scenario: "",
    lessonValue: "",
    problemType: "",
    hasIdea: false,
    ideaDescription: "",
    audioFiles: [],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveSessionMutation = useMutation({
    mutationFn: async (data: InsertSession) => {
      const response = await apiRequest("POST", "/api/sessions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      setCurrentStep("completion");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Voice-to-text functionality integrated into components

  const handleSelectPath = (path: "lesson" | "problem") => {
    setSessionData(prev => ({ ...prev, type: path }));
    setCurrentStep("content");
  };

  const handleNext = () => {
    if (currentStep === "content" && sessionData.scenario?.trim()) {
      setCurrentStep("idea");
    } else if (currentStep === "idea" && sessionData.hasIdea !== undefined) {
      // Save the session
      const completeData: InsertSession = {
        type: sessionData.type || "lesson",
        scenario: sessionData.scenario || "",
        lessonValue: sessionData.lessonValue || "",
        problemType: sessionData.problemType || "",
        hasIdea: sessionData.hasIdea || false,
        ideaDescription: sessionData.ideaDescription || "",
        audioFiles: sessionData.audioFiles || [],
      };
      saveSessionMutation.mutate(completeData);
    }
  };

  const handleBack = () => {
    if (currentStep === "content") {
      setCurrentStep("decision");
    } else if (currentStep === "idea") {
      setCurrentStep("content");
    }
  };

  const handleExport = () => {
    const exportData = {
      ...sessionData,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `think-light-session-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartNew = () => {
    setCurrentStep("decision");
    setSessionData({
      type: "lesson",
      scenario: "",
      lessonValue: "",
      problemType: "",
      hasIdea: false,
      ideaDescription: "",
      audioFiles: [],
    });
  };

  const getStepNumber = () => {
    const stepMap = { decision: 1, content: 2, idea: 3, completion: 4 };
    return stepMap[currentStep];
  };

  const canProceed = () => {
    if (currentStep === "content") {
      return sessionData.scenario?.trim() && 
        (sessionData.type === "lesson" ? sessionData.lessonValue?.trim() : sessionData.problemType);
    }
    if (currentStep === "idea") {
      return sessionData.hasIdea !== undefined;
    }
    return false;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Lightbulb className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Think Light</h1>
              <p className="text-sm text-slate-500">Guided Reflection Tool</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <HistorySidebar />
            <Button variant="outline" onClick={handleExport} size="sm">
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={getStepNumber()} totalSteps={4} />

        {/* Step Content */}
        {currentStep === "decision" && (
          <DecisionStep onSelectPath={handleSelectPath} />
        )}

        {currentStep === "content" && sessionData.type === "lesson" && (
          <LessonStep
            scenario={sessionData.scenario || ""}
            lessonValue={sessionData.lessonValue || ""}
            onScenarioChange={(value) => setSessionData(prev => ({ ...prev, scenario: value }))}
            onLessonValueChange={(value) => setSessionData(prev => ({ ...prev, lessonValue: value }))}
          />
        )}

        {currentStep === "content" && sessionData.type === "problem" && (
          <ProblemStep
            scenario={sessionData.scenario || ""}
            problemType={sessionData.problemType || ""}
            onScenarioChange={(value) => setSessionData(prev => ({ ...prev, scenario: value }))}
            onProblemTypeChange={(type) => setSessionData(prev => ({ ...prev, problemType: type }))}
          />
        )}

        {currentStep === "idea" && (
          <IdeaStep
            hasIdea={sessionData.hasIdea || false}
            ideaDescription={sessionData.ideaDescription || ""}
            onHasIdeaChange={(hasIdea) => setSessionData(prev => ({ ...prev, hasIdea }))}
            onIdeaDescriptionChange={(value) => setSessionData(prev => ({ ...prev, ideaDescription: value }))}
          />
        )}

        {currentStep === "completion" && (
          <CompletionStep onExport={handleExport} onStartNew={handleStartNew} />
        )}

        {/* Navigation Controls */}
        {currentStep !== "completion" && (
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === "decision"}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || saveSessionMutation.isPending}
              className="flex items-center space-x-2"
            >
              <span>{saveSessionMutation.isPending ? "Saving..." : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
