const express = require('express');
const router = express.Router();
const { User, Animal, Habitat, UserLog, Employee, FoodStock, ContactMessage, FoodConsumption } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { filterFields, isValidEmail, sanitizeUserData } = require('../utils/sanitize');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Transporteur Nodemailer
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Ajouter un utilisateur
router.post('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        // Validation et nettoyage des données
        const validatedData = sanitizeUserData(req.body, {
            allowedFields: ['email', 'role'],
            required: ['email', 'role'],
            allowedRoles: ['user', 'admin', 'veterinaire', 'employe']
        });

        const { email, role } = validatedData;

        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(409).json({ message: 'Utilisateur déjà existant.' });

        const generatedPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const newUser = await User.create({
            email,
            role,
            password: hashedPassword,
            isDeleted: false
        });

        try {
            await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: email,
                subject: 'Bienvenue - Vos identifiants',
                text: `Bonjour,\n\nVotre compte a été créé avec succès.\nVoici votre mot de passe temporaire : ${generatedPassword}\nMerci de le changer après votre première connexion.\n\nCordialement,\nL'équipe Zoo`
            });
        } catch (mailErr) {
            console.error("Erreur d'envoi de l'email :", mailErr);
            return res.status(500).json({ message: "Utilisateur créé mais l'e-mail n'a pas pu être envoyé." });
        }

        res.status(201).json({
            message: 'Utilisateur créé et email envoyé.',
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Erreur création utilisateur:', error);
        // Retourne l'erreur de validation ou une erreur générique
        if (error.message.includes('Email invalide') || error.message.includes('Champs manquants') || error.message.includes('rôle doit être')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Liste utilisateurs
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.findAll({ where: { isDeleted: false } });
        res.json(users);
    } catch (error) {
        console.error("Erreur chargement utilisateurs:", error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Modifier utilisateur
router.put('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user || user.isDeleted) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

        // Filtrage et validation des données
        const allowedFields = ['email', 'role', 'password'];
        const filteredBody = filterFields(req.body, allowedFields, {
            sanitize: true
        });

        // Validations spécifiques
        if (filteredBody.email && !isValidEmail(filteredBody.email)) {
            return res.status(400).json({ message: 'Email invalide.' });
        }

        if (filteredBody.role && !['user', 'admin', 'vet', 'employee'].includes(filteredBody.role)) {
            return res.status(400).json({ message: 'Rôle invalide.' });
        }

        // Hash du mot de passe si fourni
        if (filteredBody.password) {
            if (filteredBody.password.length < 8) {
                return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
            }
            filteredBody.password = await bcrypt.hash(filteredBody.password, 10);
        }

        await User.update(filteredBody, { where: { id, isDeleted: false } });
        res.json({ message: 'Utilisateur mis à jour.' });
    } catch (error) {
        console.error("Erreur MAJ utilisateur:", error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Supprimer utilisateur
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user || user.isDeleted) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

        user.isDeleted = true;
        await user.save();
        res.json({ message: 'Utilisateur supprimé (logique).' });
    } catch (error) {
        console.error("Erreur suppression utilisateur:", error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Ajouter un animal
router.post('/animals', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        // Filtrage des champs autorisés
        const allowedFields = ['nom', 'habitat_id', 'sante', 'poids', 'nourriture', 'quantite', 'vet_id', 'url', 'soins'];
        const filteredBody = filterFields(req.body, allowedFields, {
            sanitize: true,
            required: ['nom', 'habitat_id']
        });

        // Validations spécifiques
        if (filteredBody.poids && (isNaN(filteredBody.poids) || filteredBody.poids <= 0)) {
            return res.status(400).json({ message: 'Le poids doit être un nombre positif.' });
        }

        if (filteredBody.quantite && (isNaN(filteredBody.quantite) || filteredBody.quantite < 0)) {
            return res.status(400).json({ message: 'La quantité doit être un nombre positif ou nul.' });
        }

        const newAnimal = await Animal.create({
            ...filteredBody,
            consultations: 0,
            isDeleted: false
        });

        res.status(201).json(newAnimal);
    } catch (error) {
        console.error('Erreur création animal:', error);
        if (error.message.includes('Champs manquants')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Liste animaux
router.get('/animals', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const animals = await Animal.findAll({
            where: { isDeleted: false },
            attributes: ['id', 'nom', 'sante', 'poids', 'nourriture', 'soins', 'quantite', 'url'],
            include: [{ model: Habitat, as: 'habitat', attributes: ['nom'] }]
        });
        res.json(animals);
    } catch (error) {
        console.error('Erreur chargement animaux:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Modifier animal
router.put('/animals/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const animal = await Animal.findByPk(id);
        if (!animal || animal.isDeleted) return res.status(404).json({ message: 'Animal non trouvé.' });

        // Filtrage des champs autorisés
        const allowedFields = ['nom', 'habitat_id', 'sante', 'poids', 'nourriture', 'quantite', 'vet_id', 'url', 'soins'];
        const filteredBody = filterFields(req.body, allowedFields, {
            sanitize: true
        });

        // Validations spécifiques
        if (filteredBody.poids && (isNaN(filteredBody.poids) || filteredBody.poids <= 0)) {
            return res.status(400).json({ message: 'Le poids doit être un nombre positif.' });
        }

        if (filteredBody.quantite && (isNaN(filteredBody.quantite) || filteredBody.quantite < 0)) {
            return res.status(400).json({ message: 'La quantité doit être un nombre positif ou nul.' });
        }

        await Animal.update(filteredBody, { where: { id, isDeleted: false } });
        res.json({ message: 'Animal mis à jour.' });
    } catch (error) {
        console.error('Erreur MAJ animal:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Supprimer animal
router.delete('/animals/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const animal = await Animal.findByPk(id);
        if (!animal || animal.isDeleted) return res.status(404).json({ message: 'Animal non trouvé.' });

        animal.isDeleted = true;
        await animal.save();
        res.json({ message: 'Animal supprimé (logique).' });
    } catch (error) {
        console.error("Erreur suppression animal:", error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Logs
router.get('/user_logs', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const logs = await UserLog.findAll({
            order: [['date', 'DESC']],
            include: [{ model: User, as: 'user', attributes: ['email', 'role'] }],
            limit: 50
        });
        res.json({ logs });
    } catch (error) {
        console.error('Erreur chargement logs:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Route : Récupération des logs de nourriture
router.get('/food-logs', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      const logs = await FoodConsumption.findAll({
        include: [
          { model: Animal, attributes: ['nom'] },
          { model: Employee, attributes: ['nom'] }
        ],
        order: [['date', 'DESC'], ['time', 'DESC']]
      });
      res.json(logs);
    } catch (err) {
      console.error("Erreur récupération des logs :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route : Récupération des messages visiteurs
router.get('/visitor-messages', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
      res.json(messages);
    } catch (err) {
      console.error("Erreur récupération messages :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route : Récupération du stock
router.get('/food-stock', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      const stock = await FoodStock.findAll();
      res.json(stock);
    } catch (err) {
      console.error("Erreur récupération stock :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;