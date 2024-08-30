const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  sante: { type: String, required: true },
  poids: { type: Number, required: true },
  nourriture: { type: String, required: true },
  quantite: { type: Number, required: true },
  habitat: { type: String, required: true },
  url: { type: String, required: true }
});

module.exports = mongoose.model('Animal', animalSchema);
