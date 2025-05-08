const express = require('express');
const router = express.Router();
const { Animal, Habitat, FoodConsumption, ContactMessage, FoodStock, AnimalFoodLog, User } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// Récupérer tous les animaux
router.get('/animals', authenticateToken, authorizeRoles('employee', 'admin'), async (req, res) => {
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

// 🔹 Enregistrer une consommation et MAJ du stock
router.post('/food', authenticateToken, authorizeRoles('employee'), async (req, res) => {
  try {
    const { animal_id, nourriture, quantite } = req.body;
    const employee_id = req.user.id;

    if (!animal_id || !nourriture || !quantite) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const stock = await FoodStock.findOne({ where: { nourriture } });
    if (!stock) return res.status(404).json({ message: 'Nourriture non trouvée en stock' });

    if (stock.quantite_stock < quantite) {
      return res.status(400).json({ message: 'Stock insuffisant' });
    }

    // Mise à jour du stock
    stock.quantite_stock -= quantite;
    stock.updated_at = new Date();
    await stock.save();

    // Création du log dans AnimalFoodLog
    const log = await AnimalFoodLog.create({
      id: uuidv4(),
      nourriture,
      quantite,
      date: new Date(),
      time: new Date().toLocaleTimeString('fr-FR', { hour12: false }),
      animalId: animal_id,
      employeeId: employee_id
    });

    const now = new Date();
    const time = now.toLocaleTimeString('fr-FR', { hour12: false });

    // Création du log dans food_consumption
    await FoodConsumption.create({
      id: uuidv4(),
      animal_id,
      employee_id,
      nourriture,
      quantite,
      date: now,
      time
    });

    // Réponse 
    res.status(201).json({
      message: "Consommation enregistrée",
      log,
      stockRestant: stock.quantite_stock,
      alerte: stock.quantite_stock <= stock.seuil_alerte ? 'Stock faible !' : null
    });

  } catch (err) {
    console.error("Erreur ajout consommation :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Voir le stock pour employee (simple vue)
router.get('/food-stock', authenticateToken, authorizeRoles('employee', 'admin'), async (req, res) => {
  try {
    const stock = await FoodStock.findAll({ order: [['nourriture', 'ASC']] });
    res.json(stock);
  } catch (error) {
    console.error("Erreur récupération stock :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Réapprovisionner un aliment (employee uniquement)
router.put('/food-stock/:nourriture', authenticateToken, authorizeRoles('employee'), async (req, res) => {
  try {
    const { nourriture } = req.params;
    const { ajout } = req.body;

    if (!ajout || isNaN(ajout)) {
      return res.status(400).json({ message: 'Quantité invalide' });
    }

    const stock = await FoodStock.findOne({ where: { nourriture } });
    if (!stock) return res.status(404).json({ message: 'Nourriture non trouvée' });

    stock.quantite_stock += parseFloat(ajout);
    stock.updated_at = new Date();
    await stock.save();

    res.json({ message: 'Stock mis à jour', stock });
  } catch (error) {
    console.error("Erreur MAJ stock :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Voir les messages visiteurs
router.get('/messages', authenticateToken, authorizeRoles('employee', 'admin'), async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(messages);
  } catch (err) {
    console.error("Erreur récupération messages :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Répondre à un message
router.put('/messages/:id/reply', authenticateToken, authorizeRoles('employee', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const message = await ContactMessage.findByPk(id);

    if (!message) return res.status(404).json({ message: 'Message non trouvé' });

    message.reply = reply;
    message.replied_by = req.user.id;
    message.reply_date = new Date();
    await message.save();

    res.status(200).json({ message: 'Réponse enregistrée' });
  } catch (err) {
    console.error("Erreur réponse message :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Voir tous les logs nourriture (admin uniquement)
router.get('/food-log', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const logs = await AnimalFoodLog.findAll({
      include: [
        { model: Animal, as: 'animal', attributes: ['nom'] },
        { model: User, as: 'employee', attributes: ['email'] }
      ]
    });
    res.json(logs);
  } catch (error) {
    console.error('Erreur récupération logs nourriture:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;



