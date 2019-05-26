module.exports.UPGRADES = {
  'Attack Speed': {
    cost: 100,
    variable: 'playerAttack.laser.delay',
    inc: -25,
  },
  'Attack Damage': {
    cost: 100,
    variable: 'playerAttack.laser.damage',
    inc: 100,
  },
  'Number of Attacks': {
    cost: 300,
    variable: 'playerAttack.laser.numShots',
    inc: 1,
  },
  'Missile Speed': {
    cost: 100,
    variable: 'playerAttack.missile.delay',
    inc: -25,
  },
  'Missile Damage': {
    cost: 100,
    variable: 'playerAttack.missile.damage',
    inc: 300,
  },
  'Ship Speed': {
    cost: 100,
    variable: 'playerBody.accel',
    inc: 250,
  },
  'Ship HP': {
    cost: 100,
    variable: 'playerBody.maxHP',
    inc: 500,
  },
};
