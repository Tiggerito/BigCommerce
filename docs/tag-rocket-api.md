# The Tag Rocket API (TRAPI) — Local Reference Mirror

> **Source of truth:** <https://bigcommerce.websiteadvantage.com.au/tag-rocket/articles/tag-rocket-api/>
> **Last synced:** 2026-09-09
> **Maintainer note:** This is a cached copy for quick local reference and to ground code generation for `tag-rocket-*` snippets. If it disagrees with the live page, the live page wins. Re-fetch and overwrite this file when working on TRAPI-related changes.

Tag Rocket contains powerful data & event-gathering capabilities, but it does not support every tag out of the box. TRAPI is the API that lets store owners use Tag Rocket to enable enhanced tagging for tags that aren't supported natively.

---

## Core concepts

### The script wrapper
Most TRAPI scripts follow the same pattern — a wrapper that lets you use Tag Rocket once it is ready:

```js
!function(w,t){
    w[t]=w[t]||{};var T=w[t];T.i=T.i||[];if(!T.init)T.init=function(f){T.i.push(f)};

    T.init(function() {
        // YOUR TAG ROCKET CODE HERE
    })
}(window,"TagRocket")
```

- The wrapper lets the code be placed **anywhere** on the page — before or after the Tag Rocket scripts.
- It sets `T` to represent the Tag Rocket object.
- Your code is added via `T.init(fn)`, which runs after Tag Rocket is initialised and consent established, but **before** Tag Rocket starts firing events.
- Inside `T.init` you can access Tag Rocket functions and data via `T`, e.g. `console.log("Consent", T.consent);`.

### When does TRAPI run
- `init()` is **not** called until all other scripts on the page have had a chance to run and consent states are established.
- TRAPI scripts can therefore be placed anywhere on the page, and consent can be trusted when `init()` is called.
- `gtag` and the `dataLayer` are active before `init()` is called (for consent commands), but Tag Rocket delays all but the consent commands until after consent is established and all `init()` functions have run.

### Listening to events
The main feature of TRAPI is listening to Tag Rocket events via `T.on()`:

```js
// By event name
T.on('ContactSuccess', function(data, eventName){
    // YOUR EVENT HANDLER
});

// By regex (this one matches all events)
T.on(/.*/, function(data, eventName){
    // YOUR EVENT HANDLER
});
```

The handler receives the event `data` and the `eventName`.

### Handling events with a switch
A common pattern is a switch on `eventName`:

```js
T.on(/.*/, function(data, eventName){
    switch(eventName) {
        case "QuickSearch":
        case "SearchPage":
            // EVENT HANDLER CODE
            break;
        case "CartItemChanged":
            // EVENT HANDLER CODE
            break;
        case "CheckoutStep1CustomerStarted":
            // EVENT HANDLER CODE
            break;
        case "CheckoutStep5OrderCompleted":
            // EVENT HANDLER CODE FOR PURCHASES
            break;
    }
});
```

---

## Events

### Product / list / promotion events
| Event | Fires when | Data |
| --- | --- | --- |
| `LinkClick` | A specific link is clicked (email, phone, external, social). | Parameters: `tag`, `href`, `category`, `label`, `value` |
| `PromotionsVisible` | Promotions (banners) become visible to the user. | `infos` — array of info about each promotion that became visible |
| `PromotionClicked` | A promotion (banner) is clicked. | `promotion` — details about the promotion |
| `ProductsVisible` | Products become visible to the user. | `infos` — array of info about each product; includes `search` parameter with search term if related to a search |
| `ProductClicked` | A product in a list is clicked. | `product` — details about the product |
| `ProductPage` | (product page) | The product |
| `AddToWishList` | A user adds a product to their wishlist. | The product |

