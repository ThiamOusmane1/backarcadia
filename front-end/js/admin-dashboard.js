document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://arcadia-zoo-vcms.onrender.com';
  const token = localStorage.getItem('authToken');

  const logoutBtn = document.getElementById('logoutBtn');

  // Onglets Bootstrap (liens)
  const userTabLink = document.querySelector('a[href="#tab-users"]');
  const animalTabLink = document.querySelector('a[href="#tab-animals"]');
  const contactTabLink = document.querySelector('a[href="#tab-contact"]');
  const foodLogTabLink = document.querySelector('a[href="#tab-food-logs"]');
  const foodStockTabLink = document.querySelector('a[href="#tab-food-stock"]');

  // Utilisateurs
  const showAddUserFormBtn = document.getElementById('showAddUserForm');
  const addUserForm = document.getElementById('addUserForm');
  const userTableBody = document.querySelector('#userTable tbody');
  const editUserFormModal = document.getElementById('editUserForm');
  const editUserForm = editUserFormModal?.querySelector('form');
  const editUserEmail = document.getElementById('editUserEmail');
  const editUserRole = document.getElementById('editUserRole');
  let currentUserId = null;

  // Animaux
  const showAddAnimalFormBtn = document.getElementById('showAddAnimalForm');
  const addAnimalForm = document.getElementById('addAnimalForm');
  const animalTableBody = document.querySelector('#animalTable tbody');
  const editAnimalModal = document.getElementById('editAnimalForm');
  const editAnimalForm = editAnimalModal?.querySelector('form');
  const editAnimalName = document.getElementById('editAnimalName');
  const editAnimalHealth = document.getElementById('editAnimalHealth');
  const editAnimalWeight = document.getElementById('editAnimalWeight');
  const editAnimalFood = document.getElementById('editAnimalFood');
  const cancelEditAnimalBtn = document.getElementById('cancelEditAnimal');
  let currentAnimalId = null;

  const editAnimalQuantity = document.getElementById('editAnimalQuantity');
  const editAnimalSoins = document.getElementById('editAnimalSoins');
  const editAnimalConsultations = document.getElementById('editAnimalConsultations');
  const editAnimalImage = document.getElementById('editAnimalImage');
  const editAnimalHabitat = document.getElementById('editAnimalHabitat');
  const editAnimalVet = document.getElementById('editAnimalVet');
  const editAnimalIsDeleted = document.getElementById('editAnimalIsDeleted');
  const animalPreviewImage = document.getElementById('animalPreviewImage');

  // Visiteurs, logs et stock
  const contact_messageContainer = document.getElementById('contactMessages');
  const foodLogsContainer = document.getElementById('foodLogs');
  const foodStockContainer = document.getElementById('foodStock');

  // Fonction pour activer un onglet Bootstrap 5
  function showTab(tabLink) {
    const tab = new bootstrap.Tab(tabLink);
    tab.show();
  }

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
        loadContactMessages();
        loadFoodLogs();
        loadFoodStock();
      }
    });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
  });

  function populateSelectOptions(selectId, options, selectedValue) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.id;
      opt.textContent = option.nom;
      if (selectedValue && option.id === selectedValue) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });
  }

  function updateImagePreview(url) {
    if (url) {
      animalPreviewImage.src = `pictures/${url}`;
      animalPreviewImage.style.display = 'block';
    } else {
      animalPreviewImage.style.display = 'none';
    }
  }

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
          row.innerHTML =
            `<td>${user.id}</td>
             <td>${user.email}</td>
             <td>${user.role}</td>
             <td>${user.status}</td>
             <td>
               <button onclick="editUser('${user.id}', '${user.email}', '${user.role}')">Modifier</button>
               <button onclick="deleteUser('${user.id}')">Supprimer</button>
             </td>`;
          userTableBody.appendChild(row);
        });
      });
  }

  showAddUserFormBtn.addEventListener('click', () => {
    // Afficher l'onglet utilisateurs
    showTab(userTabLink);

    // Afficher / masquer le formulaire d'ajout utilisateur
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
    }).then(() => {
      addUserForm.reset();
      addUserForm.classList.add('hidden');
      loadUsers();
    });
  });

  window.editUser = function (id, email, role) {
    currentUserId = id;
    editUserEmail.value = email;
    editUserRole.value = role;

    // Afficher l'onglet utilisateurs
    showTab(userTabLink);

    // Afficher le formulaire d'édition
    editUserFormModal.classList.remove('hidden');
  };

  editUserForm?.addEventListener('submit', (e) => {
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
    }).then(() => {
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
          row.innerHTML =
            `<td>${animal.id}</td>
             <td><img src="pictures/${animal.url}" alt="${animal.nom}" class="img-fluid" /></td>
             <td>${animal.nom}</td>
             <td>${animal.habitat?.nom || 'Inconnu'}</td>
             <td>${animal.sante}</td>
             <td>${animal.poids} kg</td>
             <td>${animal.nourriture}</td>
             <td>${animal.quantite}</td>
             <td>${animal.soins || '-'}</td>
             <td>
               <button onclick="editAnimal('${animal.id}')">Modifier</button>
               <button onclick="deleteAnimal('${animal.id}')">Supprimer</button>
             </td>`;
          animalTableBody.appendChild(row);
        });
      });
  }

  showAddAnimalFormBtn.addEventListener('click', () => {
    // Afficher l'onglet animaux
    showTab(animalTabLink);

    // Afficher / masquer formulaire ajout animal
    addAnimalForm.classList.toggle('hidden');
  });

  window.editAnimal = function (id) {
    currentAnimalId = id;

    // Afficher l'onglet animaux
    showTab(animalTabLink);

    const habitatOptions = [
      { id: '66d362ccd3c7dc07f59ad8fb', nom: 'Savane' },
      { id: '66d362ccd3c7dc07f59ad8fc', nom: 'Jungle' },
      { id: '66d362ccd3c7dc07f59ad8fd', nom: 'Marais' }
    ];
    const vetOptions = [
      { id: 'veterinaire@zoo.com', nom: 'veterinaire@zoo.com' }
    ];

    fetch(`${apiUrl}/api/admin/animals/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(animal => {
        editAnimalName.value = animal.nom;
        editAnimalHealth.value = animal.sante;
        editAnimalWeight.value = animal.poids;
        editAnimalFood.value = animal.nourriture;
        editAnimalQuantity.value = animal.quantite || 0;
        editAnimalSoins.value = animal.soins || '';
        editAnimalConsultations.value = animal.consultations || 0;
        editAnimalImage.value = animal.url || '';
        editAnimalIsDeleted.checked = animal.isDeleted === 1;
        populateSelectOptions("editAnimalHabitat", habitatOptions, animal.habitat_id);
        populateSelectOptions("editAnimalVet", vetOptions, animal.vet_id);
        updateImagePreview(animal.url);
        editAnimalModal.classList.remove('hidden');
      });
  };

  editAnimalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedAnimal = {
      nom: editAnimalName.value,
      sante: editAnimalHealth.value,
      poids: parseFloat(editAnimalWeight.value),
      nourriture: editAnimalFood.value,
      quantite: parseFloat(editAnimalQuantity.value),
      soins: editAnimalSoins.value,
      consultations: parseInt(editAnimalConsultations.value),
      url: editAnimalImage.value,
      habitat_id: editAnimalHabitat.value,
      vet_id: editAnimalVet.value || null,
      isDeleted: editAnimalIsDeleted.checked ? 1 : 0
    };

    fetch(`${apiUrl}/api/admin/animals/${currentAnimalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedAnimal)
    }).then(() => {
      editAnimalModal.classList.add('hidden');
      loadAnimals();
    });
  });

  cancelEditAnimalBtn?.addEventListener('click', () => {
    editAnimalModal.classList.add('hidden');
  });

  editAnimalImage.addEventListener('input', (e) => {
    updateImagePreview(e.target.value);
  });

  window.deleteAnimal = function (id) {
    if (confirm("Supprimer cet animal ?")) {
      fetch(`${apiUrl}/api/admin/animals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => loadAnimals());
    }
  };

  // === MESSAGES CONTACT ===
  function loadContactMessages() {
    const tableBody = document.querySelector('#contactMessagesTable tbody');
    fetch(`${apiUrl}/api/employee/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(messages => {
        tableBody.innerHTML = '';
        messages.forEach(msg => {
          const row = document.createElement('tr');
          row.innerHTML =
            `<td>${msg.nom}</td>
             <td>${msg.email}</td>
             <td>${msg.message}</td>`;
          tableBody.appendChild(row);
        });
      });
  }

  // === LOGS NOURRITURE ===
  function loadFoodLogs() {
    const tableBody = document.querySelector('#foodLogsTable tbody');
    fetch(`${apiUrl}/api/employee/food-log`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(logs => {
        tableBody.innerHTML = '';
        logs.forEach(log => {
          const row = document.createElement('tr');
          row.innerHTML =
            `<td>${log.date}</td>
             <td>${log.time}</td>
             <td>${log.employee?.email || 'Inconnu'}</td>
             <td>${log.animal?.nom || 'Inconnu'}</td>
             <td>${log.nourriture}</td>
             <td>${log.quantite}</td>`;
          tableBody.appendChild(row);
        });
      });
  }

  // === STOCK NOURRITURE ===
  function loadFoodStock() {
    const tableBody = document.querySelector('#foodStockTable tbody');
    fetch(`${apiUrl}/api/employee/food-stock`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(stock => {
        tableBody.innerHTML = '';
        stock.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML =
            `<td>${item.nourriture}</td>
             <td>${item.quantite}</td>`;
          tableBody.appendChild(row);
        });
      });
  }

});
