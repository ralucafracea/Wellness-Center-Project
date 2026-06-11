const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================
// 1. RUTELE LUI TEO — Autentificare (Login & Register)
// ============================================================

const usersFilePath = path.join(__dirname, 'data', 'mock-utilizatori.json');

// POST /api/login — conectare cont
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

// POST /api/register — creare cont nou
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


// ============================================================
// 2. RUTELE COLEGULUI — Contact & Programări
// ============================================================

// POST /api/contact — salvează un mesaj nou
app.post('/api/contact', (req, res) => {
    const mesajNou = req.body;

    const caleFisier = './Data/mock-contact.json';
    const mesaje = JSON.parse(fs.readFileSync(caleFisier));

    mesaje.push(mesajNou);

    fs.writeFileSync(caleFisier, JSON.stringify(mesaje, null, 2));

    res.status(200).json({ message: "Mesaj salvat cu succes!" });
});

// POST /api/programari — salvează o programare nouă
app.post('/api/programari', (req, res) => {
    const programareNoua = req.body;

    const caleFisier = './Data/mock-programari.json';
    const programari = JSON.parse(fs.readFileSync(caleFisier));

    programari.push(programareNoua);

    fs.writeFileSync(caleFisier, JSON.stringify(programari, null, 2));

    res.status(200).json({ message: "Programare salvată cu succes!" });
});


// ============================================================
// 3. RUTELE TALE — Servicii Fitness & Spa (CRUD Admin)
// ============================================================

const fisierJson = path.join(__dirname, 'data', 'mock-catalog_servicii.json');

// GET /api/servicii — returnează toate serviciile
app.get('/api/servicii', (req, res) => {
    fs.readFile(fisierJson, 'utf8', (err, date) => {
        if (err) {
            console.log("Eroare la citire:", err);
            return res.status(500).send("Eroare la citirea bazei de date.");
        }
        res.json(JSON.parse(date));
    });
});

// POST /api/servicii — adaugă un serviciu nou din Admin
app.post('/api/servicii', (req, res) => {
    const serviciuNou = req.body;

    fs.readFile(fisierJson, 'utf8', (err, date) => {
        if (err) {
            return res.status(500).send("Eroare la citirea bazei de date.");
        }

        const listaServicii = JSON.parse(date);

        const urmatorulId = listaServicii.length > 0 ? listaServicii[listaServicii.length - 1].id + 1 : 1;
        serviciuNou.id = urmatorulId;

        serviciuNou.pret = Number(serviciuNou.pret);
        serviciuNou.durata_minute = serviciuNou.durata_minute ? Number(serviciuNou.durata_minute) : null;
        serviciuNou.zile_valabilitate = serviciuNou.zile_valabilitate ? Number(serviciuNou.zile_valabilitate) : null;

        listaServicii.push(serviciuNou);

        fs.writeFile(fisierJson, JSON.stringify(listaServicii, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send("Eroare la salvarea în baza de date.");
            }
            res.status(201).json(serviciuNou);
        });
    });
});

// DELETE /api/servicii/:id — șterge un serviciu din Admin
app.delete('/api/servicii/:id', (req, res) => {
    const idDeSters = Number(req.params.id);

    fs.readFile(fisierJson, 'utf8', (err, date) => {
        if (err) return res.status(500).send("Eroare la citire.");

        let listaServicii = JSON.parse(date);
        listaServicii = listaServicii.filter(s => s.id !== idDeSters);

        fs.writeFile(fisierJson, JSON.stringify(listaServicii, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).send("Eroare la salvare.");
            res.json({ mesaj: "Serviciu șters cu succes!" });
        });
    });
});


// ============================================================
// PORNIRE SERVER
// ============================================================
app.listen(3000, () => {
    console.log('✅ Serverul a pornit cu succes!');
    console.log('👉 Accesează: http://localhost:3000');
});