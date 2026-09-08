export default {
  async fetch(request, env, ctx) {
    // Testing bypass: add ?cf-worker=off to the URL to skip this
    // worker entirely, or ?cf-worker=no-hints to skip only the Early Hints.
    const bypass = new URL(request.url).searchParams.get("cf-worker");

    // 1. Fetch the original page response from the origin
    let response = await fetch(request);

    // If fully disabled, return the origin response without any changes.
    if (bypass === "off") {
      return response;
    }

    const contentType = response.headers.get("content-type") || "";

    // 2. Only modify successful HTML page requests
    if (response.status === 200 && contentType.includes("text/html")) {

      // --- TASK: ADD EARLY HINTS HEADERS ---
      // Skip when testing with ?...=no-hints so you can compare with and without.
      if (bypass !== "no-hints") {
        const earlyHints = [
   //       { link: "<https://...>; rel=preload; as=script; fetchpriority=high", path: "" }
        ];

        const customHints = earlyHints.map(h => h.link);

        const existingLinkHeader = response.headers.get("Link");
        response = new Response(response.body, response);

        // Collect the URLs already present in the origin's Link header (e.g. hints your
        // CMS emits) so we don't add a duplicate preload for the same resource.
        const existingUrls = new Set();
        if (existingLinkHeader) {
          for (const match of existingLinkHeader.matchAll(/<([^>]*)>/g)) {
            existingUrls.add(match[1].trim());
          }
        }

        // Only keep our hints whose URL the origin hasn't already hinted.
        const newHints = customHints.filter(link => {
          const m = link.match(/<([^>]*)>/);
          return !m || !existingUrls.has(m[1].trim());
        });

        if (newHints.length > 0) {
          response.headers.append("Link", newHints.join(", "));
        }
      }
    }

    // Return the optimized response back to the user
    return response;
  }
};
