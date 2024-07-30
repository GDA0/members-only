const { body, validationResult } = require("express-validator");
const database = require("../database");

function controlIndexGet(req, res) {
  res.render("index", { title: "", user: req.user });
}

function controlCreateMessageGet(req, res) {
  res.render("create-message", {
    title: "- Create message",
    user: req.user,
    errors: [],
    formData: {},
  });
}

const controlCreateMessagePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters long")
    .escape(),
  body("text").trim().notEmpty().withMessage("Text is required").escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("create-message", {
        title: "- Create message",
        user: req.user,
        errors: errors.array(),
        formData: req.body,
      });
    }

    try {
      const { title, text } = req.body;
      const { id } = req.user;
      await database.addMessage(title, text, id);

      res.redirect("/");
    } catch (error) {
      res.render("create-message", {
        title: "- Create message",
        user: req.user,
        errors: [{ msg: "Error creating message. Please try again." }],
        formData: req.body,
      });
    }
  },
];

module.exports = {
  controlIndexGet,
  controlCreateMessageGet,
  controlCreateMessagePost,
};
