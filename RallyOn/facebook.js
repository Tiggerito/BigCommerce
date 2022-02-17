/*
    Web Site Advantage: RallyOn Facebook [v1.0] 
    Facebook Checkout Code for RallyOn
    https://bigcommerce.websiteadvantage.com.au/tag-rocket/
    Copyright (C) 2022 Web Site Advantage
*/
!function(w,T){
    var Facebook_Pixel_ID = 'REPLACE_WITH_YOUR_PIXEL_ID';

    var productIdentifier = function(product) {return ''+product.externalProductId}; // externalProductId, sku, externalVariantId

    if(w.fbq)return;var n=w.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!w._fbq)w._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];

    T.addScriptTag('https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', Facebook_Pixel_ID);

    // InitiateCheckout
    Rally.events.subscribe('cart.initiated', function(cartData) {
        if (Rally.data.page.get().type === 'checkout') {

            fbq('track', 'PageView'); // page has started? could be outside?

            var lineItems = cartData.lineItems;
            var contents = [];
            var content_ids = [];
            var item_cnt = 0;

            lineItems.forEach(function(item) {
                var id = productIdentifier(item).toString();
                content_ids.push(id);
                contents.push({
                    "id": id,
                    "quantity": item.quantity,
                    "price": item.price,
                    "title": item.title
                });
                item_cnt += parseInt(item.quantity);
            });

            // not right as already added
            // fbq('track', 'AddToCart', {
            //     "content_name": "Rally Checkout",
            //     "content_ids": content_ids,
            //     "content_type": "product",
            //     "contents": contents,
            //     "value": cartData.total,
            //     "num_items": item_cnt,
            //     "currency": "USD"
            // });

            fbq('track', 'InitiateCheckout', {
                "content_name": "Rally Initiate Checkout",
                "content_ids": content_ids,
                "content_type": "product",
                "contents": contents,
                "value": cartData.total,
                "num_items": item_cnt,
                "currency": "USD"
            });

        }
    });

    // Purchase
    Rally.events.subscribe('cart.initiated', function(cartData) {
        if (Rally.data.page.get().type === 'confirmation') {
    
            var lineItems = cartData.lineItems;
            var contents = [];
            var content_ids = [];
            var item_cnt = 0;
    
            lineItems.forEach(function(item) {
                var id = productIdentifier(item).toString();
                content_ids.push(id);
                contents.push({
                    "id": id,
                    "quantity": item.quantity,
                    "price": item.price,
                    "title": item.title
                });
                item_cnt += parseInt(item.quantity);
            });
            if (content_ids.length > 0) {
                fbq('track', 'Purchase', {
                    "content_name": "Rally Purchase",
                    "content_ids": content_ids,
                    "content_type": "product",
                    "contents": contents,
                    "value": cartData.total,
                    "num_items": item_cnt,
                    "currency": "USD"
                });
            }
        }
    });
}(window,TagRocket);