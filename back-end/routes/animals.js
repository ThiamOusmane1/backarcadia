const express = require('express');
const router = express.Router();
const { Animal, Habitat, HistoriqueAnimal } = require('../config/mysqlConnection');

// Tous les animaux
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.findAll({
      include: [{ model: Habitat, as: 'habitat', attributes: ['nom'] }]
    });
    res.status(200).json(animals);
  } catch (error) {
    console.error('Erreur récupération animaux:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Détails d'un animal
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id, {
      include: { model: Habitat, as: 'habitat' }
    });
    if (!animal) return res.status(404).json({ message: 'Animal non trouvé' });
    res.status(200).json(animal);
  } catch (err) {
    console.error('Erreur animal ID:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour le compteur
router.post('/update-counter', async (req, res) => {
  try {
    const { id } = req.body;
    const animal = await Animal.findByPk(id);
    if (!animal) return res.status(404).json({ message: 'Animal non trouvé' });

    animal.consultations = (animal.consultations || 0) + 1;
    await animal.save();
    res.status(200).json({ consultations: animal.consultations });
  } catch (err) {
    console.error('Erreur compteur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Historique d’un animal
router.get('/:animalId/historique', async (req, res) => {
  try {
    const historique = await HistoriqueAnimal.findAll({
      where: { animal_id: req.params.animalId },
      attributes: ['id', 'animal_id', 'action', 'date', 'old_value', 'new_value'],
      order: [['date', 'DESC']],
      limit: 10
    });

    res.status(200).json(historique);
  } catch (err) {
    console.error('Erreur historique animal:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;


