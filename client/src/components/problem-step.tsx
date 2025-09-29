import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { VoiceToTextRecorder } from "@/components/ui/voice-to-text-recorder";
import { AlertTriangle, Clock, DollarSign, Package, Star, MessageSquare, Users, Brain } from "lucide-react";

const problemTypes = [
  { id: "time", label: "Time", icon: Clock },
  { id: "money", label: "Money", icon: DollarSign },
  { id: "resources", label: "Resources", icon: Package },
  { id: "reputation", label: "Reputation", icon: Star },
  { id: "communication", label: "Communication", icon: MessageSquare },
  { id: "teamwork", label: "Teamwork", icon: Users },
  { id: "knowledge", label: "Knowledge", icon: Brain },
];

interface ProblemStepProps {
  scenario: string;
  problemType: string;
  onScenarioChange: (value: string) => void;
  onProblemTypeChange: (type: string) => void;
}

export function ProblemStep({ 
  scenario, 
  problemType, 
  onScenarioChange, 
  onProblemTypeChange
}: ProblemStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Define Your Problem</h2>
            </div>
            <p className="text-slate-600">Describe the problem and categorize it to better understand the solution path.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-slate-700">
                Describe the problem scenario:
              </Label>
              <VoiceToTextRecorder
                value={scenario}
                onChange={onScenarioChange}
                placeholder="What specific problem or challenge are you facing?"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-slate-700 mb-4">
                What type of problem is this?
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {problemTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant="outline"
                      className={`p-3 h-auto flex flex-col items-center space-y-2 transition-all ${
                        problemType === type.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-slate-200 hover:border-primary hover:bg-primary/5'
                      }`}
                      onClick={() => onProblemTypeChange(type.id)}
                    >
                      <Icon className="text-slate-500 w-5 h-5" />
                      <span className="text-sm font-medium text-slate-700">{type.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
