import { createServer } from "./index.js";

const PORT = process.env.PORT || 6969;

const server = createServer();

server.listen(PORT, () => {
  console.log(`Server is running on the ${PORT} PORT`);
});
