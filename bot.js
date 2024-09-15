const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function iniciarBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  // Exibir QR Code no terminal para autenticação
  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update;
    if (qr) {
      qrcode.generate(qr, { small: true }); // Gera o QR code no terminal
    }

    if (connection === 'open') {
      console.log('Selfie conectado ao WhatsApp!');
    }
  });

  // Responder a novas mensagens
  sock.ev.on('messages.upsert', async (msg) => {
    const mensagem = msg.messages[0];
    if (!mensagem.message) return;

    const texto = mensagem.message.conversation;
    console.log('Mensagem recebida: ', texto);

    // Resposta automática para qualquer mensagem recebida
    await sock.sendMessage(mensagem.key.remoteJid, { text: 'Olá! Eu sou o Selfie-Bot! Em que posso ajudar?' });
  });

  // Salvar as credenciais de autenticação
  sock.ev.on('creds.update', saveState);
}

iniciarBot();
