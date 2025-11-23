"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // SOLUTION to get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    // override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return; // don't pass to original handler
      }

      // pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    // restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  // auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // navigate user to profile page after the call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  // setup event listeners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => {
      console.log("AI started Speaking");
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("AI stopped Speaking");
      setIsSpeaking(false);
    };
    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
      
      // Set user-friendly error message
      if (error?.message) {
        if (error.message.includes("quota") || error.message.includes("429")) {
          setError("AI service is temporarily unavailable due to high demand. Please try again in a few moments.");
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          setError("Network connection issue. Please check your internet and try again.");
        } else {
          setError("An error occurred. Please try again or contact support if the issue persists.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    // cleanup event listeners on unmount
    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);
        setError(null); // Clear any previous errors

        const fullName = user?.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "There";

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
          variableValues: {
            full_name: fullName,
            user_id: user?.id,
          },
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
        setError("Failed to start AI assistant. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-12 relative">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(var(--cyber-blue-bright) 1px, transparent 1px),
                           linear-gradient(90deg, var(--cyber-blue-bright) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 h-full max-w-6xl relative z-10">
        {/* Enhanced Title Section */}
        <div className="text-center mb-12 relative">
          {/* Decorative Corner Elements */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-4">
              <span className="text-foreground">Generate Your </span>
              <span className="text-primary uppercase tracking-wider">Fitness Program</span>
            </h1>
            
            {/* Glowing underline */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          </div>
          
          <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
            Have a <span className="text-primary font-semibold">voice conversation</span> with our AI assistant to create your personalized fitness and nutrition plan
          </p>

          {/* Status Badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-mono text-primary">AI ASSISTANT READY</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto animate-fadeIn">
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4 relative">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-red-500"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-red-500"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-red-500"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-red-500"></div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-500 font-semibold font-mono text-sm mb-1">ERROR</h3>
                  <p className="text-foreground text-sm">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-3 text-xs text-red-500 hover:text-red-400 font-mono underline"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIDEO CALL AREA - Enhanced with better styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* AI ASSISTANT CARD */}
          <Card className="bg-card backdrop-blur-sm border-2 border-primary/30 overflow-hidden relative shadow-2xl hover:border-primary/50 transition-all duration-300 group">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary"></div>

            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-mono text-primary">AI.ASSISTANT</span>
              </div>
              <span className="text-xs font-mono text-gray-400">ID:7841</span>
            </div>

            <div className="aspect-video flex flex-col items-center justify-center p-8 relative bg-gradient-to-br from-primary/5 to-transparent">
              {/* AI VOICE ANIMATION */}
              <div
                className={`absolute inset-0 ${
                  isSpeaking ? "opacity-40" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {/* Voice wave animation when speaking */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-24 gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 bg-primary rounded-full ${
                        isSpeaking ? "animate-sound-wave" : ""
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking ? `${Math.random() * 60 + 30}%` : "10%",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* AI IMAGE */}
              <div className="relative size-36 mb-6 z-10">
                <div
                  className={`absolute inset-0 bg-primary/20 rounded-full blur-2xl ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                />

                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border-2 border-primary overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary/10"></div>
                  <img
                    src="/avatar-pulse-mind.jpg"
                    alt="AI Assistant"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Scan line effect */}
                  {callActive && (
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none opacity-50" />
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-primary mb-2 font-mono">PulseMind AI</h2>
              <p className="text-sm text-gray-300 mb-1">Fitness & Diet Coach</p>
              <p className="text-xs text-gray-500 font-mono">v3.5.0-neural</p>

              {/* SPEAKING INDICATOR */}
              <div
                className={`mt-6 flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 ${
                  isSpeaking 
                    ? "bg-green-500/20 border-green-500" 
                    : callActive 
                      ? "bg-blue-500/20 border-blue-500" 
                      : callEnded
                        ? "bg-primary/20 border-primary"
                        : "bg-gray-500/20 border-gray-500"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isSpeaking 
                      ? "bg-green-500 animate-pulse" 
                      : callActive 
                        ? "bg-blue-500 animate-pulse" 
                        : callEnded
                          ? "bg-primary"
                          : "bg-gray-500"
                  }`}
                />

                <span className={`text-sm font-mono ${
                  isSpeaking 
                    ? "text-green-500" 
                    : callActive 
                      ? "text-blue-500" 
                      : callEnded
                        ? "text-primary"
                        : "text-gray-500"
                }`}>
                  {isSpeaking
                    ? "SPEAKING..."
                    : callActive
                      ? "LISTENING..."
                      : callEnded
                        ? "SESSION COMPLETE"
                        : "STANDBY"}
                </span>
              </div>
            </div>
          </Card>

          {/* USER CARD */}
          <Card className="bg-card backdrop-blur-sm border-2 border-primary/30 overflow-hidden relative shadow-2xl hover:border-primary/50 transition-all duration-300">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary"></div>

            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-mono text-primary">USER.ACTIVE</span>
              </div>
              <span className="text-xs font-mono text-gray-400">AUTHENTICATED</span>
            </div>

            <div className="aspect-video flex flex-col items-center justify-center p-8 relative bg-gradient-to-br from-primary/5 to-transparent">
              {/* User Image */}
              <div className="relative size-36 mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
                <img
                  src={user?.imageUrl}
                  alt="User"
                  className="relative size-full object-cover rounded-full border-2 border-primary shadow-lg"
                />
                {/* Online indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 border-4 border-card"></div>
              </div>

              <h2 className="text-2xl font-bold text-primary mb-2 font-mono">
                {user ? (user.firstName || "User") : "Guest"}
              </h2>
              <p className="text-sm text-gray-300 mb-1">
                {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Guest User"}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {user?.primaryEmailAddress?.emailAddress || "No email"}
              </p>

              {/* User Ready Text */}
              <div className="mt-6 flex items-center gap-3 px-4 py-2 rounded-full bg-green-500/20 border border-green-500">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-mono text-green-500">READY</span>
              </div>
            </div>
          </Card>
        </div>

        {/* MESSAGE CONTAINER - Enhanced styling */}
        {messages.length > 0 && (
          <div className="w-full mb-10 relative">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b-0 bg-card backdrop-blur-sm rounded-t-lg border-2 border-primary/30">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm font-mono text-primary">CONVERSATION.LOG</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 font-mono">
                  MESSAGES: {messages.length}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messageContainerRef}
              className="w-full bg-card backdrop-blur-sm border-2 border-t-0 border-primary/30 rounded-b-lg p-6 h-80 overflow-y-auto transition-all duration-300 scroll-smooth relative"
              style={{
                backgroundImage: `linear-gradient(var(--cyber-grid-color) 1px, transparent 1px),
                                 linear-gradient(90deg, var(--cyber-grid-color) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message-item animate-fadeIn ${
                      msg.role === "assistant" ? "ml-0" : "ml-auto"
                    } max-w-[85%]`}
                  >
                    <div className="flex items-start gap-3">
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-primary font-mono">AI</span>
                        </div>
                      )}
                      
                      <div className={`flex-1 ${msg.role !== "assistant" ? "text-right" : ""}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs text-primary font-mono">
                            {msg.role === "assistant" ? "PULSEMIND.AI" : "YOU"}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={`px-4 py-3 rounded-lg ${
                          msg.role === "assistant" 
                            ? "bg-primary/10 border border-primary/30 text-white" 
                            : "bg-primary/30 border border-primary text-white"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>

                      {msg.role !== "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white font-mono">You</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {callEnded && (
                  <div className="message-item animate-fadeIn text-center py-6">
                    <div className="inline-flex flex-col items-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-green-500 mb-1 font-mono">
                          SESSION COMPLETE
                        </div>
                        <p className="text-sm text-foreground">
                          Your fitness program has been created! Redirecting to your profile...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer stats */}
            {callActive && (
              <div className="mt-2 flex items-center justify-center gap-6 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>CONNECTION ACTIVE</span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div>LATENCY: ~120ms</div>
              </div>
            )}
          </div>
        )}

        {/* CALL CONTROLS - Enhanced */}
        <div className="w-full flex flex-col items-center gap-6">
          {/* Call Button */}
          <div className="relative">
            {connecting && (
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75 scale-110"></div>
            )}
            
            <Button
              className={`w-40 h-40 rounded-full text-2xl font-bold relative overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                callActive
                  ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
                  : callEnded
                    ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50"
                    : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
              } text-white border-4 ${
                callActive 
                  ? "border-red-400" 
                  : callEnded 
                    ? "border-green-400" 
                    : "border-primary/30"
              }`}
              onClick={toggleCall}
              disabled={connecting || callEnded}
            >
              {/* Ripple effect background */}
              {callActive && (
                <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent animate-pulse"></div>
              )}
              
              <span className="relative z-10 flex flex-col items-center gap-2">
                {/* Icon */}
                {callActive ? (
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : connecting ? (
                  <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : callEnded ? (
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )}
                
                <span className="text-base font-mono">
                  {callActive
                    ? "END CALL"
                    : connecting
                      ? "CONNECTING"
                      : callEnded
                        ? "COMPLETE"
                        : "START CALL"}
                </span>
              </span>
            </Button>
          </div>

          {/* Instructions */}
          {!callActive && !connecting && !callEnded && (
            <div className="text-center max-w-md animate-fadeIn">
              <p className="text-sm text-gray-400 mb-4">
                Click the button above to begin your AI-powered fitness consultation
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-mono">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>~3-5 min</span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>Voice enabled</span>
                </div>
              </div>
            </div>
          )}

          {/* Call stats during active call */}
          {callActive && (
            <div className="grid grid-cols-3 gap-6 w-full max-w-lg animate-fadeIn">
              <div className="text-center p-4 bg-card border border-primary/30 rounded-lg">
                <div className="text-2xl font-bold text-primary font-mono">
                  {messages.filter(m => m.role === "assistant").length}
                </div>
                <div className="text-xs text-gray-400 mt-1">AI Responses</div>
              </div>
              <div className="text-center p-4 bg-card border border-primary/30 rounded-lg">
                <div className="text-2xl font-bold text-primary font-mono">
                  {messages.filter(m => m.role === "user").length}
                </div>
                <div className="text-xs text-gray-400 mt-1">Your Messages</div>
              </div>
              <div className="text-center p-4 bg-card border border-primary/30 rounded-lg">
                <div className="text-2xl font-bold text-green-500 font-mono">LIVE</div>
                <div className="text-xs text-gray-400 mt-1">Connection</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default GenerateProgramPage;