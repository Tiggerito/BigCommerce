---
applyTo: "**/tag-rocket-*"
---
# Tag Rocket HTML snippets

All Tag Rocket scripts target the Tag Rocket API (TRAPI) published at https://bigcommerce.websiteadvantage.com.au/tag-rocket/articles/tag-rocket-api/.

## File structure
Every Tag Rocket snippet is a single `.html` file starting with `tag-rocket-` containing one `<script>` block. No wrapping HTML boilerplate.

## Script wrapper
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

## Key conventions
- The IIFE always uses `!function(w,t){...}(window,'TagRocket')`. Use `T` as the short alias: `var T=w[t]`.
- Configurable values go at the top of the IIFE, clearly grouped, ending with `// End of settings --------`.
- Consent gate with `var consentRequired = 'targetingAdvertising'` (or `'statistics'`). Check before firing: `T.consent(consentRequired, function() { ... })`.
- Inject third-party scripts with `T.addScriptTag(url)` — never with `document.write`.
- Listen for events with `T.on('eventName', function(data) { ... })` or `T.on(/regex/, function(data, eventName) { ... })`.
- Order confirmation logic must listen for `CheckoutStep5OrderCompleted`.
- Scripts can use BigCommerce Handlebars expressions

## General rules
- Do not add `console.log` unless `debug === true` is checked first, or unless the script already uses an unconditional debug mode.
