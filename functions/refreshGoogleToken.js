// refreshGoogleToken.js

const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

async function refreshAccessToken() {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }
    });

    const { access_token, expires_in } = response.data;
    const newExpiry = Date.now() + expires_in * 1000;

    const envFilePath = '.env';
    let env = fs.readFileSync(envFilePath, 'utf8');

    env = env
      .replace(/GOOGLE_ACCESS_TOKEN=.*/g, `GOOGLE_ACCESS_TOKEN=${access_token}`)
      .replace(/GOOGLE_TOKEN_EXPIRY=.*/g, `GOOGLE_TOKEN_EXPIRY=${newExpiry}`);

    fs.writeFileSync(envFilePath, env);

    console.log('✅ Access token refreshed and .env file updated.');
  } catch (error) {
    console.error('❌ Failed to refresh token:', error.response?.data || error.message);
  }
}

refreshAccessToken();