import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongoServer;
export async function connectDatabase() {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'diario-leituras' });
  console.log('MongoDB em memória conectado. Dados reiniciam ao parar a API.');
}
export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}
