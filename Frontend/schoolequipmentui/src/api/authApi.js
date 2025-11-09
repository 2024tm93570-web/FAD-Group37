import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";
import { BASE_URL } from "../common/env";

// 🔐 AUTH APIs
export const loginApi = (data) =>
  ajax.post(`${BASE_URL}/Auth/login`, data, { "Content-Type": "application/json" }).pipe(map(res => res.response));

export const registerApi = (data) =>
  ajax.post(`${BASE_URL}/Auth/register`, data, { "Content-Type": "application/json" }).pipe(map(res => res.response));

export const getUserApi = (id) =>
  ajax.getJSON(`${BASE_URL}/Auth/user/${id}`).pipe(map(res => res));

// ⚙️ EQUIPMENT APIs
export const addEquipmentApi = (data) =>
  ajax.post(`${BASE_URL}/Equipment/add`, data, { "Content-Type": "application/json" }).pipe(map(res => res.response));

export const editEquipmentApi = (id, data) =>
  ajax.put(`${BASE_URL}/Equipment/edit/${id}`, data, { "Content-Type": "application/json" }).pipe(map(res => res.response));

export const deleteEquipmentApi = (id) =>
  ajax.delete(`${BASE_URL}/Equipment/delete/${id}`).pipe(map(res => res.response));

export const listEquipmentApi = () =>
  ajax.getJSON(`${BASE_URL}/Equipment/list`).pipe(map(res => res));

// 📦 REQUEST APIs
export const createRequestApi = (data) =>
  ajax.post(`${BASE_URL}/Request`, data, { "Content-Type": "application/json" }).pipe(map(res => res.response));

export const getRequestsApi = () =>
  ajax.getJSON(`${BASE_URL}/Request`).pipe(map(res => res));

export const getRequestByIdApi = (id) =>
  ajax.getJSON(`${BASE_URL}/Request/${id}`).pipe(map(res => res));

export const updateRequestStatusApi = (id, data) =>
  ajax.put(`${BASE_URL}/Request/${id}/status`, data, { "Content-Type": "application/json" }).pipe(map(res => res.response));

export const returnRequestApi = (id, data) =>
  ajax.put(`${BASE_URL}/Request/${id}/return`, data, { "Content-Type": "application/json" }).pipe(map(res => res.response));

// 📊 ANALYTICS APIs
export const analyticsHistoryApi = () =>
  ajax.getJSON(`${BASE_URL}/Analytics/history`).pipe(map(res => res));

export const analyticsSummaryApi = () =>
  ajax.getJSON(`${BASE_URL}/Analytics/summary`).pipe(map(res => res));
