import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useWorkouts } from "./context/WorkoutContext.jsx";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function WorkoutCard({ workout, onDelete }) {
  return (
    <article className="workout-card">
      <div className="card-content">
        <h2>{workout.title}</h2>
        <p>
          <strong>Load (in Kgs):</strong> {workout.load}
        </p>
        <p>
          <strong>Reps:</strong> {workout.reps}
        </p>
        <p className="created">Created {timeAgo(workout.createdAt)}</p>
      </div>
      <button
        className="delete-btn"
        title="Delete workout"
        aria-label={`Delete ${workout.title}`}
        onClick={() => onDelete(workout._id)}
      >
        <Trash2 size={20} />
      </button>
    </article>
  );
}

function AddWorkout() {
  const { addWorkout } = useWorkouts();
  const [form, setForm] = useState({ title: "", load: "", reps: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Exercise title is required.");
    if (
      form.load === "" ||
      Number.isNaN(Number(form.load)) ||
      Number(form.load) < 0
    )
      return setError("Load must be a valid non-negative number.");
    if (
      form.reps === "" ||
      !Number.isInteger(Number(form.reps)) ||
      Number(form.reps) < 1
    )
      return setError("Reps must be a whole number of at least 1.");

    try {
      setSaving(true);
      await addWorkout(form);
      setForm({ title: "", load: "", reps: "" });
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <aside className="form-panel">
      <h2>Add a New Workout</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <label>
          Exercise Title:
          <input
            name="title"
            value={form.title}
            onChange={change}
            placeholder="e.g. Bench Press"
          />
        </label>
        <label>
          Load (in Kg's):
          <input
            name="load"
            type="number"
            min="0"
            step="any"
            value={form.load}
            onChange={change}
          />
        </label>
        <label>
          Reps:
          <input
            name="reps"
            type="number"
            min="1"
            step="1"
            value={form.reps}
            onChange={change}
          />
        </label>
        <button className="add-btn" disabled={saving}>
          {saving ? "Adding..." : "Add Workout"}
        </button>
      </form>
    </aside>
  );
}

export default function App() {
  const { workouts, loading, error, removeWorkout } = useWorkouts();
  const [deleteError, setDeleteError] = useState("");

  async function handleDelete(id) {
    setDeleteError("");
    try {
      await removeWorkout(id);
    } catch (e) {
      setDeleteError(e.message);
    }
  }

  return (
    <div className="page">
      <header>
        <h1>Workout Budyyy</h1>
      </header>
      <main>
        <section className="workouts">
          {loading && <p className="status">Loading workouts...</p>}
          {error && <p className="status error">{error}</p>}
          {deleteError && <p className="status error">{deleteError}</p>}
          {!loading && !error && workouts.length === 0 && (
            <p className="status">No workouts yet. Add your first one!</p>
          )}
          {workouts.map((w) => (
            <WorkoutCard key={w._id} workout={w} onDelete={handleDelete} />
          ))}
        </section>
        <AddWorkout />
      </main>
    </div>
  );
}
