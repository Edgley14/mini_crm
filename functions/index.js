const functions = require('firebase-functions');
const twilio = require('twilio');

exports.generateTwilioToken = functions.https.onCall((data, context) => {
  const identity = data && data.identity ? data.identity : 'anonymous';

  const accountSid = functions.config().twilio.account_sid;
  const apiKey = functions.config().twilio.api_key;
  const apiSecret = functions.config().twilio.api_secret;
  const appSid = functions.config().twilio.app_sid;

  if (!accountSid || !apiKey || !apiSecret || !appSid) {
    throw new functions.https.HttpsError('failed-precondition', 'Twilio config missing');
  }

  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
  const voiceGrant = new VoiceGrant({ outgoingApplicationSid: appSid, incomingAllow: true });
  token.addGrant(voiceGrant);

  return { token: token.toJwt() };
});
