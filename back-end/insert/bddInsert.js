require('dotenv').config();
const mongoose = require('mongoose');
const Animal = require('../models/animals');

const updateDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Mettre à jour chaque animal en ajoutant une action dans l'historique
    await Animal.updateMany(
      {}, // Cible tous les animaux
      {
        $push: {
          historique: {
            date: new Date(), // Ajoute la date actuelle
            action: 'Action par défaut - historique mis à jour' // Exemple d'action
          }
        }
      }
    );

   // console.log('Historique mis à jour avec succès pour tous les animaux.');
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la base de données:', err);
  } finally {
    mongoose.connection.close();
  }
};

updateDB();
