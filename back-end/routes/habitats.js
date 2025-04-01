const express = require('express');
const router = express.Router();
const { Animal, Habitat } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// ✅ Public - Voir tous les habitats avec leurs animaux
router.get('/', async (req, res) => {
  try {
    const habitats = await Habitat.findAll({
      where: { isDeleted: false },
      include: { model: Animal, as: 'animaux' }
    });
    res.json(habitats);
  } catch (error) {
    console.error('Erreur récupération habitats:', error.message);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ Public - Voir un habitat par son nom
router.get('/:habitatName', async (req, res) => {
  try {
    const habitat = await Habitat.findOne({
      where: { nom: req.params.habitatName, isDeleted: false },
      include: { model: Animal, as: 'animaux' }
    });

    if (!habitat) return res.status(404).send('Habitat non trouvé');
    res.json(habitat);
  } catch (error) {
    console.error('Erreur habitat par nom:', error.message);
    res.status(500).send('Erreur serveur');
  }
});

// 🔒 Admin - Créer un habitat
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const habitat = await Habitat.create(req.body);
    res.status(201).json({ message: 'Habitat créé', habitat });
  } catch (error) {
    console.error('Erreur création habitat:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔒 Admin - Modifier un habitat
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const habitat = await Habitat.findByPk(req.params.id);
    if (!habitat) return res.status(404).json({ message: 'Habitat non trouvé' });

    await habitat.update(req.body);
    res.status(200).json({ message: 'Habitat mis à jour', habitat });
  } catch (error) {
    console.error('Erreur MAJ habitat:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔒 Admin - Suppression logique
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const habitat = await Habitat.findByPk(req.params.id);
    if (!habitat) return res.status(404).json({ message: 'Habitat non trouvé' });

    habitat.isDeleted = true;
    await habitat.save();
    res.status(200).json({ message: 'Habitat supprimé logiquement' });
  } catch (error) {
    console.error('Erreur suppression logique habitat:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;

