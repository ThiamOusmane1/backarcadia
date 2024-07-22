// back-end/routes/animals.js
const express = require('express');
const router = express.Router();
const Habitat = require('../models/habitats'); // Assurez-vous que le modèle Habitat est correctement défini

router.get('/', async (req, res) => {
  try {
    const habitatName = req.query.habitat; // Récupérer le nom de l'habitat depuis les paramètres de la requête

    if (!habitatName) {
      return res.status(400).json({ error: 'Habitat name is required' });
    }

    const habitat = await Habitat.findOne({ nom: new RegExp('^' + habitatName + '$', 'i') }).populate('animaux');

    if (!habitat) {
      return res.status(404).json({ error: 'Habitat not found' });
    }

    if (!habitat.animaux || habitat.animaux.length === 0) {
      return res.status(404).json({ error: 'No animals found for this habitat' });
    }

    res.json(habitat.animaux); // Retourner les animaux de l'habitat
  } catch (error) {
    res.status(500).json({ error: 'Error fetching animals' });
  }
});

module.exports = router;
