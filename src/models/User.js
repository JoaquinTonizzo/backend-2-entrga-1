const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' }
}, { timestamps: true });

// Hash password al guardar o modificar
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const hash = bcrypt.hashSync(user.password, SALT_ROUNDS);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method para comparar contraseña
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
