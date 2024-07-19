const { model, Schema } = require("mongoose");
const cartSchema = new Schema({
//   title: { type: String, required: true, unique: true },
//   description: { type: String, required: true },
//   price: { type: Number, min: [1, "wrong min price"], required: true },
//   discountPrice: { type: Number, min: [1, "wrong min price"] },
//   shippingCost: { type: number, min: [1, "wrong min price"], required: true },
//   ratingAverage: {
//     type: Number,
//     min: [0, "wrong min rating"],
//     max: [5, "wrong max rating"],
//   },
//   totalCount: { type: Number, default: 0 },
//   stock: { type: Number, default: 0 },
//   brand: { type: String, default: null },
//   category: { type: String, required: true },
//   thumbnail: { type: String, required: true },

  product: {type:Schema.Types.ObjectId, ref: "Product", required:true},
  quantity: { type: Number, required: true },
  user:{type:Schema.Types.ObjectId, ref:"User", required:true}
});

const virtual = cartSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
exports.Cart = new model("Cart", cartSchema);
