// 🔐 AUTH
export const transformAuthResponse = (res) => ({
  token: res?.token,
  user: res?.user ? {
    id: res.user.id,
    name: res.user.name,
    email: res.user.email,
    role: res.user.role
  } : null,
});

export const transformUserResponse = (res) => ({
  id: res?.id,
  name: res?.name,
  email: res?.email,
  role: res?.role,
});

// ⚙️ EQUIPMENT
export const transformEquipmentResponse = (res) => ({
  id: res?.id,
  name: res?.name,
  type: res?.type,
  quantity: res?.quantity,
  status: res?.status,
});

// 📦 REQUEST
export const transformRequestResponse = (res) => ({
  id: res?.id,
  equipmentId: res?.equipmentId,
  userId: res?.userId,
  status: res?.status,
  requestDate: res?.requestDate,
  returnDate: res?.returnDate,
});

// 📊 ANALYTICS
export const transformAnalyticsSummary = (res) => ({
  totalRequests: res?.totalRequests,
  activeRequests: res?.activeRequests,
  returnedRequests: res?.returnedRequests,
  equipmentCount: res?.equipmentCount,
});
