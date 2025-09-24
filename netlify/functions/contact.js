// netlify/functions/contact.js
const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // ✅ Vérifie la méthode
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // ✅ Initialise Resend DANS la fonction (accès garanti à process.env)
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = JSON.parse(event.body);
    const { name, email, phone, service, message } = body;

    if (!name || !email || !service || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Champs requis manquants' })
      };
    }

    // 1. Email à toi
    await resend.emails.send({
      from: 'Contact <onboarding@resend.dev>', // ✅ domaine vérifié par Resend
      to: 'contact.atitech@gmail.com',
      subject: `Nouveau message de ${name} - ${service}`,
      html: `
        <h3>Nouveau message via le site ATI Tech Gabon</h3>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || 'Non fourni'}</p>
        <p><strong>Service demandé :</strong> ${service}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    // 2. Accusé au client
    await resend.emails.send({
      from: 'ATI Tech Gabon <onboarding@resend.dev>', // ✅ même domaine vérifié
      to: email,
      subject: '✅ Merci pour votre message – ATI Tech Gabon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #0066ff;">Bonjour ${name},</h2>
          <p>Merci pour votre message concernant <strong>${service}</strong>.</p>
          <p>Nous avons bien reçu votre demande et vous répondrons dans les plus brefs délais.</p>
          <p>Cordialement,<br>
          <strong>L’équipe ATI Tech Gabon</strong></p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 0.9em; color: #666;">
            Ce message a été envoyé automatiquement. Merci de ne pas y répondre.
          </p>
        </div>
      `
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Erreur Resend:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message || 'Erreur inconnue' })
    };
  }
};
