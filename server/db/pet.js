const mongoose = require('mongoose');
const { Schema } = mongoose;

const trainingSchema = new mongoose.Schema({
  name: String,
  stat: Number
});

const behaviorSchema = new mongoose.Schema({
  name: String,
  category: String,
  min: Number,
  max: Number,
  prevThreshold: Number,
  nextThreshold: Number
});

const petSchema = new mongoose.Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  petName: String,
  training: [trainingSchema],
  behaviors: [behaviorSchema],
  mood: Number,
  love: Number,
  health: Number
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;