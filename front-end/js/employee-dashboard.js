document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000';
    const logoutBtn = document.getElementById('logoutBtn');
    let currentMessageId = null;
  
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      window.location.href = 'index.html';
    });
  
    // 🐾 Animaux
    async function fetchAnimals() {
      try {
        const res = await fetch(`${apiUrl}/api/employee/animals`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
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
                <p><strong>Quantité à donner :</strong> ${animal.quantite || 0} kg</p>
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
  
    // 🥦 Stock
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
                  <button type="submit" class="btn btn-primary btn-sm btn-block">Réapprovisionner</button>
                </form>
              </div>
            </div>
          `;
          container.appendChild(card);
        });
  
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
              fetchStock();
            } else {
              alert('Erreur : ' + result.message);
            }
          });
        });
      } catch (err) {
        console.error("Erreur chargement stock :", err);
      }
    }
  
    // 📬 Messages
    async function fetchMessages() {
        try {
          const res = await fetch(`${apiUrl}/api/contact_messages`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
      
          const messages = await res.json();
          const container = document.getElementById('messageListContainer');
          container.innerHTML = '';
      
          if (!Array.isArray(messages) || messages.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Aucun message pour le moment.</div>';
            return;
          }
      
          messages.forEach(msg => {
            const isReplied = !!msg.reply;
            const replyStatus = isReplied ? 'Répondu' : 'En attente';
            const replyBadge = isReplied ? 'badge-success' : 'badge-warning';
            const formattedDate = new Date(msg.createdAt).toLocaleString('fr-FR');
      
            const messageItem = document.createElement('div');
            messageItem.className = 'list-group-item';
      
            messageItem.innerHTML = `
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="mb-0">${msg.subject}</h5>
                <span class="badge ${replyBadge}">${replyStatus}</span>
              </div>
              <p><strong>De :</strong> ${msg.email}</p>
              <p><strong>Reçu :</strong> ${formattedDate}</p>
              <p>${msg.message}</p>
              ${isReplied
                ? `<div class="alert alert-success"><strong>Réponse :</strong><br>${msg.reply}</div>`
                : `<button class="btn btn-outline-success btn-sm reply-btn" data-id="${msg.id}" data-message="${encodeURIComponent(msg.message)}">✉️ Répondre</button>`
              }
            `;
      
            container.appendChild(messageItem);
          });
      
          // Gestion de la modale
          document.querySelectorAll('.reply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const messageId = btn.getAttribute('data-id');
              const messageContent = decodeURIComponent(btn.getAttribute('data-message'));
              document.getElementById('modalMessageContent').innerText = messageContent;
              document.getElementById('replyText').value = '';
              document.getElementById('sendReplyBtn').setAttribute('data-id', messageId);
              $('#replyModal').modal('show');
            });
          });
      
        } catch (err) {
          console.error("Erreur chargement messages :", err);
        }
      }
      
      document.getElementById('sendReplyBtn').addEventListener('click', async () => {
        const reply = document.getElementById('replyText').value.trim();
        const messageId = document.getElementById('sendReplyBtn').getAttribute('data-id');
      
        if (!reply) {
          alert("Veuillez saisir une réponse.");
          return;
        }
      
        try {
          const res = await fetch(`${apiUrl}/api/contact_messages/${messageId}/reply`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ reply })
          });
      
          const result = await res.json();
          if (res.ok) {
            alert("Réponse enregistrée !");
            $('#replyModal').modal('hide');
            fetchMessages(); // Recharger
          } else {
            alert("Erreur : " + result.message);
          }
        } catch (err) {
          console.error("Erreur réponse :", err);
          alert("Erreur lors de l'envoi de la réponse.");
        }
      });
      
  
    // Init
    fetchAnimals();
    fetchStock();
    fetchMessages();
  });
  
  
  
  