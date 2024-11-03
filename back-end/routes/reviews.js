const express = require('express');
const router = express.Router();
const { Review } = require('../config/mysqlConnection'); // Vérifiez que ce chemin est correct
console.log('Modèle Review:', Review);

// Soumettre un avis
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Vérification des champs requis
    if (!name || !email || !subject || !message) {
        console.log('Erreur : Tous les champs sont obligatoires.', { name, email, subject, message });
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    try {
        console.log('Tentative de création d\'un nouvel avis avec les données suivantes :', { name, email, subject, message });
        const newReview = await Review.create({ name, email, subject, message });
        console.log('Nouvel avis créé avec succès:', newReview);
        res.status(201).json({ message: 'Avis envoyé avec succès.', review: newReview });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'avis:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'avis.' });
    }
});

// Récupérer tous les avis
router.get('/', async (req, res) => {
    try {
        console.log('Tentative de récupération de tous les avis...');
        const reviews = await Review.findAll();
        console.log('Avis récupérés avec succès:', reviews);
        res.json(reviews);
    } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des avis.' });
    }
});

// Supprimer un avis
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Tentative de suppression de l'avis avec l'ID: ${id}`);

    try {
        const result = await Review.destroy({ where: { id } });
        if (!result) {
            console.log(`Erreur : Avis avec l'ID ${id} non trouvé.`);
            return res.status(404).json({ message: 'Avis non trouvé.' });
        }
        console.log('Avis supprimé avec succès.');
        res.json({ message: 'Avis supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'avis:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'avis.' });
    }
});

module.exports = router;



