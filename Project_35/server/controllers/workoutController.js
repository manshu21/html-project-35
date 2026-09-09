import mongoose from "mongoose";
import Workout from "../models/workoutModel.js";

const formatValidationError = (error) =>
  Object.values(error.errors)
    .map((e) => e.message)
    .join(" ");

export async function getWorkouts(_req, res) {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch {
    res.status(500).json({ error: "Failed to fetch workouts." });
  }
}

export async function createWorkout(req, res) {
  const { title, load, reps } = req.body;

  try {
    if (
      !title?.trim() ||
      load === undefined ||
      load === "" ||
      reps === undefined ||
      reps === ""
    ) {
      return res
        .status(400)
        .json({ error: "Title, load and reps are required." });
    }

    const numericLoad = Number(load);
    const numericReps = Number(reps);

    if (!Number.isFinite(numericLoad) || numericLoad < 0) {
      return res
        .status(400)
        .json({ error: "Load must be a valid non-negative number." });
    }
    if (!Number.isInteger(numericReps) || numericReps < 1) {
      return res
        .status(400)
        .json({ error: "Reps must be a whole number of at least 1." });
    }

    const workout = await Workout.create({
      title: title.trim(),
      load: numericLoad,
      reps: numericReps,
    });

    res.status(201).json(workout);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: formatValidationError(error) });
    }
    res.status(500).json({ error: "Failed to create workout." });
  }
}

export async function deleteWorkout(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid workout id." });
    }

    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ error: "Workout not found." });

    res.status(200).json({ id: workout._id });
  } catch {
    res.status(500).json({ error: "Failed to delete workout." });
  }
}
