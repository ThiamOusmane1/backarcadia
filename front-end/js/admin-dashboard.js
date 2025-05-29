document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://arcadia-zoo-vcms.onrender.com';
  const token = localStorage.getItem('authToken');

  const logoutBtn = document.getElementById('logoutBtn');

  // Onglets Bootstrap
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

  const contact_messageContainer = document.getElementById('contactMessages');
  const foodLogsContainer = document.getElementById('foodLogs');
  const foodStockContainer = document.getElementById('foodStock');

  // Options vétérinaires (à adapter selon vos données)
  const vetOptions = [
    { id: '1', nom: 'Dr. Martin' },
    { id: '2', nom: 'Dr. Dupont' }
  ];

  function showTab(tabLink) {
    // Utiliser l'API Bootstrap native au lieu de jQuery
    if (tabLink) {
      const tab = new bootstrap.Tab(tabLink);
      tab.show();
    }
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
    })
    .catch(error => {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
      window.location.href = 'index.html';
    });

  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
  });

  function populateSelectOptions(selectId, options, selectedValue) {
    const select = document.getElementById(selectId);
    if (!select) return;
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
    if (animalPreviewImage) {
      if (url) {
        animalPreviewImage.src = `pictures/${url}`;
        animalPreviewImage.style.display = 'block';
      } else {
        animalPreviewImage.style.display = 'none';
      }
    }
  }

  function loadUsers() {
    fetch(`${apiUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(users => {
        if (userTableBody) {
          userTableBody.innerHTML = '';
          users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML =
              `<td>${user.id}</td>
               <td>${user.email}</td>
               <td>${user.role}</td>
               <td>${user.status}</td>
               <td>
                 <button class="btn btn-sm btn-primary me-1" onclick="editUser('${user.id}', '${user.email}', '${user.role}')">Modifier</button>
                 <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Supprimer</button>
               </td>`;
            userTableBody.appendChild(row);
          });
        }
      })
      .catch(error => console.error('Erreur chargement utilisateurs:', error));
  }

  showAddUserFormBtn?.addEventListener('click', () => {
    showTab(userTabLink);
    if (addUserForm) {
      addUserForm.classList.toggle('d-none');
      addUserForm.reset();
    }
  });

  addUserForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newUserEmail')?.value;
    const role = document.getElementById('newUserRole')?.value;

    if (email && role) {
      fetch(`${apiUrl}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email, role })
      }).then(() => {
        addUserForm.reset();
        addUserForm.classList.add('d-none');
        alert('Utilisateur créé avec succès !');
        loadUsers();
      }).catch(error => console.error('Erreur création utilisateur:', error));
    }
  });

  window.editUser = function (id, email, role) {
    currentUserId = id;
    if (editUserEmail && editUserRole && editUserFormModal) {
      editUserEmail.value = email;
      editUserRole.value = role;
      showTab(userTabLink);
      editUserFormModal.classList.remove('d-none');
    }
  };

  editUserForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (editUserEmail && editUserRole && currentUserId) {
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
        editUserFormModal.classList.add('d-none');
        alert('Utilisateur mis à jour avec succès !');
        loadUsers();
      }).catch(error => console.error('Erreur modification utilisateur:', error));
    }
  });

  window.deleteUser = function (id) {
    if (confirm("Supprimer cet utilisateur ?")) {
      fetch(`${apiUrl}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => loadUsers())
        .catch(error => console.error('Erreur suppression utilisateur:', error));
    }
  };

  function loadAnimals() {
    fetch(`${apiUrl}/api/admin/animals`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(animals => {
        if (animalTableBody) {
          animalTableBody.innerHTML = '';
          animals.forEach(animal => {
            const row = document.createElement('tr');
            row.innerHTML =
              `<td>${animal.id}</td>
               <td><img src="pictures/${animal.url}" alt="${animal.nom}" class="img-fluid" style="max-width: 50px;" /></td>
               <td>${animal.nom}</td>
               <td>${animal.habitat?.nom || 'Inconnu'}</td>
               <td>${animal.sante}</td>
               <td>${animal.poids} kg</td>
               <td>${animal.nourriture}</td>
               <td>${animal.quantite}</td>
               <td>${animal.soins || '-'}</td>
               <td>
                 <button class="btn btn-sm btn-primary me-1" onclick="editAnimal('${animal.id}')">Modifier</button>
                 <button class="btn btn-sm btn-danger" onclick="deleteAnimal('${animal.id}')">Supprimer</button>
               </td>`;
            animalTableBody.appendChild(row);
          });
        }
      })
      .catch(error => console.error('Erreur chargement animaux:', error));
  }

  showAddAnimalFormBtn?.addEventListener('click', () => {
    showTab(animalTabLink);
    if (addAnimalForm) {
      addAnimalForm.classList.toggle('d-none');
      addAnimalForm.reset();
    }
  });

  window.editAnimal = function (id) {
    currentAnimalId = id;
    showTab(animalTabLink);

    const habitatOptions = [
      { id: '66d362ccd3c7dc07f59ad8fb', nom: 'Savane' },
      { id: '66d362ccd3c7dc07f59ad8fc', nom: 'Jungle' },
      { id: '66d362ccd3c7dc07f59ad8fd', nom: 'Marais' }
    ];

    fetch(`${apiUrl}/api/admin/animals/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(animal => {
        if (editAnimalName && editAnimalHealth && editAnimalWeight && editAnimalFood) {
          editAnimalName.value = animal.nom;
          editAnimalHealth.value = animal.sante;
          editAnimalWeight.value = animal.poids;
          editAnimalFood.value = animal.nourriture;
          
          if (editAnimalQuantity) editAnimalQuantity.value = animal.quantite || 0;
          if (editAnimalSoins) editAnimalSoins.value = animal.soins || '';
          if (editAnimalConsultations) editAnimalConsultations.value = animal.consultations || 0;
          if (editAnimalImage) editAnimalImage.value = animal.url || '';
          if (editAnimalIsDeleted) editAnimalIsDeleted.checked = animal.isDeleted === 1;
          
          populateSelectOptions("editAnimalHabitat", habitatOptions, animal.habitat_id);
          populateSelectOptions("editAnimalVet", vetOptions, animal.vet_id);
          updateImagePreview(animal.url);
          
          if (editAnimalModal) {
            editAnimalModal.classList.remove('hidden');
            editAnimalModal.classList.remove('d-none');
          }
        }
      })
      .catch(error => console.error('Erreur chargement animal:', error));
  };

  editAnimalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (editAnimalName && editAnimalHealth && editAnimalWeight && editAnimalFood && currentAnimalId) {
      const updatedAnimal = {
        nom: editAnimalName.value,
        sante: editAnimalHealth.value,
        poids: parseFloat(editAnimalWeight.value),
        nourriture: editAnimalFood.value,
        quantite: parseFloat(editAnimalQuantity?.value || 0),
        soins: editAnimalSoins?.value || '',
        consultations: parseInt(editAnimalConsultations?.value || 0),
        url: editAnimalImage?.value || '',
        habitat_id: editAnimalHabitat?.value || null,
        vet_id: editAnimalVet?.value || null,
        isDeleted: editAnimalIsDeleted?.checked ? 1 : 0
      };

      fetch(`${apiUrl}/api/admin/animals/${currentAnimalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedAnimal)
      }).then(() => {
        if (editAnimalModal) {
          editAnimalModal.classList.add('hidden');
          editAnimalModal.classList.add('d-none');
        }
        loadAnimals();
      }).catch(error => console.error('Erreur modification animal:', error));
    }
  });

  cancelEditAnimalBtn?.addEventListener('click', () => {
    if (editAnimalModal) {
      editAnimalModal.classList.add('hidden');
      editAnimalModal.classList.add('d-none');
    }
  });

  editAnimalImage?.addEventListener('input', (e) => {
    updateImagePreview(e.target.value);
  });

  window.deleteAnimal = function (id) {
    if (confirm("Supprimer cet animal ?")) {
      fetch(`${apiUrl}/api/admin/animals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => loadAnimals())
        .catch(error => console.error('Erreur suppression animal:', error));
    }
  };

  function loadContactMessages() {
    const tableBody = document.querySelector('#contactMessagesTable tbody');
    if (tableBody) {
      fetch(`${apiUrl}/api/employee/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(messages => {
          tableBody.innerHTML = '';
          messages.forEach(msg => {
            const row = document.createElement('tr');
            row.innerHTML =
               `<td>${msg.email}</td>
               <td>${msg.message}</td>`;
            tableBody.appendChild(row);
          });
        })
        .catch(error => console.error('Erreur chargement messages:', error));
    }
  }

  function loadFoodLogs() {
    const tableBody = document.querySelector('#foodLogsTable tbody');
    if (tableBody) {
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
        })
        .catch(error => console.error('Erreur chargement logs:', error));
    }
  }

  function loadFoodStock() {
    const tableBody = document.querySelector('#foodStockTable tbody');
    if (tableBody) {
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
               <td>${item.quantite_stock}</td>`;
            tableBody.appendChild(row);
          });
        })
        .catch(error => console.error('Erreur chargement stock:', error));
    }
  }
});