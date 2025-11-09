// Connection test utility to verify backend connectivity
const BASE_URL = "http://localhost:5230/api";

export async function testBackendConnection() {
  try {
    console.log("Testing backend connection to:", BASE_URL);
    
    // Test 1: Try health endpoint first
    try {
      const healthResponse = await fetch(`${BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log("Health check passed:", healthData);
        return { success: true, message: "Backend is connected and responding" };
      }
    } catch (healthError) {
      console.log("Health endpoint not available, trying equipment endpoint");
    }
    
    // Test 2: Try equipment list endpoint
    const apiResponse = await fetch(`${BASE_URL}/equipment/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log("API endpoint status:", apiResponse.status);
    
    if (apiResponse.ok || apiResponse.status === 401) {
      // 401 is OK - it means backend is responding, just needs auth
      return { success: true, message: "Backend is connected and responding" };
    } else if (apiResponse.status === 0 || !apiResponse.status) {
      throw new Error("Network error - backend may not be running");
    } else {
      return { 
        success: false, 
        message: `Backend responded with status: ${apiResponse.status}. Check if backend is running on http://localhost:5230` 
      };
    }
  } catch (error) {
    console.error("Connection test failed:", error);
    const errorMsg = error.message || "Unknown error";
    if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
      return { 
        success: false, 
        message: "Cannot connect to backend. Please ensure the backend is running on http://localhost:5230. Run 'dotnet run' in the EquipmentLendingAPI folder." 
      };
    }
    return { 
      success: false, 
      message: `Connection error: ${errorMsg}` 
    };
  }
}

