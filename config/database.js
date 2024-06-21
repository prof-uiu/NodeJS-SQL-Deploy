import pg from "pg";

export default async function Query(text, value = undefined) {
  const client = new pg.Client({ connectionString: process.env.DATABASE });
  await client.connect();
  const result = await client.query(text, value);
  await client.end();
  return result.rows;
}
