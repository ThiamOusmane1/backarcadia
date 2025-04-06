document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000';
    const logoutBtn = document.getElementById('logoutBtn');
  
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      window.location.href = 'index.html';
    });
  
    async function fetchAnimals() {
      try {
        const res = await fetch(`${apiUrl}/api/employee/animals`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const animals = await res.json();
        const container = document.getElementById('animalCardsContainer');
        container.innerHTML = '';
  
        animals.forEach(animal => {
          const card = document.createElement('div');
          card.className = 'col-md-4 col-sm-6 mb-4';
          card.innerHTML = `
            <div class="card card-animal h-100">
              <img src="pictures/${animal.url}" class="card-img-top" alt="${animal.nom}">
              <div class="card-body">
                <h5 class="card-title">${animal.nom}</h5>
                <p><strong>Habitat :</strong> ${animal.habitat?.nom || 'Inconnu'}</p>
                <p><strong>Nourriture :</strong> ${animal.nourriture}</p>
                <p><strong>Quantité restante (animal) :</strong> ${animal.quantite || 0} kg</p>
                <form class="feed-form">
                  <input type="hidden" name="animal_id" value="${animal.id}">
                  <input type="hidden" name="nourriture" value="${animal.nourriture}">
                  <div class="form-group mt-2">
                    <input type="number" step="0.1" name="quantite" class="form-control" placeholder="Quantité donnée (kg)" required>
                  </div>
                  <button type="submit" class="btn btn-success btn-block mt-2">Donner à manger</button>
                </form>
              </div>
            </div>
          `;
          container.appendChild(card);
        });
  
        // Ajout listener sur chaque formulaire
        document.querySelectorAll('.feed-form').forEach(form => {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.quantite = parseFloat(data.quantite);
  
            try {
              const res = await fetch(`${apiUrl}/api/employee/food`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(data)
              });
              const result = await res.json();
              if (res.ok) {
                alert(result.message + (result.alerte ? `\n ${result.alerte}` : ''));
                fetchAnimals();
              } else {
                alert("Erreur : " + result.message);
              }
            } catch (err) {
              console.error("Erreur enregistrement : ", err);
              alert("Erreur lors de l'enregistrement");
            }
          });
        });
  
      } catch (err) {
        console.error("Erreur chargement animaux :", err);
      }
    }

    // Afficher le stock
async function fetchStock() {
    try {
      const res = await fetch(`${apiUrl}/api/employee/food-stock`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const stocks = await res.json();
      const container = document.getElementById('stockContainer');
      container.innerHTML = '';
  
      stocks.forEach(item => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-3';
        const isLow = item.quantite_stock <= item.seuil_alerte;
        card.innerHTML = `
          <div class="card border-${isLow ? 'danger' : 'success'}">
            <div class="card-body">
              <h5 class="card-title">${item.nourriture}</h5>
              <p><strong>Stock :</strong> ${item.quantite_stock} kg</p>
              <p><strong>Seuil alerte :</strong> ${item.seuil_alerte} kg</p>
              <form class="restock-form">
                <input type="hidden" name="nourriture" value="${item.nourriture}">
                <div class="form-group">
                  <input type="number" step="0.1" name="ajout" class="form-control" placeholder="Ajouter (kg)" required>
                </div>
                <button type="submit" class="btn btn-primary btn-sm btn-block"> Réapprovisionner</button>
              </form>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
  
      // Gérer les soumissions
      document.querySelectorAll('.restock-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(form));
          const res = await fetch(`${apiUrl}/api/employee/food-stock/${data.nourriture}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ ajout: parseFloat(data.ajout) })
          });
          const result = await res.json();
          if (res.ok) {
            alert('Stock mis à jour !');
            fetchStock(); // rafraîchir
          } else {
            alert('Erreur : ' + result.message);
          }
        });
      });
  
    } catch (err) {
      console.error("Erreur chargement stock :", err);
    }
  }
  
  
    async function fetchMessages() {
      try {
        const res = await fetch(`${apiUrl}/api/employee/messages`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const messages = await res.json();
        const container = document.getElementById('messageListContainer');
        container.innerHTML = '';
  
        messages.forEach(msg => {
          const item = document.createElement('div');
          item.className = 'list-group-item card-message';
          item.innerHTML = `
            <h5>${msg.subject}</h5>
            <p><strong>De :</strong> ${msg.email}</p>
            <p>${msg.message}</p>
            ${msg.reply ? `<div class="alert alert-success"><strong>Réponse :</strong> ${msg.reply}</div>` : ''}
          `;
          container.appendChild(item);
        });
      } catch (err) {
        console.error("Erreur chargement messages :", err);
      }
    }
  
    // Initialisation
    fetchAnimals();
    fetchStock();
    fetchMessages();
  });
  
  
  