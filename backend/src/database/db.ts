import 'dotenv/config';
import mongoose from 'mongoose';


export async function connectToDatabase() {
  try {
    await mongoose.connect(`${process.env.DB_DIALECT}://127.0.0.1:${process.env.MONGODB_PORT}/${process.env.DB_NAME}`);
    console.log(`Conectou ao MongoDB no banco de dados ${process.env.DB_NAME} através da porta ${process.env.MONGODB_PORT}!`);
  } catch (err) {
    console.error('Erro ao conectar com o MongoDB:', err);
  }
}

export default mongoose;