### Cart / checkout events
| Event | Fires when | Data |
| --- | --- | --- |
| `CartItemChanged` | A product is added or removed from the cart. | The product with a `change` parameter (how many added/removed); also includes the related `cart` |
| `CartPage` | A user views the cart page. | The cart |
| `CheckoutPage` | The checkout page is viewed. | The cart |
| `CheckoutStep1CustomerStarted` | | The cart |
| `CheckoutStep1CustomerCompleted` | | The cart |
| `CheckoutStep2ShippingStarted` | | The cart |
| `CheckoutStep2ShippingCompleted` | | The cart |
| `CheckoutStep3BillingStarted` | | The cart |
| `CheckoutStep3BillingCompleted` | | The cart |
| `CheckoutStep4PaymentStarted` | | The cart |
| `CheckoutStep5OrderCompleted` | Order completed (use this for purchases). | The cart |
| `UserDataUpdated` | `T.userData` contains currently known user info; on the order completion page it's updated just before `CheckoutStep5OrderCompleted`. | User data |

### Search / contact / account events
| Event | Fires when | Data |
| --- | --- | --- |
| `QuickSearch` | The quick search feature is triggered. | `term` — the search term |
| `SearchPage` | A user visits the search result page. | `term` — the search term |
| `ContactForm` | The user went to a contact form page. | Empty |
| `ContactSuccess` | A user successfully makes contact via the contact form. | `email` parameter |
| `ContactError` | A user's attempt to make contact fails. | An `error` object |
| `AccountCreated` | A user creates an account and lands on the thank-you page. | `method` set to `register` or `order-confirmation` |
| `SiteLogin` | A user logs in via header link. | `method`: `guest` if via order confirmation page, otherwise `site` |
| `SiteLogout` | A user logs out via the header link. | Empty |
| `CheckoutLogin` | A user logs in via the checkout page. | The cart |
| `CheckoutLogout` | A user logs out via the checkout page. | The cart |
| `SubscribeSuccess` | A user successfully subscribes to the newsletter. | `email` property |

### Data-gathering events
| Event | Fires when | Data |
| --- | --- | --- |
| `NewPromotionsAdded` | Promotions (banners) detected via correct data attributes. | |
| `NewProductsAdded` | New products detected via correct data attributes (later triggers `ProductDataGathered`). | `element`s property containing the elements for each product |
| `ProductDataGathered` | Tag Rocket finished gathering extra info about some products. | A `reason` for gathering; an array of `items` with all product data gathered. Can be replaced with a new array that omits some products. |
| `CartDataGathered` | Tag Rocket finished gathering additional info for a cart or order (`ProductDataGathered` on cart items fires first). | A `cart` property that can be modified |
| `GetValue` | A tag requests that a value be calculated; handler can overwrite `value`. | `destination` = requesting tag (MicrosoftAds, FacebookAds, GoogleAds, GA4, PinterestAds, TwitterAds, YahooAds, OpenAiAds). `type` = requested value (ItemId, ItemGroupId, VariantName, OrderAmount). `item`/`order` provides relevant data. `value` initially set from admin settings. |

### Error / diagnostics events
| Event | Fires when | Data |
| --- | --- | --- |
| `JavaScriptError` | An unhandled JavaScript error happens. | `type`, `message`, `filename`, `lineno`, `colno`, `error`, `action`, `label` |
| `ConsoleError` | A console error is generated. | `message` property |
| `LoadError` | A resource (image, JS file) fails to load. | `targetUrl`, `targetPath`, and other info |
| `JsonLdError` | A JSON-LD script had a syntax error. | `error` (string) and `element` (DOM element) indicating where |
| `StencilUtils` | `stencilUtils` has loaded. | The `stencilUtils` object |

