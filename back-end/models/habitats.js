const mongoose = require('mongoose');

let Habitat;
if (mongoose.models && mongoose.models.Habitat) {
  Habitat = mongoose.models.Habitat;
} else {
  const habitatSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    animaux: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }]
  });

  Habitat = mongoose.model('Habitat', habitatSchema);
}

module.exports = Habitat;
