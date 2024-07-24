const Stripe = require('stripe');
const StripeOrder = require('../models/stripeOrderSchema');
const paymentController = {}

//Stripe Payment Integration
const stripe = Stripe(process.env.STRIPE_API_KEY);
paymentController.createSession = async (req, res) => {
    const { id, name, unit_amount, quantity, address } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name,
                            // images: [image],

                        },
                        unit_amount: unit_amount,
                    },
                    quantity,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/ordermedicine`,
        });
        if (session) {
            const PlaceholderOrder = new StripeOrder({
                user: id,
                orderItems: [
                    {
                        name,
                        price: unit_amount,
                        quantity,
                        // image: 'imageURL'
                    },
                ],
                paymentInfo: {
                    status: session.payment_status,
                    itemsPrice: session.amount_total,
                    taxPrice: session.total_details.amount_tax,
                    totalPrice: session.amount_subtotal,
                    createdAt: Date.now(),
                    paidAt: null,
                },
                delivery: {
                    address,
                }
            });
            const savedPlaceholderOrder = await PlaceholderOrder.save();
            if (savedPlaceholderOrder) {
                console.log('Saved Placeholder Order.');
                res.status(200).send({ url: session.url });
            }
            else {
                console.log('Unable to save placeholder order.');
                return res.status(500).send('Error in saving order to database!');
            }
        }
        else {
            res.status(500).send('Stripe Session Error!');
        }
    } catch (error) {
        console.log('Error in Stripe: ', error);
        res.status(500).send('Internal Server Error!');
    }
};

module.exports = paymentController;

