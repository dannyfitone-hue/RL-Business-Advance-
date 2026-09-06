
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const {name,business,phone,email,instagram,package: pkg,goals} = req.body || {};
  if (!name || !business || !phone || !email) return res.status(400).json({error:'Missing required fields'});
  const key = process.env.RESEND_API_KEY;
  const notify = process.env.BOOKING_NOTIFY_EMAIL;
  const from = process.env.FROM_EMAIL;
  if (!key || !notify || !from) return res.status(503).json({error:'Email environment variables not configured'});
  const html = `
    <h2>New RL Business Advance Consultation Request</h2>
    <p><b>Name:</b> ${name}</p><p><b>Business:</b> ${business}</p>
    <p><b>Phone:</b> ${phone}</p><p><b>Email:</b> ${email}</p>
    <p><b>Instagram:</b> ${instagram || '-'}</p><p><b>Package:</b> ${pkg || '-'}</p>
    <p><b>Goals:</b><br>${goals || '-'}</p>`;
  const r = await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
    body:JSON.stringify({from,to:[notify],subject:`New Consultation — ${business}`,html})
  });
  if (!r.ok) return res.status(502).json({error:'Email provider error'});
  return res.status(200).json({ok:true});
}
