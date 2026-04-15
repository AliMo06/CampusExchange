const fs = require('fs');
const path = require('path');
const db = require('../../Data/db'); // Your singleton DB connection

async function initializeDatabase() {
    console.log('Starting database initialization...');

    try {
        // 1. Read the SQL file
        const sqlFilePath = path.join(__dirname, '../../Data/schema.sql');
        const sqlQuery = fs.readFileSync(sqlFilePath, { encoding: 'utf8' });

        // 2. Execute the queries
        await db.query(sqlQuery);
        
        console.log('✅ Database tables initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
    } finally {
        // 3. Exit the process so the script doesn't hang
        process.exit(0);
    }
}

initializeDatabase();