import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { seedDatabase } from './seeds/seed.js';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Configure JWT_SECRET com pelo menos 32 caracteres em backend/.env.');
  process.exit(1);
}
let server;
try {
  await connectDatabase();
  await seedDatabase();
  const port = Number(process.env.PORT) || 3001;
  server = app.listen(port, () => console.log(`API: http://localhost:${port}/api | Swagger: http://localhost:${port}/api/docs`));
} catch (error) {
  console.error('Falha ao iniciar a API:', error);
  await disconnectDatabase();
  process.exit(1);
}
async function shutdown() {
  server.close(async () => { await disconnectDatabase(); process.exit(0); });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
