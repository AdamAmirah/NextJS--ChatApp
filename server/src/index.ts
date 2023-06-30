import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import * as dotenv from "dotenv";
import { GraphQLContext, Session, SubscriptionContext } from "./util/types";
import { verifyJwt } from "./util/functions";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

const prisma = new PrismaClient();
const pubsub = new PubSub();

async function main(typeDefs, resolvers) {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams && ctx.connectionParams.session) {
          const { session } = ctx.connectionParams;
          return { session, prisma, pubsub };
        }

        return { session: null, prisma, pubsub };
      },
    },
    wsServer
  );

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const server = new ApolloServer<GraphQLContext>({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const session = verifyJwt(req.headers.authorization.split(" ")[1]);
        //console.log(session);
        return { session: session as Session, prisma, pubsub };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log("the server is up and ready");
}

main(typeDefs, resolvers).catch((err) => console.log(err));
