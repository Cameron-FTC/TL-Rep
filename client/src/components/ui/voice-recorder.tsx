import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  className?: string;
}

export function VoiceRecorder({ onRecordingComplete, className }: VoiceRecorderProps) {
  const { isRecording, recordingTime, toggleRecording } = useAudioRecorder({
    onRecordingComplete,
  });

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        type="button"
        onClick={toggleRecording}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
          isRecording 
            ? "bg-green-500 hover:bg-green-600" 
            : "bg-red-500 hover:bg-red-600",
          className
        )}
        size="sm"
      >
        {isRecording ? (
          <Square className="w-4 h-4 text-white" />
        ) : (
          <Mic className="w-4 h-4 text-white" />
        )}
      </Button>
      
      {isRecording && (
        <div className="flex items-center space-x-2 text-red-500 text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span>Recording... {recordingTime}</span>
        </div>
      )}
    </div>
  );
}
