import { Router } from "express";
import {
  CreatePerson,
  ReadPerson,
  UpdatePerson,
  DeletePerson,
  ChangePersonStatus,
} from "../controller/person.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await ReadPerson();

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

    if (!data.email) {
      res.status(400).json({ message: "email is required" });
      return;
    }

    if (!data.age <= 18) {
      res.status(400).json({ message: "age must be greater than 18" });
      return;
    }

    const new_person = await CreatePerson(data);

    res.status(200).json({
      message: "success",
      data: new_person,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.put("/:idPerson", async (req, res) => {
  try {
    const idPerson = req.params.idPerson;

    const person = await ReadPerson(idPerson);

    if (!person) {
      res.status(404).json({
        message: "Person not found",
      });
    }

    const data = req.body;

    if (!data.name) {
      res.status(400).json({
        messsage: "name is required",
      });
    }

    const updated_person = await UpdatePerson({
      id: idPerson,
      name: data.name,
      email: person[0].email,
      age: person[0].age,
    });

    res.status(200).json({
      message: "sucess",
      data: updated_person,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.delete("/:idPerson", async (req, res) => {
  try {
    const idPerson = req.params.idPerson;

    const person = await ReadPerson(idPerson);

    if (!person) {
      res.status(404).json({
        message: "Person not found",
      });
    }

    await DeletePerson(idPerson);

    res.status(200).json({
      message: `sucess, person ${person.name} deleted`,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.get("/:idPerson", async (req, res) => {
  try {
    const idPerson = req.params.idPerson;

    const person = await ReadPerson(idPerson);

    if (!person) {
      res.status(404).json({
        message: "Person not found",
      });
    }

    res.status(200).json({
      message: `sucess`,
      data: person,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
});

router.patch("/:idPerson", async (req, res) => {
  const idPerson = req.params.idPerson;

  const person = await ReadPerson(idPerson);

  if (!person) {
    res.status(404).json({
      message: "Person not found",
    });
  }

  const data = req.body;

  if (data.actived === false || data.actived === true) {
    const updated_person = await ChangePersonStatus({
      id: idPerson,
      actived: data.actived,
    });
    res.status(200).json({
      message: "sucess",
      data: updated_person,
    });
  } else {
    res.status(400).json({
      message: "actived must be true or false",
    });
  }
});

export default router;
