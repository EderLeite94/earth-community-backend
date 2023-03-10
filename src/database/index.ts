import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const port: number = parseInt(process.env.PORT || '3000');
const URL = process.env.MONGODB_URI
const connectDatabase = (): Promise<void> => {
    console.info(`Aplicação rodando na porta ${port}`);
    console.log('Conectando ao banco de dados, aguarde!');
    mongoose.set('strictQuery', true);
    return mongoose.connect(`${URL}`)
        .then(() => {
            console.log('Conectado ao Earth - Community');
        })
        .catch((err) => console.log(err));
};

export default connectDatabase;
