const express = require('express');
const router = express.Router();
const { User, Animal, Habitat, UserLog, Employee, FoodStock, ContactMessage, FoodConsumption } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Ajouter un utilisateur
router.post('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { email, role } = req.body;
    if (!email || !role) return res.status(400).json({ message: 'Email et rôle requis.' });

    try {
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(409).json({ message: 'Utilisateur déjà existant.' });

        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('password', 10);

        const newUser = await User.create({ email, role, password: hashedPassword, isDeleted: false });
        res.status(201).json({ message: 'Utilisateur créé.', user: newUser });
    } catch (error) {
        console.error('Erreur création utilisateur:', error);
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

        await User.update(req.body, { where: { id } });
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
    const { nom, habitat_id, sante, poids, nourriture, quantite, vet_id, url, soins } = req.body;
    if (!nom || !habitat_id) return res.status(400).json({ message: 'Nom et habitat requis.' });

    try {
        const newAnimal = await Animal.create({
            nom, habitat_id, sante, poids, nourriture, quantite, vet_id, url, soins,
            consultations: 0, isDeleted: false
        });
        res.status(201).json(newAnimal);
    } catch (err) {
        console.error('Erreur création animal:', err);
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

        await Animal.update(req.body, { where: { id } });
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






