require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const User = require('./models/user');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

mongoose.set('strictQuery', false);

console.log('connecting to DB');

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('successfully connected to DB');
  })
  .catch((error) => {
    console.log('error connecting to DB, reason', error.message);
    process.exit(1);
  });

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
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
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        try {
          const auth = req ? req.headers.authorization : null;
          if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(
              auth.substring(7),
              process.env.SECRET
            );
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
          }
        } catch (error) {
          return { currentUser: null };
        }
      },
    })
  );

  const PORT = process.env.PORT;

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
};

start();
