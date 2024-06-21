import { Router } from "express";
import isAuth from "../config/auth.js";
import {
  CreateStuff,
  ReadStuff,
  UpdateStuff,
  DeleteStuff,
  GetStuffsByUser,
} from "../controller/stuff.js";

const router = Router();

// Rota autenticada

router.get("/my", isAuth, async (req, res) => {
  try {
    const data = await GetStuffsByUser(req.user.id);

    res.status(200).json({
      message: "sucess",
      data: {
        stuffs: data,
        person: {
          name: req.user.name,
        },
      },
    });

    return;
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });

    return;
  }
});

// Rotas publicas

router.get("/", async (req, res) => {
  try {
    const data = await ReadStuff();

    res.status(200).json({
      message: "sucess",
      data,
    });

    return;
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });

    return;
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (!data.name) {
      res.status(400).json({ message: "name is required" });
      return;
    }

    if (!data.slug) {
      data.slug = slugfy(data.name);
    }

    const new_stuff = await CreateStuff(data);

    res.status(200).json({
      message: "success",
      data: new_stuff,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.put("/:idStuff", async (req, res) => {
  try {
    const idStuff = req.params.idStuff;

    const stuff = await ReadStuff(idStuff);

    if (!stuff) {
      res.status(404).json({
        message: "Stuff not found",
      });
    }

    const data = req.body;

    if (!data.name || data.name.length == 0) {
      res.status(400).json({
        messsage: "name is required",
      });
    }

    data.slug = slugfy(data.name);

    const updated_stuff = await UpdateStuff({
      id: idStuff,
      name: data.name,
      slug: data.slug,
    });

    res.status(200).json({
      message: "sucess",
      data: updated_stuff,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.delete("/:idStuff", async (req, res) => {
  try {
    const idStuff = req.params.idStuff;

    const stuff = await ReadStuff(idStuff);

    if (!stuff) {
      res.status(404).json({
        message: "Stuff not found",
      });
    }

    await DeleteStuff(idStuff);

    res.status(200).json({
      message: `sucess, stuff ${stuff.name} deleted`,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.get("/:idStuff", async (req, res) => {
  try {
    const idStuff = req.params.idStuff;

    const stuff = await ReadStuff(idStuff);

    if (!stuff) {
      res.status(404).json({
        message: "Stuff not found",
      });
    }

    res.status(200).json({
      message: `sucess`,
      data: stuff,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const data = await GetStuffsByUser(req.params.id);

    res.status(200).json({
      message: "sucess",
      data: {
        stuffs: data,
      },
    });

    return;
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });

    return;
  }
});

function slugfy(text) {
  return text.toLowerCase().replace(/ /g, "-");
}

export default router;