### Web Vitals / performance events
| Event | Fires when | Data |
| --- | --- | --- |
| `WebVitalsPending` | Before the complete event, to let code alter the data. | Set `cancel` to true to stop recording this vital (e.g. sample only 10% of users). Includes a `metric` property with data including `debugNode` for the chosen LCP/CLS node — `debugNode` can be changed and `debugTarget` updates automatically. |
| `WebVitalsComplete` | Web Vitals data is acquired. | `metric` with `name`, `status`, `value`; sometimes extra element data such as `debugTarget` |
| `PerformanceMetrics` | *(experimental, not yet available)* Page unloads. | `eventType` = `pagehide` or `hidden`; plus `fetchStart`, `requestStart`, `responseStart`, `responseEnd`, `domContentLoadedEventStart`, `domContentLoadedEventEnd`, `loadEventStart`, `loadEventEnd`, `transferSize`, `type`, `redirectCount`, `fcp`, `fid`, `cls`, `lcp`, `fp` |
| `SendBeacon` | A beacon is sent. | `url` and `data` parameters |
| `XMLHttpRequestResponseError` | An `XMLHttpRequest`-based request returns an error. | The request |
| `FetchResponseError` | A `fetch()` request returns an error. | The error |

### Analytics / gtag command events
| Event | Fires when | Data |
| --- | --- | --- |
| `GaCommandPending` | A GA `ga` command is about to be sent (BigCommerce built-in GA). Modify args, cancel, or insert new commands before it. | `arguments`, `cancel` |
| `GaCommandSent` | The `ga` command has been sent (add commands after a specific one). | `arguments` |
| `GtagCommandPending` | Just before `gtag` commands (GA4 & Google Ads) are sent. Modify args, cancel, or insert. Consent commands are sent before TRAPI init so can't be intercepted; on `init()` consent is in `T.consent`. | `arguments`, `cancel` |
| `GtagCommandSent` | A `gtag` command has been sent. | `arguments` |
| `GoogleAnalyticsFourItemPending` | Modify an item before it's sent to GA4 (e.g. alter categories). | The related `product` and the GA4 `item` to send (item can be updated) |

### Ad-platform command events (Pending/Sent pairs)
Each `*Pending` event lets you modify `arguments`, `cancel`, or insert a new command before it is sent. Each `*Sent` event lets you add commands after a specific one (`arguments`).

| Platform | Tag | Pending | Sent |
| --- | --- | --- | --- |
| Microsoft Ads | `uet` | `UetCommandPending` | `UetCommandSent` |
| Facebook / Meta | `fbq` | `FbqCommandPending` | `FbqCommandSent` |
| Pinterest | `pintrk` | `PintrkCommandPending` | `PintrkCommandSent` |
| Twitter/X | `twq` | `TwqCommandPending` | `TwqCommandSent` |
| Yahoo | `dotq` | `DotqCommandPending` | `DotqCommandSent` |
| TikTok | `ttq` | `TtqTrackCommandPending` | `TtqTrackCommandSent` |
| OpenAI Ads | `oaiq` | `OaiqCommandPending` | `OaiqCommandSent` |

### Consent events
| Event | Fires when | Data |
| --- | --- | --- |
| `ConsentEstablished` | Consent has first been established. | — |
| `ConsentChanged` | Tag Rocket detects the user's BigCommerce consent has changed (via banner or `TagRocket.updateConsent()`). | Current consent information |

---

## Product data properties
For product-related event data, each product can contain:

| Property | Meaning |
| --- | --- |
| `name` | Name of the product |
| `url` | The URL for this product |
| `price` | How much it costs |
| `currency` | Two-letter currency code |
| `productId` | Internal ID for the product |
| `variantId` | Internal ID for the variant, if applicable (e.g. cart events) |
| `sku` | Variant or product SKU depending on situation |
| `isVariant` | Whether this item is a variant or a top-level product |
| `hasVariants` | If a top-level product, whether it has variants |
| `variantName` | If a variant, describes the variant, e.g. "Size: Large" |
| `productSku` | The product SKU, even if this is a variant |
| `variantSku` | The variant SKU where it is a variant |
| `firstVariantSku` | If there are variants, the SKU for one of them |
| `productGtin` / `variantGtin` | GTIN for the product / variant if set |
| `productMpn` / `variantMpn` | MPN for the product / variant if set |
| `productUpc` / `variantUpc` | UPC for the product / variant if set |
| `brand` | The product's brand |
| `defaultImage` | Object with `data` and `url`. `url` is the main image; `data` is a URL template where `{:size}` can be replaced to generate any size. |
| `category` | Primary category object: `breadcrumbs` (text array), `id`, `name`, `path` (breadcrumb text) |
| `categories` | Array of all category objects the product is in (same shape as `category`) |
| `customFields` | Array of custom fields, each `{ name, value }` |
| `index` | Position in a list of products, starting at 1 |
| `e` | The product's card element if relevant |
| `quantity` | If in a cart, how many |
| `change` | In a `CartItemChanged` event, the amount changed (negative = removals) |
| `cart` | In a `CartItemChanged` event, the cart data |

