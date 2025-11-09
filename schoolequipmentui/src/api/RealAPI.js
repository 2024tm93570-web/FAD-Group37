// Real API implementation for .NET backend
const BASE_URL = "http://localhost:5230/api"; // Backend URL from launchSettings.json

// Helper function to get auth token from localStorage
function getAuthToken() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.token || "";
}

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = token;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check for network errors
    if (!response) {
      throw new Error("Network error: Unable to connect to backend. Make sure the backend is running on http://localhost:5230");
    }

    // Handle error responses
    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
        // Try to parse as JSON for better error messages
        try {
          const errorJson = JSON.parse(errorText);
          errorText = errorJson.message || errorJson.error || errorText;
        } catch {
          // Not JSON, use as is
        }
      } catch {
        errorText = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw new Error("Cannot connect to backend server. Please ensure the backend is running on http://localhost:5230");
    }
    throw error;
  }
}

// Auth API
export async function loginUser(email, password) {
  try {
    // ASP.NET Core model binding is case-insensitive, but let's be explicit
    const response = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ Email: email, Password: password }),
    });

    if (response && (response.Token || response.token)) {
      const user = {
        token: response.Token || response.token,
        role: response.Role || response.role,
        name: email.split("@")[0], // Use email prefix as name
      };
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    throw new Error("Login failed: Invalid response");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function registerUser(userData) {
  return apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function getUserById(id) {
  return apiCall(`/auth/user/${id}`);
}

// Equipment API
export async function getEquipmentList() {
  try {
    const data = await apiCall("/equipment/list");
    // Transform backend data to match frontend expectations
    // Backend returns: EquipmentId, Name, Category, Condition, Quantity, Availability (capitalized)
    // Frontend expects: id, equipmentId, name, category, condition, quantity, availability (lowercase)
    if (!data || !Array.isArray(data)) {
      console.warn("Equipment list is not an array:", data);
      return [];
    }
    
    return data.map((item) => ({
      id: item.EquipmentId || item.equipmentId || item.id,
      equipmentId: item.EquipmentId || item.equipmentId || item.id,
      name: item.Name || item.name,
      category: item.Category || item.category,
      condition: item.Condition || item.condition,
      quantity: item.Quantity !== undefined ? item.Quantity : (item.quantity !== undefined ? item.quantity : 0),
      availability: item.Availability !== undefined ? item.Availability : (item.availability !== undefined ? item.availability : true),
    }));
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    throw error;
  }
}

export async function addItem(item) {
  const equipmentDto = {
    Name: item.name,
    Category: item.category,
    Condition: item.condition,
    Quantity: parseInt(item.quantity),
    Availability: true,
  };
  return apiCall("/equipment/add", {
    method: "POST",
    body: JSON.stringify(equipmentDto),
  });
}

export async function editItem(id, item) {
  const equipmentDto = {
    Name: item.name,
    Category: item.category,
    Condition: item.condition,
    Quantity: parseInt(item.quantity),
    Availability: item.availability !== false,
  };
  return apiCall(`/equipment/edit/${id}`, {
    method: "PUT",
    body: JSON.stringify(equipmentDto),
  });
}

export async function deleteItem(id) {
  return apiCall(`/equipment/delete/${id}`, {
    method: "DELETE",
  });
}

// Request API
export async function addRequest(equipmentId) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user.token || "";
  
  // Extract userId from token (format: SIMULATED-TOKEN-{userId}-{role})
  let userId = null;
  if (token) {
    const parts = token.split("-");
    if (parts.length >= 4) {
      userId = parseInt(parts[2]); // userId is the third part (SIMULATED-TOKEN-{userId}-{role})
    }
  }

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const requestDto = {
    EquipmentId: equipmentId.equipmentId || equipmentId.id || equipmentId,
    RequestedBy: userId,
  };

  return apiCall("/request/request", {
    method: "POST",
    body: JSON.stringify(requestDto),
  });
}

export async function getRequests() {
  const data = await apiCall("/request/list");
  // Transform backend data to match frontend expectations
  return (data || []).map((req) => ({
    id: req.id,
    equipmentId: req.equipmentId,
    itemName: req.itemName,
    requestedBy: req.requestedBy,
    requestedByName: req.requestedByName,
    status: req.status,
    qty: req.qty || 1,
    createdAt: req.createdAt,
  }));
}

export async function approveRequest(requestId) {
  return apiCall(`/Request/approve/${requestId}`, {
    method: "PUT",
  });
}

export async function rejectRequest(requestId) {
  return apiCall(`/request/reject/${requestId}`, {
    method: "PUT",
  });
}

export async function markAsReturned(requestId) {
  return apiCall(`/request/return/${requestId}`, {
    method: "PUT",
  });
}

export function updateRequestStatus(id, status) {
  if (status === "Approved") {
    return approveRequest(id);
  } else if (status === "Rejected") {
    return rejectRequest(id);
  } else if (status === "Returned") {
    return markAsReturned(id);
  }
  return Promise.reject("Invalid status");
}

// Analytics API (optional)
export async function getRequestHistory() {
  return apiCall("/analytics/history");
}

export async function getUsageSummary() {
  return apiCall("/analytics/summary");
}

// Legacy compatibility functions
export function getItems() {
  return getEquipmentList();
}

export function initMockData() {
  // No-op for real API
}

