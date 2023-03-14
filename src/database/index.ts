import mongoose from 'mongoose';
import express, { Application, Express } from 'express';
const app: Application = express();

const port = parseInt(process.env.PORT || '3000', 10);
console.log('Conectando ao Earth-Community...');
const connectDatabase = (app: Application) => {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
      console.log('Conectado ao Earth-Community!');
      app.listen(port, () => {
        console.log(`Servidor iniciado na porta ${port}`);
      });
    })
    .catch((err) => {
      console.error('Erro ao conectar com o banco de dados:', err);
      process.exit(1);
    });
};

export default connectDatabase;
