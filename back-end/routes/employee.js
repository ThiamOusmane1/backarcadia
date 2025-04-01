const express = require('express');
const router = express.Router();
const { Animal, Habitat, FoodConsumption, ContactMessage } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// ✅ Récupérer tous les animaux
router.get('/employee/animals', authenticateToken, authorizeRoles('employee'), async (req, res) => {
    try {
        const animals = await Animal.findAll({
            where: { isDeleted: false },
            attributes: ['id', 'nom', 'poids', 'nourriture', 'quantite', 'url'],
            include: [{ model: Habitat, as: 'habitat', attributes: ['nom'] }]
        });
        res.json(animals);
    } catch (error) {
        console.error("Erreur récupération animaux :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ✅ Enregistrer la consommation de nourriture
router.post('/employee/food', authenticateToken, authorizeRoles('employee'), async (req, res) => {
    try {
        const { animal_id, nourriture, quantite } = req.body;

        if (!animal_id || !nourriture || !quantite) {
            return res.status(400).json({ message: 'Champs requis manquants' });
        }

        const newRecord = await FoodConsumption.create({
            id: uuidv4(),
            animal_id,
            employee_id: req.user.id,
            nourriture,
            quantite,
            date: new Date(),
            time: new Date().toLocaleTimeString('fr-FR', { hour12: false })
        });

        res.status(201).json({ message: "Consommation enregistrée", record: newRecord });
    } catch (error) {
        console.error("Erreur ajout consommation :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ✅ Voir les messages de contact des visiteurs
router.get('/employee/messages', authenticateToken, authorizeRoles('employee'), async (req, res) => {
    try {
        const messages = await ContactMessage.findAll({
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(messages);
    } catch (error) {
        console.error("Erreur récupération messages :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
