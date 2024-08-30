// back-end/routes/animals.js
const express = require('express');
const router = express.Router();
const Habitat = require('../models/habitats'); 
const Animal = require('../models/animals');

router.get('/', async (req, res) => {
  try {
    const habitatName = req.query.habitat; // Récupérer le nom de l'habitat depuis les paramètres de la requête
    console.log('Habitat Name:', habitatName);
    if (!habitatName) {
      return res.status(400).json({ error: 'Habitat name is required' });
    }

    const habitat = await Habitat.findOne({ nom: new RegExp('^' + habitatName + '$', 'i') }).populate('animaux');
    console.log('Habitat:', habitat);
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
// route pour récupérer les détails d'un animal par son ID
router.get('/animal-details', async (req, res) => {
  try {
    const animalId = req.query.id; // Récupérer l'ID de l'animal depuis les paramètres de la requête

    if (!animalId) {
      return res.status(400).json({ error: 'Animal ID is required' });
    }

    const animal = await Animal.findById(animalId); // Rechercher l'animal par son ID

    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    res.json(animal); // Retourner les détails de l'animal
  } catch (error) {
    console.error('Error fetching animal details:', error.message);
    res.status(500).json({ error: 'Error fetching animal details' });
  }
});

module.exports = router;
