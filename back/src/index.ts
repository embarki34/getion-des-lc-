import { App } from './app';

/**
 * Application Entry Point
 * Starts the unified API server with all modules
 */
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = new App(PORT);
app.start();
