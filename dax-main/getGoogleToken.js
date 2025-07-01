// getGoogleToken.js
const { google } = require('googleapis');

// Replace with your OAuth 2.0 credentials:
const CLIENT_ID     = '891150375514-1j92g1ta8jb96t8abk4bop2l5s5mvadk.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI  = 'http://localhost:5678/rest/oauth2-credential/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Ask for offline access to get a refresh token; force consent to get a token even if previously granted
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/photoslibrary.readonly',
  ],
});

console.log('🔗 Authorize this app by visiting this url:\n', authUrl);
console.log('\n📋 After approving, paste the code here and press Enter:');

// Read the code from stdin, then exchange for tokens
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (code) => {
  code = code.trim();
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Tokens acquired:');
    console.log(JSON.stringify(tokens, null, 2));
    console.log('\n▶️  Copy the value of "refresh_token" into your .env');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error retrieving access token', err);
    process.exit(1);
  }
});