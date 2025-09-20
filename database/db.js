const { Pool } = require("pg");

//.\psql -U postgres -d practica1

const pool = new Pool({
    //usuario
    user: "postgres",       
    //host que usa
    host: "localhost",
    //nombre de mi base de datos 
    database: "practica1",  
    //contraseña del usuario postgres
    password: "2025", 
    //puerto por defecto 
    port: 5432
});

module.exports = pool;
