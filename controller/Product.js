const {Product} = require("../model/Product");

exports.createProduct = async (req,res) =>{
     const product = new Product(req.body);
     try {
     const doc = await product.save()
     res.status(201).json(doc)
     } catch (error) {
     res.status(400).json(error)   
     }    
}

exports.fetchAllProducts = async(req,res)=>{
    let condition = {}
     if(!req.query.admin){
        condition.deleted = {$ne:true}
    }
  
    let query = Product.find(condition);

    
   
     if(req.query.category){
         query =  query.find({category : req.query.category})
     }
     if(req.query.brand){
         query = query.find({brand: req.query.brand})
     }
     if(req.query._sort){
         query = query.sort(req.query._sort)
     }
     if(req.query._page && req.query._per_page){
          const page = req.query._page
          const pageSize = req.query._per_page
          query = query.skip(pageSize*(page-1)).limit(pageSize)
     }
   
     
try {
    const totalDocs = await Product.find(condition)
     const data = await query.exec();
     res.status(200).json({data,items: totalDocs.length});
} catch (error) {
   res.status(400).json(error); 
}
}

exports.fetchProductsById = async(req,res)=>{
    const {id} = req.params;
    try {
        const products = await Product.findById(id)  
        res.status(200).json({products})
    } catch (error) {
        res.status(400).json(error)
    }
 
}

exports.updateProduct = async(req,res)=>{
    const {id} = req.params;
    try {
       const products = await Product.findByIdAndUpdate(id, req.body, {new: true});
       res.status(200).json({products})
    } catch (error) {
        res.status(400).json(error)
    }
}