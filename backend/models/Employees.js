const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobile: { type: Number, unique: true, required: true },
    designation: {
      type: String,
      enum: ["HR", "Manager", "Sales"],
      required: true,
    },
    gender: { type: String, enum: ["male", "female"], required: true },
    course: {
      type: String,
      enum: ["MBA", "MCA", "BCOM", "OTHERS"],
      required: true,
    },
    image: { type: String, default: "image" },
    createdByAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employees", employeeSchema);
