const express = require('express');
const router = express.Router();
const { Animal, Habitat, HistoriqueAnimal } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { v4: uuidv4 } = require('uuid');

router.use(authenticateToken, authorizeRoles('vet'));

// Liste des animaux
router.get('/animals', async (req, res) => {
  try {
    const animals = await Animal.findAll({
      where: { isDeleted: false },
      attributes: ['id', 'nom', 'sante', 'poids', 'nourriture', 'soins', 'quantite', 'url'],
      include: [{ model: Habitat, as: 'habitat', attributes: ['nom'] }]
    });

    res.json({ animals });
  } catch (error) {
    console.error('Erreur récupération animaux :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Mise à jour d’un animal avec enregistrement dans l'historique
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

    // Ajouter un log pour l'action effectuée par le vétérinaire
    await UserLog.create({
      id: uuidv4(),
      user_id: req.user.id,  // Identifiant du vétérinaire
      action: 'Mise à jour animal',
      description: `Vétérinaire ${req.user.id} a mis à jour les informations de l'animal ${id}.`,
      date: new Date()
    });

    res.json({ message: 'Animal mis à jour avec succès.' });
  } catch (error) {
    console.error("Erreur mise à jour animal :", error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Historique des 10 dernières modifications
router.get('/historique/:animalId', async (req, res) => {
  const { animalId } = req.params;

  try {
    const historique = await HistoriqueAnimal.findAll({
      where: { animal_id: animalId },
      attributes: ['id', 'action', 'old_value', 'new_value', 'date'],
      order: [['date', 'DESC']],
      limit: 10
    });

    res.json({ historique });
  } catch (error) {
    console.error('[ERROR] Historique animal :', error);
    res.status(500).json({ message: 'Erreur chargement historique.' });
  }
});

module.exports = router;



