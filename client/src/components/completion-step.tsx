import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Plus } from "lucide-react";

interface CompletionStepProps {
  onExport: () => void;
  onStartNew: () => void;
}

export function CompletionStep({ onExport, onStartNew }: CompletionStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Session Complete!</h2>
          <p className="text-slate-600 mb-8">Your reflection has been saved. You can review it anytime in your history.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onExport} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Entry</span>
            </Button>
            <Button variant="outline" onClick={onStartNew} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Start New Session</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
