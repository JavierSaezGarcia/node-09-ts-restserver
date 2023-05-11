import express, { Application } from 'express';
import userRoutes from '../routes/usuarios';
import cors from 'cors';
import db from '../db/connection';

class Server {

    private app: Application;
    private port: string;
    private apiPaths = {
        usuarios: '/api/usuarios'
        
    }
    
    constructor() {

        this.app = express();    
        this.port = process.env.PORT || '8000';
        // Llamar a mi base de datos antes de los middlewares
        this.dbConnection();
        // LLamo a mis middlewares SIEMPRE ANTES DE LLAMAR A LAS RUTAS
        this.middlewares();
        // Definir mis rutas
        this.routes();      

    }

    // TODO conectar base de datos
    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Database online');
            
        } catch (err: any) {
            throw new Error(err);
        }
    }


    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura del body
        this.app.use(express.json());

        // Carpeta publica
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.apiPaths.usuarios, userRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        
            });
    }
}

export default Server;