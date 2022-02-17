/*
    Web Site Advantage: RallyOn Google Analytics Legacy  [v1.0] 
    Google Analytics Checkout Code for RallyOn using analytics.js and the ga() function
    https://bigcommerce.websiteadvantage.com.au/tag-rocket/
    Copyright (C) 2022 Web Site Advantage
*/
!function(w,T,r){
    var Google_Analytics_Universal_ID = 'REPLACE_WITH_YOUR_PROPERTY_ID';

    var productIdentifier = function(product) {return ''+product.externalProductId}; // externalProductId, sku, externalVariantId

    w['GoogleAnalyticsObject']=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)},w[r].l=1*new Date();
        
    T.addScriptTag('https://www.google-analytics.com/analytics.js');

    ga('create', Google_Analytics_Universal_ID, 'auto');
    ga('require', 'ec');
    ga('send', 'pageview');

    Rally.events.subscribe('cart.initiated', function(cartData) {
        if (Rally.data.page.get().type === 'confirmation') {
            var lineItems = cartData.lineItems;
            var totalPrice = cartData.total;
            var totalTax = cartData.tax;
            var totalShipping = cartData.shipping || 0;
            var orderId = Rally.data.order.get().id || null;
    
            // set base params
            ga('set', 'currencyCode', cartData.currency); // Set currency
            ga('set', 'location', window.location.protocol + "//" + window.location.host);
    
            lineItems.forEach(function(item) {
                var id = productIdentifier(item).toString();
                ga('ec:addProduct', {
                    'id': id,
                    'name': item.title,
                    'category': 'Product',
                    'variant': item.externalVariantId.toString(),
                    'price': item.price,
                    'quantity': item.quantity
                });
            });
    
            // Set purchase event
            ga('ec:setAction', 'purchase', {
                'id': orderId,
                'affiliation': 'Rally',
                'revenue': totalPrice,
                'tax': totalTax,
                'shipping': totalShipping
            }); 
        }
    });
}(window,TagRocket,'ga');