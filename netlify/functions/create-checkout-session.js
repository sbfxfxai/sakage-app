const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Menu data (mirrors frontend menuData)
const menuData = {
    breakfastSandwiches: [
        { id: 1, name: "Flagship Sakage Sandwich", price: 17.99 },
        { id: 2, name: "Steak & Egg White Power Stack", price: 14.99 },
        { id: 3, name: "Sausage & Egg White Power Stack", price: 11.99 },
        { id: 4, name: "The Ultimate Bacon & Cheese Stack", price: 9.99 }
    ],
    lunchSpecials: [
        { id: 5, name: "BBQ Pork Sandwich", price: 14.99 },
        { id: 6, name: "Sakage Signature Lean Gourmet Burger", price: 14.99 }
    ],
    sidesAndSweets: [
        { id: 7, name: "Hash Browns", price: 7.99 },
        { id: 8, name: "Blueberry Muffin", price: 3.99 },
        { id: 9, name: "Cinnamon Rolls", price: 4.99 }
    ]
};

const menuCategories = [
    { id: 'breakfastSandwiches', items: menuData.breakfastSandwiches },
    { id: 'lunchSpecials', items: menuData.lunchSpecials },
    { id: 'sidesAndSweets', items: menuData.sidesAndSweets }
];

exports.handler = async (event) => {
    try {
        const { items, tip, deliveryFee, customerDetails } = JSON.parse(event.body);

        // Validate items
        const lineItems = items.map(itemId => {
            const item = menuCategories
                .flatMap(category => category.items)
                .find(item => item.id === parseInt(itemId));
            if (!item) {
                throw new Error(`Invalid item ID: ${itemId}`);
            }
            return {
                price_data: {
                    currency: 'usd',
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100) // Convert to cents
                },
                quantity: 1
            };
        });

        // Add delivery fee
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Delivery Fee' },
                unit_amount: Math.round(deliveryFee * 100)
            },
            quantity: 1
        });

        // Add tip if provided
        if (tip && parseFloat(tip) > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Tip' },
                    unit_amount: Math.round(parseFloat(tip) * 100)
                },
                quantity: 1
            });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'https://sakage.online/success',
            cancel_url: 'https://sakage.online/order',
            customer_email: customerDetails.email,
            shipping_address_collection: {
                allowed_countries: ['US']
            },
            metadata: {
                customer_name: customerDetails.name,
                customer_phone: customerDetails.phone,
                delivery_address: customerDetails.address,
                delivery_instructions: customerDetails.instructions || ''
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id })
        };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};