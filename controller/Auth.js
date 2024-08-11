const {User} = require ('../model/User')

exports.createUser = async(req,res) =>{
    const user = new User(req.body)
    try {
        const doc = await user.save()
        res.status(200).json({doc:doc.id, role:doc.role})
    } catch (error) {
        res.status(400).json(error)
    }
}
exports.loginUser = async(req,res) =>{
    try {
        const user = await User.findOne({email: req.body.email}).exec();
        if(!user){
            res.status(401).json({message: "No Such User Email exists"})
        }else if(user.password === req.body.password){
            res.status(200).json({id: user.id, role:user.role});
        }else{
            res.status(401).json({message: "Invalid Credintails"})
        }
        

    } catch (error) {
        res.status(400).json(error)
    }
  
}