import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Exercise title is required."],
      trim: true,
    },
    load: {
      type: Number,
      required: [true, "Load is required."],
      min: [0, "Load cannot be negative."],
    },
    reps: {
      type: Number,
      required: [true, "Reps are required."],
      min: [1, "Reps must be at least 1."],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Workout", workoutSchema);
