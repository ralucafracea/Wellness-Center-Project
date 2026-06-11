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

// ---------------------------------------- RUTA DE LOGIN ---------------------------------------------
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

// -------------------------------------- RUTA DE CREARE CONT (REGISTER) --------------------------------
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

// --------------------------- RUTE PENTRU "CONTUL MEU" --------------------------------------------


// Căile către noile noastre fișiere JSON (Baza de date)
const programariFilePath = path.join(__dirname, 'data', 'mock-programari_clienti.json');
const catalogFilePath = path.join(__dirname, 'data', 'mock-catalog_servicii.json');

// RUTA GET: Aducem programările unui client pe baza ID-ului său
app.get('/api/programari-client/:id', (req, res) => {
    try {
        const idClient = parseInt(req.params.id); // Luăm ID-ul din URL și îl facem număr
        
        // 1. Citim programările și catalogul
        const programariRaw = fs.readFileSync(programariFilePath, 'utf8');
        const programari = JSON.parse(programariRaw);

        const catalogRaw = fs.readFileSync(catalogFilePath, 'utf8');
        const catalog = JSON.parse(catalogRaw);

        // 2. Filtrăm doar programările acestui client
        const programarileLui = programari.filter(p => p.id_utilizator === idClient);

        // 3. Facem "JOIN-ul": Adăugăm numele serviciului din catalog la fiecare programare
        const programariComplete = programarileLui.map(prog => {
            // Căutăm serviciul în catalog după id_serviciu
            const serviciu = catalog.find(s => s.id === prog.id_serviciu);
            
            return {
                id_programare: prog.id,
                nume_serviciu: serviciu ? serviciu.nume : 'Serviciu necunoscut',
                data: prog.data_rezervare,
                ora: prog.ora_rezervare,
                status: prog.status
            };
        });

        // Trimitem lista completă către frontend
        res.json({ success: true, programari: programariComplete });

    } catch (eroare) {
        console.error("EROARE LA CITIREA PROGRAMARILOR:", eroare);
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