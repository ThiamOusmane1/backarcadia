const express = require('express');
const router = express.Router();
const { Animal, Habitat, HistoriqueAnimal } = require('../config/mysqlConnection');

// Récupérer tous les animaux avec leur habitat
router.get('/', async (req, res) => {
    try {
        const animals = await Animal.findAll({
            include: [{
                model: Habitat,
                as: 'habitat',
                attributes: ['nom']
            }]
        });
        res.status(200).json(animals);
    } catch (error) {
        console.error('Erreur lors de la récupération des animaux:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des animaux' });
    }
});

// Récupérer un animal par son ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const animal = await Animal.findByPk(id, {
            include: { model: Habitat, as: 'habitat' }
        });
        if (!animal) {
            return res.status(404).json({ message: 'Animal non trouvé.' });
        }
        res.status(200).json(animal);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'animal:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des détails de l\'animal' });
    }
});

// Mettre à jour le compteur de consultations
router.post('/update-counter', async (req, res) => {
    const { id } = req.body;
    try {
        const animal = await Animal.findByPk(id);
        if (!animal) {
            return res.status(404).json({ message: 'Animal non trouvé.' });
        }
        animal.consultations = (animal.consultations || 0) + 1;
        await animal.save();
        res.status(200).json({ message: 'Compteur de consultations mis à jour.', consultations: animal.consultations });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compteur:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du compteur' });
    }
});

// Récupérer l'historique d'un animal
router.get('/:animalId/historique', async (req, res) => {
    const { animalId } = req.params;
    
    try {
        // Modification de la requête pour ne sélectionner que les colonnes existantes
        const historique = await HistoriqueAnimal.findAll({
            where: { animal_id: animalId },
            attributes: ['id', 'animal_id', 'action', 'date', 'vet_id', 'old_value', 'new_value'] // Sélectionnez les colonnes existantes
        });

        // Si l'historique est vide, renvoie une réponse 404
        if (!historique.length) {
            return res.status(404).json({ message: 'Historique non trouvé' });
        }

        // Renvoie l'historique si trouvé
        res.status(200).json(historique);
    } catch (error) {
        // Capture l'erreur et la log dans la console
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
    }
});


module.exports = router;

