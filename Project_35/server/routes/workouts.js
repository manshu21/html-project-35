import { Router } from "express";
import {
  getWorkouts,
  createWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";

const router = Router();

router.get("/", getWorkouts);
router.post("/", createWorkout);
router.delete("/:id", deleteWorkout);

export default router;
