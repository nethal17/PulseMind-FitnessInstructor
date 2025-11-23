"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CornerElements from "@/components/CornerElements";
import { 
  CheckCircle2Icon, 
  CircleIcon, 
  TimerIcon, 
  TrophyIcon,
  CalendarIcon,
  DumbbellIcon,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";

interface SetTracking {
  reps: number;
  weight?: number;
  completed: boolean;
}

interface ExerciseTracking {
  exerciseName: string;
  sets: SetTracking[];
}

const WorkoutTrackingPage = () => {
  const { user } = useUser();
  const userId = user?.id as string;

  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const activePlan = allPlans?.find((plan) => plan.isActive);
  
  const today = new Date().toISOString().split("T")[0];
  const todaySession = useQuery(api.workouts.getWorkoutByDate, {
    userId,
    date: today,
  });

  // Get last 30 days of workout sessions
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const recentSessions = useQuery(api.workouts.getWorkoutSessions, {
    userId,
    startDate: thirtyDaysAgo,
  });

  const personalRecords = useQuery(api.workouts.getPersonalRecords, { userId });
  const saveWorkoutSession = useMutation(api.workouts.saveWorkoutSession);
  const savePersonalRecord = useMutation(api.workouts.savePersonalRecord);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [exerciseTracking, setExerciseTracking] = useState<ExerciseTracking[]>([]);
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Rest timer between sets
  const [restTimer, setRestTimer] = useState(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [restDuration, setRestDuration] = useState(90); // default 90 seconds

  // Calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Initialize exercise tracking when day is selected
  useEffect(() => {
    if (selectedDay && activePlan) {
      const dayWorkout = activePlan.workoutPlan.exercises.find(
        (ex) => ex.day === selectedDay
      );

      if (dayWorkout) {
        // Check if there's an existing session
        if (todaySession && todaySession.dayName === selectedDay) {
          setExerciseTracking(todaySession.completedExercises);
          setSessionNotes(todaySession.notes || "");
          setSessionDuration(todaySession.duration || 0);
        } else {
          // Initialize new tracking
          const tracking: ExerciseTracking[] = dayWorkout.routines.map((routine) => ({
            exerciseName: routine.name,
            sets: Array(routine.sets || 3)
              .fill(null)
              .map(() => ({
                reps: routine.reps || 10,
                weight: undefined,
                completed: false,
              })),
          }));
          setExerciseTracking(tracking);
        }
      }
    }
  }, [selectedDay, activePlan, todaySession]);

  // Session timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRestTimerRunning && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsRestTimerRunning(false);
            // Play notification sound (optional)
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestTimerRunning, restTimer]);

  const toggleSetCompletion = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exerciseTracking];
    updated[exerciseIndex].sets[setIndex].completed = 
      !updated[exerciseIndex].sets[setIndex].completed;
    setExerciseTracking(updated);

    // Start rest timer when set is completed
    if (updated[exerciseIndex].sets[setIndex].completed) {
      setRestTimer(restDuration);
      setIsRestTimerRunning(true);
    }
  };

  const updateSetWeight = (exerciseIndex: number, setIndex: number, weight: number) => {
    const updated = [...exerciseTracking];
    updated[exerciseIndex].sets[setIndex].weight = weight;
    setExerciseTracking(updated);
  };

  const updateSetReps = (exerciseIndex: number, setIndex: number, reps: number) => {
    const updated = [...exerciseTracking];
    updated[exerciseIndex].sets[setIndex].reps = reps;
    setExerciseTracking(updated);
  };

  const handleSaveWorkout = async () => {
    if (!activePlan || !selectedDay) return;

    try {
      await saveWorkoutSession({
        userId,
        planId: activePlan._id,
        date: today,
        dayName: selectedDay,
        completedExercises: exerciseTracking,
        duration: Math.floor(sessionDuration / 60), // convert to minutes
        notes: sessionNotes,
      });

      // Check for personal records
      for (const exercise of exerciseTracking) {
        const completedSets = exercise.sets.filter((s) => s.completed && s.weight);
        if (completedSets.length > 0) {
          const maxWeight = Math.max(...completedSets.map((s) => s.weight || 0));
          const maxReps = Math.max(...completedSets.map((s) => s.reps));

          await savePersonalRecord({
            userId,
            exerciseName: exercise.exerciseName,
            maxWeight,
            maxReps,
            achievedDate: today,
          });
        }
      }

      alert("Workout saved successfully! 🎉");
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isWorkoutDay = (date: Date | null) => {
    if (!date) return false;
    const dateStr = date.toISOString().split("T")[0];
    return recentSessions?.some((session) => session.date === dateStr);
  };

  if (!activePlan) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-8 text-center border-2 border-primary/30">
          <h2 className="text-2xl font-bold mb-4">No Active Plan</h2>
          <p className="text-gray-400 mb-6">
            You need an active fitness plan to track workouts
          </p>
          <Link href="/generate-program">
            <Button className="bg-primary hover:bg-primary/90">
              Create Fitness Plan
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--cyber-blue-bright) 1px, transparent 1px),
                             linear-gradient(90deg, var(--cyber-blue-bright) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold font-mono">
              <span className="text-primary">WORKOUT</span>{" "}
              <span className="text-foreground">TRACKER</span>
            </h1>
            
            {/* Quick Stats Bar */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-mono text-primary font-bold">
                  {recentSessions?.filter((s) => {
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return new Date(s.date) >= weekAgo;
                  }).length || 0} THIS WEEK
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full">
                <TrophyIcon className="w-3 h-3 text-secondary" />
                <span className="text-xs font-mono text-secondary font-bold">
                  {personalRecords?.length || 0} PRs
                </span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Day Selection + Calendar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Day Selection Card */}
            <Card className="border border-primary bg-card backdrop-blur-sm p-4">
              <h3 className="text-sm font-mono font-bold text-primary mb-3 flex items-center gap-2">
                <DumbbellIcon className="w-4 h-4" />
                SELECT DAY
              </h3>
              <div className="space-y-2">
                {activePlan.workoutPlan.exercises.map((exercise) => (
                  <button
                    key={exercise.day}
                    onClick={() => setSelectedDay(exercise.day)}
                    className={`w-full px-3 py-2 rounded-lg font-mono text-sm transition-all ${
                      selectedDay === exercise.day
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-card border border-primary/30 text-white hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    {exercise.day}
                  </button>
                ))}
              </div>
            </Card>

            {/* Compact Calendar */}
            <Card className="border border-primary bg-card backdrop-blur-sm p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-primary">CALENDAR</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-primary/10"
                  >
                    <ChevronLeftIcon className="w-3 h-3 text-primary" />
                  </button>
                  <span className="text-xs font-mono px-2">{currentMonth.toLocaleDateString("en-US", { month: "short" })}</span>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-primary/10"
                  >
                    <ChevronRightIcon className="w-3 h-3 text-primary" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                  <div key={idx} className="text-center text-[10px] font-mono text-primary py-1">
                    {day}
                  </div>
                ))}
                
                {generateCalendarDays().map((date, index) => {
                  const hasWorkout = isWorkoutDay(date);
                  const isToday = date?.toISOString().split("T")[0] === today;
                  
                  return (
                    <div
                      key={index}
                      className={`h-7 flex items-center justify-center text-[10px] rounded ${
                        date
                          ? hasWorkout
                            ? "bg-green-500/30 text-green-500 font-bold"
                            : isToday
                              ? "bg-primary/30 text-primary font-bold"
                              : "text-white"
                          : ""
                      }`}
                    >
                      {date && date.getDate()}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Rest Timer - Compact */}
            <Card className="border border-primary bg-card backdrop-blur-sm p-3">
              <h3 className="text-xs font-mono font-bold text-primary mb-2 flex items-center gap-2">
                <TimerIcon className="w-3 h-3" />
                REST TIMER
              </h3>
              <div className="text-center">
                <div className={`text-3xl font-mono font-bold mb-2 ${
                  isRestTimerRunning && restTimer <= 10 ? "text-red-500 animate-pulse" : "text-primary"
                }`}>
                  {formatTime(restTimer)}
                </div>
                <div className="flex gap-1 mb-2">
                  <button
                    onClick={() => {
                      setRestTimer(restDuration);
                      setIsRestTimerRunning(true);
                    }}
                    className="flex-1 h-7 rounded bg-green-500 hover:bg-green-600 text-white text-xs font-mono"
                  >
                    START
                  </button>
                  <button
                    onClick={() => setIsRestTimerRunning(false)}
                    className="flex-1 h-7 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-mono"
                  >
                    STOP
                  </button>
                  <button
                    onClick={() => {
                      setRestTimer(restDuration);
                      setIsRestTimerRunning(false);
                    }}
                    className="h-7 w-7 rounded border border-primary/30 hover:bg-primary/10"
                  >
                    <RotateCcwIcon className="w-3 h-3 mx-auto text-primary" />
                  </button>
                </div>
                <input
                  type="number"
                  value={restDuration}
                  onChange={(e) => setRestDuration(parseInt(e.target.value) || 90)}
                  className="w-full h-7 px-2 bg-card border border-primary/30 rounded text-xs text-center font-mono"
                  placeholder="Duration (sec)"
                />
              </div>
            </Card>

            {/* Personal Records - Compact */}
            <Card className="border border-primary bg-card backdrop-blur-sm p-3">
              <h3 className="text-xs font-mono font-bold text-primary mb-2 flex items-center gap-2">
                <TrophyIcon className="w-3 h-3" />
                RECORDS
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {personalRecords && personalRecords.length > 0 ? (
                  personalRecords.slice(0, 8).map((record) => (
                    <div
                      key={record._id}
                      className="p-2 bg-card/50 border border-primary/20 rounded text-xs"
                    >
                      <div className="font-semibold truncate">{record.exerciseName}</div>
                      <div className="flex gap-2 font-mono mt-0.5">
                        {record.maxWeight && (
                          <span className="text-primary">{record.maxWeight}lb</span>
                        )}
                        {record.maxReps && (
                          <span className="text-secondary">{record.maxReps}r</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-3">
                    No records yet
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Main Column - Workout Tracking */}
          <div className="lg:col-span-9">
            {selectedDay && exerciseTracking.length > 0 ? (
              <Card className="border border-primary bg-card backdrop-blur-sm p-4">
                {/* Session Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary/20">
                  <div>
                    <h2 className="text-2xl font-bold font-mono text-primary">{selectedDay}</h2>
                    <p className="text-xs text-gray-200 font-mono">
                      {exerciseTracking.length} exercises • {exerciseTracking.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)} / {exerciseTracking.reduce((acc, ex) => acc + ex.sets.length, 0)} sets completed
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Session Timer */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg">
                      <TimerIcon className="w-4 h-4 text-primary" />
                      <span className="font-mono text-sm text-primary font-bold">
                        {formatTime(sessionDuration)}
                      </span>
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`ml-1 p-1 rounded ${
                          isTimerRunning
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {isTimerRunning ? (
                          <PauseIcon className="w-3 h-3 text-white" />
                        ) : (
                          <PlayIcon className="w-3 h-3 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exercises List */}
                <div className="space-y-4 mb-4">
                  {exerciseTracking.map((exercise, exerciseIndex) => {
                    const completedSets = exercise.sets.filter((s) => s.completed).length;
                    const totalSets = exercise.sets.length;
                    const progress = (completedSets / totalSets) * 100;

                    return (
                      <div
                        key={exerciseIndex}
                        className="border border-primary/50 rounded-lg p-3 bg-card"
                      >
                        {/* Exercise Header */}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-base">{exercise.exerciseName}</h3>
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-mono text-gray-400">
                              {completedSets}/{totalSets}
                            </div>
                            <div className="w-16 h-1.5 bg-card rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Sets Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {exercise.sets.map((set, setIndex) => (
                            <div
                              key={setIndex}
                              className={`flex items-center gap-2 p-2 rounded border transition-all ${
                                set.completed
                                  ? "border-green-500/50 bg-green-500/10"
                                  : "border-primary/20 bg-card/50"
                              }`}
                            >
                              <button
                                onClick={() => toggleSetCompletion(exerciseIndex, setIndex)}
                                className="flex-shrink-0"
                              >
                                {set.completed ? (
                                  <CheckCircle2Icon className="w-5 h-5 text-green-500" />
                                ) : (
                                  <CircleIcon className="w-5 h-5 text-gray-400" />
                                )}
                              </button>

                              <span className="text-xs font-mono text-gray-400 min-w-[40px]">
                                Set {setIndex + 1}
                              </span>

                              <input
                                type="number"
                                value={set.reps}
                                onChange={(e) =>
                                  updateSetReps(exerciseIndex, setIndex, parseInt(e.target.value) || 0)
                                }
                                className="w-14 h-7 px-2 bg-card border border-primary/30 rounded text-xs text-center font-mono"
                                placeholder="R"
                              />
                              <span className="text-[10px] text-gray-400">reps</span>

                              <input
                                type="number"
                                value={set.weight || ""}
                                onChange={(e) =>
                                  updateSetWeight(exerciseIndex, setIndex, parseInt(e.target.value) || 0)
                                }
                                className="w-14 h-7 px-2 bg-card border border-primary/30 rounded text-xs text-center font-mono"
                                placeholder="W"
                              />
                              <span className="text-[10px] text-gray-400">lbs</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Notes Section */}
                <div className="mb-4">
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-primary/30 rounded-lg text-sm resize-none"
                    rows={2}
                    placeholder="Workout notes (optional)..."
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSaveWorkout}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-mono font-bold shadow-lg"
                >
                  SAVE WORKOUT
                </Button>
              </Card>
            ) : (
              <Card className="border border-primary bg-card backdrop-blur-sm p-12 text-center">
                <DumbbellIcon className="w-18 h-18 mx-auto mb-4 text-primary/50" />
                <h3 className="text-2xl font-bold font-mono mb-2">
                  <span className="text-primary">SELECT</span> A WORKOUT DAY
                </h3>
                <p className="text-md text-gray-200">
                  Choose a day from the left sidebar to start tracking your workout.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTrackingPage;
