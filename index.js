import express from "express";
const PORT = process.env.PORT || 3000;
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectDB} from "./db/db.js";

import usuariosRutas from "./routes/UsuariosRutas.js";

async function conexionDB() {
    var mensajeDB = await connectDB();
    console.log(mensajeDB);
    
}

const app = express();
conexionDB();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/appi",usuariosRutas);


app.listen(PORT, ()=>{
    console.log(`Servidor en http://localhost:${PORT}`);
});