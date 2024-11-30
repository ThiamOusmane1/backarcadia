const express = require('express');
const router = express.Router();
const { Animal, Habitat ,HistoriqueAnimal } = require('../config/mysqlConnection'); // Import des modèles


// Route pour afficher tous les habitats
router.get('/', async (req, res) => {
  try {
    const habitats = await Habitat.findAll({
      include: { model: Animal, as: 'animaux' } // Inclure les animaux liés
    });
    res.json(habitats); // Renvoie les données en JSON
  } catch (error) {
    console.error('Erreur lors de la récupération des habitats:', error.message);
    res.status(500).send('Erreur lors de la récupération des habitats');
  }
});

// Route pour afficher les détails d'un habitat par nom
router.get('/:habitatName', async (req, res) => {
  try {
    const habitatName = req.params.habitatName;

    // Recherche de l'habitat (insensible à la casse)
    const habitat = await Habitat.findOne({
      where: { nom: habitatName },
      include: { model: Animal, as: 'animaux' }
    });

    if (!habitat) {
      return res.status(404).send('Habitat non trouvé');
    }

    res.json(habitat); // Renvoie les données en JSON
  } catch (error) {
    console.error('Erreur lors de la récupération des animaux pour cet habitat:', error.message);
    res.status(500).send('Erreur lors de la récupération des animaux pour cet habitat');
  }
});

module.exports = router;
