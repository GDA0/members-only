const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/sign-up", authController.controlSignUpGet);
router.post("/sign-up", authController.controlSignUpPost);

router.get("/log-in", authController.controlLogInGet)

module.exports = router;
