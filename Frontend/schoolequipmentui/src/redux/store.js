import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { rootReducer } from "./rootReducer";
import { rootEpic } from "./rootEpic";

// Create the Epic middleware
const epicMiddleware = createEpicMiddleware();

// Configure store with reducer and middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // disable thunk since we're using epics
      serializableCheck: false, // optional: avoids serializability warnings from rxjs actions
    }).concat(epicMiddleware),
});

// Run the root epic after store creation
epicMiddleware.run(rootEpic);
