require('dotenv').config();
const express = require('express');
const path = require('path');
const { authenticateToken, authorizeRoles } = require('./routes/auth');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const connectDB = require('./config/connection');

// Importer les modèles pour s'assurer qu'ils sont enregistrés
require('./models/animals');
require('./models/habitats');

const animalRouter = require('./routes/animals');
const habitatRouter = require('./routes/habitats');
const User = require('./models/user');

const app = express();
const port = 3002;

// Middleware CORS - Configurer les règles d'accès
app.use(cors({
    origin: '*', // Permet tout origine pour le développement. Remplacez par des URLs spécifiques en production.
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour gérer les sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware pour parser le body des requêtes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques du répertoire 'front-end' (images, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, '../front-end')));

// Servir les images depuis le répertoire 'front-end/pictures'
app.use('/pictures', express.static(path.join(__dirname, '../front-end/pictures')));

// Route de base pour la racine
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Zoo Arcadia !');
});

// Utiliser les routeurs pour les routes liées aux animaux et aux habitats
app.use('/api/animals', animalRouter);
app.use('/api/habitats', habitatRouter);

// Route de connexion
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const result = await bcrypt.compare(password, user.password);

            if (result) {
                req.session.user = { email: user.email, role: user.role };
                return res.json({ message: `Bonjour ${user.email}, connexion réussie !` });
            } else {
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }
        } else {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        return res.status(500).send('Erreur serveur');
    }
});

// Middleware pour vérifier l'authentification
function authMiddleware(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).redirect('/login.html');
    }
}

// Protéger certaines routes avec le middleware d'authentification
app.get('/dashboard.html', authMiddleware, authorizeRoles('admin', 'vet', 'enploye'), (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end', 'dashboard.html'));
});

// Démarrer le serveur et la connexion à la base de données
const startServer = async () => {
    try {
        await connectDB();
        console.log('Base de données connectée avec succès !');

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });
    } catch (err) {
        console.error('Erreur lors du démarrage du serveur:', err);
    }
};

startServer();
