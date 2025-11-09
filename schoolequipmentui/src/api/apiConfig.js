// API Configuration - Toggle between mock and real API
import * as mockApi from "./mockAPI";
import * as realApi from "./RealAPI";

const USE_MOCK = false; // 👈 Set to false to use real .NET backend

const api = USE_MOCK ? mockApi : realApi;

// Export individual functions for convenience with fallbacks
export const loginUser = api.loginUser || (() => Promise.reject("loginUser not available"));
export const registerUser = api.registerUser || (() => Promise.reject("registerUser not available"));
export const getEquipmentList = api.getEquipmentList || (() => Promise.resolve([]));
export const getItems = api.getItems || api.getEquipmentList || (() => Promise.resolve([]));
export const addItem = api.addItem || (() => Promise.reject("addItem not available"));
export const editItem = api.editItem || (() => Promise.reject("editItem not available"));
export const deleteItem = api.deleteItem || (() => Promise.reject("deleteItem not available"));
export const addRequest = api.addRequest || (() => Promise.reject("addRequest not available"));
export const getRequests = api.getRequests || (() => Promise.resolve([]));
export const approveRequest = api.approveRequest || (() => Promise.reject("approveRequest not available"));
export const rejectRequest = api.rejectRequest || (() => Promise.reject("rejectRequest not available"));
export const markAsReturned = api.markAsReturned || (() => Promise.reject("markAsReturned not available"));
export const updateRequestStatus = api.updateRequestStatus || (() => Promise.reject("updateRequestStatus not available"));
export const getRequestHistory = api.getRequestHistory || (() => Promise.resolve([]));
export const getUsageSummary = api.getUsageSummary || (() => Promise.resolve({}));
export const initMockData = api.initMockData || (() => {});
