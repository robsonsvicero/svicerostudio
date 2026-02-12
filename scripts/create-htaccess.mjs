import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const targetPath = path.join(distDir, '.htaccess');

const content = `# SPA routing for Hostinger/Apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/x-javascript "access plus 1 year"
  ExpiresByType application/font-woff "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(js|css|woff|woff2|svg|png|jpg|jpeg|webp|gif|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
`;

if (!fs.existsSync(distDir)) {
  console.error('dist/ folder not found. Run the build first.');
  process.exit(1);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Created dist/.htaccess');
