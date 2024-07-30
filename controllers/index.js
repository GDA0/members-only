function controlIndexGet(req, res) {
  if (!req.user) {
    return res.render("home", { title: "- Home" });
  }
  res.render("index", { title: "", user: req.user });
}

module.exports = {
  controlIndexGet,
};
