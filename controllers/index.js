function controlIndexGet(req, res) {
  res.render("index", { title: "", user: req.user });
}

module.exports = {
  controlIndexGet,
};
