/**
 * These routes are authenticated using passport and ensure that scores can be securely uploaded.
 */

const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');
const UPGRADES = require('../../shared/upgrades');

const router = express.Router();

// This only gets requested from ChooseShipScene.js
router.post('/submit-texture', asyncMiddleware(async (req, res, next) => {
  const { frame } = req.body;
  const { email } = req.user;
  await UserModel.updateOne({ email }, { shipTexture: frame });
  res.status(200).json({ status: 'ok' });
}));

router.post('/submit-score', asyncMiddleware(async (req, res, next) => {
  const { score, level } = req.body;
  const { email } = req.user;
  const user = await UserModel.findOne({ email }, '-_id');

  if (!user.highScores) user.highScores = {};
  const userScore = user.highScores[`level${level}`];

  if (!userScore || userScore < score) {
    const set = {};
    set[`highScores.level${level}`] = score;

    if (!user.highestLevel || user.highestLevel <= level) { set.highestLevel = parseInt(level, 10) + 1; }

    await UserModel.updateOne({ email }, set);
  }

  res.status(200).json({ status: 'ok' });
}));

router.post('/submit-money', asyncMiddleware(async (req, res, next) => {
  const { money } = req.body;
  const { email } = req.user;
  await UserModel.updateOne({ email }, { money });
  res.status(200).json({ status: 'ok' });
}));

router.post('/reset-upgrades', asyncMiddleware(async (req, res, next) => {
  const { email } = req.user;
  const set = {}
  Object.keys(UPGRADES).forEach((key) => {
    set[`upgrades.${key}`] = 0;
  });
  await UserModel.updateOne({ email }, set);
  res.status(200).json({ status: 'ok' });
}))

router.post('/update-upgrade', asyncMiddleware(async (req, res, next) => {
  const { upgrade, count } = req.body;
  const { email } = req.user;
  const set = {};
  set[`upgrades.${upgrade}`] = count;
  await UserModel.updateOne({ email }, set);
  res.status(200).json({ status: 'ok' });
}));

router.get('/scores', asyncMiddleware(async (req, res, next) => {
  const users = await UserModel.find({}, 'name highScore -_id')
    .sort({ highScore: -1 })
    .limit(10);
  res.status(200).json(users);
}));

router.get('/player-data', asyncMiddleware(async (req, res, next) => {
  const { email } = req.user;
  const user = await UserModel.findOne({ email }, '-_id');
  res.status(200).json(user);
}));

module.exports = router;
