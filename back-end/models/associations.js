// models/associations.js
const Animal = require('./animals');
const Habitat = require('./habitats');

// Définir la relation entre Habitat et Animal
Habitat.hasMany(Animal, {
    foreignKey: 'habitatId',
    as: 'animaux'
});

Animal.belongsTo(Habitat, {
    foreignKey: 'habitatId',
    as: 'habitat'
});
