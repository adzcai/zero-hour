const express = require('express');
const UserModel = require('../models/userModel');
const asyncMiddleware = require('../middleware/asyncMiddleware');

const router = express.Router();

// If the user tries to access the base, we send them to the main index.html file
router.get('/', (req, res, next) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// We send them an ok status
router.get('/status', (req, res, next) => {
  res.status(200).json({ status: 'ok' });
});

// When someone signs up, we create a new entry for them in the database
router.post('/signup', asyncMiddleware(async (req, res, next) => {
  const { name, email, password } = req.body;
  await UserModel.create({ email, password, name });
  res.status(200).json({ status: 'ok' });
}));

// When someone wants to log in, we check if the email exists in our database
// and then if the password matches our stored email.
router.post('/login', asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(401).json({ message: 'unauthenticated' });
    return;
  }
  const validate = await user.isValidPassword(password);
  if (!validate) {
    res.status(401).json({ message: 'unauthenticated' });
    return;
  }
  res.status(200).json({ status: 'ok' });
}));

router.post('/logout', (req, res, next) => {
  res.status(200).json({ status: 'ok' });
});

router.post('/token', (req, res, next) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
