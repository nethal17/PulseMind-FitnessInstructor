"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon, Trash2Icon, FileDownIcon, ActivityIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { exportToPDF } from "@/lib/pdfExport";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;

  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const deletePlan = useMutation(api.plans.deletePlan);
  
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);
  const [planToDelete, setPlanToDelete] = useState<Id<"plans"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activePlan = allPlans?.find((plan) => plan.isActive);

  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  const handleDeletePlan = async () => {
    if (!planToDelete || !userId) return;

    try {
      setIsDeleting(true);
      await deletePlan({ planId: planToDelete, userId });
      
      // Reset selected plan if it was deleted
      if (selectedPlanId === planToDelete) {
        setSelectedPlanId(null);
      }
      
      setPlanToDelete(null);
    } catch (error) {
      console.error("Error deleting plan:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportPDF = () => {
    if (!currentPlan) return;
    
    const userName = user?.fullName || user?.firstName || undefined;
    exportToPDF(currentPlan, userName);
  };

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(var(--cyber-blue-bright) 1px, transparent 1px),
                           linear-gradient(90deg, var(--cyber-blue-bright) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10">
        <ProfileHeader user={user} />

      {allPlans && allPlans?.length > 0 ? (
        <div className="space-y-8">
          {/* PLAN SELECTOR - Enhanced */}
          <div className="relative backdrop-blur-sm border-2 border-primary/30 p-8 bg-card rounded-lg shadow-2xl hover:border-primary/50 transition-all duration-300">
            <CornerElements />
            
            {/* Header with decorative line */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold tracking-tight font-mono">
                  <span className="text-primary">YOUR</span>{" "}
                  <span className="text-background">FITNESS PLANS</span>
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="font-mono text-xs text-primary">
                    TOTAL: {allPlans.length}
                  </span>
                </div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
            </div>

            <div className="flex flex-wrap gap-3">
              {allPlans.map((plan) => (
                <div key={plan._id} className="relative group">
                  <Button
                    onClick={() => setSelectedPlanId(plan._id)}
                    className={`relative group transition-all duration-300 font-mono pr-3 ${
                      selectedPlanId === plan._id
                        ? "bg-primary/20 text-primary border-2 border-primary shadow-lg shadow-primary/20"
                        : "bg-transparent border-2 border-primary/50 text-background hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    {/* Hover glow effect */}
                    {selectedPlanId !== plan._id && (
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded transition-all duration-300"></div>
                    )}
                    
                    <span className="relative z-10 flex items-center gap-2">
                      {plan.name}
                      {plan.isActive && (
                        <span className="flex items-center gap-1 bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded border border-green-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          ACTIVE
                        </span>
                      )}
                    </span>
                  </Button>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlanToDelete(plan._id);
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-500 border-2 border-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg"
                    title="Delete plan"
                  >
                    <Trash2Icon className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PLAN DETAILS - Enhanced */}
          {currentPlan && (
            <div className="relative backdrop-blur-sm border-2 border-primary/30 rounded-lg p-8 bg-card shadow-2xl">
              <CornerElements />

              {/* Plan Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50"></div>
                    <h3 className="text-2xl font-bold text-background font-mono">
                      ACTIVE PLAN: <span className="text-primary">{currentPlan.name}</span>
                    </h3>
                  </div>
                  
                  {/* Export to PDF Button */}
                  <div className="flex items-center gap-3">
                    <Link href="/workout-tracking">
                      <Button className="group relative bg-gradient-to-r from-green-500/20 to-green-500/10 border-2 border-green-500/50 text-green-500 hover:border-green-500 hover:bg-green-500/10 font-mono transition-all duration-300 shadow-lg hover:shadow-green-500/20">
                        <ActivityIcon className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                        <span className="font-semibold">TRACK WORKOUT</span>
                        
                        {/* Decorative corner */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
                      </Button>
                    </Link>
                    
                    <Button
                      onClick={handleExportPDF}
                      className="group relative bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/50 text-primary hover:border-primary hover:bg-primary/10 font-mono transition-all duration-300 shadow-lg hover:shadow-primary/20"
                    >
                      <FileDownIcon className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                      <span className="font-semibold">EXPORT TO PDF</span>
                      
                      {/* Decorative corner */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-secondary"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-secondary"></div>
                    </Button>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
              </div>

              <Tabs defaultValue="workout" className="w-full">
                <TabsList className="mb-8 w-full grid grid-cols-2 bg-primary/5 border-2 border-primary/30 p-1 rounded-lg">
                  <TabsTrigger
                    value="workout"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-2 data-[state=active]:border-primary text-background rounded font-mono transition-all duration-300"
                  >
                    <DumbbellIcon className="mr-2 size-5" />
                    <span className="font-semibold">WORKOUT PLAN</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="diet"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-2 data-[state=active]:border-primary text-background rounded font-mono transition-all duration-300"
                  >
                    <AppleIcon className="mr-2 h-5 w-5" />
                    <span className="font-semibold">DIET PLAN</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="workout" className="space-y-6">
                  {/* Schedule Badge */}
                  <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-mono mb-1">WEEKLY SCHEDULE</div>
                      <span className="font-mono text-sm text-primary font-semibold">
                        {currentPlan.workoutPlan.schedule.join(" • ")}
                      </span>
                    </div>
                  </div>

                  {/* Exercise Days Accordion */}
                  <Accordion type="multiple" className="space-y-4">
                    {currentPlan.workoutPlan.exercises.map((exerciseDay, index) => (
                      <AccordionItem
                        key={index}
                        value={exerciseDay.day}
                        className="border-2 border-primary/30 rounded-lg overflow-hidden bg-card/50 hover:border-primary/50 transition-all duration-300"
                      >
                        <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-primary/10 font-mono border-b-2 border-primary/20 transition-all duration-300">
                          <div className="flex justify-between w-full items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              <span className="text-primary text-lg font-bold">{exerciseDay.day}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                              <DumbbellIcon className="w-3 h-3 text-primary" />
                              <span className="text-xs text-primary font-semibold">
                                {exerciseDay.routines.length} EXERCISES
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pb-6 px-5 bg-gradient-to-b from-primary/5 to-transparent">
                          <div className="space-y-4 mt-4">
                            {exerciseDay.routines.map((routine, routineIndex) => (
                              <div
                                key={routineIndex}
                                className="group border-2 border-primary/30 p-4 bg-card hover:bg-primary/5 rounded-lg transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <Link 
                                    href={`https://www.google.com/search?q=${encodeURIComponent(routine.name + " exercise")}`}
                                    target="_blank"
                                    className="flex items-center gap-2 group/link"
                                  >
                                    <h4 className="font-semibold text-background text-lg group-hover/link:text-primary transition-colors">
                                      {routine.name}
                                    </h4>
                                    <svg className="w-4 h-4 text-primary opacity-0 group-hover/link:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </Link>
                                  <div className="flex items-center gap-2">
                                    <div className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-mono font-bold">
                                      {routine.sets} SETS
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-secondary text-white text-xs font-mono font-bold">
                                      {routine.reps} REPS
                                    </div>
                                  </div>
                                </div>
                                {routine.description && (
                                  <p className="text-sm text-gray-400 leading-relaxed pl-2 border-l-2 border-primary/30">
                                    {routine.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                <TabsContent value="diet" className="space-y-6">
                  {/* Calorie Target Card */}
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-mono text-sm text-gray-400 block mb-2">
                          DAILY CALORIE TARGET
                        </span>
                        <div className="font-mono text-4xl text-primary font-bold">
                          {currentPlan.dietPlan.dailyCalories}
                          <span className="text-xl ml-2">KCAL</span>
                        </div>
                      </div>
                      <div className="p-4 bg-primary/20 rounded-full">
                        <AppleIcon className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-primary via-primary/50 to-transparent my-6"></div>

                  {/* Meals Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentPlan.dietPlan.meals.map((meal, index) => (
                      <div
                        key={index}
                        className="border-2 border-primary/30 rounded-lg overflow-hidden bg-card/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                      >
                        {/* Meal Header */}
                        <div className="flex items-center gap-3 p-4 bg-primary/10 border-b-2 border-primary/20">
                          <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                          <h4 className="font-mono text-primary font-bold text-lg">{meal.name}</h4>
                          <div className="ml-auto text-xs font-mono text-gray-400">
                            {meal.foods.length} items
                          </div>
                        </div>
                        
                        {/* Food Items */}
                        <ul className="space-y-2 p-4">
                          {meal.foods.map((food, foodIndex) => (
                            <li
                              key={foodIndex}
                              className="flex items-center gap-3 text-sm text-gray-200 p-2 rounded hover:bg-primary/5 transition-colors"
                            >
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-xs text-primary font-mono font-bold">
                                {foodIndex + 1}
                              </span>
                              <span className="leading-relaxed">{food}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <NoFitnessPlan />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!planToDelete} onOpenChange={(open) => !open && setPlanToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                <Trash2Icon className="w-5 h-5 text-red-500" />
              </div>
              <span>DELETE FITNESS PLAN</span>
            </DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to delete this fitness plan? This action cannot be undone and all workout and diet information will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent my-2"></div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setPlanToDelete(null)}
              disabled={isDeleting}
              className="bg-primary/10 border-2 border-primary/50 text-background hover:bg-primary/20 font-mono"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleDeletePlan}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-500 font-mono"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  DELETING...
                </span>
              ) : (
                "DELETE PLAN"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </section>
  );
};
export default ProfilePage;