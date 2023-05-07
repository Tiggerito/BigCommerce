// product details
var product = {
    price: 50, // -1 = price unknown
    priceCurrency: 'GBP', 
    weight: 30, 
    width: 10,
    height: 10, 
    depth: 10,
    fixedShippingPrice: -1, // -1 = no fixed price. 0 = free
    fixedShippingCurrency: 'GBP'
};

// USA - Always free shipping
shippingItems.push({
    cost: 0, // FREE
    currency: "USD",
    country: ["US"], // In the US
    handlingTimeMinDays: 0, 
    handlingTimeMaxDays: 1,
    transitTimeMinDays: 1,
    transitTimeMaxDays: 3
});

// Australia
// Free in the Adelaide Metropolitan area
shippingItems.push({
    cost: 0, // FREE
    currency: "AUD",
    country: ["AU"], // In Australia
    postalCode: ["5000-5117", "512*", "5150", "5158", "5159", "516*-517*", "5950", "5960"], // Adelaide Metropolitan postcodes
    handlingTimeMinDays: 0, 
    handlingTimeMaxDays: 1,
    transitTimeMinDays: 1,
    transitTimeMaxDays: 3
});

// $10 in South Australia
shippingItems.push({
    cost: 10, 
    currency: "AUD",
    country: ["AU"], 
    region: ["SA"],// In South Australia
    handlingTimeMinDays: 0, 
    handlingTimeMaxDays: 1,
    transitTimeMinDays: 1,
    transitTimeMaxDays: 5
});

// Less than $15 in Australia
shippingItems.push({
    maxCost: 15, 
    currency: "AUD",
    country: ["AU"], 
    handlingTimeMinDays: 0, 
    handlingTimeMaxDays: 1,
    transitTimeMinDays: 3,
    transitTimeMaxDays: 7
});

// The UK
// Use fixed shipping if provided
if (product.fixedShippingPrice >= 0) {
    shippingItems.push({
        cost: product.fixedShippingPrice, 
        currency: product.fixedShippingCurrency,
        country: ["GB"], 
        handlingTimeMinDays: 0, 
        handlingTimeMaxDays: 1,
        transitTimeMinDays: 3,
        transitTimeMaxDays: 7
    });
} else {

    // else Free shipping over $100
    if (product.price > 100) {
        shippingItems.push({
            cost: 0, 
            currency: "GBP",
            country: ["GB"], 
            handlingTimeMinDays: 0, 
            handlingTimeMaxDays: 1,
            transitTimeMinDays: 3,
            transitTimeMaxDays: 7
        });
    } else {
        // Costs for products under $100 are based on weight

        if (product.weight < 10) {
            shippingItems.push({
                cost: 5, // the min shipping cost
                currency: "GBP",
                country: ["GB"], 
                handlingTimeMinDays: 0, 
                handlingTimeMaxDays: 1,
                transitTimeMinDays: 3,
                transitTimeMaxDays: 7
            });
        } else if (product.weight < 20) {
            shippingItems.push({
                cost: 10, 
                currency: "GBP",
                country: ["GB"], 
                handlingTimeMinDays: 0, 
                handlingTimeMaxDays: 1,
                transitTimeMinDays: 3,
                transitTimeMaxDays: 7
            });
        } else if (product.weight > 100) {
            shippingItems.push({
                cost: 50, // the max shipping cost
                currency: "GBP",
                country: ["GB"], 
                handlingTimeMinDays: 0, 
                handlingTimeMaxDays: 1,
                transitTimeMinDays: 3,
                transitTimeMaxDays: 7
            });
        } else {
            shippingItems.push({
                cost: 10 + (product.weight / 3), // varying shipping cost
                currency: "GBP",
                country: ["GB"], 
                handlingTimeMinDays: 0, 
                handlingTimeMaxDays: 1,
                transitTimeMinDays: 3,
                transitTimeMaxDays: 7
            });
        }
    }
}