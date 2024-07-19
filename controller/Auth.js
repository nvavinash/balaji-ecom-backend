const {Auth} = require ('../model/User')

exports.createUser = async(req,res) =>{
    const user = new User(req.body)
    try {
        const doc = await user.save().exec()
        res.status(200).json(doc)
    } catch (error) {
        res.status(400).json(error)
    }
}
exports.loginUser = async(req,res) =>{
    try {
        const user = User.findOne({email: req.body.email});
        if(!user){
            res.status(401).json({message: "No Such User Email exists"})
        }else if(user.password === req.body.password){
            res.status(200).json({id: user.id, name: user.name, email: user.email, addresses: user.addresses});
        }else{
            res.status(401).json({message: "Invalid Credintails"})
        }
        

    } catch (error) {
        res.status(400).json(error)
    }
  
}