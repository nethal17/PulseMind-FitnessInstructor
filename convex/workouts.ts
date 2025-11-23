import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update a workout session
export const saveWorkoutSession = mutation({
  args: {
    userId: v.string(),
    planId: v.id("plans"),
    date: v.string(),
    dayName: v.string(),
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
    duration: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if session already exists for this date
    const existingSession = await ctx.db
      .query("workoutSessions")
      .withIndex("by_date", (q) => 
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .first();

    if (existingSession) {
      // Update existing session
      await ctx.db.patch(existingSession._id, {
        completedExercises: args.completedExercises,
        duration: args.duration,
        notes: args.notes,
      });
      return existingSession._id;
    } else {
      // Create new session
      const sessionId = await ctx.db.insert("workoutSessions", args);
      return sessionId;
    }
  },
});

// Get workout sessions for a date range
export const getWorkoutSessions = query({
  args: {
    userId: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter by date range if provided
    if (args.startDate || args.endDate) {
      sessions = sessions.filter((session) => {
        if (args.startDate && session.date < args.startDate) return false;
        if (args.endDate && session.date > args.endDate) return false;
        return true;
      });
    }

    return sessions.sort((a, b) => b.date.localeCompare(a.date));
  },
});

// Get workout session for a specific date
export const getWorkoutByDate = query({
  args: {
    userId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("workoutSessions")
      .withIndex("by_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .first();

    return session;
  },
});

// Get workout history for a specific plan
export const getWorkoutsByPlan = query({
  args: {
    planId: v.id("plans"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_plan_id", (q) => q.eq("planId", args.planId))
      .collect();

    return sessions.sort((a, b) => b.date.localeCompare(a.date));
  },
});

// Save or update personal record
export const savePersonalRecord = mutation({
  args: {
    userId: v.string(),
    exerciseName: v.string(),
    maxWeight: v.optional(v.number()),
    maxReps: v.optional(v.number()),
    achievedDate: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if record already exists for this exercise
    const existingRecord = await ctx.db
      .query("personalRecords")
      .withIndex("by_exercise", (q) =>
        q.eq("userId", args.userId).eq("exerciseName", args.exerciseName)
      )
      .first();

    if (existingRecord) {
      // Update only if new record is better
      const shouldUpdate =
        (args.maxWeight && (!existingRecord.maxWeight || args.maxWeight > existingRecord.maxWeight)) ||
        (args.maxReps && (!existingRecord.maxReps || args.maxReps > existingRecord.maxReps));

      if (shouldUpdate) {
        await ctx.db.patch(existingRecord._id, {
          maxWeight: args.maxWeight || existingRecord.maxWeight,
          maxReps: args.maxReps || existingRecord.maxReps,
          achievedDate: args.achievedDate,
        });
        return { isNewRecord: true, recordId: existingRecord._id };
      }
      return { isNewRecord: false, recordId: existingRecord._id };
    } else {
      // Create new record
      const recordId = await ctx.db.insert("personalRecords", args);
      return { isNewRecord: true, recordId };
    }
  },
});

// Get all personal records for a user
export const getPersonalRecords = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("personalRecords")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    return records;
  },
});

// Get personal record for a specific exercise
export const getPersonalRecordByExercise = query({
  args: {
    userId: v.string(),
    exerciseName: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("personalRecords")
      .withIndex("by_exercise", (q) =>
        q.eq("userId", args.userId).eq("exerciseName", args.exerciseName)
      )
      .first();

    return record;
  },
});

// Delete a workout session
export const deleteWorkoutSession = mutation({
  args: {
    sessionId: v.id("workoutSessions"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    
    if (!session || session.userId !== args.userId) {
      throw new Error("Session not found or unauthorized");
    }

    await ctx.db.delete(args.sessionId);
    return { success: true };
  },
});
