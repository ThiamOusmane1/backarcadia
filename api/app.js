const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Configuration CORS
app.use(cors({
    origin: [
        'http://127.0.0.1:8080',
        'https://backarcadia-mxgu8but6-thiamousmane1s-projects.vercel.app',
        'https://backarcadia.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true
}));

// Middleware pour parser les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../front-end')));
app.use('/pictures', express.static(path.join(__dirname, '../front-end/pictures')));

// Importer et utiliser les routeurs
const animalRouter = require('./backend/routes/animals');
const habitatRouter = require('./backend/routes/habitats');
const reviewRouter = require('./backend/routes/reviews');
const authRoutes = require('./backend/routes/auth');

app.use('/api/animals', animalRouter);
app.use('/api/habitats', habitatRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/auth', authRoutes.router);

// Route de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Zoo Arcadia !');
});

// Exporter la fonction pour Vercel
module.exports = (req, res) => {
    return app(req, res);
};



