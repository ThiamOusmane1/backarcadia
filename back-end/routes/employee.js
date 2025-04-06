const express = require('express');
const router = express.Router();
const { Animal, Habitat, FoodConsumption, ContactMessage, FoodStock } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// Récupérer tous les animaux
router.get('/animals', authenticateToken, authorizeRoles('employee'), async (req, res) => {
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

    stock.quantite_stock -= quantite;
    stock.updated_at = new Date();
    await stock.save();

    const record = await FoodConsumption.create({
      id: uuidv4(),
      animal_id,
      employee_id,
      nourriture,
      quantite,
      date: new Date(),
      time: new Date().toLocaleTimeString('fr-FR', { hour12: false })
    });

    res.status(201).json({
      message: "Consommation enregistrée",
      record,
      stockRestant: stock.quantite_stock,
      alerte: stock.quantite_stock <= stock.seuil_alerte ? 'Stock faible !' : null
    });
  } catch (err) {
    console.error("Erreur ajout consommation :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Voir tout le stock
router.get('/food-stock', authenticateToken, authorizeRoles('employee'), async (req, res) => {
    try {
      const stock = await FoodStock.findAll({ order: [['nourriture', 'ASC']] });
      res.json(stock);
    } catch (error) {
      console.error("Erreur récupération stock :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
// Réapprovisionner un aliment
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
router.get('/messages', authenticateToken, authorizeRoles('employee'), async (req, res) => {
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

// 🔹 Répondre à un message
router.put('/messages/:id/reply', authenticateToken, authorizeRoles('employee'), async (req, res) => {
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

module.exports = router;


