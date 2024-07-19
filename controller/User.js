const {User} = require('../model/User')

exports.fetchUserById = async(req,res) =>{
    const {id} = req.params;
    try{
       const user = await User.findById(id,'name, email, address').exec();
       res.status(200).json(user)
    }catch(error){
        res.status(400).json(error)
    }
}

exports.updateUser = async(req,res) =>{
    const {id} = res.params;
    try {
        const user = User.findByIdAndUpdate(id,req.body,{new:true})
    } catch (error) {
        res.status(400).json(error)
    }
} 