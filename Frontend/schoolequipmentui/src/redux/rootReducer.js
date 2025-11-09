import { combineReducers } from "@reduxjs/toolkit";
import * as types from "./constants/authConstants";

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return { ...state, user: action.payload.user, token: action.payload.token };
    case types.LOGOUT:
      return {};
    default:
      return state;
  }
};

const equipmentReducer = (state = { list: [] }, action) => {
  switch (action.type) {
    case types.LIST_EQUIPMENT_SUCCESS:
      return { ...state, list: action.payload };
    default:
      return state;
  }
};

const requestReducer = (state = { requests: [] }, action) => {
  switch (action.type) {
    case types.FETCH_REQUESTS_SUCCESS:
      return { ...state, requests: action.payload };
    default:
      return state;
  }
};

const analyticsReducer = (state = { summary: {} }, action) => {
  switch (action.type) {
    case types.FETCH_SUMMARY_SUCCESS:
      return { ...state, summary: action.payload };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  auth: authReducer,
  equipment: equipmentReducer,
  request: requestReducer,
  analytics: analyticsReducer,
});
