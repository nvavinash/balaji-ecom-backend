const {Cart}= require("../model/Cart")

exports.fetchCartByUser = async(req,res) =>{
    const {id} = req.user;
    try {
        const cartItems = await Cart.find({user:id}).populate('product');
        res.status(201).json(cartItems)
    } catch (error) {
       res.status(400).json(error) 
    }
}

exports.addToCart = async (req, res) => {
    try {
        // Create a new cart instance
        const {id} = req.user;
        const cart = new Cart({...req.body,user:id});
        
        // Save the cart to the database
        const savedCart = await cart.save();
        
        // Populate the 'product' field after the cart has been saved
        const populatedCart = await savedCart.populate('product')
        
        // Send the populated cart as the response
        res.status(201).json(populatedCart);
    } catch (error) {
        // Handle any errors
        res.status(400).json(error);
    }
};

exports.deleteFromCart = async(req,res)=>{
    const {id} = req.params
    try {
        const doc = await Cart.findByIdAndDelete(id)
        res.status(200).json(doc)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.updateCart = async (req, res) => {
    const { id } = req.params;
    try {
        // Attempt to find and update the cart
        const cart = await Cart.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!cart) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Populate the 'product' field
        await cart.populate('product');
        console.log('Populated cart:', cart);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: "Error updating cart", error });
    }
};
