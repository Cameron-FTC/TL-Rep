import { useState, useRef, useCallback } from "react";

interface UseSpeechRecognitionOptions {
  onTranscript?: (text: string) => void;
  continuous?: boolean;
  language?: string;
}

export function useSpeechRecognition({ 
  onTranscript, 
  continuous = true,
  language = 'en-US' 
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  const isSupported = useCallback(() => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported()) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    try {
      setError(null);
      
      // Create speech recognition instance
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        
        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [continuous, language, onTranscript, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported: isSupported(),
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
}

// Add type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}