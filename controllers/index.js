const { body, validationResult } = require("express-validator");
const { formatDistanceToNow } = require("date-fns");

const database = require("../database");

function sortMessagesByDate(messages) {
  return messages.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
}

async function controlIndexGet(req, res) {
  try {
    const messages = await database.getAllMessages();
    const sortedMessages = sortMessagesByDate(messages);
    res.render("index", {
      title: "- Messages",
      user: req.user,
      messages: sortedMessages,
      formatDistanceToNow,
      error: "",
    });
  } catch (error) {
    console.error("Error getting all messages", error);
    res.render("index", {
      title: "- Messages",
      user: req.user,
      messages: [],
      formatDistanceToNow,
      error: "Error getting all messages messages. Please refresh the page.",
    });
  }
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

function controlBecomeAdminGet(req, res) {
  res.render("./become-admin/become-admin", {
    title: "- Become admin",
    user: req.user,
    errors: [],
    formData: {},
  });
}

async function controlBecomeAdminPost(req, res) {
  try {
    const { secret_passcode } = req.body;

    if (secret_passcode === req.user.username.split("").reverse().join("")) {
      await database.updateIsAdmin(req.user.id);
      res.render("./become-admin/success", {
        title: "- Become admin success",
        user: req.user,
      });
    } else {
      res.render("./become-admin/become-admin", {
        title: "- Become admin",
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
    res.render("./become-admin/become-admin", {
      title: "- Become admin",
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

function controlDeleteMessageGet(req, res) {
  const { id } = req.params;

  res.render("delete-message", {
    title: "- Delete message",
    user: req.user,
    id,
    errors: [],
  });
}

async function controlDeleteMessagePost(req, res) {
  try {
    const { id } = req.params;
    const message = await database.getMessage(id);
    if (message.user_id !== 10 || req.user.id === 10) {
      await database.removeMessage(id);
      res.redirect("/");
    } else {
      res.render("delete-message", {
        title: "- Delete message",
        user: req.user,
        id,
        errors: [
          {
            msg: `Sorry, you cannot delete messages by <a href="/">@GDA</a>`,
          },
        ],
      });
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    res.render("delete-message", {
      title: "- Delete message",
      user: req.user,
      id,
      errors: [
        {
          msg: "An error occurred while deleting the message. Please try again.",
        },
      ],
    });
  }
}

module.exports = {
  controlIndexGet,
  controlCreateMessageGet,
  controlCreateMessagePost,
  controlBecomeAdminGet,
  controlBecomeAdminPost,
  controlDeleteMessageGet,
  controlDeleteMessagePost,
};
