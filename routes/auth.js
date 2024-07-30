const express = require("express");
const passport = require("passport");

const authController = require("../controllers/auth");
const configurePassport = require("../configurePassport");

const router = express.Router();
configurePassport(passport);

router.get("/sign-up", authController.controlSignUpGet);
router.post("/sign-up", authController.controlSignUpPost);

router.get("/log-in", authController.controlLogInGet);
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
  })
);

module.exports = router;
