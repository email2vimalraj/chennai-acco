import { Schema } from 'mongoose';
import crypto from 'crypto';

const db = require('../../database').getDB();

const authTypes = ['google', 'facebook', 'twitter'];

// #region schemas
const UserSchema = db.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  hashedPassword: String,
  salt: String,
  address: String,
  provider: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const PropertySchema = db.Schema({
  name: String,
  description: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  price: String,
  currency: String,
  address: String,
  latitude: String,
  longitude: String,
  bedroomCount: Number,
  bathroomCount: Number,
  accomadatesCount: Number,
  area: String,
  rating: Number,
  startDate: Date,
  endDate: Date,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const PhotoSchema = db.Schema({
  name: String,
  filePath: String,
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const BookingSchema = db.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
  },
  checkInDate: Date,
  checkOutDate: Date,
  amountPaid: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewSchema = db.Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
  },
  comment: String,
  rating: Number,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const TransactionSchema = db.Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  payee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
  },
  transferOn: Date,
  promoCode: String,
  discountAmount: String,
  amount: String,
  currency: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
// #endregion schemas

// #region virtuals
UserSchema.virtual('password').set(function setPassword(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
}).get(function getPassword() {
  return this._password;
});
// #endregion virtuals

// #region validations
const validatePresenceOf = (value) => value && value.length;

// The below 4 validations only apply if signing up traditionally
UserSchema.path('name').validate(function validateName(name) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function validateEmail(email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function validateUsername(username) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashedPassword').validate(function validatePassword(hashedPassword) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashedPassword.length;
}, 'Password cannot be blank');
// #endregion validations

// #region hooks
UserSchema.pre('save', function preSave(next) {
  if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
    next(new Error('Invalid password'));
  } else {
    const currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
      this.createdAt = currentDate;
    }
    next();
  }
});

UserSchema.pre('update', function preUpdate() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

PropertySchema.pre('save', function preSave(next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

PropertySchema.pre('update', function preUpdate() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

PhotoSchema.pre('save', function preSave(next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

PhotoSchema.pre('update', function preUpdate() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

BookingSchema.pre('save', function preSave(next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

BookingSchema.pre('update', function preUpdate() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

ReviewSchema.pre('save', function preSave(next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

ReviewSchema.pre('update', function preUpdate() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

TransactionSchema.pre('save', function preSave(next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

TransactionSchema.pre('update', function preUpdate() {
  this.update({}, { $set: { updatedAt: new Date() } });
});
// #endregion hooks

// #region methods
UserSchema.methods = {
  authenticate: function authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  makeSalt: function makeSalt() {
    return Math.round((new Date().valueOf() * Math.random())).toString();
  },

  encryptPassword: function encryptPassword(password) {
    if (!password) return '';
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  },
};
// #endregion methods

// #region models
const User = db.model('User', UserSchema);
const Property = db.model('Property', PropertySchema);
const Photo = db.model('Photo', PhotoSchema);
const Booking = db.model('Booking', BookingSchema);
const Review = db.model('Review', ReviewSchema);
const Transaction = db.model('Transaction', TransactionSchema);
// #endregion models

module.exports = {
  User,
  Property,
  Photo,
  Booking,
  Review,
  Transaction,
};
