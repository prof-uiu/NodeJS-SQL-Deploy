import { Router } from "express";
import {
  CreateUser,
  GetUser,
  ChangePassword,
  Login,
} from "../controller/user.js";

import { BuildBody, SendMail } from "../config/mailer.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (!data.username) {
      res.status(400).json({ message: "username is required" });
      return;
    }

    if (!data.password) {
      res.status(400).json({ message: "password is required" });
      return;
    }

    if (!data.email) {
      res.status(400).json({ message: "email is required" });
      return;
    }

    const new_user = await CreateUser({
      username: data.username,
      password: data.password,
      email: data.email,
    });

    const body = BuildBody(
      "Cadastro concluído",
      `Olá ${data.username}, seu cadastro foi concluído com sucesso.`,
    );

    const emailSended = await SendMail({
      to: data.email,
      subject: "Cadastro concluído",
      ...body,
    })
      .then((res) => {
        return true;
      })
      .catch((error) => {
        return error.message;
      });

    res.status(200).json({
      message: "success",
      data: new_user,
      emailSended,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = req.body;

    if (!data.username) {
      res.status(400).json({ message: "username is required" });
      return;
    }

    if (!data.password) {
      res.status(400).json({ message: "password is required" });
      return;
    }

    if (data.password.length < 6) {
      res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
      return;
    }

    const user = await Login({
      username: data.username,
      password: data.password,
    });

    if (!user) {
      res.status(400).json({ message: "invalid username or password" });
      return;
    }

    res.setHeader("Authorization", "Bearer " + user);

    res.status(200).json({
      message: "Login success",
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.post("/recuperar-senha", async (req, res) => {
  try {
    const data = req.body;

    if (!data.username) {
      res.status(400).json({ message: "username is required" });
      return;
    }

    const user = await GetUser({ username: data.username });

    if (!user) {
      res.status(404).json({ message: "Username not found" });
      return;
    }

    const new_password = "12345678";

    await ChangePassword(user.id, new_password);

    const body = BuildBody(
      "Recuperação de senha",
      `Olá <strong>${user.username}</strong>, você solicitou uma recuperação de senha.<br>Sua nova senha é <strong>${new_password}</strong>.`,
    );

    const emailSended = await SendMail({
      to: user.email,
      subject: "Recuperação de senha",
      ...body,
    })
      .then((res) => {
        return true;
      })
      .catch((error) => {
        return error.message;
      });

    res.status(200).json({
      message: "success",
      emailSended,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

export default router;
