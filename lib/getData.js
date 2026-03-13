export async function getData(key, opts = {}) {
  const variants = [
    key,
    key.replace(/([A-Z])/g, "-$1").toLowerCase(),
    key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
  ].filter(Boolean);

  const tried = new Set();

  for (const v of variants) {
    if (tried.has(v)) continue;
    tried.add(v);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/${v}`,
        {
          cache: "no-store",
          credentials: "include", // 👈 important
          ...opts,
        }
      );

      if (res.ok) {
        const json = await res.json();
        return {
          success: true,
          data: json.data ?? json,
          message: json.message ?? null,
        };
      }

      if (res.status === 404) continue;

      const errBody = await res.text();
      return { success: false, error: `API error ${res.status}: ${errBody}` };
    } catch (err) {
      continue;
    }
  }

  return {
    success: false,
    error: `Failed to fetch /api/${key} (tried variants: ${[
      ...tried,
    ].join(", ")})`,
  };
}