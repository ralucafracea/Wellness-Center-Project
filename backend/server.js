const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); //pt criptare parole

const app = express();
app.use(cors());
app.use(express.json());


// ==============================================================================================================================
// 1. RUTELE LUI TEO — Autentificare & Contul Meu
// ==============================================================================================================================

const usersFilePath = path.join(__dirname, 'data', 'mock-utilizatori.json');
const programariClientiFilePath = path.join(__dirname, 'data', 'mock-programari_clienti.json');
const catalogFilePath = path.join(__dirname, 'data', 'mock-catalog_servicii.json');

// ---------------------------------------- RUTA DE LOGIN ---------------------------------------------
app.post('/api/login', async(req, res) => {
    try {
        const { email, parola } = req.body; 

        const usersRaw = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(usersRaw);

        const gasit = users.find(u => u.email === email); // prima data cautam dupa mail

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

        const usersRaw = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(usersRaw);

        const emailExista = users.find(u => u.email === email);
        if (emailExista) {
            return res.status(400).json({ success: false, message: 'Acest email este deja folosit!' });
        }

        //criptare parola:
        const saltRounds = 10; // cat de complexa sa fie criptarea
        const parolaCriptataReal = await bcrypt.hash(parola, saltRounds);

        const nouId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        
        const utilizatorNou = {
            id: nouId,
            nume: nume,
            email: email,
            parola_criptata: parolaCriptataReal, 
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

// --------------------------- RUTE PENTRU PAGINA PRINCIPALA (ACASA) --------------------------------
// RUTA GET: Aducem doar pachetele din categoria "combinat"
app.get('/api/pachete-combinate', (req, res) => {
    try {
        const catalogRaw = fs.readFileSync(catalogFilePath, 'utf8');
        const catalog = JSON.parse(catalogRaw);

        // Filtrăm catalogul și păstrăm doar ce ne interesează
        const pacheteCombinate = catalog.filter(serviciu => serviciu.categorie === 'combinat');

        res.json({ success: true, pachete: pacheteCombinate });
    } catch (eroare) {
        console.error("EROARE LA CITIREA PACHETELOR:", eroare);
        }
    });
// --------------------------- RUTE PENTRU "CONTUL MEU" --------------------------------------------
app.get('/api/programari-client/:id', (req, res) => {
    try {
        const idClient = parseInt(req.params.id); 
        
        const programariRaw = fs.readFileSync(programariClientiFilePath, 'utf8');
        const programari = JSON.parse(programariRaw);

        const catalogRaw = fs.readFileSync(catalogFilePath, 'utf8');
        const catalog = JSON.parse(catalogRaw);

        const programarileLui = programari.filter(p => p.id_utilizator === idClient);

        const programariComplete = programarileLui.map(prog => {
            const serviciu = catalog.find(s => s.id === prog.id_serviciu);
            
            return {
                id_programare: prog.id,
                nume_serviciu: serviciu ? serviciu.nume : 'Serviciu necunoscut',
                data: prog.data_rezervare,
                ora: prog.ora_rezervare,
                status: prog.status
            };
        });

        res.json({ success: true, programari: programariComplete });

    } catch (eroare) {
        console.error("EROARE LA CITIREA PROGRAMARILOR:", eroare);
        res.status(500).json({ success: false, message: 'Eroare internă a serverului.' });
    }
});


// ==============================================================================================================================
// 2. RUTELE LUI RALUCA — Contact & Rezervări / Abonamente
// ==============================================================================================================================

const caleMesaje = path.join(__dirname, 'data', 'mock-mesaje_contact.json');
const caleProgramari = path.join(__dirname, 'data', 'mock-programari_clienti.json');
const caleUtilizatori = path.join(__dirname, 'data', 'mock-utilizatori.json');
const caleServicii = path.join(__dirname, 'data', 'mock-catalog_servicii.json');
const caleAbonamente = path.join(__dirname, 'data', 'mock-abonamente_clienti.json');

// ---------------------------------------- RUTA POST CONTACT -----------------------------------------
app.post('/api/contact', (req, res) => {
    const dateClient = req.body;
    
    try {
        const mesaje = fs.existsSync(caleMesaje) ? JSON.parse(fs.readFileSync(caleMesaje)) : [];
        const noulId = mesaje.length > 0 ? mesaje[mesaje.length - 1].id + 1 : 1;

        let dataBaza = dateClient.data_trimitere ? new Date(dateClient.data_trimitere) : new Date();
        let dataFormatata = dataBaza.toISOString().split('T')[0];

        const mesajStructuraCorecta = {
            id: noulId,
            nume_expeditor: dateClient.nume || dateClient.nume_expeditor, 
            email: dateClient.email,
            subiect: dateClient.subiect,
            mesaj: dateClient.mesaj,
            data_trimitere: dataFormatata
        };
        
        mesaje.push(mesajStructuraCorecta);
        fs.writeFileSync(caleMesaje, JSON.stringify(mesaje, null, 2));
        
        res.status(200).json({ message: "Mesaj contact salvat cu succes pe structura corectă!" });
    } catch (error) {
        console.error(" Eroare la salvarea mesajului de contact:", error);
        res.status(500).json({ error: "Eroare la scrierea în fișier." });
    }
});

// ------------------------------------ RUTA POST PROGRAMĂRI & ABONAMENTE -----------------------------
app.post('/api/programari', (req, res) => {
    const dateClient = req.body;
    
    try {
        const utilizatori = fs.existsSync(caleUtilizatori) ? JSON.parse(fs.readFileSync(caleUtilizatori)) : [];
        const userFound = utilizatori.find(u => u.email === dateClient.email);
        if (!userFound) return res.status(404).json({ error: "Utilizatorul nu a fost găsit." });
        const id_utilizator = userFound.id;

        const servicii = fs.existsSync(caleServicii) ? JSON.parse(fs.readFileSync(caleServicii)) : [];
        const serviciuFound = servicii.find(s => s.nume === dateClient.pachet_abonament);
        if (!serviciuFound) return res.status(404).json({ error: "Serviciul nu există." });
        
        const id_serviciu = serviciuFound.id;
        const tip_achizitie = serviciuFound.tip_achizitie; 

        // Separare logică: Abonament vs Programare
        if (tip_achizitie === "abonament") {
            const abonamente = fs.existsSync(caleAbonamente) ? JSON.parse(fs.readFileSync(caleAbonamente)) : [];
            const noulId = abonamente.length > 0 ? abonamente[abonamente.length - 1].id + 1 : 1;

            let dataStart = new Date(dateClient.data_rezervare);
            let zileValabilitate = serviciuFound.zile_valabilitate || 30; 
            
            let dataEnd = new Date(dataStart);
            dataEnd.setDate(dataEnd.getDate() + zileValabilitate);
            
            const dataStartStr = dataStart.toISOString().split('T')[0];
            const dataEndStr = dataEnd.toISOString().split('T')[0];

            const noulAbonament = {
                id: noulId,
                id_utilizator: id_utilizator,
                id_serviciu: id_serviciu,
                data_inceput: dataStartStr,
                data_sfarsit: dataEndStr,
                status: "activ" 
            };

            abonamente.push(noulAbonament);
            fs.writeFileSync(caleAbonamente, JSON.stringify(abonamente, null, 2));
            
            return res.status(200).json({ message: "Abonament salvat cu succes!" });

        } else {
            const programari = fs.existsSync(caleProgramari) ? JSON.parse(fs.readFileSync(caleProgramari)) : [];
            const noulId = programari.length > 0 ? programari[programari.length - 1].id + 1 : 1;
            
            const nouaProgramare = {
                id: noulId,
                id_utilizator: id_utilizator,
                id_serviciu: id_serviciu,
                data_rezervare: dateClient.data_rezervare,
                ora_rezervare: dateClient.ora_rezervare,
                status: dateClient.status_plata === "platita" ? "platita" : "neplatita"
            };
            
            programari.push(nouaProgramare);
            fs.writeFileSync(caleProgramari, JSON.stringify(programari, null, 2));
            
            return res.status(200).json({ message: "Programare salvată cu succes!" });
        }

    } catch (error) {
        console.error(" Eroare server:", error);
        res.status(500).json({ error: "Eroare la procesarea datelor." });
    }
});


// ==============================================================================================================================
// 3. RUTELE TALE (RADU) — Servicii Fitness & Spa (CRUD Admin)
// ==============================================================================================================================

const fisierJson = path.join(__dirname, 'data', 'mock-catalog_servicii.json');

// GET /api/servicii — returnează toate serviciile (Actualizat pentru siguranță cu varianta Ralucăi)
app.get('/api/servicii', (req, res) => {
    try {
        const servicii = fs.existsSync(fisierJson) ? JSON.parse(fs.readFileSync(fisierJson, 'utf8')) : [];
        res.status(200).json(servicii);
    } catch (error) {
        console.error("Eroare la citire:", error);
        res.status(500).send("Eroare la citirea bazei de date.");
    }
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