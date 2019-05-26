/**
 * These routes are authenticated using passport and ensure that scores can be securely uploaded.
 */

const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const router = express.Router();

router.post('/submit-score', asyncMiddleware(async (req, res, next) => {
  const { email, score } = req.body;
  await UserModel.updateOne({ email }, { highScore: score });
  res.status(200).json({ status: 'ok' });
}));

router.get('/scores', asyncMiddleware(async (req, res, next) => {
  const users = await UserModel.find({}, 'name highScore -_id')
    .sort({ highScore: -1 })
    .limit(10);
  res.status(200).json(users);
}));

router.post('/update-upgrade', asyncMiddleware(async (req, res, next) => {
  const { upgrade, count } = req.body;
  const { email } = req.user;
  const set = {};
  set[`upgrades.${upgrade}`] = count;
  await UserModel.updateOne({ email }, set);
  res.status(200).json({ status: 'ok' });
}));

router.get('/upgrades', asyncMiddleware(async (req, res, next) => {
  const { email } = req.user;
  const user = await UserModel.findOne({ email }, 'upgrades -_id');
  res.status(200).json(user);
}));

module.exports = router;
