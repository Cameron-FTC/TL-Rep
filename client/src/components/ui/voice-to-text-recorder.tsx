import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Mic, MicOff, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceToTextRecorderProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function VoiceToTextRecorder({ 
  value, 
  onChange, 
  placeholder = "Type or speak your response...",
  className,
  disabled = false
}: VoiceToTextRecorderProps) {
  const [mode, setMode] = useState<'text' | 'voice'>('text');

  const handleTranscript = useCallback((transcript: string) => {
    // Append new transcript to existing text
    const newValue = value ? `${value} ${transcript}` : transcript;
    onChange(newValue);
  }, [value, onChange]);

  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    onTranscript: handleTranscript,
    continuous: true,
    language: 'en-US'
  });

  const handleModeToggle = () => {
    if (mode === 'voice' && isListening) {
      stopListening();
    }
    resetTranscript();
    setMode(mode === 'text' ? 'voice' : 'text');
  };

  const handleStartStopVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleModeToggle}
            disabled={disabled}
            className="flex items-center space-x-1"
          >
            {mode === 'text' ? <Type className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{mode === 'text' ? 'Text' : 'Voice'}</span>
          </Button>
          
          {!isSupported && mode === 'voice' && (
            <span className="text-xs text-amber-600">
              Speech recognition not supported in this browser
            </span>
          )}
        </div>

        {mode === 'voice' && isSupported && (
          <Button
            type="button"
            onClick={handleStartStopVoice}
            disabled={disabled}
            className={cn(
              "w-8 h-8 rounded-full transition-colors",
              isListening 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-green-500 hover:bg-green-600"
            )}
            size="sm"
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-white" />
            ) : (
              <Mic className="w-4 h-4 text-white" />
            )}
          </Button>
        )}
      </div>

      <div className="relative">
        <Textarea
          placeholder={mode === 'voice' ? 
            (isListening ? "Listening... Speak now" : "Click the microphone to start speaking") : 
            placeholder
          }
          className={cn(
            "min-h-[120px] resize-none",
            mode === 'voice' && isListening && "border-green-500 bg-green-50"
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || (mode === 'voice' && isListening)}
          readOnly={mode === 'voice' && isListening}
        />
        
        {mode === 'voice' && isListening && (
          <div className="absolute top-2 right-2 flex items-center space-x-2 text-green-600 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Listening...</span>
          </div>
        )}
      </div>

      {mode === 'voice' && transcript && (
        <div className="text-xs text-slate-500 p-2 bg-slate-50 rounded border">
          <span className="font-medium">Current: </span>
          {transcript}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-600 p-2 bg-red-50 rounded border">
          {error}
        </div>
      )}
    </div>
  );
}