const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
  rol: {
    type: String,
    required: [true, "role is required"],
  },
});

module.exports = model("Role", RoleSchema);
