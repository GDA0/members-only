const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const database = require("../database");

function controlSignUpGet(req, res) {
  res.render("sign-up", { title: "- Sign up", errors: [], formData: {} });
}

const controlSignUpPost = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .escape(),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .escape(),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .isLength({ max: 20 })
    .withMessage("Username must be no more than 20 characters long")
    .matches(/^[a-zA-Z0-9_\.]+$/)
    .withMessage(
      "Username must contain only letters, numbers, underscores, or periods"
    )
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 64 })
    .withMessage("Password must be no more than 64 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character"),
  body("confirm_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("sign-up", {
        title: "- Sign up",
        errors: errors.array(),
        formData: req.body,
      });
    }

    try {
      const { first_name, last_name, username, password } = req.body;
      const usernameExists = await database.checkUsernameExists(username);
      if (usernameExists) {
        return res.render("sign-up", {
          title: "- Sign up",
          errors: [{ msg: "Username exists" }],
          formData: req.body,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await database.addUser(first_name, last_name, username, hashedPassword);

      const user = await database.getUser("username", username);

      req.login(user, (err) => {
        if (err) {
          console.error("Error during auto login:", err);
          return res.render("sign-up", {
            title: "Sign up",
            errors: [
              {
                msg: "Sign-up was successful, but an error occurred during auto login. Please log in manually.",
              },
            ],
            formData: req.body,
          });
        }
        return res.redirect("/");
      });
    } catch (error) {
      console.error("Error during user sign-up:", error);
      return res.render("sign-up", {
        title: "Sign up",
        errors: [
          { msg: "An error occurred during sign-up. Please try again." },
        ],
        formData: req.body,
      });
    }
  },
];

function controlLogInGet(req, res) {
  res.render("log-in", { title: "- Log in" });
}

module.exports = {
  controlSignUpGet,
  controlSignUpPost,
  controlLogInGet,
};
