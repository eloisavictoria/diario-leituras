import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Reading } from '../models/Reading.js';
export async function seedDatabase() {
  const samples = [
    { name: 'Ana', email: 'ana@example.com', password: 'Leitura123!' },
    { name: 'Bruno', email: 'bruno@example.com', password: 'Leitura123!' },
    { name: 'Carla', email: 'carla@example.com', password: 'Leitura123!' }
  ];
  const users = [];
  for (const sample of samples) {
    const passwordHash = await bcrypt.hash(sample.password, 10);
    users.push(await User.create({ name: sample.name, email: sample.email, passwordHash }));
  }
  await Reading.insertMany([
    { title: 'O Hobbit', author: 'J. R. R. Tolkien', genre: 'Fantasia', opinion: 'Uma aventura envolvente, com personagens memoráveis.', rating: 5, recommend: true, userId: users[0]._id },
    { title: '1984', author: 'George Orwell', genre: 'Ficção científica', opinion: 'Uma leitura instigante sobre vigilância e poder.', rating: 5, recommend: true, userId: users[0]._id },
    { title: 'Clean Code', author: 'Robert C. Martin', genre: 'Tecnologia', opinion: 'Traz ideias úteis para discutir legibilidade e manutenção de código.', rating: 4, recommend: true, userId: users[1]._id }
  ]);
  console.log('Massa inicial: 3 usuários e 3 leituras carregadas.');
}
