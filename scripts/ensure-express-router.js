import fs from 'fs/promises';
import path from 'path';

async function ensureRouterShim() {
  try {
    const targetDir = path.resolve('node_modules', 'express', 'lib');
    const targetFile = path.join(targetDir, 'router.js');

    // If express/lib doesn't exist, nothing to do
    try {
      await fs.access(targetDir);
    } catch (e) {
      console.warn('ensure-express-router: express lib not present, skipping shim.');
      return;
    }

    // If router.js already exists, do nothing
    try {
      await fs.access(targetFile);
      // file exists
      return;
    } catch (e) {
      // continue to create
    }

    const content = "module.exports = require('./router/index.js');\n";
    await fs.writeFile(targetFile, content, { encoding: 'utf8' });
    console.log('ensure-express-router: created router.js shim in express/lib');
  } catch (err) {
    console.error('ensure-express-router: failed', err);
    process.exitCode = 0; // don't fail install
  }
}

ensureRouterShim();
