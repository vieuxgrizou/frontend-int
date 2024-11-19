const express = require('express');
const cors = require('cors');
const sitesRoutes = require('./routes/sites');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://intensify.io',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/sites', sitesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});