const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // pt autentificare (teo)
const app = express();

app.use(cors());
app.use(express.json());


// ==============================================================================================================================
// TEO
// ==============================================================================================================================

const usersFilePath = path.join(__dirname, 'data', 'mock-utilizatori.json');

// 1. RUTA DE LOGIN
app.post('/api/login', (req, res) => {
    try {
        const { email, parola } = req.body; 

        const usersRaw = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(usersRaw);

        const gasit = users.find(u => u.email === email && u.parola_criptata === parola);

        if (gasit) {
            res.json({ 
                success: true, 
                message: 'Te-ai conectat cu succes!', 
                utilizator: { 
                    id: gasit.id, 
                    nume: gasit.nume, 
                    email: gasit.email,
                    rol: gasit.rol 
                } 
            });
        } else {
            res.status(401).json({ success: false, message: 'Email sau parolă incorectă!' });
        }
    } catch (eroare) {
        console.error("EROARE LA LOGIN:", eroare);
        res.status(500).json({ success: false, message: 'Eroare internă a serverului.' });
    }
});

// 2. RUTA DE CREARE CONT (REGISTER)
app.post('/api/register', (req, res) => {
    try {
        const { nume, email, telefon, parola } = req.body;

        const usersRaw = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(usersRaw);

        const emailExista = users.find(u => u.email === email);
        if (emailExista) {
            return res.status(400).json({ success: false, message: 'Acest email este deja folosit!' });
        }

        const nouId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        
        const utilizatorNou = {
            id: nouId,
            nume: nume,
            email: email,
            parola_criptata: parola, 
            telefon: telefon,
            rol: "client" 
        };

        users.push(utilizatorNou);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        res.json({ success: true, message: 'Cont creat cu succes!' });
    } catch (eroare) {
        console.error("EROARE LA INREGISTRARE:", eroare);
        res.status(500).json({ success: false, message: 'Eroare internă a serverului.' });
    }
});

// ==============================================================================================================================
// END TEO
// ==============================================================================================================================


// Pornim serverul
app.listen(3000, () => {
    console.log('Serverul SPA rulează pe http://localhost:3000');
});