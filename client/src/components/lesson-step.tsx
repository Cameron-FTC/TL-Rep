import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { VoiceToTextRecorder } from "@/components/ui/voice-to-text-recorder";
import { GraduationCap } from "lucide-react";

interface LessonStepProps {
  scenario: string;
  lessonValue: string;
  onScenarioChange: (value: string) => void;
  onLessonValueChange: (value: string) => void;
}

export function LessonStep({ 
  scenario, 
  lessonValue, 
  onScenarioChange, 
  onLessonValueChange
}: LessonStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Capture Your Lesson</h2>
            </div>
            <p className="text-slate-600">Describe the situation and what you learned from it.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-slate-700">
                What happened? Describe the scenario:
              </Label>
              <VoiceToTextRecorder
                value={scenario}
                onChange={onScenarioChange}
                placeholder="Tell us about the situation that taught you something valuable..."
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-slate-700">
                What's the value and how can it be actionable?
              </Label>
              <VoiceToTextRecorder
                value={lessonValue}
                onChange={onLessonValueChange}
                placeholder="Explain what you learned and how you can apply this lesson in the future..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
