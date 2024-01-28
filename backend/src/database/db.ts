import 'dotenv/config';
import mongoose from 'mongoose';

async function main() {
  await mongoose.connect(`${process.env.DB_DIALECT}://127.0.0.1:${process.env.MONGODB_PORT}/${process.env.DB_NAME}`)

  console.log(`Conectou ao ${process.env.DB_DIALECT} no banco de dados ${process.env.DB_NAME} através da porta ${process.env.MONGODB_PORT}!`)
}
main().catch(err => console.log(err))

export default mongoose;
