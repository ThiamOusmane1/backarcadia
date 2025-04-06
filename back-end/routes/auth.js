// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../config/mysqlConnection');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Requête de connexion reçue :', { email });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Erreur login :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer le rôle de l'utilisateur connecté
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/getUserRole', authenticateToken, (req, res) => {
  const role = req.user.role;
  if (!role) return res.status(404).json({ message: 'Rôle non trouvé' });
  res.json({ role });
});

module.exports = router;

