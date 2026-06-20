import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL is not defined");
}

const sql = neon(process.env.NEON_DATABASE_URL);

const seedData = [
  { name: "JavaScript", aliases: ["JS", "Vanilla JS", "Javascript"] },
  { name: "TypeScript", aliases: ["TS", "Typescript"] },
  { name: "React", aliases: ["ReactJS", "React.js"] },
  { name: "Next.js", aliases: ["NextJS", "Next", "Nextjs"] },
  { name: "Node.js", aliases: ["NodeJS", "Node", "Nodejs"] },
  { name: "Python", aliases: ["Py"] },
  { name: "PostgreSQL", aliases: ["Postgres", "Postgresql"] },
  { name: "MongoDB", aliases: ["Mongo", "Mongodb"] },
  { name: "HTML", aliases: ["HTML5"] },
  { name: "CSS", aliases: ["CSS3"] },
  { name: "Tailwind CSS", aliases: ["Tailwind", "TailwindCSS"] }
];

async function seed() {
  console.log("Seeding tech stacks...");
  
  await sql`
    CREATE TABLE IF NOT EXISTS tech_stacks (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL UNIQUE,
      aliases TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  for (const stack of seedData) {
    try {
      await sql`
        INSERT INTO tech_stacks (name, aliases)
        VALUES (${stack.name}, ${stack.aliases})
        ON CONFLICT (name) DO NOTHING;
      `;
      console.log(`Inserted ${stack.name}`);
    } catch (e) {
      console.error(`Failed to insert ${stack.name}:`, e);
    }
  }
  console.log("Seeding complete.");
}

seed().catch(console.error);