## Cart / order properties
| Property | Meaning |
| --- | --- |
| `orderId` | Numerical ID identifying the order |
| `cartAmount` | |
| `currency.code` | Two-letter currency code |
| `items` | Array of the products in the cart |

---

## Cancelling events
Some events include parameters to cancel actions:

| Parameter | Effect |
| --- | --- |
| `cancelBuiltInEvents` | On core events fired by Tag Rocket. If `true`, won't pass the event on to the built-in tags. |
| `cancelDataLayerEvents` | If the GTM Data Layer Events feature is enabled and Tag Rocket's events are sent to the `dataLayer`, set `true` to prevent an event being pushed to the `dataLayer`. |
| `cancel` | On Pending Tag events. If `true`, stops the pending event from being sent. |

---

## Core functions

### `T.addScriptTag(url [, attributes] [, onload])`
Loads a script in the background (sets `async` automatically), avoiding the need to duplicate loader boilerplate.

```js
T.addScriptTag('https://tag.com/tag.js');

// Custom attributes. Setting `id` is special: if an element with that id already
// exists, the tag is NOT added (a neat way to avoid duplicate tagging).
T.addScriptTag('https://tag.com/tag.js', {id: 'mytagid', importance: 'high', crossorigin: 'anonymous'});

// Callback once the script has loaded
T.addScriptTag('https://tag.com/tag.js', {id: 'mytagid'}, function() {
    // USE THE SCRIPT NOW IT HAS LOADED
});
```

### `T.addPreconnectTag(url)`
Adds a preconnect tag so the browser sets up connections to domains early.

```js
T.addPreconnectTag('https://api.tag.com');
```
> **Privacy note:** disabled when the consent banner is enabled, because it can leak IP address info before consent is given.

### `T.addStyleTag(css)`
Inserts CSS via a style tag.

```js
T.addStyleTag('h1 {font-weight: 700;}');
```

### `T.checkCart()`
Tag Rocket uses Stencil to detect cart changes. If a site alters carts in ways Tag Rocket isn't aware of, call `T.checkCart()` to process the changes now instead of waiting.

### `T.block = true`
Set as early as possible to stop Tag Rocket from doing any tracking (e.g. a bot not otherwise excluded).

### `T.processOrder(orderId)`
Tag Rocket auto-processes orders on the order-confirmation page. If a customised site doesn't visit that page on order completion, call `T.processOrder(orderId)` manually. See [tag-rocket-process_order.html](https://github.com/Tiggerito/BigCommerce/blob/main/tag-rocket-process_order.html).

### `TagRocket.getProductId(destination, type, product, productFormat [, variantFormat])`
Gets a product ID using the Tag Rocket admin ID format syntax.

| Argument | Meaning |
| --- | --- |
| `destination` | Name for what will use this ID (the channel name). |
| `type` | `'ItemId'` (variant) or `'ItemGroupId'` (product). |
| `product` | The product object to extract the ID from. |
| `productFormat` | Text with placeholders replaced by product values: `[[psku]]` = Product SKU if available, `[[pid]]` = Product ID, `[[vsku]]` = Variant SKU if available, `[[vid]]` = Variant ID if available, `[[vname]]` = Variant Name if available. Use `||` to supply an alternate format if the first isn't available. If all formats fail, Product ID is used. |
| `variantFormat` | If set and it's a variant, an `'ItemId'` type uses this format instead. |

