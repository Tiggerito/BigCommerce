export default {
  async fetch(request, env, ctx) {
    // Testing bypass: add ?cf-worker=off to the URL to skip this
    const bypass = new URL(request.url).searchParams.get("cf-worker");

    // 1. Fetch the original page response from the origin
    let response = await fetch(request);

    // If fully disabled, return the origin response without any changes.
    if (bypass === "off") {
      return response;
    }

    const contentType = response.headers.get("content-type") || "";

    // Requires images to be on the same domain as the worker
    const url = new URL(request.url);
    if (url.searchParams.get("noindex") === "true") {
      response = new Response(response.body, response);
      response.headers.append("X-Robots-Tag", "noindex");
    }

    // 2. Only modify successful HTML page requests
    if (response.status === 200 && contentType.includes("text/html")) {

      // noindex for images in the card-img-container class
      response = new HTMLRewriter()
        .on('.card-img-container img', new ImageParamAppender())
        .transform(response);
    }

    // Return the optimized response back to the user
    return response;
  }
};

class ImageParamAppender {
  // Helper function to append the query parameter to a single URL string
  appendParam(urlStr) {
    if (!urlStr) return urlStr;
    
    try {
      // Handle relative URLs by providing a dummy base
      const base = "https://temporary-base.local";
      const url = new URL(urlStr, base);
      
      // Append or update the parameter
      url.searchParams.set("noindex", "true");
      
      // If it was originally a relative URL, return just the relative path + search
      if (urlStr.startsWith('/') || !urlStr.includes('://')) {
        return url.pathname + url.search + url.hash;
      }
      
      return url.toString();
    } catch (e) {
      // Fallback if URL parsing fails (e.g., invalid format)
      return urlStr.includes('?') ? `${urlStr}&noindex=true` : `${urlStr}?noindex=true`;
    }
  }

  // Helper function to process comma-separated srcset attributes
  processSrcset(srcsetStr) {
    if (!srcsetStr) return srcsetStr;

    // Split by commas, but handle spaces carefully (e.g., "image.jpg 2x, image2.jpg 100w")
    return srcsetStr
      .split(',')
      .map(candidate => {
        const trimmed = candidate.trim();
        if (!trimmed) return '';
        
        // Split the URL from its width/density descriptor (e.g., ["image.jpg", "2x"])
        const parts = trimmed.split(/\s+/);
        if (parts.length > 0) {
          parts[0] = this.appendParam(parts[0]);
        }
        return parts.join(' ');
      })
      .join(', ');
  }

  element(element) {
    // 1. Update the 'src' attribute
    const src = element.getAttribute("src");
    if (src) {
      element.setAttribute("src", this.appendParam(src));
    }

    // 2. Update the 'srcset' attribute
    const srcset = element.getAttribute("srcset");
    if (srcset) {
      element.setAttribute("srcset", this.processSrcset(srcset));
    }

    // 3. update the lazysizes lazyload srcset
    const datasrcset = element.getAttribute("data-srcset");
    if (datasrcset) {
      element.setAttribute("data-srcset", this.processSrcset(datasrcset));
    }
  }
}
