import { Router } from "express";
import { register, login, mostrarUsuarios, buscarUsuario, borrarUsuario, editarUsuario} from "../db/usuariosDB.js";
import { mensaje } from "../libs/mensajes.js";
const router = Router();

router.post("/register", async (req, res) => {
    const respuesta = await register(req.body);
    console.log(respuesta.mensajeOriginal);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});


router.post("/login", async(req,res)=>{
    const respuesta = await login(req.body);
    console.log(respuesta.mensajeOriginal);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);

});

router.get("/usuariosMost", async (req, res) => {
        const respuesta = await mostrarUsuarios();
        res.status(respuesta.status).json({
            Mensaje: respuesta.mensajeUsuario, 
            Usuarios: respuesta.mensajeOrijinal
        });
});

router.get('/usuariosBusc/:id', async (req, res) => {
    const respuesta = await buscarUsuario(req.params.id);
    res.status(respuesta.status).json({
        Mensaje: respuesta.mensajeUsuario, 
        Usuarios: respuesta.mensajeOrijinal
    });
});

router.delete('/usuarioBorr/:id', async (req, res) => {
    const respuesta = await borrarUsuario(req.params.id);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.put('/usuarioEdi/:id', async (req, res) => {
    const respuesta = await editarUsuario(req.params.id, req.body,);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});




router.get("/salir", async(req,res)=>{
    res.json("estas en salir")
});

router.get("/usuarioslogeados", async(req,res)=>{
    res.json("estas en usuarioslogeados convencionales admis y logeados")
});

router.get("/Administradores", async(req,res)=>{
    res.json("estas en adim solo admins logeados")
});

router.get("/cualquierUsuario", async(req,res)=>{
    res.json("estas en no importa si estas logeado")
});

export default router;