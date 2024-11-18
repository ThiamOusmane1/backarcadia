document.addEventListener('DOMContentLoaded', () => {
    const userTableBody = document.querySelector('#userTable tbody');
    const animalTableBody = document.querySelector('#animalTable tbody');
    const logoutBtn = document.getElementById('logoutBtn');
    const addUserBtn = document.getElementById('addUserBtn');
    const addAnimalBtn = document.getElementById('addAnimalBtn');
    const editUserForm = document.getElementById('editUserForm');
    const editAnimalForm = document.getElementById('editAnimalForm');
    const editUserEmail = document.getElementById('editUserEmail');
    const editUserRole = document.getElementById('editUserRole');
    const editAnimalName = document.getElementById('editAnimalName');
    const editAnimalHealth = document.getElementById('editAnimalHealth');
    const editAnimalWeight = document.getElementById('editAnimalWeight');
    const editAnimalFood = document.getElementById('editAnimalFood');
    const apiUrl = 'https://zoo-arcadia-omega.vercel.app';
    let currentUserId, currentAnimalId;

    // Déconnexion
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    });

    // Vérifier le rôle de l'utilisateur
    fetch(`${apiUrl}/api/auth/getUserRole`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.role !== 'admin') {
            alert("Accès refusé");
            window.location.href = 'index.html';
        } else {
            loadUsers();
            loadAnimals();
        }
    })
    .catch(error => console.error("Erreur dans la récupération du rôle :", error));

    // Charger les utilisateurs
    function loadUsers() {
        fetch(`${apiUrl}/api/users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        })
        .then(response => response.json())
        .then(users => {
            userTableBody.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button onclick="editUser('${user.id}', '${user.email}', '${user.role}')">Modifier</button>
                        <button onclick="deleteUser('${user.id}')">Supprimer</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des utilisateurs :", error));
    }

    // Charger les animaux
    function loadAnimals() {
        fetch(`${apiUrl}/api/animals`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        })
        .then(response => response.json())
        .then(animals => {
            animalTableBody.innerHTML = '';
            animals.forEach(animal => {
                const imageUrl = `/pictures/${animal.url}`;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${animal.id}</td>
                    <td><img src="${imageUrl}" class="img-fluid mb-3" alt="${animal.nom}"></td>
                    <td>${animal.nom}</td>
                    <td>${animal.habitat ? animal.habitat.nom : 'Inconnu'}</td>
                    <td>${animal.sante}</td>
                    <td>${animal.poids} kg</td>
                    <td>${animal.nourriture}</td>
                    <td>${animal.quantite} kg</td>
                    <td>${animal.soins}</td>
                    <td>
                        <button onclick="editAnimal('${animal.id}', '${animal.nom}', '${animal.sante}', ${animal.poids}, '${animal.nourriture}')">Modifier</button>
                        <button onclick="deleteAnimal('${animal.id}')">Supprimer</button>
                    </td>
                `;
                animalTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des animaux :", error));
    }

    // Fonction pour éditer un utilisateur
    window.editUser = function(id, email, role) {
        currentUserId = id;
        editUserEmail.value = email;
        editUserRole.value = role;
        editUserForm.style.display = 'block';
    };

    // Envoi des modifications d'un utilisateur
    editUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fetch(`${apiUrl}/api/users/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                email: editUserEmail.value,
                role: editUserRole.value
            })
        })
        .then(response => {
            if (response.ok) {
                loadUsers();
                editUserForm.reset();
                editUserForm.style.display = 'none';
            } else {
                alert("Erreur lors de la mise à jour de l'utilisateur");
            }
        })
        .catch(error => console.error("Erreur lors de la mise à jour :", error));
    });

    // Fonction pour supprimer un utilisateur
    window.deleteUser = function(id) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            fetch(`${apiUrl}/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            })
            .then(response => {
                if (response.ok) {
                    loadUsers();
                } else {
                    alert("Erreur lors de la suppression de l'utilisateur");
                }
            })
            .catch(error => console.error("Erreur lors de la suppression :", error));
        }
    };

    // Fonction pour éditer un animal
    window.editAnimal = function(id, nom, sante, poids, nourriture) {
        currentAnimalId = id;
        editAnimalName.value = nom;
        editAnimalHealth.value = sante;
        editAnimalWeight.value = poids;
        editAnimalFood.value = nourriture;
        editAnimalForm.style.display = 'block';
    };

    // Envoi des modifications d'un animal
    editAnimalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fetch(`${apiUrl}/api/animals/${currentAnimalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                nom: editAnimalName.value,
                sante: editAnimalHealth.value,
                poids: editAnimalWeight.value,
                nourriture: editAnimalFood.value
            })
        })
        .then(response => {
            if (response.ok) {
                loadAnimals();
                editAnimalForm.reset();
                editAnimalForm.style.display = 'none';
            } else {
                alert("Erreur lors de la mise à jour de l'animal");
            }
        })
        .catch(error => console.error("Erreur lors de la mise à jour :", error));
    });

    // Fonction pour supprimer un animal
    window.deleteAnimal = function(id) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet animal ?")) {
            fetch(`${apiUrl}/api/animals/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            })
            .then(response => {
                if (response.ok) {
                    loadAnimals();
                } else {
                    alert("Erreur lors de la suppression de l'animal");
                }
            })
            .catch(error => console.error("Erreur lors de la suppression :", error));
        }
    };
    
    // Gestion des ajouts d'utilisateurs et d'animaux (similaire à ce que tu as déjà)
});
