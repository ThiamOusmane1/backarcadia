const express = require('express');
const router = express.Router();
const { Animal, Habitat, HistoriqueAnimal } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { v4: uuidv4 } = require('uuid');

//  Middleware pour tous les endpoints vétérinaire
router.use(authenticateToken, authorizeRoles('vet'));

// Liste des animaux
router.get('/animals', async (req, res) => {
    try {
        const animals = await Animal.findAll({
            where: { isDeleted: false },
            attributes: ['id', 'nom', 'sante', 'poids', 'nourriture', 'soins', 'quantite', 'url'],
            include: [{ model: Habitat, as: 'habitat', attributes: ['nom'] }]
        });

        // Retourne un objet contenant le tableau 
        return res.json({ animals });
    } catch (error) {
        console.error(' Erreur lors de la récupération des animaux :', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
});

//  Mise à jour d’un animal avec historique
router.put('/animals/:id', async (req, res) => {
    const { id } = req.params;
    const { sante, poids, nourriture, soins, habitat_id } = req.body;

    try {
        const animal = await Animal.findByPk(id);
        if (!animal) return res.status(404).json({ message: 'Animal non trouvé.' });

        const oldValues = {
            sante: animal.sante,
            poids: animal.poids,
            nourriture: animal.nourriture,
            soins: animal.soins,
            habitat_id: animal.habitat_id
        };

        const updates = {
            sante: sante ?? animal.sante,
            poids: poids ?? animal.poids,
            nourriture: nourriture ?? animal.nourriture,
            soins: soins ?? animal.soins,
            habitat_id: habitat_id ?? animal.habitat_id
        };

        await animal.update(updates);

        await HistoriqueAnimal.create({
            id: uuidv4(),
            animal_id: id,
            vet_id: req.user.id,
            action: 'Mise à jour',
            old_value: JSON.stringify(oldValues),
            new_value: JSON.stringify(updates),
            date: new Date()
        });

        res.json({ message: 'Animal mis à jour avec succès.' });
    } catch (error) {
        console.error(" Erreur mise à jour de l'animal :", error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = router;




