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

      // --- TASK: INJECT DATA INTO HTML ---
      const country = request.cf?.country || '-';
      const region = request.cf?.regionCode || '-';
      const asn = request.cf?.asn || '-';

      response = new HTMLRewriter()
        .on('html', {
          element(el) { 
            el.setAttribute("data-country", country);
            el.setAttribute("data-region", region);
            el.setAttribute("data-asn", asn);
          }
        })
        .transform(response);
    }

    // Return the optimized response back to the user
    return response;
  }
};
