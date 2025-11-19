export async function getData(endpoint) {
  try {
    // Always create a safe base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const url = `${baseUrl}/api/${endpoint}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const json = await response.json();

    // Always return a consistent structure
    return {
      success: true,
      data: json?.data ?? json ?? [],
    };

  } catch (error) {
    console.error("getData error:", error);

    // SAFE fallback — prevents build crashes
    return {
      success: false,
      data: [],
      error: error.message || "Unknown error",
    };
  }
}
