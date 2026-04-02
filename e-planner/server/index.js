require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(express.json());

app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.post('/auth/google/verify', async (req, res) => {
  const { tokenId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // Di sini Anda akan menyimpan atau mengambil pengguna dari database
    // dan membuat sesi untuk mereka.
    req.login(payload, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to login' });
        }
        res.json(payload);
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
});

app.get('/api/user', (req, res) => {
    res.send(req.user);
});

app.post('/api/logout', (req, res) => {
    req.logout();
    res.send({ message: 'Logged out' });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
