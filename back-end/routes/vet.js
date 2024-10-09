const express = require('express');
const router = express.Router();
const { Animal, Habitat, HistoriqueAnimal } = require('../config/mysqlconnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/api/animals/vet/:vet_id', authenticateToken, authorizeRoles('vet'), async (req, res) => {
    try {
        const { vet_id } = req.params;  // Récupérer le vet_id depuis l'URL

        // Récupérer tous les animaux associés à ce vétérinaire
        const animals = await Animal.findAll({
            where: { vet_id: vet_id },
           // include: [{ model: Habitat, as: 'habitat' }]  // Si vous voulez inclure des habitats
        });

        if (animals.length === 0) {
            return res.status(404).json({ message: 'Aucun animal trouvé pour ce vétérinaire' });
        }

        res.json(animals);
    } catch (error) {
        console.error('Erreur lors de la récupération des animaux :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des animaux' });
    }
});



// Route pour mettre à jour un animal (vétérinaire uniquement)
router.put('/animals/:id', authenticateToken, authorizeRoles('vet'), async (req, res) => {
    try {
        const { id } = req.params;  // Récupérer l'ID de l'animal depuis l'URL
        const { nourriture, sante, poids, soins } = req.body;
        const vetId = req.user.userId;  // Récupérer l'ID du vétérinaire depuis le token JWT

        // Vérifier que l'animal appartient bien au vétérinaire connecté
        const animal = await Animal.findOne({
            where: { id, vet_id: vetId }
        });

        if (!animal) {
            return res.status(404).json({ message: 'Animal non trouvé ou non associé à ce vétérinaire' });
        }

        // Mise à jour des informations de l'animal
        animal.nourriture = nourriture;
        animal.sante = sante;
        animal.poids = poids;
        animal.soins = soins;

        await animal.save(); // Enregistrer les changements

        res.json({ message: 'Animal mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'animal :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'animal' });
    }
});


module.exports = router;

