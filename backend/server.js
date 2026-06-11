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



//RALUCA
const caleMesaje = path.join(__dirname, 'data', 'mock-mesaje_contact.json');
const caleProgramari = path.join(__dirname, 'data', 'mock-programari_clienti.json');
const caleUtilizatori = path.join(__dirname, 'data', 'mock-utilizatori.json');
const caleServicii = path.join(__dirname, 'data', 'mock-catalog_servicii.json');
const caleAbonamente = path.join(__dirname, 'data', 'mock-abonamente_clienti.json');

// ==========================================================================
// RUTA GET: Trimite catalogul de servicii catre frontend
// ==========================================================================
app.get('/api/servicii', (req, res) => {
    try {
        const servicii = fs.existsSync(caleServicii) ? JSON.parse(fs.readFileSync(caleServicii)) : [];
        res.status(200).json(servicii);
    } catch (error) {
        console.error(" Eroare la citirea catalogului:", error);
        res.status(500).json({ error: "Eroare la server." });
    }
});

// ==========================================================================
// RUTA POST: Preluare mesaje contact 
// ==========================================================================
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


// ==========================================================================
// RUTA POST: Preluare programari si abonamente
// ==========================================================================
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


        // Este Abonament sau Programare
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
            
            return res.status(200).json({ message: "Abonament salvat cu succes în mock-abonamente_clienti.json!" });

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
            
            return res.status(200).json({ message: "Programare salvată cu succes în mock-programari_clienti.json!" });
        }

    } catch (error) {
        console.error(" Eroare server:", error);
        res.status(500).json({ error: "Eroare la procesarea datelor." });
    }
});
//END RALUCA

// Pornim serverul
app.listen(3000, () => {
    console.log('Serverul SPA rulează pe http://localhost:3000');
});