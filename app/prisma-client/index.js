"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "AccountType",
    embedded: false
  },
  {
    name: "Permission",
    embedded: false
  },
  {
    name: "Specialization",
    embedded: false
  },
  {
    name: "ChatRoom",
    embedded: false
  },
  {
    name: "MessageContent",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/lyfeaid/demo/dev`
});
exports.prisma = new exports.Prisma();