```js
// Simply return a product id
var id = TagRocket.getProductId('MyTag', 'ItemGroupId', product, '[[pid]]');

// Product SKU if set, otherwise 'P' + Product ID
var id = TagRocket.getProductId('MyTag', 'ItemGroupId', product, '[[psku]]||P[[pid]]');

// Cart case: variant value plus product value
var itemGroupId = TagRocket.getProductId('MyTag', 'ItemGroupId', product, '[[psku]]||P[[pid]]');
var itemId      = TagRocket.getProductId('MyTag', 'ItemId', product, '[[psku]]||P[[pid]]', '[[vsku]]');
```

---

## Public parameters
Accessed via the `T` variable inside a script. Some are only set for specific events.

| Parameter | Meaning |
| --- | --- |
| `consent` | Details about the current user's consent settings. |
| `log` | A log of the events fired, grouped by tags. |
| `order` | Access to the current order on the order completion page. |
| `pageType` | The current page type. |
| `products` | Details about products on the page. |
| `product` | Details about the product for a product page. |
| `cards` | Any cards found related to a search provider. |
| `countryCode` | Normally from the Stencil object; can be overridden with a `data-country` attribute on the `html` tag (a Cloudflare worker builder can populate it). Used for complex Google Consent Mode configs. |
| `regionCode` | Previously from the Stencil object (BigCommerce dropped it); set via a `data-region` attribute on the `html` tag. Used for complex Google Consent Mode configs. |
| `userData` | What is currently known about the user. If modified, call `T.userDataUpdated()` to fire `UserDataUpdated` and inform all tags. |
| `tags` | Pipe-separated list of the enabled tags. |

---

## Controlling consent
- Tag Rocket integrates with the BigCommerce consent system and third-party CMPs that support Google Consent Mode.
- Inspect current consent with `TagRocket.consent`.
- Standard BigCommerce consent options: `analytics`, `functional`, `targetingAdvertising`. The consent data also includes properties used for Consent Modes.
- Tag Rocket waits until consent is established (BigCommerce banner: on DOMContentLoaded; CMPs: may be delayed). On establishment it fires `ConsentEstablished`; later changes fire `ConsentChanged`.
- If a CMP doesn't support Google Consent Mode, you must implement it. Set consent like:

```js
gtag("consent", "update", {
   "ad_storage": "granted",
   "ad_user_data": "granted",
   "ad_personalization": "granted",
   "analytics_storage": "granted",
   "functionality_storage": "granted",
   "personalization_storage": "granted",
   "security_storage": "granted"
});
```

Each parameter is `"granted"` or `"denied"`. Tag Rocket listens for these consent commands, responds (enabling tags / sending events as consent is granted), and uses the BigCommerce API to report the new settings.

> At this time, BigCommerce does not support `ad_user_data` or `ad_personalization`.

See: [How to set up consent mode with Tag Rocket and BigCommerce](https://bigcommerce.websiteadvantage.com.au/tag-rocket/articles/google-consent-mode-v2-and-bigcommerce/).

---

## Setup notes
- Install Tag Rocket, then in the Dashboard open **Global Tag Values** settings → **Tag Rocket API** section → check **Fire All Events** → Finish Editing → Publish.
- Add scripts via **Storefront → Script Manager**. Set **Location on page** to **Head** if you want to intercept all TRAPI events (otherwise some events may fire before your code runs).
- Set the **Script category** to match the tag type (most tracking tags are `Targeting;Advertising`) so BigCommerce can enforce consent compliance when the cookie banner is enabled.

## Console logger example
The simplest way to observe events and their data:

```html
<script data-cfasync="false">
!function(w,t){
    w[t]=w[t]||{};var T=w[t];T.i=T.i||[];if(!T.init)T.init=function(f){T.i.push(f)};

    T.init(function() {
        console.log("Tag Rocket is initialized");
        console.log("Consent", T.consent);

        T.on(/.*/, function(data, eventName){
            console.log('OnEvent ' + eventName, data);
        });
    })
}(window,"TagRocket")
</script>
```
