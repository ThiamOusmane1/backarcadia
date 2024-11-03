const express = require('express'); 
const router = express.Router();
const { User, Animal, Habitat } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Route pour récupérer tous les utilisateurs
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.findAll({
            where: { isDeleted: false } // Ne récupérer que les utilisateurs non supprimés
        });
        res.json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour mettre à jour un utilisateur
router.put('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        
        await User.update(req.body, { where: { id, isDeleted: false } });
        res.json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour supprimer un utilisateur avec suppression logique
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        user.isDeleted = true;  // Marquer comme supprimé
        await user.save();
        res.json({ message: 'Utilisateur marqué comme supprimé' });
    } catch (error) {
        console.error("Erreur lors de la suppression logique de l'utilisateur :", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour récupérer tous les animaux
router.get('/animals', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const animals = await Animal.findAll({
            where: { isDeleted: false }, // Ne récupérer que les animaux non supprimés
            attributes: ['id', 'nom', 'sante', 'poids', 'nourriture', 'soins', 'quantite', 'url'],
            include: [{ model: Habitat, as: 'habitat', attributes: ['nom'] }]
        });
        res.json(animals);
    } catch (error) {
        console.error('Erreur lors de la récupération des animaux :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour ajouter un nouvel animal
router.post('/animals', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const animal = await Animal.create(req.body);
        res.status(201).json(animal);
    } catch (error) {
        console.error('Erreur lors de la création de l\'animal :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour supprimer un animal avec suppression logique
router.delete('/animals/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const animal = await Animal.findByPk(id);
        if (!animal) return res.status(404).json({ message: 'Animal non trouvé' });

        animal.isDeleted = true;  // Marquer comme supprimé
        await animal.save();
        res.json({ message: 'Animal marqué comme supprimé' });
    } catch (error) {
        console.error("Erreur lors de la suppression logique de l'animal :", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;



