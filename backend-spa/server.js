const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

// RUTA POST: Preluare mesaje contact
app.post('/api/contact', (req, res) => {
    const mesajNou = req.body;
    
    // Citim fișierul existent din folderul tău "Data"
    const caleFisier = './Data/mock-contact.json';
    const mesaje = JSON.parse(fs.readFileSync(caleFisier));
    
    mesaje.push(mesajNou);
    
    // Salvăm înapoi în fișier
    fs.writeFileSync(caleFisier, JSON.stringify(mesaje, null, 2));
    
    res.status(200).json({ message: "Mesaj salvat cu succes!" });
});

// RUTA POST: Preluare programări
app.post('/api/programari', (req, res) => {
    const programareNoua = req.body;
    
    // Citim fișierul de programări
    const caleFisier = './Data/mock-programari.json';
    const programari = JSON.parse(fs.readFileSync(caleFisier));
    
    // Adăugăm rezervarea nouă
    programari.push(programareNoua);
    
    // Salvăm înapoi în fișier
    fs.writeFileSync(caleFisier, JSON.stringify(programari, null, 2));
    
    res.status(200).json({ message: "Programare salvată cu succes!" });
});

// Pornim serverul
app.listen(3000, () => {
    console.log('Serverul SPA rulează pe http://localhost:3000');
});