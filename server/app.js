import createError from 'http-errors';
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as localStrategy } from 'passport-local'
import User from './models/users.js';
import bcrypt from 'bcrypt'
import indexRouter from './routes/index.js';
import passport from 'passport';
import { ApolloServer } from 'apollo-server-express';
import Schemas from './gql/schemas.js';
import resolvers from './gql/resolvers.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: __dirname+'/.env'})

const server = new ApolloServer({
  typeDefs: Schemas,
  resolvers,
  context: async ({ req }) => {
    // do curr_user stuff and add mongo models
  }
})

await server.start()

const app = express();
server.applyMiddleware({ app, path: '/graphql'})

const mongoDB = process.env.MONGO_URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, '../frontend/build')));

// Passport Stategy
passport.use('signup', new localStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hashedPassword, isAdmin: false });
    
    return done(null, user);
  } catch (error) {
    done(error);
  }
}));

passport.use('login', new localStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const validate = await user.isValidPassword(password);
      if (!validate) {
        return done(null, false, { message: 'Wrong Password' });
      }

      return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
      return done(error);
    } 
  })
);

passport.use('jwt', new jwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET
}, async (payload, done) => {
  const user = await User.findById(payload._id)
  
  if (bcrypt.compare(payload.password, user.password)) {
    return done(null, user)
  } else {
    return done(null, false)
  }
}))

app.use('/api', indexRouter);


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
