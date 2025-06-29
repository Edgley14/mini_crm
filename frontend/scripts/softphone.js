import { app, firestore } from './firebase-config.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-functions.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

const functions = getFunctions(app);
const getTwilioToken = httpsCallable(functions, 'generateTwilioToken');

let currentNumber = '';
let device = null;
let connection = null;

function appendNumber(num) {
  currentNumber += num;
  document.getElementById('numberDisplay').value = currentNumber;
}

async function startCall() {
  if (!currentNumber) return alert('Debe ingresar un número');
  try {
    const identity = localStorage.getItem('usuario') || 'anon';
    const resp = await getTwilioToken({ identity });
    const token = resp.data.token;
    device = new Twilio.Device(token, { debug: false });

    device.on('ready', () => {
      connection = device.connect({ To: currentNumber });
      logCall('start');
    });

    device.on('error', err => alert('Twilio error: ' + err.message));
    device.on('disconnect', () => logCall('end'));
  } catch (err) {
    console.error(err);
    alert('Error iniciando llamada');
  }
}

function endCall() {
  if (connection) connection.disconnect();
  currentNumber = '';
  document.getElementById('numberDisplay').value = '';
}

function muteCall() {
  if (connection) connection.mute(!connection.isMuted());
}

function holdCall() {
  alert('Hold no implementado');
}

function transferCall() {
  alert('Transferencia no implementada');
}

async function logCall(status) {
  try {
    await addDoc(collection(firestore, 'llamadas'), {
      numero: currentNumber,
      usuario: localStorage.getItem('usuario') || 'anon',
      status,
      timestamp: Date.now()
    });
  } catch (e) {
    console.error('Error guardando llamada', e);
  }
}

window.appendNumber = appendNumber;
window.startCall = startCall;
window.endCall = endCall;
window.muteCall = muteCall;
window.holdCall = holdCall;
window.transferCall = transferCall;
