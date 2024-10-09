document.addEventListener('DOMContentLoaded', () => {
    const animalsTableBody = document.querySelector('#animalsTable tbody');
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const updateAnimalBtn = document.getElementById('updateAnimalBtn');
    const statusMessage = document.getElementById('statusMessage');
    const modalStatusMessage = document.getElementById('modalStatusMessage');

    let selectedAnimalId = null;

    // Fonction pour afficher un message de statut
    function showStatusMessage(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? 'red' : 'green';
        setTimeout(() => { statusMessage.textContent = ''; }, 3000);
    }

    // Fonction pour afficher un message dans la modale
    function showModalStatusMessage(message, isError = false) {
        modalStatusMessage.textContent = message;
        modalStatusMessage.style.color = isError ? 'red' : 'green';
        setTimeout(() => { modalStatusMessage.textContent = ''; }, 3000);
    }

    // Fermer la fenêtre modale
    closeModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Ouvrir la fenêtre modale pour modifier un animal
    function openEditModal(animal) {
        selectedAnimalId = animal.id; 
        document.getElementById('animalHealth').value = animal.sante;
        document.getElementById('animalWeight').value = animal.poids;
        document.getElementById('animalFood').value = animal.nourriture; // Ajouté
        document.getElementById('animalCare').value = animal.soins || '';
        editModal.style.display = 'flex';
    }

    // Charger les animaux depuis l'API
    function loadAnimals() {
        const vetId = getVetIdFromToken(); // Récupérer l'ID du vétérinaire

        if (!vetId) {
            showStatusMessage('Erreur : ID du vétérinaire non trouvé', true);
            return;
        }

        showStatusMessage('Chargement des animaux...', false); // Message de chargement

        fetch(`http://localhost:3000/api/animals/vet/${vetId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Token JWT pour authentification
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des animaux');
            }
            return response.json();
        })
        .then(data => {
            console.log('Réponse de l\'API:', data);
            const animals = Array.isArray(data) ? data : [data];
            animalsTableBody.innerHTML = ''; // Vide le tableau avant de le remplir

            animals.forEach(animal => {
                const imageUrl = `/pictures/${animal.url}`; // Image du serveur
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td><img src="${imageUrl}" class="img-fluid mb-3" alt="${animal.nom}"></td>
                    <td>${animal.nom}</td>
                    <td>${animal.habitat_id || 'Inconnu'}</td>
                    <td>${animal.sante}</td>
                    <td>${animal.poids} kg</td>
                    <td>${animal.nourriture}</td>
                    <td>${animal.quantite} kg</td>
                    <td>${animal.soins}</td>
                    <td>
                        <button class="view-history-btn" data-animal-id="${animal.id}">Voir l'historique</button>
                        <button class="edit-btn" data-id="${animal.id}">Modifier</button>
                    </td>
                `;

                // Ajouter événements "Modifier" et "Voir l'historique"
                row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(animal));
                row.querySelector('.view-history-btn').addEventListener('click', () => {
                    afficherHistorique(animal.id); // Utiliser l'id correct
                });

                animalsTableBody.appendChild(row);
            });

            showStatusMessage('Animaux chargés avec succès !');
        })
        .catch(error => {
            console.error('Erreur lors du chargement des animaux :', error);
            showStatusMessage('Erreur lors du chargement des animaux', true);
        });
    }

    // Mettre à jour les informations de l'animal via l'API
    updateAnimalBtn.addEventListener('click', () => {
        const updatedAnimal = {
            nourriture: document.getElementById('animalFood').value,
            sante: document.getElementById('animalHealth').value,
            poids: document.getElementById('animalWeight').value,
            soins: document.getElementById('animalCare').value
        };

        fetch(`http://localhost:3000/api/animals/${selectedAnimalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Token JWT pour authentification
            },
            body: JSON.stringify(updatedAnimal)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de l\'animal');
            }
            return response.json();
        })
        .then(() => {
            editModal.style.display = 'none';
            loadAnimals(); // Recharge la liste des animaux après mise à jour
            showModalStatusMessage('Animal mis à jour avec succès !');
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour :', error);
            showModalStatusMessage('Erreur lors de la mise à jour de l\'animal', true);
        });
    });

    // Charger les animaux au démarrage de la page
    loadAnimals();
});

