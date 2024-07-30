const database = require("../database");

function controlJoinClubGet(req, res) {
  res.render("./join-club/join-club", {
    title: "- Join club",
    formData: {},
    errors: [],
    user: req.user,
  });
}

async function controlJoinClubPost(req, res) {
  try {
    const { secret_passcode } = req.body;

    if (secret_passcode === req.user.username) {
      await database.updateMembershipStatus(req.user.id);
      res.render("./join-club/success", {
        title: "- Join club success",
        user: req.user,
      });
    } else {
      res.render("./join-club/join-club", {
        title: "- Join club",
        formData: req.body,
        errors: [
          {
            msg: "Incorrect secret passcode. Please try again.",
          },
        ],
        user: req.user,
      });
    }
  } catch (error) {
    console.error("Error verifying secret passcode", error);
    res.render("./join-club/join-club", {
      title: "- Join club",
      formData: req.body,
      errors: [
        {
          msg: "Error verifying secret passcode. Please try again.",
        },
      ],
      user: req.user,
    });
  }
}

module.exports = {
  controlJoinClubGet,
  controlJoinClubPost,
};
