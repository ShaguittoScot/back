import express from "express";
const PORT = process.env.PORT || 3000;
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/db.js";
import usuariosRutas from "./routes/UsuariosRutas.js";
import dotenv from 'dotenv';
dotenv.config();  // Cargar las variables de entorno


async function conexionDB() {
    var mensajeDB = await connectDB();
    console.log(mensajeDB);
}

const app = express();
conexionDB();


app.use(cors({
    origin: 'http://localhost:3001',  // Asegúrate de que este sea el origen correcto de tu frontend
    credentials: true,  // Permitir el uso de cookies
}));


app.use(cookieParser());
app.use(express.json());
app.use("/appi", usuariosRutas);

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
