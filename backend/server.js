const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); //pt criptare parole

// baze de date:
require('dotenv').config(); 
const mysql = require('mysql2/promise'); 

// verificare in consola ca nu mai putem:
console.log("DATE CITITE DE NODE.JS");
console.log("Host:", process.env.DB_HOST);
console.log("Port DB:", process.env.DB_PORT); 

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 27852,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false 
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const app = express();
app.use(cors());
app.use(express.json());


// ==============================================================================================================================
// RUTE TEO — Autentificare & Contul Meu
// ==============================================================================================================================

// am comentat rutele vechi catre fisiere json pentru a le pastra in caz de nevoie
// const usersFilePath = path.join(__dirname, 'data', 'mock-utilizatori.json');
// const programariClientiFilePath = path.join(__dirname, 'data', 'mock-programari_clienti.json');
// const catalogFilePath = path.join(__dirname, 'data', 'mock-catalog_servicii.json');

// ---------------------------------------- RUTA DE LOGIN ---------------------------------------------
app.post('/api/login', async(req, res) => {
    try {
        const { email, parola } = req.body; 

        // extragem utilizatorul din baza de date
        const [rows] = await db.query('SELECT * FROM utilizatori WHERE email = ?', [email]);
        const gasit = rows[0]; // prima data cautam dupa mail

        if (gasit) {
            const parolaE_Corecta = await bcrypt.compare(parola, gasit.parola_criptata);
            if (parolaE_Corecta) {
                res.json({ 
                    success: true, 
                    message: 'Te-ai conectat cu succes!', 
                    utilizator: { 
                        id: gasit.id, 
                        nume: gasit.nume, 
                        email: gasit.email,
                        rol: gasit.rol,
                        telefon: gasit.telefon 
                    } 
                });
            } else {
                res.status(401).json({ success: false, message: 'Email sau parolă incorectă!' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Email sau parolă incorectă!' });
        }
    } catch (eroare) {
        console.error("EROARE LA LOGIN:", eroare);
        res.status(500).json({ success: false, message: 'Eroare internă a serverului.' });
    }
});

// -------------------------------------- RUTA DE CREARE CONT (REGISTER) --------------------------------
app.post('/api/register', async(req, res) => {
    try {
        const { nume, email, telefon, parola } = req.body;

        // verificam daca exista deja emailul in baza de date
        const [utilizatoriExistenti] = await db.query('SELECT id FROM utilizatori WHERE email = ?', [email]);
        
        if (utilizatoriExistenti.length > 0) {
            return res.status(400).json({ success: false, message: 'Acest email este deja folosit!' });
        }

        //criptare parola:
        const saltRounds = 10; // cat de complexa sa fie criptarea
        const parolaCriptataReal = await bcrypt.hash(parola, saltRounds);

        // inseram utilizatorul in tabel
        await db.query(
            'INSERT INTO utilizatori (nume, email, parola_criptata, telefon, rol) VALUES (?, ?, ?, ?, ?)',
            [nume, email, parolaCriptataReal, telefon, 'client']
        );

        res.json({ success: true, message: 'Cont creat cu succes!' });
    } catch (eroare) {
        console.error("EROARE LA INREGISTRARE:", eroare);
        res.status(500).json({ success: false, message: 'Eroare internă a serverului.' });
    }
});

// --------------------------- RUTE PENTRU PAGINA PRINCIPALA (ACASA) --------------------------------
app.get('/api/pachete-combinate', async (req, res) => {
    try {
        // extragem pachetele cu filtru din mysql
        const [pacheteCombinate] = await db.query('SELECT * FROM catalog_servicii WHERE categorie = ?', ['combinat']);

        res.json({ success: true, pachete: pacheteCombinate });
    } catch (eroare) {
        console.error("EROARE LA CITIREA PACHETELOR:", eroare);
        res.status(500).json({ success: false, message: 'Eroare la extragerea pachetelor din baza de date.' });
    }
});

// ------------------------------ RUTE PENTRU "CONTUL MEU" --------------------------------------------
app.get('/api/programari-client/:id', async (req, res) => {
    try {
        const idClient = parseInt(req.params.id); 
        const [programariComplete] = await db.query(`
            SELECT p.id as id_programare, c.nume as nume_serviciu, p.data_rezervare as data, p.ora_rezervare as ora, p.status 
            FROM programari_clienti p 
            JOIN catalog_servicii c ON p.id_serviciu = c.id 
            WHERE p.id_utilizator = ?
        `, [idClient]);

        res.json({ success: true, programari: programariComplete });

    } catch (eroare) {
        console.error("EROARE LA CITIREA PROGRAMARILOR:", eroare);
        res.status(500).json({ success: false, message: 'Eroare internă a serverului.' });
    }
});

// abonamente:
app.get('/api/abonamente-client/:id', async (req, res) => {
    try {
        const idClient = parseInt(req.params.id); 
        const [abonamenteComplete] = await db.query(`
            SELECT a.id as id_abonament, c.nume as nume_abonament, a.data_inceput, a.data_sfarsit, a.status 
            FROM abonamente_clienti a 
            JOIN catalog_servicii c ON a.id_serviciu = c.id 
            WHERE a.id_utilizator = ?
        `, [idClient]);

        res.json({ success: true, abonamente: abonamenteComplete });

    } catch (eroare) {
        console.error("EROARE LA CITIREA ABONAMENTELOR:", eroare);
        res.status(500).json({ success: false, message: 'Eroare interna a serverului.' });
    }
});


// ==============================================================================================================================
// RUTE RALUCA — Contact si Rezervari / Abonamente
// ==============================================================================================================================

// am comentat rutele vechi
// const caleMesaje = path.join(__dirname, 'data', 'mock-mesaje_contact.json');
// const caleProgramari = path.join(__dirname, 'data', 'mock-programari_clienti.json');
// const caleUtilizatori = path.join(__dirname, 'data', 'mock-utilizatori.json');
// const caleServicii = path.join(__dirname, 'data', 'mock-catalog_servicii.json');
// const caleAbonamente = path.join(__dirname, 'data', 'mock-abonamente_clienti.json');

// ---------------------------------------- RUTA POST CONTACT -----------------------------------------
app.post('/api/contact', async (req, res) => { // adaugat async
    const dateClient = req.body;
    
    try {
        let dataBaza = dateClient.data_trimitere ? new Date(dateClient.data_trimitere) : new Date();
        let dataFormatata = dataBaza.toISOString().split('T')[0];

        const numeExpeditor = dateClient.nume || dateClient.nume_expeditor;

        await db.query(
            'INSERT INTO mesaje_contact (nume_expeditor, email, subiect, mesaj, data_trimitere) VALUES (?, ?, ?, ?, ?)',
            [numeExpeditor, dateClient.email, dateClient.subiect, dateClient.mesaj, dataFormatata]
        );
        
        res.status(200).json({ message: "Mesaj contact salvat cu succes pe structura corectă!" });
    } catch (error) {
        console.error(" Eroare la salvarea mesajului de contact:", error);
        res.status(500).json({ error: "Eroare la scrierea în fișier." });
    }
});

// ------------------------------------ RUTA POST PROGRAMARI & ABONAMENTE -----------------------------
app.post('/api/programari', async (req, res) => { // adaugat async
    const dateClient = req.body;
    
    try {
        const [users] = await db.query('SELECT id FROM utilizatori WHERE email = ?', [dateClient.email]);
        if (users.length === 0) return res.status(404).json({ error: "Utilizatorul nu a fost găsit." });
        const id_utilizator = users[0].id;

        const [servicii] = await db.query('SELECT id, tip_achizitie, zile_valabilitate FROM catalog_servicii WHERE nume = ?', [dateClient.pachet_abonament]);
        if (servicii.length === 0) return res.status(404).json({ error: "Serviciul nu există." });
        
        const id_serviciu = servicii[0].id;
        const tip_achizitie = servicii[0].tip_achizitie; 

        // separare logica: Abonament vs Programare
        if (tip_achizitie === "abonament") {
            let dataStart = new Date(dateClient.data_rezervare);
            let zileValabilitate = servicii[0].zile_valabilitate || 30; 
            
            let dataEnd = new Date(dataStart);
            dataEnd.setDate(dataEnd.getDate() + zileValabilitate);
            
            const dataStartStr = dataStart.toISOString().split('T')[0];
            const dataEndStr = dataEnd.toISOString().split('T')[0];

            // inseram abonament
            await db.query(
                'INSERT INTO abonamente_clienti (id_utilizator, id_serviciu, data_inceput, data_sfarsit, status) VALUES (?, ?, ?, ?, ?)',
                [id_utilizator, id_serviciu, dataStartStr, dataEndStr, 'activ']
            );
            
            return res.status(200).json({ message: "Abonament salvat cu succes!" });

        } else {
            const statusPlata = dateClient.status_plata === "platita" ? "platita" : "neplatita";
            
            // inseram programare
            await db.query(
                'INSERT INTO programari_clienti (id_utilizator, id_serviciu, data_rezervare, ora_rezervare, status) VALUES (?, ?, ?, ?, ?)',
                [id_utilizator, id_serviciu, dateClient.data_rezervare, dateClient.ora_rezervare, statusPlata]
            );
            
            return res.status(200).json({ message: "Programare salvată cu succes!" });
        }

    } catch (error) {
        console.error(" Eroare server:", error);
        res.status(500).json({ error: "Eroare la procesarea datelor." });
    }
});


// ==============================================================================================================================
// RUTE RADU — Servicii Fitness & Spa (CRUD Admin)
// ==============================================================================================================================

// const fisierJson = path.join(__dirname, 'data', 'mock-catalog_servicii.json'); // comentat 

// GET /api/servicii — returnează toate serviciile 
app.get('/api/servicii', async (req, res) => { // adaugat async
    try {
        const [servicii] = await db.query('SELECT * FROM catalog_servicii');
        res.status(200).json(servicii);
    } catch (error) {
        console.error("Eroare la citire:", error);
        res.status(500).send("Eroare la citirea bazei de date.");
    }
});

// POST /api/servicii — adauga un serviciu nou din Admin
app.post('/api/servicii', async (req, res) => { // adaugat async
    const serviciuNou = req.body;

    try {
        serviciuNou.pret = Number(serviciuNou.pret);
        serviciuNou.durata_minute = serviciuNou.durata_minute ? Number(serviciuNou.durata_minute) : null;
        serviciuNou.zile_valabilitate = serviciuNou.zile_valabilitate ? Number(serviciuNou.zile_valabilitate) : null;

        // inseram serviciul nou si preluam raspunsul in variabila result
        const [result] = await db.query(
            'INSERT INTO catalog_servicii (nume, descriere, pret, categorie, tip_achizitie, durata_minute, zile_valabilitate) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [serviciuNou.nume, serviciuNou.descriere, serviciuNou.pret, serviciuNou.categorie, serviciuNou.tip_achizitie, serviciuNou.durata_minute, serviciuNou.zile_valabilitate]
        );

        serviciuNou.id = result.insertId; // ii atasam noul id creat in mysql
        res.status(201).json(serviciuNou);
    } catch (error) {
        console.error("Eroare la adaugare:", error);
        res.status(500).send("Eroare la salvarea în baza de date.");
    }
});

// DELETE /api/servicii/:id — sterge un serviciu din Admin
app.delete('/api/servicii/:id', async (req, res) => { // adaugat async
    const idDeSters = Number(req.params.id);

    try {
        await db.query('DELETE FROM catalog_servicii WHERE id = ?', [idDeSters]);
        res.json({ mesaj: "Serviciu șters cu succes!" });
    } catch (error) {
        console.error("Eroare la stergere:", error);
        res.status(500).send("Eroare la salvare.");
    }
});


// ============================================================
// PORNIRE SERVER
// ============================================================
app.listen(3000, () => {
    console.log('✅ Serverul a pornit cu succes!');
    console.log('👉 Accesează: http://localhost:3000');
});