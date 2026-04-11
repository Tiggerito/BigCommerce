# Skill: Find Main Product Image Selector

## Description
This skill instructs the agent on how to find the CSS selector for the main product image on an e-commerce product page. It uses the browser tools to evaluate the page's images and identify the main product image based on dimensions and class/ID names.

## Execution Steps

### 1. Launch Browser Context
Use `mcp_chrome-devtools-mcp_new_page` or `mcp_chrome-devtools-mcp_select_page` to open or select the target product URL in the browser.

### 2. Extract Image Information
Use `mcp_chrome-devtools-mcp_evaluate_script` on the page with the following JavaScript payload to extract information about all significant images on the page:

```javascript
() => {
  const images = Array.from(document.querySelectorAll('img'));
  return images.map(img => ({
    src: img.src,
    alt: img.alt,
    className: img.className,
    id: img.id,
    width: img.width,
    height: img.height,
    parentElementClassName: img.parentElement ? img.parentElement.className : '',
    parentNodeName: img.parentElement ? img.parentElement.nodeName : ''
  })).filter(img => img.width > 50 || img.height > 50);
}
```

### 3. Analyze Output
Evaluate the returned JSON array of images to find the one that is most likely the main product image. Look for:
- Large dimensions (typically the main image being one of the largest width/height combinations).
- Class names or IDs containing keywords like `product`, `main`, `default`, `primary`, or `featured`.

### 4. Provide the CSS Selector
Based on the identified main product image, formulate and provide a simple and robust CSS selector (e.g., `img.productView-image--default` or `#main-product-image`) that targets the specific `img` tag.
