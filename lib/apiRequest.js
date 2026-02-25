import toast from "react-hot-toast";

export async function makeRequest(
  setLoading,
  endpoint,
  data,
  resourceName,
  reset,
  redirect,
  method = "POST"
) {
  try {
    setLoading(true);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      toast.success(resourceName);
      reset?.();
      redirect?.();
    } else {
      toast.error(responseData?.message || "Something went wrong");
    }
  } catch (error) {
    console.error("REQUEST ERROR:", error);
    toast.error("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
}

// ============================
// UPDATE (PUT)
// ============================
export async function makePutRequest(
  setLoading,
  endpoint,
  data,
  resourceName,
  redirect,
  reset
) {
  try {
    setLoading(true);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      toast.success(`${resourceName} updated successfully`);
      redirect?.();
      reset?.();
    } else {
      toast.error(responseData?.message || "Something went wrong");
    }
  } catch (error) {
    console.error("PUT ERROR:", error);
    toast.error("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
}