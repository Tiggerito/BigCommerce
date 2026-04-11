# Skill: Audit Structured Data

## Description
This skill instructs the agent on how to audit a webpage's structured data (JSON-LD and Meta Tags) to ensure compatibility with major data consumers like Google, Facebook, Bing, and Pinterest. It evaluates the presence, formatting, and relevance of data, focusing particularly on e-commerce properties.

## Execution Steps

### 1. Launch Browser Context
Use `mcp_chrome-devtools-mcp_new_page` to open the target URL in the browser.

### 2. Extract Structured Data
Use `mcp_chrome-devtools-mcp_evaluate_script` on the page with the following JavaScript payload to accurately extract JSON-LD scripts and relevant Meta tags (Open Graph, Twitter, Product) directly from the live DOM:

```javascript
() => {
    const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(el => {
        try {
            return JSON.parse(el.textContent);
        } catch (e) {
            return el.textContent;
        }
    });

    const metaTags = Array.from(document.querySelectorAll('meta'))
        .filter(el => {
            const name = el.getAttribute('name');
            const property = el.getAttribute('property');
            return (name && (name.startsWith('twitter:') || name === 'description')) || 
                   (property && (property.startsWith('og:') || property.startsWith('product:')));
        })
        .map(el => ({
            name: el.getAttribute('name') || el.getAttribute('property'),
            content: el.getAttribute('content')
        }));
        
    return {
        jsonLd: jsonLdScripts,
        metaTags: metaTags
    };
}
```

### 3. Analyze Output against Best Practices
Evaluate the returned JSON-LD and Meta tags for compatibility:
- **Google Search & Shopping (and Bing)**: 
  - Look for valid schema structures: `Product`, `ProductGroup`, `offers`, `shippingDetails`. 
  - Sub-checks: Does it nest variations under `hasVariant`? Is there `BreadcrumbList`? Are `aggregateRating` and `review` present? Are there global product IDs (`gtin`, `mpn`)? Are Schema enums formatted thoroughly (e.g. `https://schema.org/InStock`)? Does it use `hasMerchantReturnPolicy`?
- **Facebook / Meta**: 
  - Check for dynamic ad requirements: `og:type="product"`, `og:title`, `og:image`, `product:price:amount`, `product:retailer_item_id` (Variant ID), and `product:item_group_id` (Base Product ID).
- **Pinterest**: 
  - Verity Rich Pin compatibility: `og:type` is "product", coupled with `og:price:standard_amount` or `product:price:amount`.

### 4. Generate Report
Prepare a summary assessing compatibility with each consumer and provide specific, actionable recommendations for improvement based on missing or malformed keys in the evaluated output.
