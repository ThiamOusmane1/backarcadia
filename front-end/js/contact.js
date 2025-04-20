document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
  
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
  
      try {
        const res = await fetch('http://localhost:3000/api/contact_messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, subject, message })
        });
  
        const result = await res.json();
  
        if (res.ok) {
          alert('✅ Message envoyé avec succès !');
          form.reset();
          form.classList.remove('was-validated');
        } else {
          alert('❌ Erreur : ' + result.message);
        }
      } catch (err) {
        console.error('Erreur lors de l\'envoi du message :', err);
        alert('⚠️ Une erreur est survenue. Veuillez réessayer plus tard.');
      }
    });
  });
  