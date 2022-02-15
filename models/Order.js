const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["PROCESSING", "IN_PROCESS", "READY_TO_PICKUP"],
    default: "PROCESSING",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

OrderSchema.methods.toJSON = function () {
  const { __v, ...order } = this.toObject();
  return order;
};

module.exports = model("Order", OrderSchema);
