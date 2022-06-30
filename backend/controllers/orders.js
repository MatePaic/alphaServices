const {Order} = require('../models/order');
const pdf = require('html-pdf');
const path = require('path');
const fs = require("fs");
const ejs = require('ejs');
const moment = require('moment'); 

exports.getOrders = async (req, res) => {
    const ordersList = await Order.find(); 
    if (!ordersList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(ordersList);
}

exports.getOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(500).json({ message: 'The order with the given ID was not found' });
    }
    res.status(200).send(order);
}

exports.createOrder = async (req, res) => {
    const orderNumber = await Order.countDocuments();
    const order = new Order({
        bikeId: req.body.bikeId,
        brand: req.body.brand,
        model: req.body.model,
        serviceDate: req.body.serviceDate,
        year: req.body.year,
        mileage: req.body.mileage,
        chainChangePrice: req.body.chainChangePrice,
        oilChangePrice: req.body.oilChangePrice,
        airFilterChangePrice: req.body.airFilterChangePrice,
        brakeFluidChangePrice: req.body.brakeFluidChangePrice,
        fullPrice: req.body.fullPrice,
        discount: req.body.discount,
        discountedPrice: req.body.discountedPrice,
        orderNumber: orderNumber + 1
    });
    order.save().then((createdOrder => {
        res.status(201).json(createdOrder)
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        });
    });
}

exports.updateOrder = async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            serviceDate: req.body.serviceDate,
            mileage: req.body.mileage,
            chainChangePrice: req.body.chainChangePrice,
            oilChangePrice: req.body.oilChangePrice,
            airFilterChangePrice: req.body.airFilterChangePrice,
            brakeFluidChangePrice: req.body.brakeFluidChangePrice,
            fullPrice: req.body.fullPrice,
            discount: req.body.discount,
            discountedPrice: req.body.discountedPrice
        },
        { new: true }
    );

    if (!order) {
        return res.status(400).send('the order cannot be created!');
    };
    res.send(order);
}

exports.deleteOrder = (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(order => {
        if (order) {
            return res.status(200).json({ success: true, message: 'the order is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'order not found' });
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err });
    });
}

exports.downloadOrderSummary = async (req, res) => {
    const order = await Order.findById(req.params.id);
    try {
        const filepath = path.join(__dirname, '..', 'templates', 'order-summary.ejs');
        const ejsString = fs.readFileSync(filepath, 'utf8');
        const template = ejs.compile(ejsString);
        const templateData = { ...order, serviceDate: moment(order.serviceDate).format('LLL') };
        const html = template({...order.toObject(), serviceDate: moment(order.serviceDate).format('LLL') }); 

        // Base represents the base url from which the templates will for static images
        // Stack overflow question which helped: https://stackoverflow.com/questions/59312225/cannot-render-images-properly-using-ejs-renderfile?rq=1
        var pdfOptions = {
            format: 'A4',
            orientation: 'portrait',
            base: `${req.protocol}://${req.get('host')}`,
        };

        pdf.create(html, pdfOptions).toBuffer(function (err, buffer) {
            res.setHeader('Content-Length', buffer.length);
            res.write(buffer, 'binary');
            res.end();
        });
    } catch (error) {
        return res.status(500);
    }
}
