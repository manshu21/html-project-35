import { createContext, useContext, useEffect, useReducer } from "react";

const API = "http://localhost:5000/api/workouts";
const WorkoutContext = createContext();

const initialState = { workouts: [], loading: true, error: "" };

function reducer(state, action) {
  switch (action.type) {
    case "SET_WORKOUTS": return { ...state, workouts: action.payload, loading: false, error: "" };
    case "ADD_WORKOUT": return { ...state, workouts: [action.payload, ...state.workouts], error: "" };
    case "REMOVE_WORKOUT": return { ...state, workouts: state.workouts.filter(w => w._id !== action.payload) };
    case "ERROR": return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(API)
      .then(async r => { const data = await r.json(); if (!r.ok) throw new Error(data.error); return data; })
      .then(data => dispatch({ type: "SET_WORKOUTS", payload: data }))
      .catch(e => dispatch({ type: "ERROR", payload: e.message || "Unable to load workouts." }));
  }, []);

  async function addWorkout(payload) {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to add workout.");
    dispatch({ type: "ADD_WORKOUT", payload: data });
    return data;
  }

  async function removeWorkout(id) {
    const response = await fetch(`${API}/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to delete workout.");
    dispatch({ type: "REMOVE_WORKOUT", payload: id });
  }

  return <WorkoutContext.Provider value={{ ...state, addWorkout, removeWorkout }}>
    {children}
  </WorkoutContext.Provider>;
}

export function useWorkouts() {
  return useContext(WorkoutContext);
}
