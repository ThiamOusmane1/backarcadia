const express = require('express');
const router = express.Router();
const { Animal, Habitat } = require('../config/mysqlConnection'); // Assurez-vous que ce chemin est correct
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Route pour récupérer les animaux d'un vétérinaire connecté
router.get('/animals', authenticateToken, authorizeRoles('vet'), async (req, res) => {
    try {
        const animals = await Animal.findAll({
            attributes: ['id', 'nom', 'sante', 'poids', 'nourriture', 'soins', 'quantite', 'url'],
            include: [
                { model: Habitat, as: 'habitat', attributes: ['nom'] }
            ]
        });

        return res.json({ message: 'Liste des animaux récupérée avec succès.', animals });
    } catch (error) {
        console.error('Erreur lors de la récupération des animaux :', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Route pour mettre à jour les informations d'un animal
router.put('/animals/:id', authenticateToken, authorizeRoles('vet'), async (req, res) => {
    const { id } = req.params;
    console.log(`ID reçu pour la mise à jour : ${id}`); // Vérifie si l'ID arrive bien
    console.log(`Corps de la requête :`, req.body);

    try {
        // Rechercher l'animal par son ID
        const animal = await Animal.findByPk(id);

        if (!animal) {
            console.log('Animal non trouvé');
            return res.status(404).json({ message: 'Animal non trouvé.' });
        }

        console.log('Animal trouvé :', animal);

        // Mise à jour des champs, avec vérification que le body contient bien les données
        animal.sante = req.body.sante ?? animal.sante;
        animal.poids = req.body.poids ?? animal.poids;
        animal.nourriture = req.body.nourriture ?? animal.nourriture;
        animal.soins = req.body.soins ?? animal.soins;
        animal.habitat_id = req.body.habitat_id ?? animal.habitat_id; // Si tu veux mettre à jour l'habitat

        // Sauvegarde dans la base de données
        console.log('Tentative de sauvegarde de l\'animal');
        await animal.save();

        console.log('Animal mis à jour avec succès');
        return res.json({ message: 'Animal mis à jour avec succès.', animal });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'animal :', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = router;


