# 🌿 Tirra Wellness Center

O aplicație web Full-Stack dezvoltată pentru gestionarea completă a unui centru de Spa & Fitness. Proiectul include un sistem de programări, gestionarea abonamentelor, un panou de administrare și autentificare securizată a utilizatorilor, fiind conectat la o bază de date MySQL găzduită în cloud.

## ✨ Funcționalități Principale

### 👥 Pentru Clienți:
* **Autentificare Securizată:** Creare cont și logare cu parole criptate (hashing prin `bcrypt`). Protecție împotriva accesului neautorizat.
* **Catalog de Servicii:** Vizualizarea pachetelor de Spa, Fitness și Pachete Combinate direct pe pagina principală.
* **Sistem de Rezervări:** Posibilitatea de a face programări pentru ședințe individuale sau de a achiziționa abonamente pe mai multe zile.
* **Contul Meu:** Un dashboard personalizat unde clientul își poate vedea istoricul programărilor, statusul plăților și abonamentele active.
* **Formular de Contact:** Trimiterea de mesaje direct către administrația centrului.
* **UI/UX Modern:** Modale personalizate (fără alerte standard de browser), design responsiv și meniu hamburger pentru dispozitive mobile.

### ⚙️ Pentru Administratori (Panoul de Admin):
* **Gestiune Servicii (CRUD):** Adăugarea, vizualizarea și ștergerea serviciilor din catalog (Spa, Fitness, Combinat).
* **Controlul Prețurilor și Valabilității:** Setarea duratei în minute, a prețului și a zilelor de valabilitate pentru pachete.

---

## 🛠️ Tehnologii Folosite

**Frontend:**
* HTML5 & CSS3 (Design responsiv)
* Vanilla JavaScript (Comunicare asincronă cu API-ul prin `fetch`)

**Backend:**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) (Crearea API-ului RESTful)
* `bcrypt` (Securizarea parolelor)
* `cors`, `dotenv` (Managementul securității și al variabilelor de mediu)

**Baza de Date:**
* **MySQL** (Găzduită în cloud prin [Aiven](https://aiven.io/))
* `mysql2/promise` (Interogări asincrone folosind Pool de conexiuni)

---

## 🗄️ Structura Bazei de Date
Proiectul folosește o bază de date relațională complexă, cu foreign keys și reguli de cascade, structurată astfel:
1.  `utilizatori` (Clienți și Admini)
2.  `catalog_servicii` (Pachete spa, fitness, combinate)
3.  `programari_clienti` (Programări punctuale cu dată și oră)
4.  `abonamente_clienti` (Abonamente cu dată de început și sfârșit)
5.  `mesaje_contact` (Mesajele primite din formularul de contact)

---

## 🚀 Instalare și Rulare Locală

Pentru a rula acest proiect (backend-ul) pe mașina locală, urmați pașii de mai jos:

### 1. Clonarea proiectului
```bash
git clone [https://github.com/numele-vostru/wellness-center.git](https://github.com/numele-vostru/wellness-center.git)
cd wellness-center/backend
