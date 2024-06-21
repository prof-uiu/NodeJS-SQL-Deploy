import Query from "../config/database.js";

export async function CreateStuff({ name, slug }) {
  const new_stuff = await Query(
    "INSERT INTO stuff(name,slug) VALUES($1,$2) RETURNING *",
    [name, slug],
  );
  return new_stuff;
}

export async function ReadStuff(id = null) {
  if (!id) {
    const stuffs = await Query("SELECT * FROM stuff");
    return stuffs;
  } else {
    const stuff = await Query("SELECT * FROM stuff WHERE id = $1", [id]);
    return stuff;
  }
}

export async function GetStuffsByUser(userId) {
  try {
    const stuffs = await Query(
      "SELECT stuff.id stuff_id, stuff.name stuff_name, person.name person_name FROM stuff INNER JOIN person_stuff ON person_stuff.stuff_id = stuff.id INNER JOIN person ON person_stuff.person_id = person.id INNER JOIN public.user ON public.user.id = person.user_id WHERE public.user.id = $1",
      [userId],
    );
    return stuffs;
  } catch (error) {
    return [];
  }
}

export async function UpdateStuff({ id, name, slug }) {
  const stuff = await Query(
    "UPDATE stuff SET name = $1, slug = $2 WHERE id = $3",
    [name, slug, id],
  );
  return stuff;
}

export async function DeleteStuff(id) {
  const stuff = await Query("DELETE FROM stuff WHERE id = $1 RETURNING *", [
    id,
  ]);
  return stuff;
}
