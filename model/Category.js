const {model, Schema} = require('mongoose');

const categorySchema  = new Schema({
label : {type : String, required : true, unique : true},
value : {type : String, required: true, unique: true}
})

const virtual = categorySchema.virtual('id')
virtual.get(function(){
    return this._id
})

categorySchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function(doc,ret){delete ret._id}
})

exports.Category = new model('Category', categorySchema)