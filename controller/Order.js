const {Order} = require('../model/Order');

exports.fetchOrdersByUser = async(req,res) =>{
    const order = req.query;
    try {
        const orders = await Order.find({user: user}).populate('user');
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.createOrder = async(req,res)=>{
    const order = new Order(req.body)
    try {
        const doc = await order.save(order)
        res.status(200).json(doc)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.deleteOrder = async(req,res)=>{
    const {id} = req.params;
    try {
        const order = await Order.findByIdAndDelete(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.updateOrder = async(req,res)=>{
    const {id} = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, req.body,{
            new:true,
        });
        res.status(200).json(order)
    } catch (error) {
        res.status(400).json(error)
    }
}