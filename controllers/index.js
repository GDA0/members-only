function controlIndexGet(req, res) {
  res.render("index", { title: "" });
}

module.exports = {
  controlIndexGet,
};
