const {model, Schema} = require('mongoose');

const productSchema = new Schema({
    title : {type: String, required : true, unique:true},
    description : {type: String, required : true},
    price : {type: Number,min:[1, "wrong min price"], required : true},
    discountPrice : {type: Number ,min:[1, "wrong min price"], required : true},
    shippingCost : {type: Number ,min:[1, "wrong min price"], required : true},
    ratingAverage : {type: Number,min:[0, "wrong min rating"], max:[5, "wrong max rating"],default:0},
    totalCount : {type: Number,default:0},
    stock : {type: Number,default:0},
   brand : {type: String,default:null},
   category: {type: String, required : true},
   thumbnail : {type: String, required : true},
   images : {type: [String], required : true},
   deleted : {type: Boolean, default:false},
})

const virtual = productSchema.virtual('id')
virtual.get(function(){
    return this._id;
});
productSchema.set('toJSON',{
    virtuals : true,
    versionKey: false,
    transform : function (doc,ret){ delete ret._id}
})

exports.Product = new model('Product', productSchema)