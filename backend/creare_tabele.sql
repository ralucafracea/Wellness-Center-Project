CREATE DATABASE IF NOT EXISTS tirra_wellness_db;
USE tirra_wellness_db;

CREATE TABLE utilizatori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nume VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    parola_criptata VARCHAR(255) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    rol ENUM('client', 'admin') DEFAULT 'client'
);

CREATE TABLE catalog_servicii (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nume VARCHAR(150) NOT NULL,
    descriere TEXT,
    pret DECIMAL(10, 2) NOT NULL,
    categorie ENUM('spa', 'fitness', 'combinat') NOT NULL,
    tip_achizitie ENUM('programare', 'abonament') NOT NULL,
    durata_minute INT NULL,
    zile_valabilitate INT NULL
);

CREATE TABLE programari_clienti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilizator INT NOT NULL,
    id_serviciu INT NOT NULL,
    data_rezervare DATE NOT NULL,
    ora_rezervare TIME NOT NULL,
    status ENUM('neplatita', 'platita', 'anulata') DEFAULT 'neplatita',
    FOREIGN KEY (id_utilizator) REFERENCES utilizatori(id) ON DELETE CASCADE,
    FOREIGN KEY (id_serviciu) REFERENCES catalog_servicii(id) ON DELETE RESTRICT
);

CREATE TABLE abonamente_clienti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilizator INT NOT NULL,
    id_serviciu INT NOT NULL,
    data_inceput DATE NOT NULL,
    data_sfarsabonamente_clientiit DATE NOT NULL,
    status ENUM('activ', 'expirat') DEFAULT 'activ',
    FOREIGN KEY (id_utilizator) REFERENCES utilizatori(id) ON DELETE CASCADE,
    FOREIGN KEY (id_serviciu) REFERENCES catalog_servicii(id) ON DELETE RESTRICT
);

CREATE TABLE mesaje_contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nume_expeditor VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subiect VARCHAR(150) NOT NULL,
    mesaj TEXT NOT NULL,
    data_trimitere TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);