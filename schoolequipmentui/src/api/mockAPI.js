// src/api/mockApi.js
let items = [
    { id: 1, name: "Microscope", category: "Lab", condition: "Good", quantity: 5},
    { id: 2, name: "Football", category: "Sports", condition: "Fair", quantity: 10 },
  ];
  
  let requests = [];
  // src/api/mockAPI.js
// existing mock request storage
let currentUser = { role: "Student", name: "Student User" }; // for testing

export function addRequest(equipmentId) {
  const equipment = equipmentList.find((e) => e.equipmentId === equipmentId);
  if (!equipment || equipment.quantity === 0) {
    return Promise.reject("Equipment not available");
  }

  const newRequest = {
    id: requests.length + 1,
    equipmentId: equipment.equipmentId,
    itemName: equipment.name,
    requestedBy: currentUser.id,
    requestedByName: currentUser.name,
    qty: 1,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  requests.push(newRequest);

  // Reduce quantity to simulate issued request
//   equipment.quantity = Math.max(0, equipment.quantity - 1);

  return Promise.resolve("Request submitted");
}

// Optional: get requests for student dashboard
export function getRequests() {
  return Promise.resolve(requests);
}

  // src/api/mockAPI.js

// Mock data
const equipmentList = [
    {
      equipmentId: 1,
      name: "Microscope",
      category: "Lab",
      condition: "Good",
      quantity: 5,
      availability: true,
    },
    {
      equipmentId: 2,
      name: "Football",
      category: "Sports",
      condition: "Fair",
      quantity: 10,
      availability: true,
    },
  ];
  
  // Simulate GET /equipment/list
  export function getEquipmentList() {
    // Return a promise to mimic async API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(equipmentList);
      }); // simulate network delay
    });
  }
  
  export function approveRequest(requestId) {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return Promise.reject("Request not found");
  
    req.status = "Approved";
  
    // Reduce equipment quantity on approval
    const equipment = equipmentList.find((e) => e.equipmentId === req.equipmentId);
    if (equipment) {
      equipment.quantity = Math.max(0, equipment.quantity - req.qty);
    }
  
    return Promise.resolve("Request approved");
  }
  
  // Reject a request
  export function rejectRequest(requestId) {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return Promise.reject("Request not found");
  
    req.status = "Rejected";
    return Promise.resolve("Request rejected");
  }

  // Optional: function to add equipment (for AdminDashboard)
  export function addItem(newItem) {
    const id = equipmentList.length + 1;
    equipmentList.push({ equipmentId: id, ...newItem });
    return Promise.resolve("Equipment added");
  }
  
  
  export function initMockData() {
    // already initialized above
  }
  
  export function loginUser(email, password) {
    if (email.includes("admin"))
      return { token: "mock-admin", role: "Admin", name: "Admin User" };
    if (email.includes("lab"))
      return { token: "mock-lab", role: "LabAssistant", name: "Lab Assistant" };
    if (email.includes("student"))
      return { token: "mock-student", role: "Student", name: "Student User" };
    return null;
  }
  
//   export async function getEquipmentList() {
//     const res = await fetch(`${BASE_URL}/equipment`);
//     return res.json();
//   }
  
  
  // Items
  export function getItems() {
    return items;
  }
  
//   export function addItem(item) {
//     item.id = items.length + 1;
//     items.push(item);
//   }
  
  export function deleteItem(id) {
    items = items.filter((it) => it.id !== id);
  }
  
  // Requests
//   export function getRequests() {
//     return requests;
//   }
  
//   export function addRequest(req) {
//     req.id = requests.length + 1;
//     requests.push(req);
//   }
  
  export function updateRequestStatus(id, status) {
    requests = requests.map((r) => (r.id === id ? { ...r, status } : r));
    return Promise.resolve(`Request ${status.toLowerCase()}`);
  }

  // Additional exports for compatibility
  export function registerUser(userData) {
    return Promise.resolve({ message: "User registered (mock)" });
  }

  export function editItem(id, item) {
    const index = equipmentList.findIndex((e) => e.equipmentId === id);
    if (index !== -1) {
      equipmentList[index] = { ...equipmentList[index], ...item };
      return Promise.resolve("Equipment updated");
    }
    return Promise.reject("Equipment not found");
  }

  export function markAsReturned(requestId) {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return Promise.reject("Request not found");
    req.status = "Returned";
    return Promise.resolve("Marked as returned");
  }

  export function getRequestHistory() {
    return Promise.resolve(requests);
  }

  export function getUsageSummary() {
    return Promise.resolve({
      totalRequests: requests.length,
      returnedCount: requests.filter((r) => r.status === "Returned").length,
      mostRequestedItem: "Microscope",
      requestsByRole: {},
    });
  }
  
// const BASE_URL = "https://dummyjson.com/products"; // update later if hosted

// export async function login(email, password) {
//   const res = await fetch(`${BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   if (!res.ok) throw new Error("Login failed");
//   return res.json();
// }

// export async function getEquipmentList() {
//   const res = await fetch(`${BASE_URL}/equipment`);
//   return res.json();
// }

// export async function addEquipment(item) {
//   const res = await fetch(`${BASE_URL}/equipment`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(item),
//   });
//   return res.json();
// }

// export async function requestEquipment(id, userId) {
//   const res = await fetch(`${BASE_URL}/requests`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ equipmentId: id, userId }),
//   });
//   return res.json();
// }

// export async function updateRequestStatus(id, status) {
//   const res = await fetch(`${BASE_URL}/requests/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ status }),
//   });
//   return res.json();
// }

// export async function getAllRequests() {
//   const res = await fetch(`${BASE_URL}/requests`);
//   return res.json();
// }
