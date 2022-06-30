const mongoose = require('mongoose');

const bikeSchema = mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    lastSupportedYear: {
        type: Number,
        required: true
    },
    chainChangePrice: {
        type: Number,
        required: true
    },
    oilAndOilFilterChangePrice: {
        type: Number,
        required: true
    },
    airFilterChangePrice: {
        type: Number,
        required: true
    },
    brakeFluidChangePrice: {
        type: Number,
        required: true
    }
})

bikeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

bikeSchema.set('toJSON', {
    virtuals: true,
});

exports.Bike = mongoose.model('Bike', bikeSchema);
