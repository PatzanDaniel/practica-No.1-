const express = require("express");
const app = express();
//metodos para utilizar swagger
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
//metodo para guardar la sesion iniciada
const session = require("express-session"); 
//conexion con el archivo yaml (swagger)
const swaggerDocument = YAML.load("./openapi.yaml");

app.use(express.json());

app.use(session({
    secret: "mi-clave-secreta",  
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
//routes utilizadas 
app.use("/api/usuario", require("./routers/usuario"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/status", (req, res) => {
    res.status(200).json({ status: "running" });
});
// conexion en que puerto o servidor 
const port = 3000;
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
