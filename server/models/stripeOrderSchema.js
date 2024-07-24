const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true,
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            // image: {
            //     type: String,
            //     required: false,
            // },
        },
    ],
    paymentInfo: {
        status: {
            type: String,
            required: true,
            default: 'default',
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        paidAt: {
            type: Date,
            default: null,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    delivery: {
        address: {
            type: String,
            required: true,
        },
    }
});

const StripeOrder = mongoose.model('StripeOrder', orderSchema);

module.exports = StripeOrder;