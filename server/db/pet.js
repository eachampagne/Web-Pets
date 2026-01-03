const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @module pet-database
 * @description
 * This file holds the all the schemas in relation to the pet. This represents
 * the structures of the collections in the database.
 */

/**
 * For the training data for the pet. Gets the pet name from what
 * the user submits as an input when creating a pet.
 * @name trainingSchema
 */
const trainingSchema = new mongoose.Schema({
  name: String,
  stat: Number
});

/**
 * For holding the behavior of the pet. Can and will change based
 * on the user interating with the pet.
 * @name behaviorSchema
 */
const behaviorSchema = new mongoose.Schema({
  name: String,
  category: String,
  min: Number,
  max: Number,
  prevThreshold: Number,
  nextThreshold: Number
});

/**
 * Holdes the data for the pet. This also take data from other schemas in the
 * database like the trainingSchema and behaviorSchema. Properties can also change based
 * on how the user interacts with the pet.
 * @name petSchema
 */
const petSchema = new mongoose.Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  name: String,
  training: [trainingSchema],
  behaviors: [behaviorSchema],
  mood: Number,
  love: Number,
  health: Number,
  hunger: Number,
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;