import stuff from "./stuffs.js";
import person from "./persons.js";
import user from "./users.js";

const UseRouter = (app) => {
  app.use("/stuffs", stuff);
  app.use("/person", person);
  app.use("/user", user);
};

export default UseRouter;
