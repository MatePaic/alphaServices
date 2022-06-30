const {Bike} = require('../models/bike')

exports.getBikes = async (req, res) => {
    const bikeList = await Bike.find(); 
    if (!bikeList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(bikeList);
}

exports.getBike = async (req, res) => {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
        res.status(500).json({ message: 'The bike with the given ID was not found' });
    }
    res.status(200).send(bike);
}




