# GitHub Copilot Instructions — Web Site Advantage / Tag Rocket / SEO Rich Snppets / Page Lightning

## Repository purpose
This repo contains Tag Rocket, SEO Rich Snppets and Page Lightning integration snippets for BigCommerce stores, as well as other scripts and html files related to BigCommerce. All Tag Rocket scripts target the Tag Rocket API published at https://bigcommerce.websiteadvantage.com.au/tag-rocket/articles/tag-rocket-api/.

## BigCommerce API and schema sources
- For any BigCommerce-related API usage (endpoints, request/response shapes, fields, enums, constraints, and versioning), use the bigcommerce-docs MCP as the primary source of truth.
- Prefer bigcommerce-docs MCP results over memory or ad-hoc assumptions when generating or updating code that integrates with BigCommerce APIs.
- When MCP output conflicts with existing code/comments, treat bigcommerce-docs MCP as authoritative and update code accordingly, unless project-specific behavior explicitly requires otherwise.
- If bigcommerce-docs MCP is unavailable, clearly note that limitation and fall back to official BigCommerce documentation links, then re-validate with MCP when available.

> **Note:** Tag Rocket API (TRAPI) snippet conventions (files starting with `tag-rocket-`) live in [instructions/tag-rocket.instructions.md](instructions/tag-rocket.instructions.md).

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
- Copyright header must always say "Web Site Advantage" — do not change the company name.
