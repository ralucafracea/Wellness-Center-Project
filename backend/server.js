const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // pt autentificare (teo)
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

// ==============================================================================================================================
// TEO
// ==============================================================================================================================

//RUTE DE AUTENTIFICARE (Conectare si creare cont) ----------------------------------------------

// CAlea catre fisierul cu utilizatori:
const usersFilePath = path.join(__dirname, 'data', 'mock-users.json');

// 1. RUTA DE LOGIN (Conectare)
app.post('/api/login', (req, res) => {
    // Luăm emailul și parola din ce a trimis formularul de pe frontend
    const { email, parola } = req.body; 

    // Citim fișierul tău cu utilizatori
    const usersRaw = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(usersRaw);

    // Căutăm dacă există un utilizator cu acest email ȘI această parolă
    const gasit = users.find(u => u.email === email && u.parola === parola);

    if (gasit) {
        // Succes! Trimitem înapoi și datele lui (fără parolă) ca să le salvezi pe frontend
        res.json({ 
            success: true, 
            message: 'Te-ai conectat cu succes!', 
            utilizator: { id: gasit.id, nume: gasit.nume, email: gasit.email } 
        });
    } else {
        // Eșec
        res.status(401).json({ 
            success: false, 
            message: 'Email sau parolă incorectă!' 
        });
    }
});

// 2. RUTA DE REGISTER (Creare cont nou)
app.post('/api/register', (req, res) => {
    const { nume, email, telefon, parola } = req.body;

    const usersRaw = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(usersRaw);

    // Verificăm dacă nu cumva emailul e deja folosit
    const emailExista = users.find(u => u.email === email);
    if (emailExista) {
        return res.status(400).json({ success: false, message: 'Acest email este deja folosit!' });
    }

    // Creăm un ID nou (următorul număr la rând)
    const nouId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    
    // Construim noul utilizator
    const utilizatorNou = {
        id: nouId,
        nume: nume,
        email: email,
        telefon: telefon,
        parola: parola
    };

    // Îl adăugăm în listă și salvăm modificarea înapoi în fișierul JSON
    users.push(utilizatorNou);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.json({ success: true, message: 'Cont creat cu succes!' });
});

// ==============================================================================================================================
// END TEO
// ==============================================================================================================================

// Pornim serverul
app.listen(3000, () => {
    console.log('Serverul SPA rulează pe http://localhost:3000');
});