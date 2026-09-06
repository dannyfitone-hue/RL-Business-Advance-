
const form = document.getElementById('leadForm');
const msg = document.getElementById('formMessage');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = 'Sending your consultation request...';
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const r = await fetch('/api/book', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Unable to send');
    form.reset();
    msg.textContent = 'Request received. We’ll contact you to schedule your free consultation.';
  } catch (err) {
    msg.textContent = 'Your form is ready, but email delivery needs to be connected in Vercel before launch.';
  }
});
