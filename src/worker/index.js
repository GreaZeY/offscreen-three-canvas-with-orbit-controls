import { expose } from "comlink";
import * as handlers from "./workerHandlers";

self.window = {};

self.document = {};

const workerHandlers = {
  ...handlers,
};

expose(workerHandlers);
