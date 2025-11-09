const fs = require('fs');
const path = require('path');
const readline = require('readline');
const axios = require('axios'); // npm install axios

// ------------------- CONFIGURATION -------------------
const API_URL = "https://script.google.com/macros/s/AKfycbyRjbI2zo_HfRhSAnXcUGah7nYTmflfn1plkDB9RMzC8MfkLpsJGvlRpv40zR1KlVTJ/exec"; 
// 👆 Use your Web App deployment URL (ending in /exec)

const ABSOLUTE_PATH = path.resolve(__dirname, '../');
// List of env files to manage
const ENV_FILES_CONFIG = [
    { name: 'ayuwedic-backend-env', path: path.join(ABSOLUTE_PATH, "../",'.env.development.local') },
];
// -----------------------------------------------------

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function makeApiRequest(body) {
    if (!API_URL) {
        throw new Error("API_URL is not set. Please paste your Google App Script Web App URL.");
    }

    const res = await axios.post(API_URL, body, {
        headers: { 'Content-Type': 'application/json' },
        maxRedirects: 5 // axios follows redirects by default, but you can control it
    });

    return res.data;
}

async function uploadEnvFiles() {
    console.log('🔒 Starting upload process...');
    const password = await askQuestion('Enter the password to upload: ');

    for (const fileConfig of ENV_FILES_CONFIG) {
        try {
            if (!fs.existsSync(fileConfig.path)) {
                console.warn(`⚠️  Skipping ${fileConfig.name}: File not found at ${fileConfig.path}`);
                continue;
            }

            console.log(`- 📤 Uploading ${fileConfig.name}...`);
            const fileContent = fs.readFileSync(fileConfig.path, 'utf8');

            const body = {
                file: fileContent,
                name: fileConfig.name,
                password: password
            };

            const response = await makeApiRequest(body);
            console.log(`  - ✅ Success: ${fileConfig.name} uploaded. Response:`, response);
        } catch (error) {
            console.error(`  - ❌ Error uploading ${fileConfig.name}: ${error.message}`);
        }
    }
    console.log('✨ Upload process finished.');
}

async function downloadEnvFiles() {
    console.log('🔒 Starting download process...');
    const password = await askQuestion('Enter the password to download: ');

    for (const fileConfig of ENV_FILES_CONFIG) {
        try {
            console.log(`- 📥 Downloading ${fileConfig.name}...`);
            const body = {
                name: fileConfig.name,
                password: password
            };

            const response = await makeApiRequest(body);

            if (response && response.fileContent) {
                const dir = path.dirname(fileConfig.path);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(fileConfig.path, response.fileContent);
                console.log(`  - ✅ Success: ${fileConfig.name} downloaded to ${fileConfig.path}`);
            } else {
                console.warn(`  - ⚠️  Could not download ${fileConfig.name}. Response was empty or invalid.`);
            }

        } catch (error) {
            console.error(`  - ❌ Error downloading ${fileConfig.name}: ${error.message}`);
        }
    }
    console.log('✨ Download process finished.');
}

async function main() {
    console.log('------------------------------------');
    console.log('🚀 Welcome to the ENV File Manager 🚀');
    console.log('------------------------------------');

    if (!API_URL) {
        console.error("🚨 CRITICAL: API_URL is not set in the script. Please paste your Google App Script Web App URL and restart.");
        rl.close();
        return;
    }

    const mode = await askQuestion('Choose a mode: [UP]load or [GET]download? ');

    switch (mode.toUpperCase()) {
        case 'UP':
            await uploadEnvFiles();
            break;
        case 'GET':
            await downloadEnvFiles();
            break;
        default:
            console.log('Invalid mode selected. Please choose "UP" or "GET".');
            break;
    }

    rl.close();
}

main();