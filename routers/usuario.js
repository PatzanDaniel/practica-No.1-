const { Router } = require("express");
const router = Router();
//conexion a la base de datos 
const pool = require("../database/db");

let users = [];

// POST crear usuario
router.post("/crear", async (req, res) => {
    const { nombre, correo, pass, rol} = req.body;
    const result = await pool.query(
        //insertamos en la base de datos 
        "INSERT INTO usuario (nombre, correo, pass, rol) VALUES ($1, $2, $3, $4) RETURNING *",
        [nombre, correo, pass, rol]
    );
    res.status(201).json(result.rows[0]);
});

// GET obtener información de un usuario por nombre
router.get("/buscar-usuario", async (req, res) => {
    const { nombre } = req.query;

    try {
        const result = await pool.query(
            "SELECT nombre, correo, rol, fecha_crecion FROM usuario WHERE nombre = $1",
            [nombre]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// POST Iniciar sesion con correo y pass
router.post("/sesion", async (req, res) => {
    //credenciales para iniciar la sesion
    const { correo, pass } = req.body;
    const result = await pool.query(
        //consulta la base de datos 
        "SELECT * FROM usuario WHERE correo = $1 AND pass = $2",
        [correo, pass]
    );
    //control si coinciden los datos 
    if (result.rows.length > 0) {
         req.session.usuario = result.rows[0]; 
        res.json({usuario: result.rows[0] });
    } else {
        res.json({mensaje: "Correo o contraseña incorrectos" });
    }
});

// DELETE eliminar usuario por correo y pass
router.delete("/eliminar", async (req, res) => {
    //credenciales para la eliminacion
    const { correo, pass } = req.body;
    //consultamos la base de datos 
    const user = await pool.query(
        "SELECT nombre FROM usuario WHERE correo = $1 AND pass = $2",
        [correo, pass]
    );
    //eliminamos este mismo
    await pool.query(
        "DELETE FROM usuario WHERE correo = $1 AND pass = $2",
        [correo, pass]
    );

    res.json({ message: "Usuario eliminado correctamente" });
});

// POST crear un mensaje 
router.post("/mensaje", async (req, res) => {
    //pedimos unicamente el texto del mensaje 
    const { texto } = req.body;
    //se identifica con el id
    const id_usuario = req.session.usuario.id; 

    //se inseta en la tabla id el texto y la fecha de creacion 
    const result = await pool.query(
        `INSERT INTO mensaje (id_usuario, contenido, fecha)
         VALUES ($1, $2, NOW())
         RETURNING id_mensaje, contenido, fecha`,
        [id_usuario, texto]
    );

    res.status(201).json({
        id_mensaje: result.rows[0].id_mensaje,
        nombre_usuario: req.session.usuario.nombre, 
        contenido: result.rows[0].contenido,
        fecha: result.rows[0].fecha
    });
});

// GET leer los ultimos 10 mensajes tuyos o de los seguidos
router.get("/ultimos_mensajes", async (req, res) => {
    //sesion 
    const nombre = req.query.nombre;
    //se verifica las relaciones con seguidos 
    const result = await pool.query(
        `SELECT u.nombre, m.contenido, m.fecha
         FROM mensaje m
         JOIN usuario u ON m.id_usuario = u.id
         WHERE u.nombre = $1
            OR u.id IN (
                SELECT s.id_seguido
                FROM seguidor s
                JOIN usuario su ON s.id_seguidor = su.id
                WHERE su.nombre = $1
            )
         ORDER BY m.fecha DESC
         LIMIT 10`,
        [nombre] 
    );

    res.json(result.rows);
});

// POST seguir a otro usuario
router.post("/seguir", async (req, res) => {
    const { nombre } = req.body;
    //nombre de la persona con el login
    const seguidor = req.session.usuario.nombre;

    const result = await pool.query(
        //insertamos en la base de datos 
        "INSERT INTO seguidor (seguidor, seguido) VALUES ($1, $2) RETURNING *",
        [seguidor, nombre]
    );

    res.status(201).json({ message: "Ahora sigues al usuario", data: result.rows[0] });
});

// DELETE dejar de seguir
router.delete("/seguir", async (req, res) => {
    const { nombre } = req.body;
    //nombre de la persona con el login
    const seguidor = req.session.usuario.nombre;

    const result = await pool.query(
        //eliminamos en la base de datos 
        "DELETE FROM seguidor WHERE seguidor = $1 AND seguido = $2 RETURNING *",
        [seguidor, nombre]
    );

    res.json({ message: "Has dejado de seguir al usuario", data: result.rows[0] });
});


module.exports = router;