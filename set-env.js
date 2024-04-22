const { resolve } = require('path');

const { writeFile, mkdir } = require('fs/promises');

const dotenv = require('dotenv');
const { execSync } = require('child_process');

dotenv.config();

const targetPath = resolve(
  __dirname,
  'apps/frontend/src/environments/environment.ts'
);

const requiredEnvironmentVariables = [
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'AUTH0_AUDIENCE',
  // 'AUTH0_CALLBACK_URL',
  'API_SERVER_URL',
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvironmentVariables.length) {
  console.error(
    `Missing environment variables: ${missingEnvironmentVariables.join(', ')}`
  );
  process.exit(1);
}

const envConfigFile = `export const environment = {
  production: false,
  auth0: {
    domain: '${process.env['AUTH0_DOMAIN']}',
    clientId: '${process.env['AUTH0_CLIENT_ID']}',
    authorizationParams: {
      audience: '${process.env['AUTH0_AUDIENCE']}',
      // redirect_uri: '${process.env['AUTH0_CALLBACK_URL']}',
      redirect_uri: window.location.origin,
    },
  },
  api: {
    serverUrl: '${process.env['API_SERVER_URL']}',
  },
};
`;

(async () => {
  try {
    await writeFile(targetPath, envConfigFile);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await mkdir(resolve(__dirname, 'apps/frontend/src/environments'), {
        recursive: true,
      });
      await writeFile(targetPath, envConfigFile);
    } else {
      console.error(err);
      throw err;
    }
  }
})();
