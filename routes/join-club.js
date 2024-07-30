const express = require("express");
const router = express.Router();
const joinClubController = require("../controllers/join-club");

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
}

function checkMembershipStatus(req, res, next) {
  if (req.user.membership_status === "member") {
    return res.redirect("/");
  }
  next();
}

router.get(
  "/join-club",
  checkAuthentication,
  checkMembershipStatus,
  joinClubController.controlJoinClubGet
);

router.post(
  "/join-club",
  checkAuthentication,
  checkMembershipStatus,
  joinClubController.controlJoinClubPost
);

module.exports = router;
