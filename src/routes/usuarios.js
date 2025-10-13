import {Router} from "express";
import { 
//creo rutas, este se define en usuariosControler
obtenerUsuarios,
crearUsuario,
actualizarUsuario,
eliminarUsuario
} from "../controllers/usuariosController.js";

const router =Router();
//defino y creo las rutas con las diferentes acciones
router. get("/",obtenerUsuarios);
router. post("/", crearUsuario); 
router.put("/:id", actualizarUsuario);
router.delete("/:id",eliminarUsuario);

    export default router;