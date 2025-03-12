import User from "../models/usuariModelo.js";
import {encriptarPassword, validarPassword} from "../midlewares/funcionesPass.js";
import { mensaje } from '../libs/mensajes.js';
import { creartoken } from "../libs/jwt.js";


export const register = async ({ userName, nombre, email, password }) => {
    try {
        // Verificar que no haya campos vacíos
        if (!userName || !nombre || !email || !password) {
            return mensaje(400, "Todos los campos son obligatorios");
        }

        // Verificar si el usuario o el email ya están registrados
        const usuarioDuplicado = await User.findOne({ userName });
        const emailDuplicado = await User.findOne({ email });

        if (usuarioDuplicado || emailDuplicado) {
            return mensaje(400, "Usuario o email duplicado");
        }

        // Encriptar la contraseña antes de guardar
        const { salt, hash } = encriptarPassword(password);

        // Crear el objeto del usuario
        const dataUser = new User({
            userName,
            nombre,
            email,
            password: hash,
            salt
        });

        // Guardar el nuevo usuario en la base de datos
        const respuestaMongo = await dataUser.save();

        // Crear un token para el usuario
        const token = await creartoken({
            _id: respuestaMongo._id,
            tipoUsuario: respuestaMongo.tipoUsuario,
            userName: respuestaMongo.userName,
            nombre: respuestaMongo.nombre,
            email: respuestaMongo.email
        });

        // Retornar la respuesta con el token
        return mensaje(200, "Usuario registrado b", respuestaMongo._id, token);

    } catch (error) {
        console.log("Error al registrar usuario:", error);
        return mensaje(500, "Error al registrar usuario");
    }
};



export const login = async ({ userName, password }) => {
    try {
        // Verificar que los campos no estén vacíos
        if (!userName || !password) {
            return mensaje(400, "El usuario y la contraseña son obligatorios");
        }

        // Buscar al usuario por el nombre de usuario
        const usuarioEncontado = await User.findOne({ userName });
        if (!usuarioEncontado) {
            return mensaje(400, "Datos incorrectos log1");
        }

        // Validar la contraseña
        const passwordValido = validarPassword(password, usuarioEncontado.salt, usuarioEncontado.password);
        if (!passwordValido) {
            return mensaje(400, "Datos incorrectos log2");
        }

        // Crear un token para el usuario
        const token = await creartoken(
            { 
                _id: usuarioEncontado._id, 
                nombre:usuarioEncontado.nombre,
                tipoUsuario: usuarioEncontado.tipoUsuario,
                userName: usuarioEncontado.userName,
                email: usuarioEncontado.email

            }
        );

        // Retornar la respuesta con el token
        return mensaje(200, `Bienvenido ${usuarioEncontado.userName}`, usuarioEncontado._id, token);

    } catch (error) {
        console.log("Error en login:", error);
        return mensaje(400, "Datos incorrectos log3", error);
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
    console.log('id bd:',id);
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
        if (datosActualizados.password && datosActualizados.password.trim() !== "") {
            const { salt, hash } = encriptarPassword(datosActualizados.password);
            datosActualizados.password = hash;
            datosActualizados.salt = salt;
        } else {
            delete datosActualizados.password;
        }

        const usuarioActualizado = await User.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!usuarioActualizado) {
            return mensaje(404, "Usuario no encontrado");
        }
        return mensaje(200, "Usuario actualizado correctamente", usuarioActualizado);
    } catch (error) {
        return mensaje(500, "Error al actualizar usuario", error);
    }
};



// Función para verificar si un usuario es administrador
export const isAdminAutorizado = async (id) => {
    try {
        console.log('id:',id);
        const usuario = await User.findById(id);
        return usuario && usuario.tipoUsuario === "Administrador";
        
    } catch (error) {
        console.error("Error en isAdminAutorizado:", error);
        return false;
    }
};
