document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000'; // ou Vercel
    const token = localStorage.getItem('authToken');
  
    const logoutBtn = document.getElementById('logoutBtn');
  
    const showAddUserFormBtn = document.getElementById('showAddUserForm');
    const addUserForm = document.getElementById('addUserForm');
    const userTableBody = document.querySelector('#userTable tbody');
    const editUserFormModal = document.getElementById('editUserForm');
    const editUserForm = editUserFormModal.querySelector('form');
    const editUserEmail = document.getElementById('editUserEmail');
    const editUserRole = document.getElementById('editUserRole');
    let currentUserId = null;
  
    const showAddAnimalFormBtn = document.getElementById('showAddAnimalForm');
    const addAnimalForm = document.getElementById('addAnimalForm');
    const animalTableBody = document.querySelector('#animalTable tbody');
  
    const editAnimalModal = document.getElementById('editAnimalForm');
    const editAnimalForm = editAnimalModal.querySelector('form');
    const editAnimalName = document.getElementById('editAnimalName');
    const editAnimalHealth = document.getElementById('editAnimalHealth');
    const editAnimalWeight = document.getElementById('editAnimalWeight');
    const editAnimalFood = document.getElementById('editAnimalFood');
    const cancelEditAnimalBtn = document.getElementById('cancelEditAnimal');
    let currentAnimalId = null;
  
    // Vérification du rôle
    fetch(`${apiUrl}/api/auth/getUserRole`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.role !== 'admin') {
          alert('Accès interdit');
          window.location.href = 'index.html';
        } else {
          loadUsers();
          loadAnimals();
        }
      });
  
    // Déconnexion
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      window.location.href = 'index.html';
    });
  
    // === UTILISATEURS ===
    function loadUsers() {
      fetch(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
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
        });
    }
  
    showAddUserFormBtn.addEventListener('click', () => {
      addUserForm.classList.toggle('hidden');
    });
  
    addUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newUserEmail').value;
      const role = document.getElementById('newUserRole').value;
  
      fetch(`${apiUrl}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email, role })
      })
        .then(() => {
          addUserForm.reset();
          addUserForm.classList.add('hidden');
          loadUsers();
        });
    });
  
    window.editUser = function (id, email, role) {
      currentUserId = id;
      editUserEmail.value = email;
      editUserRole.value = role;
      editUserFormModal.classList.remove('hidden');
    };
  
    editUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      fetch(`${apiUrl}/api/admin/users/${currentUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: editUserEmail.value,
          role: editUserRole.value
        })
      })
        .then(() => {
          editUserFormModal.classList.add('hidden');
          loadUsers();
        });
    });
  
    window.deleteUser = function (id) {
      if (confirm("Supprimer cet utilisateur ?")) {
        fetch(`${apiUrl}/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }).then(() => loadUsers());
      }
    };
  
    // === ANIMAUX ===
    function loadAnimals() {
      fetch(`${apiUrl}/api/admin/animals`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(animals => {
          animalTableBody.innerHTML = '';
          animals.forEach(animal => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${animal.id}</td>
              <td><img src="pictures/${animal.url}" alt="${animal.nom}" class="img-fluid" /></td>
              <td>${animal.nom}</td>
              <td>${animal.habitat?.nom || 'Inconnu'}</td>
              <td>${animal.sante}</td>
              <td>${animal.poids} kg</td>
              <td>${animal.nourriture}</td>
              <td>${animal.quantite}</td>
              <td>${animal.soins || '-'}</td>
              <td>
                <button onclick="editAnimal('${animal.id}', '${animal.nom}', '${animal.sante}', ${animal.poids}, '${animal.nourriture}')">Modifier</button>
                <button onclick="deleteAnimal('${animal.id}')">Supprimer</button>
              </td>
            `;
            animalTableBody.appendChild(row);
          });
        });
    }
  
    showAddAnimalFormBtn.addEventListener('click', () => {
      addAnimalForm.classList.toggle('hidden');
    });
  
    addAnimalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        nom: document.getElementById('newAnimalName').value,
        sante: document.getElementById('newAnimalHealth').value,
        poids: parseFloat(document.getElementById('newAnimalWeight').value),
        nourriture: document.getElementById('newAnimalFood').value,
        quantite: parseFloat(document.getElementById('newAnimalQuantity').value),
        url: document.getElementById('newAnimalUrl').value
      };
  
      fetch(`${apiUrl}/api/admin/animals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
        .then(() => {
          addAnimalForm.reset();
          addAnimalForm.classList.add('hidden');
          loadAnimals();
        });
    });
  
    window.editAnimal = function (id, nom, sante, poids, nourriture) {
      currentAnimalId = id;
      editAnimalName.value = nom;
      editAnimalHealth.value = sante;
      editAnimalWeight.value = poids;
      editAnimalFood.value = nourriture;
      editAnimalModal.classList.remove('hidden');
    };
  
    editAnimalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      fetch(`${apiUrl}/api/admin/animals/${currentAnimalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nom: editAnimalName.value,
          sante: editAnimalHealth.value,
          poids: parseFloat(editAnimalWeight.value),
          nourriture: editAnimalFood.value
        })
      })
        .then(() => {
          editAnimalModal.classList.add('hidden');
          loadAnimals();
        });
    });
  
    cancelEditAnimalBtn.addEventListener('click', () => {
      editAnimalModal.classList.add('hidden');
    });
  
    window.deleteAnimal = function (id) {
      if (confirm("Supprimer cet animal ?")) {
        fetch(`${apiUrl}/api/admin/animals/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }).then(() => loadAnimals());
      }
    };
  });
  
  
