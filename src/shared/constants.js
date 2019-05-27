function Upgrade(cost, variable, inc, baseValue) {
  return {
    cost, variable, inc, baseValue,
    getCost: (count) => cost * Math.pow(2, count),
    getValue: (count) => baseValue + inc * count
  };
}

module.exports.UPGRADES = {
  'Attack Speed': Upgrade(100, 'playerAttack.laser.delay', -25, 200),
  'Attack Damage': Upgrade(100, 'playerAttack.laser.damage', 100, 400),
  'Laser Speed': Upgrade(50, 'playerAttack.laser.speed', 50, 750),
  'Number of Attacks': Upgrade(300, 'playerAttack.laser.numShots', 1, 1),

  'Missile Fire Speed': Upgrade(100, 'playerAttack.missile.delay', -25, 500),
  'Missile Damage': Upgrade(100, 'playerAttack.missile.damage', 300, 800),
  'Missile Speed': Upgrade(50, 'playerAttack.missile.speed', 50, 500),

  'Ship Speed': Upgrade(100, 'playerBody.accel', 250, 1000),
  'Ship HP': Upgrade(100, 'playerBody.maxHP', 500, 1000),
};
