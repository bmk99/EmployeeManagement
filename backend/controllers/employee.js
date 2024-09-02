const EmployeeSchema = require("../models/Employees");

exports.createEmp = async (req, res) => {
  const data = req.body;
  const image = req.file ? req.file.filename : data.image;
  const createdBy = req.userid
console.log(req.userid)
  try {
    const empUser = new EmployeeSchema({
      ...data,
      image,
      createdBy,
    });
    await empUser.save();
    res.status(201).json({ message: "Employee created successfully" });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[field];
      const message = `The ${field} '${duplicateValue}' is already registered. Please use a different ${field}.`;
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEmp = async (req, res) => {
  try {
    const empUsers = await EmployeeSchema.find({});
    return res.status(200).json(empUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.editEmp = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const image = req.file ? req.file.filename : data.image;
  let user = await EmployeeSchema.findById(id);
  try {
    if (!user) {
      return res.status(403).json({ message: "Not Found" });
    }
    const updatedUser = await EmployeeSchema.findByIdAndUpdate(
      id,
      { ...data, image },
      {
        new: true,
      }
    );
    await updatedUser.save();
    return res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[field];
      const message = `The ${field} '${duplicateValue}' is already registered. Please use a different ${field}.`;
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteEmp = async (req, res) => {
  const { id } = req.params;
  const user = await EmployeeSchema.findById(id);
  try {
    if (!user) {
      return res.status(403).json({ message: "Not found" });
    }
    const result = await EmployeeSchema.findByIdAndDelete(id);
    return res.status(200).json({ messsage: "Sucessfully Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
