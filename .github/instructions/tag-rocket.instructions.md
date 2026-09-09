---
applyTo: "**/tag-rocket-*"
---
# Tag Rocket HTML snippets

All Tag Rocket scripts target the Tag Rocket API (TRAPI) documented at https://bigcommerce.websiteadvantage.com.au/tag-rocket/articles/tag-rocket-api/.

A local mirror of the TRAPI docs (events, data payloads, core functions and concepts) is kept at [docs/tag-rocket-api.md](../../docs/tag-rocket-api.md) for quick reference. It is a cached copy — the live URL above is authoritative if they disagree. Re-fetch and overwrite the mirror when doing TRAPI-related work. If the user asks "refresh the TRAPI mirror", update the local copy accordingly.

## File structure
Every Tag Rocket snippet is a single `.html` file starting with `tag-rocket-` containing one `<script>` block. No wrapping HTML boilerplate.

## Script wrapper
```html
<script data-cfasync="false">
/*
    Web Site Advantage: Tag Rocket [Tag Name] [vX.Y]
    [One-line description]
    https://bigcommerce.websiteadvantage.com.au/tag-rocket/articles/tag-rocket-api/
    https://github.com/Tiggerito/BigCommerce/blob/main/[File Name]
    Copyright (C) [year] Web Site Advantage
    {{!-- 
    Add this script to the BigCommerce Script Manager using the following settings:

    Placement: Header
    Location: All pages
    Script category: Essential
    Script type: Script
    Script contents: this file, review any TODOs in the script and make modifications as needed
    --}}
*/
!function(w,t){
    // Bootstrap TagRocket
    w[t]=w[t]||{};var T=w[t];T.i=T.i||[];if(!T.init)T.init=function(f){T.i.push(f)};

    // TODO: Update these settings to match your account.
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
