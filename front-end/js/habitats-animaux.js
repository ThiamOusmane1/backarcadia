document.addEventListener('DOMContentLoaded', function() {
    const habitatsList = document.getElementById('habitats-list');
    const animalGallery = document.getElementById('animal-gallery');
    const modalBody = document.getElementById('modal-body');
    
    const animalsData = {
        "Savane": [
            { name: "Lion", image: "pictures/lion.jpg", description: "Le roi de la savane." },
            { name: "Éléphant", image: "pictures/elephant.jpg", description: "Le plus grand animal terrestre." }
        ],
        "Jungle": [
            { name: "Tigre", image: "pictures/tigre.jpg", description: "Un prédateur puissant." },
            { name: "Singe", image: "pictures/singe.jpg", description: "Intelligent et joueur." }
        ],
        "Marais": [
            { name: "Crocodile", image: "pictures/crocodile.jpg", description: "Un redoutable reptile." },
            { name: "Héron", image: "pictures/heron.jpg", description: "Un grand oiseau élégant." }
        ]
    };

    // Gestion du clic sur une carte d'habitat
    habitatsList.addEventListener('click', function(event) {
        const habitatCard = event.target.closest('.ha-card');
        if (habitatCard) {
            const habitat = habitatCard.dataset.habitat;
            displayAnimals(habitat);
        }
    });

    // Fonction pour afficher les animaux pour l'habitat sélectionné
    function displayAnimals(habitat) {
        const animals = animalsData[habitat];
        animalGallery.innerHTML = ''; // Réinitialiser la galerie

        animals.forEach(animal => {
            const animalCard = `
                <div class="col-md-4 mb-4">
                    <div class="card animal-card" data-animal='${JSON.stringify(animal)}'>
                        <img src="${animal.image}" class="card-img-top" alt="${animal.name}">
                        <div class="card-body">
                            <h5 class="card-title">${animal.name}</h5>
                            <p class="card-text">${animal.description}</p>
                        </div>
                    </div>
                </div>
            `;
            animalGallery.innerHTML += animalCard;
        });
    }

    // Gestion du clic sur une carte d'animal pour ouvrir la modale
    animalGallery.addEventListener('click', function(event) {
        const animalCard = event.target.closest('.animal-card');
        if (animalCard) {
            const animal = JSON.parse(animalCard.dataset.animal);
            showAnimalDetails(animal);
        }
    });

    // Fonction pour afficher les détails de l'animal dans la modale
    function showAnimalDetails(animal) {
        modalBody.innerHTML = `
            <img src="${animal.image}" class="img-fluid mb-3" alt="${animal.name}">
            <h5>${animal.name}</h5>
            <p>${animal.description}</p>
        `;
        $('#animalModal').modal('show'); // Utilisation de jQuery pour afficher la modale Bootstrap
    }
});
