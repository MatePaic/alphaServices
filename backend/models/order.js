const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    bikeId: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    serviceDate: {
        type: String,
        required: true
    },
    year: {
        type: Number,
    },
    mileage: {
        type: Number,
        required: true
    },
    chainChangePrice: {
        type: Number
    },
    oilChangePrice: {
        type: Number
    },
    airFilterChangePrice: {
        type: Number
    },
    brakeFluidChangePrice: {
        type: Number
    },
    orderNumber: {
        type: Number
    },
    fullPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
    },
    discountedPrice: {
        type: Number,
    }
})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);
