# GitHub Copilot Instructions — Web Site Advantage / Tag Rocket

## Repository purpose
This repo contains Tag Rocket integration snippets for BigCommerce stores, as well as other scripts and html files related to BigCommerce. All Tag Rocket scripts target the Tag Rocket API published at https://bigcommerce.websiteadvantage.com.au/tag-rocket/articles/tag-rocket-api/.

---

## Tag Rocket HTML snippets

### File structure
Every Tag Rocket snippet is a single `.html` file starting with `tag-rocket-` containing one `<script>` block. No wrapping HTML boilerplate.

### Script wrapper
```html
<script data-cfasync="false">
/*
    Web Site Advantage: Tag Rocket [Tag Name] [vX.Y]
    [One-line description]
    https://bigcommerce.websiteadvantage.com.au/tag-rocket/articles/tag-rocket-api/
    Copyright (C) [year] Web Site Advantage
*/
!function(w,t){
    // Bootstrap TagRocket
    w[t]=w[t]||{};var T=w[t];T.i=T.i||[];if(!T.init)T.init=function(f){T.i.push(f)};

    // --- Settings (change these) ---
    var setting1 = 'value';
    var debug = false;
    // End of settings --------

    T.init(function() {
        // implementation
    });
}(window,'TagRocket');
</script>
```

### Key conventions
- The IIFE always uses `!function(w,t){...}(window,'TagRocket')`. Use `T` as the short alias: `var T=w[t]`.
- Configurable values go at the top of the IIFE, clearly grouped, ending with `// End of settings --------`.
- Consent gate with `var consentRequired = 'targetingAdvertising'` (or `'statistics'`). Check before firing: `T.consent(consentRequired, function() { ... })`.
- Inject third-party scripts with `T.addScriptTag(url)` — never with `document.write`.
- Listen for events with `T.on('eventPattern', function(data, eventName) { ... })`.
- Order confirmation logic must listen for `CheckoutStep5OrderCompleted`.
- Scripts can use BigCommerce Handlebars expressions 

---

## BigCommerce Stencil / Handlebars embedded in scripts

BigCommerce Handlebars expressions are rendered server-side before the script reaches the browser. What is supported is documented in https://developer.bigcommerce.com/docs/storefront/stencil/themes/context/handlebars-reference.

Follow these patterns:

- Use `~` for whitespace trimming: `{{~#if page_type '===' 'product'}}`.
- Page type checks: `page_type '===' 'product'`, `'category'`, `'cart'`, `'orderconfirmation'`, `'search'`.
- Home page check: `settings.request.absolute_path '===' '/'`.
- Plain ES5-compatible JavaScript as scripts are loaded directly in a browser

---

## General rules
- Do not add `console.log` unless `debug === true` is checked first, or unless the script already uses an unconditional debug mode.
- Copyright header must always say "Web Site Advantage" — do not change the company name.
