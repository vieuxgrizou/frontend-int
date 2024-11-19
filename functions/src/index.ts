import * as functions from 'firebase-functions/v2';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; // Import morgan pour logger les requêtes HTTP
declare module 'morgan'; // Ajout de la déclaration pour éviter l'erreur TypeScript
import './config/firebase';
import { sitesRouter } from './routes/sites';
import { personasRouter } from './routes/personas';
import { commentsRouter } from './routes/comments';
import { auth } from './middleware/auth';
import { validateApiKey } from './middleware/apiKey'; // Correction du chemin
import { aiRouter } from './routes/ai'; // Assurez-vous que l'importation est correcte

const app = express();

const allowedOrigins = [
  'https://intensify.io',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://api-g64uqov7ba-ew.a.run.app',
  'https://sb1-egv1rl.netlify.app', // Ajout de l'URL Netlify
  'https://sunny-zuccutto-a6c2a8.netlify.app'
];

// Configuration CORS avancée via middleware Express
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
  maxAge: 86400 // Cache CORS pour 24 heures
}));

// Logger des requêtes avec morgan
app.use(morgan('dev'));

app.use(express.json()); // Pour analyser les JSON du corps de la requête
app.use((req, _, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Middleware d'authentification global
app.use((req, res, next) => {
  if (req.originalUrl.includes('/auth/login') || req.originalUrl.includes('/auth/register')) {
    next();
  } else {
    validateApiKey(req, res, () => auth(req, res, next).catch(next));
  }
});

// Routes publiques
import authRouter from './routes/auth'; // Ajoutez un fichier de routes auth si nécessaire
app.use('/api/auth', authRouter);

// Routes protégées
app.use('/api/sites', sitesRouter);
app.use('/api/personas', personasRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/ai', aiRouter); // Ajouter la route pour AI

// Catch-all pour les routes non définies
app.use((_, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Exportation de la fonction Cloud Function
export const api = functions.https.onRequest(
  {
    region: 'europe-west1',
    cors: true, // Activer CORS de manière basique
  },
  app
);
