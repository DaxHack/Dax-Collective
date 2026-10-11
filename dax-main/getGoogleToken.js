// getGoogleToken.js
const { google } = require('googleapis');

// Configure OAuth credentials through the local process environment.
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const missing = [
  ['GOOGLE_CLIENT_ID', CLIENT_ID],
  ['GOOGLE_CLIENT_SECRET', CLIENT_SECRET],
  ['GOOGLE_REDIRECT_URI', REDIRECT_URI],
].filter(([, value]) => !value).map(([name]) => name);
if (missing.length) {
  console.error(`Missing required OAuth environment configuration: ${missing.join(', ')}`);
  process.exit(1);
}

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
