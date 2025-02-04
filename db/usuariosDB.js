import User from "../models/usuariModelo.js";
import { encriptarPassword, validarPassword } from "../midlewares/funcionesPass.js";
import { mensaje } from '../libs/mensajes.js';
import { creartoken } from "../libs/jwt.js";

export const register = async ({userName, nombre,email, password}) => {
    try {
        const usuarioDuplicado = await User.findOne({userName});
        const emailDuplicado = await User.findOne({email});
        if (usuarioDuplicado || emailDuplicado) {
            //console.log("Usuario duplicado");
            //return usuarioDuplicado;
            return mensaje(400, "Usuario duplicado");
        }
        
        const {salt, hash} = encriptarPassword(password);
        const dataUser = new User({
            userName,
            nombre,
            email,
            password: hash,
            salt
        });
        const respuestaMongo = await dataUser.save();
        const token = await creartoken({id: respuestaMongo._id});
        //console.log("Usuario registrado:");
        //return respuestaMongo;
        return mensaje(200, "Usuario registrado",respuestaMongo._id,token);
    } catch (error) {
        //console.error("Error al registrar user:", error);
        //throw error;
        console.log(500, "Error al registrar usuario",error);
    }
};


export const login = async ({userName, password}) => {
    try {
        const usuarioEncontado = await User.findOne({userName});
        if (!usuarioEncontado) {
            return mensaje(400, "Datos incorrectos log1");
        }
        const passwordValido = validarPassword(password, usuarioEncontado.salt, usuarioEncontado.password);
        if (!passwordValido) {
            return mensaje(400, "Datos incorrectos log2");
        }
        const token = await creartoken({id: usuarioEncontado._id});
        return mensaje(200, `Bienbenido ${usuarioEncontado.userName}`,usuarioEncontado._id,token);
    } catch (error) {
        return mensaje(400,"Datos incorrectos log3",error);
    }
};

export const mostrarUsuarios = async () => {
    try {
        const usuarios = await User.find();
        //console.log(usuarios);
        return mensaje(200, "Usuarios obtenidos correctamente", usuarios);
    } catch (error) {
        return mensaje(500, "Error al obtener usuarios", error);
    }
};

export const buscarUsuario = async (id) => {
    try {
        const usuario = await User.findById(id);
        if (!usuario) {
            return mensaje(404, "Usuario no encontrado");
        }
        return mensaje(200, "Usuario encontrado", usuario);
    } catch (error) {
        return mensaje(500, "Error al buscar usuario", error);
    }
};

export const borrarUsuario = async (id) => {
    try {
        const usuarioEliminado = await User.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return mensaje(404, "Usuario no encontrado");
        }
        return mensaje(200, "Usuario eliminado correctamente");
    } catch (error) {
        return mensaje(500, "Error al eliminar usuario", error);
    }
};

export const editarUsuario = async (id, datosActualizados) => {
    try {
        const usuarioActualizado = await User.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!usuarioActualizado) {
            return mensaje(404, "Usuario no encontrado");
        }
        return mensaje(200, "Usuario actualizado correctamente", usuarioActualizado);
    } catch (error) {
        return mensaje(500, "Error al actualizar usuario", error);
    }
};