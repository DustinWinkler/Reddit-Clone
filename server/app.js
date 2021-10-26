import createError from 'http-errors';
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import User from './models/users.js';
import Post from "./models/posts.js";
import Comment from "./models/comments.js";
import Subreddit from "./models/subreddit.js";
import { ApolloServer } from 'apollo-server-express';
import Schemas from './GraphQL/schemas.js';
import resolvers from './GraphQL/resolvers.js';
import jwt from 'express-jwt';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: __dirname+'/.env'})

const app = express();

app.use(jwt({
  secret: process.env.AUTH_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false
}))

const server = new ApolloServer({
  typeDefs: Schemas,
  resolvers,
  context: async ({ req }) => {
    const currentUser = req.user
    return {
      User,
      Post,
      Comment,
      Subreddit,
      currentUser
    }
  }
})

await server.start()

const corsConfig = {
  credentials: true,
  origin: '*'
}

server.applyMiddleware({ app, path: '/graphql', cors: corsConfig})

const mongoDB = process.env.MONGO_URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, '../frontend/build')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 404);
  res.json(err);
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

export default app;
