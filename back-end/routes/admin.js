const express = require('express');
const router = express.Router();
const { User, Animal, Habitat } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Ajouter un nouvel utilisateur (admin uniquement)
router.post('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ message: 'Email et rôle sont requis.' });
    }

    try {
        const userExist = await User.findOne({ where: { email } });
        if (userExist) return res.status(409).json({ message: 'Cet utilisateur existe déjà.' });

        const defaultPassword = 'password'; 
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const newUser = await User.create({
            email,
            role,
            password: hashedPassword,
            isDeleted: false
        });

        res.status(201).json({ message: 'Utilisateur créé.', user: newUser });
    } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});


// Voir tous les utilisateurs (Admin)
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.findAll({ where: { isDeleted: false } });
        res.json(users);
    } catch (error) {
        console.error("Erreur récupération utilisateurs:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Modifier un utilisateur
router.put('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        await User.update(req.body, { where: { id, isDeleted: false } });
        res.json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
        console.error("Erreur mise à jour utilisateur:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Suppression logique d’un utilisateur
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        user.isDeleted = true;
        await user.save();
        res.json({ message: 'Utilisateur supprimé (logique)' });
    } catch (error) {
        console.error("Erreur suppression utilisateur:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Voir tous les animaux
router.get('/animals', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const animals = await Animal.findAll({
            where: { isDeleted: false },
            attributes: ['id', 'nom', 'sante', 'poids', 'nourriture', 'soins', 'quantite', 'url'],
            include: [{ model: Habitat, as: 'habitat', attributes: ['nom'] }]
        });
        res.json(animals);
    } catch (error) {
        console.error('Erreur récupération animaux :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer un animal (logique)
router.delete('/animals/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const animal = await Animal.findByPk(id);
        if (!animal) return res.status(404).json({ message: 'Animal non trouvé' });

        animal.isDeleted = true;
        await animal.save();
        res.json({ message: 'Animal supprimé (logique)' });
    } catch (error) {
        console.error("Erreur suppression animal:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Modifier un animal
router.put('/animals/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const animal = await Animal.findByPk(id);
        if (!animal) return res.status(404).json({ message: 'Animal non trouvé' });

        await Animal.update(req.body, { where: { id, isDeleted: false } });
        res.json({ message: 'Animal mis à jour' });
    } catch (error) {
        console.error('Erreur mise à jour animal :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;





