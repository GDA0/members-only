const express = require('express')
const passport = require('passport')

const authController = require('../controllers/auth')
const configurePassport = require('../configurePassport')

const router = express.Router()
configurePassport(passport)

// Check if the user is authenticated
function checkAuthentication (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

// Signup routes
router.get('/sign-up', authController.controlSignUpGet)
router.post('/sign-up', authController.controlSignUpPost)

// Login routes
router.get('/log-in', checkAuthentication, authController.controlLogInGet)
router.post(
  '/log-in',
  checkAuthentication,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureMessage: true
  })
)

// Logout route
router.get('/log-out', authController.controlLogOutGet)

module.exports = router
