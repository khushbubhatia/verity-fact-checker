// ─── test-config.js ───────────────────────────────────────────────────────────
// Loads .env file for Node.js testing (since import.meta.env only works in Vite)

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file
try {
  const envPath = join(__dirname, '.env');
  const envFile = readFileSync(envPath, 'utf8');
  
  // Parse .env file
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();
    
    if (key && value) {
      process.env[key] = value;
    }
  });
  
  console.log('✓ Loaded .env file');
} catch (err) {
  console.error('⚠ Could not load .env file:', err.message);
  console.error('Make sure .env exists in the project root');
  process.exit(1);
}

export default process.env;