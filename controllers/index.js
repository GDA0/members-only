function controlIndexGet(req, res) {
  res.render("index", { title: "", user: req.user });
}

function controlCreateMessageGet(req, res) {
  res.render("create-message", { title: "- Create message", user: req.user });
}

module.exports = {
  controlIndexGet,
  controlCreateMessageGet,
};
