import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { rootReducer } from "./rootReducer";
import { rootEpic } from "./rootEpic";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(epicMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

epicMiddleware.run(rootEpic);
