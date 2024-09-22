const mongoose = require('mongoose');

const historiqueSchema = new mongoose.Schema({
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    action: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Historique = mongoose.model('Historique', historiqueSchema);

module.exports = Historique;
