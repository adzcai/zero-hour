const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { UPGRADES } = require('../../shared/constants');

const { Schema } = mongoose;

const upgrades = { };
Object.keys(UPGRADES).forEach((key) => {
  upgrades[key] = {
    type: Number,
    default: 0,
  };
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  highScore: {
    type: Number,
    default: 0,
  },
  resetToken: {
    type: String,
  },
  resetTokenExp: {
    type: Date,
  },
  upgrades,
});

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
