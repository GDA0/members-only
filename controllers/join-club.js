function controlJoinClubGet(req, res) {
  res.render("join-club", { title: "- Join club" });
}

module.exports = {
  controlJoinClubGet,
};
