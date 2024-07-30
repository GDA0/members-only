function controlIndexGet(req, res) {
  if (!req.user) {
    return res.render("home", { title: "- Home", user: null });
  }
  res.render("index", { title: "", user: req.user });
}

module.exports = {
  controlIndexGet,
};
