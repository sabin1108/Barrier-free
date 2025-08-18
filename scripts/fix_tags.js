const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const dbUrl = process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    throw new Error("NEON_DATABASE_URL is not set in .env.local");
  }

  const sql = neon(dbUrl);

  console.log("Running manual migration to alter 'tags' column type...");

  try {
    // Manually alter the table to change the 'tags' column to jsonb
    await sql.unsafe(`ALTER TABLE projects ALTER COLUMN tags TYPE jsonb USING tags::jsonb;`);
    console.log("Successfully altered the 'tags' column to jsonb.");
  } catch (error) {
    console.error("Error altering table:", error);
    // If the column is already jsonb, it might throw an error, which we can ignore.
    if (error.message.includes('column "tags" is already of type jsonb')) {
        console.log("Column is already of type jsonb. No action needed.");
    } else {
        // For other errors, exit with a failure code.
        process.exit(1);
    }
  }
  
  console.log("Manual migration finished.");
}

main();
