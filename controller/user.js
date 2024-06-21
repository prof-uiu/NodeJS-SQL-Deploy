import Query from "../config/database.js";
import BCrypt from "bcrypt";
import JWT from "jsonwebtoken";

const SECRET = process.env.DATABASE;

export async function CreateUser({ username, password, email }) {
  try {
    const hash_password = BCrypt.hashSync(password, 10);
    const new_user = await Query(
      "INSERT INTO public.user(username,password,email) VALUES($1,$2,$3) RETURNING *",
      [username, hash_password, email],
    );
    return new_user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GetUser({ username }) {
  try {
    const user = await Query("SELECT * FROM public.user WHERE username = $1", [
      username,
    ]);
    return user[0];
  } catch (error) {
    return null;
  }
}

export async function ChangePassword(id, password) {
  const hash_password = BCrypt.hashSync(password, 10);
  const new_password = await Query(
    "UPDATE public.user SET password = $1 WHERE id = $2 RETURNING *",
    [hash_password, id],
  );
  return new_password;
}

export async function GetUserById(id) {
  try {
    const user = await Query(
      "SELECT * FROM public.user INNER JOIN person ON person.user_id = public.user.id  WHERE public.user.id = $1",
      [id],
    );
    return user[0];
  } catch (error) {
    return null;
  }
}

export async function Login({ username, password }) {
  const user = await GetUser({ username });

  if (!user) {
    return false;
  }

  const password_match = BCrypt.compareSync(password, user.password);

  if (!password_match) {
    return false;
  }

  const token = JWT.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      actived: user.actived,
    },
    SECRET,
    { expiresIn: "1h" },
  );

  return token;
}
