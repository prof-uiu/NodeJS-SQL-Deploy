import Query from "../config/database.js";

export async function CreatePerson({ name, email, age }) {
  const new_person = await Query(
    "INSERT INTO person(name,email,age) VALUES($1,$2,$3) RETURNING *",
    [name, email, age],
  );
  return new_person;
}

export async function ReadPerson(id = null) {
  if (!id) {
    const persons = await Query("SELECT * FROM person");
    return persons;
  } else {
    const person = await Query("SELECT * FROM person WHERE id = $1", [id]);
    return person;
  }
}

export async function ChangePersonStatus({ id, actived }) {
  const person = await Query("UPDATE person SET actived = $1 WHERE id = $2", [
    actived,
    id,
  ]);

  return person;
}

export async function UpdatePerson({ id, name, email, age }) {
  const person = await Query(
    "UPDATE person SET name = $1, email = $2, age = $3 WHERE id = $4",
    [name, email, age, id],
  );
  return person;
}

export async function DeletePerson(id) {
  const person = await Query("DELETE FROM person WHERE id = $1", [id]);
  return person;
}
