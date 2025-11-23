import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
    userId: v.string(),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.optional(v.number()),
              reps: v.optional(v.number()),
              duration: v.optional(v.string()),
              description: v.optional(v.string()),
              exercises: v.optional(v.array(v.string())),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    isActive: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"]),

  workoutSessions: defineTable({
    userId: v.string(),
    planId: v.id("plans"),
    date: v.string(), // ISO date string
    dayName: v.string(), // e.g., "Monday", "Day 1"
    completedExercises: v.array(
      v.object({
        exerciseName: v.string(),
        sets: v.array(
          v.object({
            reps: v.number(),
            weight: v.optional(v.number()),
            completed: v.boolean(),
          })
        ),
      })
    ),
    duration: v.optional(v.number()), // in minutes
    notes: v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_plan_id", ["planId"])
    .index("by_date", ["userId", "date"]),

  personalRecords: defineTable({
    userId: v.string(),
    exerciseName: v.string(),
    maxWeight: v.optional(v.number()),
    maxReps: v.optional(v.number()),
    achievedDate: v.string(), // ISO date string
  })
    .index("by_user_id", ["userId"])
    .index("by_exercise", ["userId", "exerciseName"]),
});