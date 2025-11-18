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

    return await response.json();

  } catch (error) {
    console.error("getData error:", error);
    return null;
  }
}
