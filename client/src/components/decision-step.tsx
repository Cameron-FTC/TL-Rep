import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, AlertTriangle, Route } from "lucide-react";

interface DecisionStepProps {
  onSelectPath: (path: "lesson" | "problem") => void;
}

export function DecisionStep({ onSelectPath }: DecisionStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Route className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Let's start your reflection</h2>
            <p className="text-slate-600">Choose the path that best describes your situation today.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Button
              variant="outline"
              className="group p-6 h-auto border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
              onClick={() => onSelectPath("lesson")}
            >
              <div className="flex items-start space-x-4 text-left">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <GraduationCap className="text-green-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">It's a Lesson</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Something went well or taught you something valuable. You want to capture the learning and make it actionable.
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="group p-6 h-auto border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
              onClick={() => onSelectPath("problem")}
            >
              <div className="flex items-start space-x-4 text-left">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <AlertTriangle className="text-yellow-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">It's a Problem</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Something needs to be solved or improved. You want to categorize and work through the challenge.
                  </p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
