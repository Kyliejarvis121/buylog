export async function getData(endpoint) {
  try {
    // Use NEXT_PUBLIC_BASE_URL if defined, otherwise fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Construct the full API URL
    const url = `${baseUrl}/api/${endpoint}`;

    // Fetch data from API with no caching
    const response = await fetch(url, { cache: "no-store" });

    // Throw an error if response is not OK
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
    }

    // Parse JSON response
    const json = await response.json();

    // Return consistent structure
    return {
      success: true,
      data: json?.data ?? json ?? [],
      error: null,
    };
  } catch (error) {
    console.error("getData error:", error);

    // Safe fallback object
    return {
      success: false,
      data: [],
      error: error?.message || "Unknown error",
    };
  }
}
