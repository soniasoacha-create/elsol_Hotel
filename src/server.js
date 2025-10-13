import express from "express";
import dotenv from "dotenv";
import usuariosRoutes from "./routes/usuarios.js";//Importa el módulo de rutas 

dotenv.config();

const app = express ();
app.use(express.json());

//Rutas
app.use("/usuarios", usuariosRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});

