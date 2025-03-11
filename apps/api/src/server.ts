import { createServer } from "./index.js";
import "dotenv/config";

//SERIALIZE BIGINT
declare global {
  interface BigInt {
    toJSON(): string;
  }
}
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const PORT = process.env.PORT;

const server = createServer();

server.listen(PORT, () => {
  console.log(`Server is running on the ${PORT} PORT`);
});
