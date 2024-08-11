const {User} = require('../model/User')

exports.fetchUserById = async(req,res) =>{
    const {id} = req.params;
    console.log("this is id",id);
    try{
       const user = await User.findById(id);
       console.log("this is user",user);
       res.status(200).json(user)
    }catch(error){
        res.status(400).json(error)
    }
}

exports.updateUser = async(req,res) =>{
    const {id} = req.params;
    try {
        const user = await User.findByIdAndUpdate(id,req.body,{new:true})
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json(error)
    }
} 