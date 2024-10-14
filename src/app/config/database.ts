import "dotenv/config";
import { drizzle } from "drizzle-orm/connect";
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL!;

// const pool = new Pool({ connectionString: databaseUrl });
// const db = drizzle(pool);

const db = drizzle("node-postgres", databaseUrl);

export default db;
