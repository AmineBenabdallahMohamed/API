const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./config/student-upf-firebase-adminsdk-r7dm9-4b2c706783.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.send('API Express.js liée à Firebase est en fonctionnement');
});

app.post('/add-student', async (req, res) => {
  try {
    const { nom, prenom, age, niveauScolaire } = req.body;
    const docRef = await db.collection('students').add({
      nom,
      prenom,
      age,
      niveauScolaire,
    });
    res.status(200).json({
      message: 'Étudiant ajouté avec succès',
      id: docRef.id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get('/api/get-students', async (req, res) => {
  try {
    const snapshot = await db.collection('students').get();
    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get('/api/get-student/:id', async (req, res) => {
  const studentId = req.params.id;
  try {
    const doc = await db.collection('students').doc(studentId).get();
    if (doc.exists) {
      res.status(200).json(doc.data());
    } else {
      res.status(404).json({ message: 'Étudiant non trouvé' });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
