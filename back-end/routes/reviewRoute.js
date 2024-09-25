const express = require('express');
const router = express.Router();
const Review = require('./models/reviews'); // Importation du modèle MySQL Review

// Route POST pour soumettre un avis
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    try {
        // Création et sauvegarde de l'avis dans MySQL
        const newReview = await Review.create({ name, email, subject, message });
        res.status(201).json({ message: 'Avis envoyé avec succès.', review: newReview });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'avis:', error.message);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'avis.' });
    }
});

// Route GET pour récupérer tous les avis
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.findAll(); // Récupération de tous les avis
        res.json(reviews);
    } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des avis.' });
    }
});

module.exports = router;
