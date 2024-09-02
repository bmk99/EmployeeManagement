const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      unique: [true, 'This email is already registered.'], 
      required: [true, 'Email is required.']
    },
    mobile: { 
      type: Number, 
      unique: [true, 'This mobile number is already registered.'], 
      required: [true, 'Mobile number is required.']
    },
    designation: {
      type: String,
      enum: ["HR", "Manager", "Sales"],
      required: [true, 'Designation is required.'],
    },
    gender: { 
      type: String, 
      enum: ["male", "female"], 
      required: [true, 'Gender is required.']
    },
    course: {
      type: String,
      enum: ["MBA", "MCA", "BCOM", "OTHERS"],
      required: [true, 'Course is required.'],
    },
    image: { type: String, default: "image" },
    createdByAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employees", employeeSchema);
