const express = require('express');
const path = require('path');
const app = express();

// Middleware pour traiter les données POST
app.use(express.urlencoded({ extended: true }));

// Définir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Configurer le moteur de vues EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de vérification des heures de travail
function checkBusinessHours(req, res, next) {
  const Time = new Date();
  const day = Time.getDay();//0=dimanche,...,6=samedi
  const hour = Time.getHours();

  if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
    next();
  } else {
    res.status(403).send(`
      <h1 style="text-align: center; color: red;">Accès refusé</h1>
      <p style="text-align: center;">L'application est disponible uniquement pendant les heures de travail (du lundi au vendredi, de 9h à 17h).</p>
    `);
  }
}
app.use(checkBusinessHours);

// Routes GET
app.get('/', (req, res) => {
  res.render('home', { title: 'Page d\'accueil' });
});

app.get('/services', (req, res) => {
  res.render('services', { title: 'Nos Services' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Nous Contacter' });
});

// Route POST pour le formulaire
app.post('/send-message', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Message reçu de ${name} et d'adresse email (${email}) : ${message}`);
  res.send(`
    <h1 style="text-align: center; margin-top: 20px;">Merci pour votre message !</h1>
    <p style="text-align: center;">Nous vous répondrons rapidement.</p>
    <p style="text-align: center;"><a href="/">Retour à l'accueil</a></p>
  `);
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
