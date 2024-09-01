const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/user");

router.post("/userRegister", registerUser);
router.post("/userLogin", loginUser);

module.exports = router;
