const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth");
const {
  createEmp,
  editEmp,
  deleteEmp,
  getAllEmp,
} = require("../controllers/employee");
const upload = require("../middlewares/upload"); // Import multer configuration

// Route to create a new employee with image upload
router.post("/createEmp", authorization, upload.single("image"), createEmp);

// Other routes remain the same
router.get("/allEmp", authorization, getAllEmp);
router.put("/updateEmp/:id", authorization, upload.single("image"), editEmp);
router.delete("/deleteEmp/:id", authorization, deleteEmp);

module.exports = router;
