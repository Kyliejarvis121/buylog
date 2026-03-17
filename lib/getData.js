// /lib/getData.js
export async function getData(key, opts = {}, timeoutMs = 10000) {
  const variants = [
    key,
    key.replace(/([A-Z])/g, "-$1").toLowerCase(),
    key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
  ].filter(Boolean);

  const tried = new Set();

  for (const v of variants) {
    if (tried.has(v)) continue;
    tried.add(v);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log("[getData] Fetching:", v);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/${v}`,
        {
          cache: "no-store",
          credentials: "include",
          signal: controller.signal,
          ...opts,
        }
      );

      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        console.log("[getData] Success:", v, json);
        return {
          success: true,
          data: json.data ?? json,
          message: json.message ?? null,
        };
      }

      if (res.status === 404) {
        console.warn("[getData] 404, trying next variant:", v);
        continue;
      }

      const errBody = await res.text();
      console.error("[getData] API error:", res.status, errBody);
      return { success: false, error: `API error ${res.status}: ${errBody}` };
    } catch (err) {
      clearTimeout(timeout);
      console.error("[getData] Fetch error for", v, err?.message || err);
      continue;
    }
  }

  return {
    success: false,
    error: `Failed to fetch /api/${key} (tried variants: ${[...tried].join(", ")})`,
  };
}