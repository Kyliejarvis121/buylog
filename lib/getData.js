export async function getData(endpoint) {
  try {
    // Use NEXT_PUBLIC_BASE_URL first, fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Build the API URL
    const url = `${baseUrl}/api/${endpoint}`;

    // Fetch data from API
    const response = await fetch(url, { cache: "no-store" });

    // Throw error if response is not ok
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
    }

    const json = await response.json();

    // Always return a consistent object
    return {
      success: true,
      data: json?.data ?? json ?? [],
      error: null,
    };
  } catch (error) {
    console.error("getData error:", error);

    // Safe fallback
    return {
      success: false,
      data: [],
      error: error.message || "Unknown error",
    };
  }
}
