import express from 'express';
import nodemailer from 'nodemailer';
const router = express.Router();

router.post('/', async (req, res) => {
  const {
    nome,
    email,
    whatsapp,
    cidade,
    tipoAtuacao,
    outroAtuacao,
    servico,
    marcaSite,
    link,
    motivo,
    outroMotivo,
    objetivo,
    prazo,
    investimento,
    pacote,
    mensagem
  } = req.body;

  // Monta o corpo do e-mail
  const html = `
    <h2>Novo formulário de interesse</h2>
    <p><b>Nome:</b> ${nome}</p>
    <p><b>E-mail:</b> ${email}</p>
    <p><b>WhatsApp:</b> ${whatsapp}</p>
    <p><b>Cidade/Estado/País:</b> ${cidade}</p>
    <p><b>Tipo de atuação:</b> ${tipoAtuacao} ${outroAtuacao ? '(' + outroAtuacao + ')' : ''}</p>
    <p><b>Serviço principal:</b> ${servico}</p>
    <p><b>Marca/Site:</b> ${marcaSite}</p>
    <p><b>Link:</b> ${link}</p>
    <p><b>Motivo:</b> ${motivo} ${outroMotivo ? '(' + outroMotivo + ')' : ''}</p>
    <p><b>Objetivo:</b> ${objetivo}</p>
    <p><b>Prazo:</b> ${prazo}</p>
    <p><b>Investimento:</b> ${investimento}</p>
    <p><b>Pacote de interesse:</b> ${pacote}</p>
    <p><b>Mensagem extra:</b> ${mensagem}</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `Svicero Studio <${process.env.SMTP_USER}>`,
      to: 'hello@svicerostudio.com.br',
      subject: 'Novo formulário de interesse',
      html
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    res.status(500).json({ ok: false, error: 'Erro ao enviar e-mail.' });
  }
});

export default router;
