document.addEventListener('DOMContentLoaded', () => {
  console.log('[DEBUG] vet-dashboard.js chargé');

  const apiUrl = 'https://arcadia-back-olive.vercel.app/';

  const animalsTableBody = document.querySelector('#animalsTable tbody');
  const logoutBtn = document.getElementById('logoutBtn');
  const editModal = document.getElementById('editModal');
  const updateAnimalBtn = document.getElementById('updateAnimalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelEditAnimal = document.getElementById('cancelEditAnimal');
  const statusMessage = document.getElementById('statusMessage');
  const modalStatusMessage = document.getElementById('modalStatusMessage');

  let selectedAnimalId = null;

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
  });

  function showStatusMessage(message, isError = false, isModal = false) {
    const el = isModal ? modalStatusMessage : statusMessage;
    el.textContent = message;
    el.style.color = isError ? 'red' : 'green';
    setTimeout(() => { el.textContent = ''; }, 3000);
  }

  function openEditModal(animal) {
    selectedAnimalId = animal.id;
    document.getElementById('animalHealth').value = animal.sante || '';
    document.getElementById('animalWeight').value = animal.poids || '';
    document.getElementById('animalFood').value = animal.nourriture || '';
    document.getElementById('animalCare').value = animal.soins || '';
    editModal.classList.remove('hidden');
    console.log('[DEBUG] Ouverture modale pour :', animal.nom);
  }

  function loadAnimals() {
    console.log('[DEBUG] Envoi GET vers /api/vet/animals');
    showStatusMessage('Chargement des animaux...');

    fetch(`${apiUrl}/api/vet/animals`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Erreur serveur');
      return res.json();
    })
    .then(response => {
      const animals = response.animals;
      console.log('[DEBUG] Données API :', animals);

      if (!Array.isArray(animals)) return;

      animalsTableBody.innerHTML = '';
      animals.forEach(animal => {
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
          <td>
						<button class="edit-btn">Modifier</button>
						<button class="history-btn">Historique</button>
					</td>`;

        row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(animal));
        animalsTableBody.appendChild(row);
				row.querySelector('.history-btn').addEventListener('click', () => openHistoriqueModal(animal.id));

      });

      showStatusMessage('Animaux chargés avec succès.');
    })
    .catch(err => {
      console.error('[ERROR] Chargement animaux :', err);
      showStatusMessage('Erreur de chargement.', true);
    });
  }

  updateAnimalBtn.addEventListener('click', () => {
    const data = {
      sante: document.getElementById('animalHealth').value.trim(),
      poids: parseFloat(document.getElementById('animalWeight').value),
      nourriture: document.getElementById('animalFood').value.trim(),
      soins: document.getElementById('animalCare').value.trim()
    };

    if (!data.sante || !data.nourriture || !data.soins || isNaN(data.poids) || data.poids <= 0) {
      showStatusMessage('Champs invalides', true, true);
      return;
    }

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
      showStatusMessage('Mise à jour réussie.', false, true);
      editModal.classList.add('hidden');
      loadAnimals();
    })
    .catch(err => {
      console.error('[ERROR] Mise à jour animal :', err);
      showStatusMessage('Erreur mise à jour', true, true);
    });
  });

  closeModalBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
  });

  cancelEditAnimal.addEventListener('click', () => {
    editModal.classList.add('hidden');
  });
  // historique
	function openHistoriqueModal(animalId) {
    console.log('[DEBUG] Récupération historique pour animal ID :', animalId);
  
    fetch(`${apiUrl}/api/vet/historique/${animalId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const historiqueList = document.getElementById('historiqueList');
        const modal = document.getElementById('historiqueModal');
  
        historiqueList.innerHTML = '';
  
        if (!data.historique || data.historique.length === 0) {
          historiqueList.innerHTML = '<li>Aucun historique trouvé.</li>';
        } else {
          data.historique.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'historique-entry';
  
            const oldValue = JSON.parse(entry.old_value || '{}');
            const newValue = JSON.parse(entry.new_value || '{}');
  
            li.innerHTML = `
              <div><strong> ${new Date(entry.date).toLocaleString()}</strong></div>
              <div><span class="badge badge-info">${entry.action}</span></div>
              <div class="mt-2"><strong> Avant :</strong>
                <pre class="bg-light p-2 border rounded">${Object.entries(oldValue).map(([k, v]) => `${k}: ${v}`).join('\n')}</pre>
              </div>
              <div><strong> Après :</strong>
                <pre class="bg-light p-2 border rounded">${Object.entries(newValue).map(([k, v]) => `${k}: ${v}`).join('\n')}</pre>
              </div>
              <hr/>
            `;
  
            historiqueList.appendChild(li);
          });
        }
  
        modal.classList.remove('hidden');
      })
      .catch(err => {
        console.error('[ERROR] Chargement historique :', err);
        alert("Erreur lors du chargement de l'historique.");
      });
  }
  
	
	// Fermeture modale historique
	const closeHistoriqueModal = document.getElementById('closeHistoriqueModal');
	if (closeHistoriqueModal) {
		closeHistoriqueModal.addEventListener('click', () => {
			document.getElementById('historiqueModal').classList.add('hidden');
		});
	}
	
  loadAnimals();
});

  








