require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectMySQLDB();
        console.log('Connexion à MySQL réussie.');

        app.listen(port, () => {
            console.log(`Serveur démarré sur le port ${port}`);
        });
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur :', error);
    }
};

startServer();

