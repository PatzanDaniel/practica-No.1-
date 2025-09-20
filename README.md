Api para la creacion y posteo de mensajes tipo blog 

se deberá cambiar las credenciales a su base de datos local se uso postgrest

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

este apartado deberá cambiar el puerto en caso sea distinto, el nombre de la base de datos, el user, y su contraseña que haya decidido
para tener los datos e interacciones guardadas se deberán crear las tablas llamadas usuario, mensaje y seguidor de esta manera y con nombres 
si lo hace de distinta manera se deberán adaptar las columnas 

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50),
  correo VARCHAR(50),
  pass VARCHAR(50),
  rol VARCHAR(20),
  fecha_crecion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mensaje (
  id_mensaje SERIAL PRIMARY KEY,
  contenido TEXT,
  fecha TIMESTAMP DEFAULT NOW(),
  id_usuario INTEGER REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE seguidor (
  id SERIAL PRIMARY KEY,
  seguidor INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  seguido INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  fecha TIMESTAMP DEFAULT NOW()
);

para iniciarlo correctamente se ubicara en la ruta donde tenga el proyecto en el programa git bash aquí ingresara la linea Node index.js 
si todo esta correcto aparecerá el host del servidor 
para apagarlo se necesitara usar la combinación Ctrl+C
