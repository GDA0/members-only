const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index");

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render("home", { title: "- Home", user: null });
}

function checkMembershipStatus(req, res, next) {
  if (req.user.membership_status !== "member") {
    return res.redirect("/join-club");
  }
  next();
}

function checkIsAdmin(req, res, next) {
  if (!req.user.is_admin) {
    return res.redirect("/become-admin");
  }
  next();
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

router.get(
  "/become-admin",
  checkAuthentication,
  checkMembershipStatus,
  indexController.controlBecomeAdminGet
);

router.post(
  "/become-admin",
  checkAuthentication,
  checkMembershipStatus,
  indexController.controlBecomeAdminPost
);

router.get(
  "/messages/:id/delete",
  checkAuthentication,
  checkMembershipStatus,
  checkIsAdmin,
  indexController.controlDeleteMessageGet
);

module.exports = router;
