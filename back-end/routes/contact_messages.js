const express = require('express');
const router = express.Router();
const { ContactMessage, User } = require('../config/mysqlConnection');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// Envoyer un message (public)
router.post('/', async (req, res) => {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const newMessage = await ContactMessage.create({
            id: uuidv4().slice(0, 24),
            email,
            subject,
            message,
            createdAt: new Date(),
            reply: null,
            replyDate: null,
            repliedBy: null
        });

        res.status(201).json({
            message: 'Message envoyé avec succès.',
            data: newMessage
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Voir tous les messages (admin & employee)
router.get('/', authenticateToken, authorizeRoles('admin', 'employee'), async (req, res) => {
    try {
        const messages = await ContactMessage.findAll({
            include: {
                model: User,
                as: 'repondeur',
                attributes: ['id', 'email', 'role']
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(messages);
    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Répondre à un message (admin & employee)
router.put('/:id/reply', authenticateToken, authorizeRoles('admin', 'employee'), async (req, res) => {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) {
        return res.status(400).json({ message: 'La réponse est requise.' });
    }

    try {
        const message = await ContactMessage.findByPk(id);
        if (!message) return res.status(404).json({ message: 'Message non trouvé.' });

        message.reply = reply;
        message.replyDate = new Date();
        message.repliedBy = req.user.id;

        await message.save();

        res.json({ message: 'Réponse enregistrée avec succès.', data: message });
    } catch (error) {
        console.error('Erreur lors de la réponse au message :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Supprimer une réponse (admin uniquement)
router.put('/:id/clear-reply', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;

    try {
        const message = await ContactMessage.findByPk(id);
        if (!message || !message.reply) {
            return res.status(404).json({ message: 'Message ou réponse introuvable.' });
        }

        message.reply = null;
        message.replyDate = null;
        message.repliedBy = null;

        await message.save();
        res.json({ message: 'Réponse supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la réponse :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = router;

