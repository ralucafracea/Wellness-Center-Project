const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const path = require('path');

const app = express();
app.use(cors()); 
app.use(express.json()); 

const fisierJson = path.join(__dirname, 'data', 'catalog_servicii.json');

// RUTA GET - Citește JSON-ul și îl trimite pe net
app.get('/api/servicii', (req, res) => {
    fs.readFile(fisierJson, 'utf8', (err, date) => {
        if (err) {
            console.log("Eroare la citire:", err);
            return res.status(500).send("Eroare la citirea bazei de date.");
        }
        res.json(JSON.parse(date));
    });
});

// RUTA POST - Primește un serviciu nou și îl salvează în fișierul JSON
app.post('/api/servicii', (req, res) => {
    const serviciuNou = req.body; // Datele trimise din formularul HTML

    fs.readFile(fisierJson, 'utf8', (err, date) => {
        if (err) {
            return res.status(500).send("Eroare la citirea bazei de date.");
        }

        const listaServicii = JSON.parse(date);

        // Generăm un ID unic (luăm ID-ul ultimului serviciu și adunăm 1)
        const urmatorulId = listaServicii.length > 0 ? listaServicii[listaServicii.length - 1].id + 1 : 1;
        serviciuNou.id = urmatorulId;

        // Transformăm prețul și duratele în numere (din formular vin ca text)
        serviciuNou.pret = Number(serviciuNou.pret);
        serviciuNou.durata_minute = serviciuNou.durata_minute ? Number(serviciuNou.durata_minute) : null;
        serviciuNou.zile_valabilitate = serviciuNou.zile_valabilitate ? Number(serviciuNou.zile_valabilitate) : null;

        // Adăugăm noul serviciu în listă
        listaServicii.push(serviciuNou);

        // Salvăm lista actualizată înapoi în fișierul JSON
        fs.writeFile(fisierJson, JSON.stringify(listaServicii, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send("Eroare la salvarea în baza de date.");
            }
            res.status(201).json(serviciuNou); // Răspundem cu succes
        });
    });
});

// RUTA DELETE - Șterge un serviciu pe baza ID-ului primit în URL
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
// Pornește serverul
app.listen(3000, () => {
    console.log('✅ Serverul backend a pornit cu succes!');
    console.log('👉 Accesează: http://localhost:3000/api/servicii');
});