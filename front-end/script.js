document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://backarcadia.vercel.app/';
  
    // Déclenchement auto si ?habitat=... présent dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const habitatParam = urlParams.get('habitat');
    if (habitatParam) {
      fetchAnimals(habitatParam);
    }
  
    // Quand on clique sur une carte d'habitat manuellement
    document.querySelectorAll('.ha-card').forEach(card => {
      card.addEventListener('click', () => {
        const habitat = card.dataset.habitat;
        fetchAnimals(habitat);
      });
    });
  
    // Fonction pour charger les animaux
    async function fetchAnimals(habitatName) {
      try {
        const res = await fetch(`${apiUrl}/api/habitats/${habitatName}`);
        const habitat = await res.json();
        const animalGallery = document.getElementById('animalGallery');
        animalGallery.innerHTML = '';
  
        if (!habitat.animaux || habitat.animaux.length === 0) {
          animalGallery.innerHTML = '<p>Aucun animal trouvé pour cet habitat.</p>';
          return;
        }
  
        habitat.animaux.forEach(animal => {
          const card = document.createElement('div');
          card.className = 'col-md-4 mb-4';
          card.innerHTML = `
            <div class="card">
              <img src="pictures/${animal.url}" class="card-img-top" alt="${animal.nom}">
              <div class="card-body">
                <h5 class="card-title">${animal.nom}</h5>
                <button class="btn btn-info btn-sm mr-2" onclick="fetchAnimalDetails('${animal.id}')">Détails</button>
                <button class="btn btn-secondary btn-sm" onclick="fetchAnimalHistorique('${animal.id}')">Historique</button>
              </div>
            </div>
          `;
          animalGallery.appendChild(card);
        });
  
        // Scroll automatique jusqu'à la galerie
        animalGallery.scrollIntoView({ behavior: 'smooth' });
  
      } catch (err) {
        console.error('Erreur fetch habitat :', err);
      }
    }
  
    // Fonction détails
    window.fetchAnimalDetails = async function (id) {
      try {
        await updateConsultationCounter(id);
        const res = await fetch(`${apiUrl}/api/animals/${id}`);
        const animal = await res.json();
  
        document.getElementById('modal-body').innerHTML = `
          <img src="pictures/${animal.url}" class="img-fluid mb-3" alt="${animal.nom}">
          <h5>${animal.nom}</h5>
          <p><strong>Santé :</strong> ${animal.sante || '-'}</p>
          <p><strong>Poids :</strong> ${animal.poids || '-'} kg</p>
          <p><strong>Nourriture :</strong> ${animal.nourriture || '-'}</p>
          <p><strong>Quantité :</strong> ${animal.quantite || '-'} kg</p>
          <p><strong>Soins :</strong> ${animal.soins || '-'}</p>
          <p><strong>Consultations :</strong> ${animal.consultations || 0}</p>
        `;
        $('#animalModal').modal('show');
      } catch (err) {
        console.error('Erreur détails:', err);
      }
    };
  
    // Fonction historique
    window.fetchAnimalHistorique = async function (id) {
      try {
        await updateConsultationCounter(id);
        const res = await fetch(`${apiUrl}/api/animals/${id}/historique`);
        const historique = await res.json();
  
        if (!Array.isArray(historique) || historique.length === 0) {
          document.getElementById('modal-body').innerHTML = '<p>Aucun historique trouvé.</p>';
        } else {
          const content = historique.map(entry => `
            <div>
              <strong>${new Date(entry.date).toLocaleString()}</strong><br>
              <b>Avant :</b> <pre>${entry.old_value}</pre>
              <b>Après :</b> <pre>${entry.new_value}</pre>
              <hr>
            </div>
          `).join('');
          document.getElementById('modal-body').innerHTML = content;
        }
  
        $('#animalModal').modal('show');
      } catch (err) {
        console.error('Erreur historique:', err);
        document.getElementById('modal-body').innerHTML = '<p>Erreur lors de la récupération de l\'historique.</p>';
        $('#animalModal').modal('show');
      }
    };
  
    // Fonction compteur consultations
    async function updateConsultationCounter(animalId) {
      try {
        const response = await fetch(`${apiUrl}/api/animals/update-counter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: animalId })
        });
        const data = await response.json();
        console.log('[Consultations] Nouvelle valeur :', data.consultations);
      } catch (err) {
        console.error('Erreur mise à jour compteur:', err);
      }
    }
  });
  






            