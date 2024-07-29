function controlSignUpGet(req, res) {
  res.render("sign-up", { title: "- Sign up" });
}

module.exports = {
  controlSignUpGet,
};
