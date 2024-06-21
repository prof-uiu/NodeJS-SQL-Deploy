import express from "express";
import cookieParser from "cookie-parser";

import Router from "./routes/index.js";
import isAuth from "./config/auth.js";

const port = process.env["PORT"];

const app = express();

app.use(express.json());
app.use(cookieParser());

Router(app);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Agora vai dar certo!",
  });
});

app.get("/logado", isAuth, (req, res) => {
  res.status(200).json({
    message: "Você está logado!",
    username: req.user.username,
  });
});

app.listen(port, () => {
  console.log(`Node.js ouvindo na porta ${port}.`);
});

export default app;
