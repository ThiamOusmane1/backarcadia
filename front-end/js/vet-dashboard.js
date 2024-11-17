document.addEventListener('DOMContentLoaded', () => {
    const animalsTableBody = document.querySelector('#animalsTable tbody');
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const updateAnimalBtn = document.getElementById('updateAnimalBtn');
    const statusMessage = document.getElementById('statusMessage');
    const apiUrl = 'https://zoo-arcadia-omega.vercel.app';

    let selectedAnimalId = null;

    // Fonction pour déconnecter l'utilisateur
    function logout() {
        localStorage.removeItem('authToken'); // Supprime le token d'authentification
        window.location.href = 'index.html';  // Redirige vers la page de connexion
    }

    // Écouter le clic sur le bouton de déconnexion
    logoutBtn.addEventListener('click', logout);

    // Fonction pour afficher un message de statut
    function showStatusMessage(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? 'red' : 'green';
        setTimeout(() => { statusMessage.textContent = ''; }, 3000);
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
        document.getElementById('animalFood').value = animal.nourriture;
        document.getElementById('animalCare').value = animal.soins || '';
        editModal.style.display = 'flex';
    }

    // Charger les animaux depuis l'API
    function loadAnimals() {
        showStatusMessage('Chargement des animaux...', false); // Message de chargement

        fetch('${apiUrl}/api/animals', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Utiliser 'authToken'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des animaux');
            }
            return response.json();
        })
        .then(data => {
            console.log('Réponse de l\'API:', data); // Afficher la réponse

            // Vérification de la propriété animals
            if (!Array.isArray(data)) {
                throw new Error('Les données ne sont pas un tableau');
            }

            animalsTableBody.innerHTML = ''; // Vide le tableau avant de le remplir

            data.forEach(animal => {
                const imageUrl = `/pictures/${animal.url}`; 
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td><img src="${imageUrl}" class="img-fluid mb-3" alt="${animal.nom}"></td>
                    <td>${animal.nom}</td>
                    <td>${animal.habitat ? animal.habitat.nom : 'Inconnu'}</td>
                    <td>${animal.sante}</td>
                    <td>${animal.poids} kg</td>
                    <td>${animal.nourriture}</td>
                    <td>${animal.quantite} kg</td>
                    <td>${animal.soins}</td>
                    <td>
                        <button class="edit-btn" data-id="${animal.id}">Modifier</button>
                    </td>
                `;

                // Ajouter événements "Modifier"
                row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(animal));

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
            sante: document.getElementById('animalHealth').value,
            poids: document.getElementById('animalWeight').value,
            nourriture: document.getElementById('animalFood').value,
            soins: document.getElementById('animalCare').value,
        };

        // Validation des champs
        if (!updatedAnimal.sante || !updatedAnimal.poids || !updatedAnimal.nourriture || !updatedAnimal.soins) {
            showStatusMessage('Veuillez remplir tous les champs.', true);
            return;
        }

        if (isNaN(updatedAnimal.poids) || updatedAnimal.poids <= 0) {
            showStatusMessage('Le poids doit être un nombre positif.', true);
            return;
        }

        console.log(`Mise à jour de l'animal avec l'ID : ${selectedAnimalId}`);

        fetch(`${apiUrl}/api/animals/${selectedAnimalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`  // Token d'authentification
            },
            body: JSON.stringify(updatedAnimal)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.log('Erreur API:', errorData);
                    throw new Error(`Erreur API : ${errorData.message || 'Erreur inconnue'}`);
                });
            }
            return response.json();
        })
        .then(() => {
            editModal.style.display = 'none';
            loadAnimals();  // Recharger la liste des animaux après mise à jour
            showStatusMessage('Informations mises à jour avec succès !');
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour de l\'animal :', error);
            showStatusMessage('Erreur lors de la mise à jour de l\'animal', true);
        });
    });

    loadAnimals(); // Charger les animaux au démarrage
});





