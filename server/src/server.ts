import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as dotenv from "dotenv";
import { typeDefs } from "./schema/schema";
import { resolvers } from "./resolvers/resolvers";
import { checkConnection } from "./PostgreSQL/PostgreSQL";
import connectToDatabase from "./mongoDB/mongoConnection";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
// import Redis from "ioredis";
import http from "http";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import chalk from "chalk";
import RedisClient from "./redis/redis";
import { makeExecutableSchema } from "@graphql-tools/schema";

interface context {
  token?: string;
}

dotenv.config();
const PORT = process.env.PORT ;

const app = express();
const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
});
const schema = makeExecutableSchema({ typeDefs, resolvers });
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer<context>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),{
    async serverWillStart() {
        return {
            async drainServer() {
                await serverCleanup.dispose();
            },
        };
    },
},],
});

const start = async () => {
  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    morgan("tiny"),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.token;
        return { token };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(chalk.blueBright(`🚀 Server ready at http://localhost:${PORT}/graphql`));
  await checkConnection();
  await connectToDatabase();
  RedisClient.connect()
    .then(() =>
      console.log(
        chalk.magentaBright("Connected to Redis🚀🚀")
      )
    )
    .catch((error) => {
      if (error instanceof Error) console.log(error.message);
    });
};
start();