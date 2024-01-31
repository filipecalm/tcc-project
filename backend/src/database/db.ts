import 'dotenv/config';
import mongoose from 'mongoose';

export async function connectToDatabase() {
  let dbConnectionString: string;
  if (process.env.NODE_ENV === 'dev') {
    dbConnectionString = `${process.env.DB_DIALECT}://127.0.0.1:${process.env.MONGODB_PORT}/${process.env.DB_NAME}`;
  } else if (process.env.NODE_ENV === 'prod') {
    dbConnectionString = process.env.DB_CONNECTION as string;
  } else {
    throw new Error('O ambiente não está definido corretamente');
  }

  try {
    await mongoose.connect(dbConnectionString);
    console.log(`Conectou ao MongoDB usando a string de conexão: ${dbConnectionString}`);
  } catch (err) {
    console.error('Erro ao conectar com o MongoDB:', err);
  }
}

export default mongoose;
