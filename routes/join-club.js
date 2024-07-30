const express = require("express");
const router = express.Router();
const joinClubController = require("../controllers/join-club");

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
}

router.get(
  "/join-club",
  checkAuthentication,
  joinClubController.controlJoinClubGet
);

module.exports = router;
