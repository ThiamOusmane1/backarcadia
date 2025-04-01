document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000';

    const logoutBtn = document.getElementById('logoutBtn');
    const animalsTableBody = document.querySelector('#animalsTable tbody');
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditAnimal = document.getElementById('cancelEditAnimal');
    const updateAnimalBtn = document.getElementById('updateAnimalBtn');
    const statusMessage = document.getElementById('statusMessage');
    const modalStatusMessage = document.getElementById('modalStatusMessage');

    let selectedAnimalId = null;

    console.log(' Script vet-dashboard.js chargé');

    // Déconnexion
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    });

    // Messages
    function showStatusMessage(message, isError = false, isModal = false) {
        const element = isModal ? modalStatusMessage : statusMessage;
        element.textContent = message;
        element.style.color = isError ? 'red' : 'green';
        setTimeout(() => { element.textContent = ''; }, 3000);
    }

    // Fermer modale
    closeModalBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    cancelEditAnimal.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    // Ouvrir modale
    function openEditModal(animal) {
        selectedAnimalId = animal.id;
        document.getElementById('animalHealth').value = animal.sante || '';
        document.getElementById('animalWeight').value = animal.poids || '';
        document.getElementById('animalFood').value = animal.nourriture || '';
        document.getElementById('animalCare').value = animal.soins || '';
        editModal.classList.remove('hidden');
        console.log(' Ouverture de la modale pour l\'animal :', animal.nom);
    }

    // Charger les animaux
    function loadAnimals() {
        showStatusMessage(' Chargement des animaux...');
        console.log(' Envoi de la requête GET vers /api/vet/animals');

        fetch(`${apiUrl}/api/vet/animals`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            console.log('[DEBUG] Status de la réponse:', res.status);
            if (!res.ok) throw new Error('Erreur récupération animaux');
            return res.json();
        })
        .then(response => {
            console.log('Réponse API animaux :', response);
            const animals = response.animals;
            animalsTableBody.innerHTML = '';

            animals.forEach(animal => {
                console.log('Affichage boucle animaux → premier nom :', animals[0]?.nom);

                const row = document.createElement('tr');
                const imageUrl = `pictures/${animal.url}`;

                row.innerHTML = `
                    <td><img src="${imageUrl}" class="img-fluid" alt="${animal.nom}"></td>
                    <td>${animal.nom}</td>
                    <td>${animal.habitat?.nom || 'Inconnu'}</td>
                    <td>${animal.sante}</td>
                    <td>${animal.poids} kg</td>
                    <td>${animal.nourriture}</td>
                    <td>${animal.quantite} kg</td>
                    <td>${animal.soins || '-'}</td>
                    <td><button class="edit-btn">Modifier</button></td>
                `;

                row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(animal));
                animalsTableBody.appendChild(row);
            });

            showStatusMessage(' Animaux chargés avec succès.');
        })
        .catch(err => {
            console.error(' Erreur chargement animaux :', err);
            showStatusMessage('Erreur chargement animaux', true);
        });
    }

    // Mise à jour
    updateAnimalBtn.addEventListener('click', () => {
        const data = {
            sante: document.getElementById('animalHealth').value.trim(),
            poids: parseFloat(document.getElementById('animalWeight').value),
            nourriture: document.getElementById('animalFood').value.trim(),
            soins: document.getElementById('animalCare').value.trim()
        };

        if (!data.sante || !data.nourriture || !data.soins || isNaN(data.poids) || data.poids <= 0) {
            showStatusMessage(' Champs invalides.', true, true);
            return;
        }

        console.log(' Mise à jour de l\'animal ID :', selectedAnimalId, data);

        fetch(`${apiUrl}/api/vet/animals/${selectedAnimalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) throw new Error('Erreur mise à jour');
            return res.json();
        })
        .then(() => {
            showStatusMessage(' Mise à jour réussie.', false, true);
            editModal.classList.add('hidden');
            loadAnimals();
        })
        .catch(err => {
            console.error(' Erreur update animal :', err);
            showStatusMessage('Erreur mise à jour animal', true, true);
        });
    });

    // Démarrage
    loadAnimals();
});








