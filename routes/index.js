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

router.get(
  "/create-message",
  checkAuthentication,
  indexController.controlCreateMessageGet
);
router.post(
  "/create-message",
  checkAuthentication,
  indexController.controlCreateMessagePost
);

module.exports = router;
