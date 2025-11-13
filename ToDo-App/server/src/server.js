import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const server = http.createServer(app);

async function bootstrap() {
  await connectDB();
  server.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`);
  });
}

bootstrap();
