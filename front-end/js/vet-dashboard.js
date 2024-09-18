document.addEventListener('DOMContentLoaded', () => {
    const animalsTableBody = document.querySelector('#animalsTable tbody');
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const updateAnimalBtn = document.getElementById('updateAnimalBtn');
    const statusMessage = document.getElementById('statusMessage');  // Pour les messages de statut
    const modalStatusMessage = document.getElementById('modalStatusMessage');  // Message dans la modale
    
    let selectedAnimalId = null;

    // Fonction pour afficher un message de statut
    function showStatusMessage(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? 'red' : 'green';
        setTimeout(() => { statusMessage.textContent = ''; }, 3000); // Cache le message après 3 secondes
    }

    // Fonction pour afficher un message dans la modale
    function showModalStatusMessage(message, isError = false) {
        modalStatusMessage.textContent = message;
        modalStatusMessage.style.color = isError ? 'red' : 'green';
        setTimeout(() => { modalStatusMessage.textContent = ''; }, 3000); // Cache le message après 3 secondes
    }

    // Fermer la fenêtre modale
    closeModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Ouvrir la fenêtre modale pour modifier un animal
    function openEditModal(animal) {
        selectedAnimalId = animal._id;  // Stocke l'ID de l'animal sélectionné
        document.getElementById('animalHealth').value = animal.sante; // Affiche l'état de santé dans le formulaire
        document.getElementById('animalWeight').value = animal.poids; // Affiche le poids dans le formulaire
        document.getElementById('animalCare').value = animal.soins || ''; // Affiche les consultations (soins)
        editModal.style.display = 'flex'; // Ouvre la modale
    }

    // Charger les animaux depuis l'API
    function loadAnimals() {
        fetch('/api/vet/animals')  // Requête API pour charger les animaux
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur dans la requête API');
                }
                return response.json();  // Transforme la réponse en JSON
            })
            .then(data => {
                console.log('Réponse de l\'API:', data);  // Debug: Affiche la réponse

                // Vérifie si la réponse est un tableau, sinon l'encapsule dans un tableau
                const animals = Array.isArray(data) ? data : [data];

                // Vide le tableau HTML avant d'ajouter les nouvelles données
                animalsTableBody.innerHTML = '';

                // Itère sur les animaux pour les afficher
                animals.forEach(animal => {

                    const imageUrl = `/pictures/${animal.url}`;
                    const row = document.createElement('tr');  // Crée une nouvelle ligne de tableau

                    row.innerHTML = `
                    <td><img src="${imageUrl}" class="img-fluid mb-3" alt="${animal.nom}"></td> <!-- Image de l'animal -->
                    <td>${animal.nom}</td> <!-- Nom de l'animal -->
                    <td>${animal.habitat || 'Inconnu'}</td> <!-- Habitat de l'animal -->
                    <td>${animal.sante}</td> <!-- État de santé -->
                    <td>${animal.poids} kg</td> <!-- Poids de l'animal -->
                    <td>${animal.nourriture}</td> <!-- Nourriture de l'animal -->
                    <td>${animal.quantite} kg</td> <!-- Quantité de nourriture -->
                    <td>${animal.consultations ? animal.consultations : 'Aucun soin disponible'}</td> <!-- Soins ou consultations -->
                    <td><button class="edit-btn" data-id="${animal._id}">Modifier</button></td> <!-- Bouton Modifier -->
                    `;

                    // Ajoute un événement pour ouvrir la modale de modification au clic sur le bouton "Modifier"
                    row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(animal));

                    // Ajoute la ligne au tableau HTML
                    animalsTableBody.appendChild(row);
                });
                showStatusMessage('Animaux chargés avec succès !');
            })
            .catch(error => {
                console.error('Erreur lors du chargement des animaux :', error);
                showStatusMessage('Erreur lors du chargement des animaux', true);  // Affiche un message d'erreur
            });
    }

    // Mettre à jour les informations de l'animal via l'API
    updateAnimalBtn.addEventListener('click', () => {
        const updatedAnimal = {
            sante: document.getElementById('animalHealth').value,  // Récupère la nouvelle santé
            poids: document.getElementById('animalWeight').value,  // Récupère le nouveau poids
            soins: document.getElementById('animalCare').value  // Récupère les nouvelles consultations (soins)
        };

        // Envoie la requête PUT à l'API pour mettre à jour l'animal
        fetch(`/api/vet/animals/${selectedAnimalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAnimal),  // Convertit l'objet en JSON pour l'envoyer
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de l\'animal');
            }
            return response.json();  // Convertit la réponse en JSON
        })
        .then(() => {
            // Ferme la modale après la mise à jour réussie
            editModal.style.display = 'none';
            loadAnimals();  // Recharge la liste des animaux pour refléter les modifications
            showModalStatusMessage('Animal mis à jour avec succès !');
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour :', error);
            showModalStatusMessage('Erreur lors de la mise à jour de l\'animal', true);  // Affiche un message d'erreur
        });
    });

    // Charger les animaux au démarrage de la page
    loadAnimals();
});

