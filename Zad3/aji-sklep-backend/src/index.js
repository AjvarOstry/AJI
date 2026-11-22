import { app } from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(`Bakcend uruchomiony na porcie ${config.port}`);
});