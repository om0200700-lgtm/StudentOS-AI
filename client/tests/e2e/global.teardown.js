import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalTeardown() {
  console.log('Cleaning up test database...');
  // We can write a teardown script or just let the setup clear it next time
  // For strict cleanup, we run a similar script that just drops the database.
}
