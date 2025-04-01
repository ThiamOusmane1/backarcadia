const express = require('express');
const router = express.Router();
const { Review } = require('../config/mysqlConnection');

// Ajouter un avis
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    try {
        const newReview = await Review.create({
            name,
            email,
            subject,
            message
        });

        return res.status(201).json({
            message: 'Avis envoyé avec succès.',
            review: newReview
        });
    } catch (error) {
        console.error('[POST /reviews] Erreur :', error);
        return res.status(500).json({
            error: 'Erreur serveur lors de l\'enregistrement de l\'avis.'
        });
    }
});

// Tous les avis
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Retourner un tableau, même vide
        return res.status(200).json(reviews || []);
    } catch (error) {
        console.error('[GET /reviews] Erreur :', error);
        return res.status(500).json({
            error: 'Erreur serveur lors de la récupération des avis.'
        });
    }
});

// Supprimer un avis par ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Review.destroy({ where: { id } });

        if (result === 0) {
            return res.status(404).json({ message: 'Avis non trouvé.' });
        }

        return res.json({ message: 'Avis supprimé avec succès.' });
    } catch (error) {
        console.error('[DELETE /reviews/:id] Erreur :', error);
        return res.status(500).json({
            error: 'Erreur serveur lors de la suppression de l\'avis.'
        });
    }
});

module.exports = router;




