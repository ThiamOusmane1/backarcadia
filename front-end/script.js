document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://arcadia-zoo-vcms.onrender.com';

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

  // Fonction pour formater les données JSON en format lisible
  function formatAnimalData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      let formattedText = '';
      
      // Parcourir toutes les propriétés de l'objet
      for (const [key, value] of Object.entries(data)) {
        // Traduire les clés en français et formater
        let frenchKey = '';
        switch(key.toLowerCase()) {
          case 'nom': frenchKey = 'Nom'; break;
          case 'sante': frenchKey = 'Santé'; break;
          case 'poids': frenchKey = 'Poids'; break;
          case 'nourriture': frenchKey = 'Nourriture'; break;
          case 'quantite': frenchKey = 'Quantité'; break;
          case 'soins': frenchKey = 'Soins'; break;
          case 'consultations': frenchKey = 'Consultations'; break;
          case 'habitat': frenchKey = 'Habitat'; break;
          case 'race': frenchKey = 'Race'; break;
          case 'age': frenchKey = 'Âge'; break;
          case 'url': frenchKey = 'Image'; break;
          default: frenchKey = key.charAt(0).toUpperCase() + key.slice(1);
        }
        
        // Formater la valeur selon le type
        let formattedValue = value;
        if (key === 'poids' || key === 'quantite') {
          formattedValue = `${value} kg`;
        } else if (key === 'consultations') {
          formattedValue = `${value} fois`;
        } else if (value === null || value === undefined || value === '') {
          formattedValue = 'Non renseigné';
        }
        
        formattedText += `<strong>${frenchKey} :</strong> ${formattedValue}<br>`;
      }
      
      return formattedText;
    } catch (error) {
      // Si ce n'est pas du JSON valide, retourner le texte tel quel
      return jsonString;
    }
  }

  // Fonction historique améliorée
  window.fetchAnimalHistorique = async function (id) {
    try {
      await updateConsultationCounter(id);
      const res = await fetch(`${apiUrl}/api/animals/${id}/historique`);
      const historique = await res.json();

      if (!Array.isArray(historique) || historique.length === 0) {
        document.getElementById('modal-body').innerHTML = '<p>Aucun historique trouvé.</p>';
      } else {
        const content = historique.map((entry, index) => {
          const date = new Date(entry.date).toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          return `
            <div class="card mb-3">
              <div class="card-header bg-light">
                <h6 class="mb-0"><i class="fas fa-calendar-alt"></i> Modification n°${index + 1}</h6>
                <small class="text-muted">${date}</small>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <h6 class="text-danger">Avant modification :</h6>
                    <div class="border p-2 rounded bg-light">
                      ${formatAnimalData(entry.old_value)}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <h6 class="text-success">Après modification :</h6>
                    <div class="border p-2 rounded bg-light">
                      ${formatAnimalData(entry.new_value)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');
        
        document.getElementById('modal-body').innerHTML = `
          <h5 class="mb-3"><i class="fas fa-history"></i> Historique des modifications</h5>
          ${content}
        `;
      }

      $('#animalModal').modal('show');
    } catch (err) {
      console.error('Erreur historique:', err);
      document.getElementById('modal-body').innerHTML = '<p class="text-danger">Erreur lors de la récupération de l\'historique.</p>';
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
      //console.log('[Consultations] Nouvelle valeur :', data.consultations);
    } catch (err) {
      console.error('Erreur mise à jour compteur:', err);
    }
  }
});






            