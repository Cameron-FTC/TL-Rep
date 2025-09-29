import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { VoiceToTextRecorder } from "@/components/ui/voice-to-text-recorder";
import { Lightbulb, Check, HelpCircle } from "lucide-react";

interface IdeaStepProps {
  hasIdea: boolean;
  ideaDescription: string;
  onHasIdeaChange: (hasIdea: boolean) => void;
  onIdeaDescriptionChange: (value: string) => void;
}

export function IdeaStep({ 
  hasIdea, 
  ideaDescription, 
  onHasIdeaChange, 
  onIdeaDescriptionChange
}: IdeaStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Do you have an idea?</h2>
            </div>
            <p className="text-slate-600">Whether you have a solution or not, we'll help you capture your thoughts.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Button
              variant="outline"
              className={`group p-6 h-auto border-2 transition-all duration-200 text-left ${
                hasIdea === true 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-slate-200 hover:border-green-500 hover:bg-green-50'
              }`}
              onClick={() => onHasIdeaChange(true)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Check className="text-green-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Yes, I have an idea</h3>
                  <p className="text-slate-600 text-sm">I have thoughts on how to approach this</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className={`group p-6 h-auto border-2 transition-all duration-200 text-left ${
                hasIdea === false 
                  ? 'border-primary bg-primary/5' 
                  : 'border-slate-200 hover:border-primary hover:bg-primary/5'
              }`}
              onClick={() => onHasIdeaChange(false)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <HelpCircle className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">No, not yet</h3>
                  <p className="text-slate-600 text-sm">I need to think more about this</p>
                </div>
              </div>
            </Button>
          </div>

          {hasIdea !== false && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-slate-700">
                    {hasIdea ? "Share your idea or thoughts:" : "What would you like to capture about this situation?"}
                  </Label>
                  <VoiceToTextRecorder
                    value={ideaDescription}
                    onChange={onIdeaDescriptionChange}
                    placeholder={
                      hasIdea 
                        ? "Describe your idea or approach to this situation..."
                        : "Capture any thoughts or feelings about this situation..."
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
