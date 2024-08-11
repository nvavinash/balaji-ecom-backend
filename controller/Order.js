const {Order} = require('../model/Order');

exports.fetchOrdersByUser = async(req,res) =>{
    const {userId}= req.params;
    try {
        const orders = await Order.find({user: userId});
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.createOrder = async(req,res)=>{
    const order = new Order(req.body)
    try {
        const doc = await order.save()
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

exports.fetchAllOrders = async(req,res)=>{
    let query = Order.find({deleted:{$ne:true}});
    if(req.query._sort){
        query = query.sort(req.query._sort)
    }
    if(req.query._page && req.query._per_page){
        const page = req.query._page
        const perPage = req.query._per_page
        query = query.skip(perPage*(page-1)).limit(perPage)
    }

   try {
    const totalDocs = await Order.find({deleted:{$ne: true}})
     const data = await query.exec();
     res.status(200).json({data,items: totalDocs.length});
} catch (error) {
   res.status(400).json(error); 
}
}