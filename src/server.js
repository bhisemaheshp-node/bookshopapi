import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const NUM_CPUS = os.cpus().length;
const PORT = parseInt(process.env.PORT) || 5000;

if (cluster.isPrimary && process.env.NODE_ENV!='development') {
  // Fork one worker per CPU core
  for (let i = 0; i < NUM_CPUS; i++) {
    cluster.fork();
  }

  // Restart worker automatically on crash
  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });

  cluster.on('online', (worker) => {
    console.log(`[Master] Worker PID ${worker.process.pid} is online`);
  });

} else {
  // Worker process: start Express app and connect to DB
  const { default: app } = await import('./app.js');
  
  try {
    app.listen(PORT, () => {
      console.log(`[Worker ${process.pid}] Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(`[Worker ${process.pid}] Startup error:`, err.message);
    process.exit(1);
  }
}
