const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index");

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render("home", { title: "- Home", user: null });
}

router.get("/", checkAuthentication, indexController.controlIndexGet);

module.exports = router;
