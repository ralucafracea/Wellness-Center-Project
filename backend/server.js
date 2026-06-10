const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================
// RUTELE COLEGEI — Contact & Programări
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
// RUTELE MELE — Servicii Fitness
// ============================================================

const fisierJson = path.join(__dirname, '..', 'data', 'catalog_servicii.json');

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

// POST /api/servicii — adaugă un serviciu nou
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

// DELETE /api/servicii/:id — șterge un serviciu după ID
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