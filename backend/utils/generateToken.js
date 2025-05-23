const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_for_development', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = generateToken; 