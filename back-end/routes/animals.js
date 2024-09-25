const express = require('express');
const router = express.Router();
const Animal = require('../models/animals'); // Importation du modèle Animal
const Habitat = require('../models/habitats'); // Importation du modèle Habitat

// GET tous les animaux d'un habitat spécifique
router.get('/', async (req, res) => {
  try {
    const habitatName = req.query.habitat;
    if (!habitatName) {
      return res.status(400).json({ error: 'Le nom de l\'habitat est requis' });
    }

    // Rechercher le nom de l'habitat et les animaux associés avec Sequelize
    const habitat = await Habitat.findOne({
      where: { name: habitatName },
      include: { model: Animal, as: 'animaux' } // Inclure les animaux dans la réponse
    });

    if (!habitat || habitat.animaux.length === 0) {
      return res.status(404).json({ error: 'Aucun animal trouvé pour cet habitat' });
    }

    res.json(habitat.animaux);
  } catch (error) {
    console.error('Erreur lors de la récupération des animaux:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des animaux' });
  }
});

// GET détails d'un animal par ID
router.get('/animal-details', async (req, res) => {
  try {
    const animalId = req.query.id;

    if (!animalId) {
      return res.status(400).json({ error: 'L\'ID de l\'animal est requis' });
    }

    const animal = await Animal.findByPk(animalId, { include: { model: Habitat, as: 'habitat' } }); // Inclure l'habitat dans la réponse

    if (!animal) {
      return res.status(404).json({ error: 'Animal non trouvé' });
    }

    res.json(animal);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'animal:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des détails de l\'animal' });
  }
});

// GET historique d'un animal spécifique
router.get('/:id/historiques', async (req, res) => {
  try {
    const animalId = req.params.id;

    if (!animalId) {
      return res.status(400).json({ error: 'L\'ID de l\'animal est requis' });
    }

    const animal = await Animal.findByPk(animalId);

    if (!animal || !animal.history) {
      return res.status(404).json({ error: 'Aucun historique trouvé pour cet animal' });
    }

    res.json(animal.history);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique de l\'animal:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique de l\'animal' });
  }
});

module.exports = router;
