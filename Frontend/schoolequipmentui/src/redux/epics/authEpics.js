import { ofType, combineEpics } from "redux-observable";
import { mergeMap, map, catchError, of } from "rxjs";
import * as types from "../constants/authConstants";
import {
  loginApi, registerApi, getUserApi,
  addEquipmentApi, editEquipmentApi, deleteEquipmentApi, listEquipmentApi,
  createRequestApi, getRequestsApi, getRequestByIdApi, updateRequestStatusApi, returnRequestApi,
  analyticsHistoryApi, analyticsSummaryApi
} from "../../api/authApi";
import {
  transformAuthResponse, transformUserResponse, transformEquipmentResponse,
  transformRequestResponse, transformAnalyticsSummary
} from "../../common/transformer/authTransformer";

// AUTH EPICS
const loginEpic = (action$) =>
  action$.pipe(
    ofType(types.LOGIN_REQUEST),
    mergeMap(action =>
      loginApi(action.payload).pipe(
        map(res => ({ type: types.LOGIN_SUCCESS, payload: transformAuthResponse(res) })),
        catchError(err => of({ type: types.LOGIN_FAILURE, payload: err.message }))
      )
    )
  );

const registerEpic = (action$) =>
  action$.pipe(
    ofType(types.REGISTER_REQUEST),
    mergeMap(action =>
      registerApi(action.payload).pipe(
        map(res => ({ type: types.REGISTER_SUCCESS, payload: transformAuthResponse(res) })),
        catchError(err => of({ type: types.REGISTER_FAILURE, payload: err.message }))
      )
    )
  );

// EQUIPMENT EPICS
const listEquipmentEpic = (action$) =>
  action$.pipe(
    ofType(types.LIST_EQUIPMENT_REQUEST),
    mergeMap(() =>
      listEquipmentApi().pipe(
        map(res => ({ type: types.LIST_EQUIPMENT_SUCCESS, payload: res.map(transformEquipmentResponse) })),
        catchError(err => of({ type: types.LIST_EQUIPMENT_FAILURE, payload: err.message }))
      )
    )
  );

// REQUEST EPICS
const fetchRequestsEpic = (action$) =>
  action$.pipe(
    ofType(types.FETCH_REQUESTS),
    mergeMap(() =>
      getRequestsApi().pipe(
        map(res => ({ type: types.FETCH_REQUESTS_SUCCESS, payload: res.map(transformRequestResponse) })),
        catchError(err => of({ type: types.FETCH_REQUESTS_FAILURE, payload: err.message }))
      )
    )
  );

// ANALYTICS EPICS
const analyticsSummaryEpic = (action$) =>
  action$.pipe(
    ofType(types.FETCH_SUMMARY),
    mergeMap(() =>
      analyticsSummaryApi().pipe(
        map(res => ({ type: types.FETCH_SUMMARY_SUCCESS, payload: transformAnalyticsSummary(res) })),
        catchError(err => of({ type: types.FETCH_SUMMARY_FAILURE, payload: err.message }))
      )
    )
  );

  export {
    loginEpic,
    registerEpic,
    listEquipmentEpic,
    fetchRequestsEpic,
    analyticsSummaryEpic,
  };
  
  export const rootEpic = combineEpics(
    loginEpic,
    registerEpic,
    listEquipmentEpic,
    fetchRequestsEpic,
    analyticsSummaryEpic
  );
