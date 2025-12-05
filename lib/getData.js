// lib/getData.js
export async function getData(key, opts = {}) {
  // Accept keys like "farmerSupport" or "farmer-support"
  // Will try variations in order until one responds 200
  const variants = [
    key,
    key.replace(/([A-Z])/g, "-$1").toLowerCase(), // camelCase -> kebab-case
    key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), // kebab -> camelCase
  ].filter(Boolean);

  const tried = new Set();

  for (const v of variants) {
    if (tried.has(v)) continue;
    tried.add(v);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/${v}`, {
        cache: "no-store",
        ...opts,
      });

      if (res.ok) {
        const json = await res.json();
        // Normalize: always return object with {success, data, message}
        return {
          success: true,
          data: json.data ?? json, // works for lists and single items
          message: json.message ?? null,
        };
      }

      if (res.status === 404) continue; // try next variant
      const errBody = await res.text();
      return { success: false, error: `API error ${res.status}: ${errBody}` };
    } catch (err) {
      // network or other error, try next variant
      continue;
    }
  }

  return { success: false, error: `Failed to fetch /api/${key} (tried variants: ${[...tried].join(", ")})` };
}
