import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const VoiceSearch = ({ onVoiceResult, isExpanded = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true);

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        if (event.results.length > 0) {
          const result = event.results[0][0].transcript;
          setTranscript("");
          onVoiceResult(result.trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setTranscript("");

        if (event.error === "network") {
          const userInput = prompt(
            "Voice search unavailable. Please type your search:"
          );
          if (userInput && userInput.trim()) {
            onVoiceResult(userInput.trim());
          }
        } else if (event.error === "not-allowed") {
          toast.error("Microphone access denied");
        } else if (event.error === "no-speech") {
          toast.error("No speech detected");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setTranscript("");
      };

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("Listening...");
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onVoiceResult]);

  const startListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      const userInput = prompt(
        "Voice search unavailable. Please type your search:"
      );
      if (userInput && userInput.trim()) {
        onVoiceResult(userInput.trim());
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="relative">
      <button
        onClick={startListening}
        disabled={!isSupported}
        className={`p-2 rounded-full transition-all duration-300 ${
          isListening
            ? "bg-red-500 text-white animate-pulse"
            : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
        }`}
        title={isListening ? "Stop listening" : "Start voice search"}
        aria-label={isListening ? "Stop voice search" : "Start voice search"}
      >
        <i
          className={`fas ${isListening ? "fa-stop" : "fa-microphone"} text-sm`}
        ></i>
      </button>

      {/* {transcript && (
        <div
          className={`absolute ${
            isExpanded ? "top-full left-0 right-0" : "top-full right-0"
          } mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {transcript}
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default VoiceSearch;
