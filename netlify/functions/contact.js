// netlify/functions/contact.js
const { Resend } = require('resend');

exports.handler = async (event) => {
  // Vérifie la méthode HTTP
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse les données du formulaire
    const { name, email, phone, service, message } = JSON.parse(event.body);

    // Validation basique
    if (!name || !email || !service || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Tous les champs requis ne sont pas remplis.' })
      };
    }

    // Initialise Resend avec la clé d'API (fournie par Netlify)
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1. Envoie le message à toi
    await resend.emails.send({
      from: 'Contact <onboarding@resend.dev>', // ✅ domaine officiel Resend
      to: 'contact.atitech@gmail.com',
      subject: `📩 Nouveau message de ${name} - ${service}`,
      html: `
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || 'Non fourni'}</p>
        <p><strong>Service :</strong> ${service}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    // 2. Envoie l'accusé au client
    await resend.emails.send({
      from: 'ATI Tech Gabon <onboarding@resend.dev>', // ✅ même domaine fiable
      to: email,
      subject: '✅ Merci pour votre message – ATI Tech Gabon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #0066ff;">Bonjour ${name},</h2>
          <p>Merci pour votre message concernant <strong>${service}</strong>.</p>
          <p>Nous avons bien reçu votre demande et vous répondrons dans les plus brefs délais.</p>
          <p>Cordialement,<br><strong>L’équipe ATI Tech Gabon</strong></p>
        </div>
      `
    });

    // Réponse succès
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('❌ Erreur Resend:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message || 'Erreur inconnue' })
    };
  }
};
