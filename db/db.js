import mongoose from 'mongoose';
import { mensaje } from '../libs/mensajes.js';

export async function connectDB () {
    try {
        
        const conexion = await mongoose.connect('mongodb://localhost:27017/MongoDBApp');
        //const conexion = await mongoose.connect('mongodb+srv://arieldsti23:niideaAlv@cluster0.ag2ij.mongodb.net/?retryWrites=true&w=majority&appName=MongoDBApp');
        // console.log(conexion);
    //console.log('MongoDB connected');
    return mensaje(200, 'MongoDB connected');
    } catch (error) {
        return mensaje(400, 'Error al conectar a la base de datos', error);
    }
};

