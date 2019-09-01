/* eslint-disable no-param-reassign */
// reads in our .env file and makes those values available as environment variables
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Datauri = require('datauri');
const express = require('express');
const jsdom = require('jsdom');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

// We set up our express server
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

// Load routes from other files
const routes = require('./src/server/routes/main');
const secureRoutes = require('./src/server/routes/secure');
const passwordRoutes = require('./src/server/routes/password');

const asyncMiddleware = require('./src/server/middleware/asyncMiddleware');
const ChatModel = require('./src/server/models/chatModel');

const datauri = new Datauri();
const { JSDOM } = jsdom;

// setup mongo connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
mongoose.connection
  .on('error', (error) => {
    console.error(error);
    process.exit(1);
  })
  .on('connected', () => {
    console.log('connected to mongo');
  });
mongoose.set('useFindAndModify', false);

// Load in some middlewares to make sure we can read incoming requests properly
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

require('./src/server/auth/auth');

// Serve our static files and set up our main routes (see ./routes)
app.use(express.static(path.resolve(__dirname, 'build')));
app.use('/', routes);
app.use('/', passwordRoutes);
app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

// Specific paths when the user tries to access certain parts
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
app.get('/game.html', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'game.html'));
});
app.get('/messages', passport.authenticate('jwt', { session: false }), asyncMiddleware(async (req, res, next) => {
  const messages = await ChatModel.find({}, 'email name message createdAt -_id')
    .sort({ createdAt: -1 })
    .limit(30);
  res.status(200).json(messages.reverse());
}));

// We put this here to have access to SocketIO
app.post('/submit-chatline', passport.authenticate('jwt', { session: false }), asyncMiddleware(async (req, res, next) => {
  const { message } = req.body;
  const { email, name } = req.user;
  await ChatModel.create({ email, name, message });
  io.emit('newMessage', {
    username: name,
    message,
  });
  res.status(200).json({ status: 'ok' });
}));

// catch all other routes
app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Not Found' });
});
// handle errors
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

function setupAuthoritativePhaser() {
  console.log('setting up authoritative server');

  JSDOM.fromFile(path.resolve(__dirname, 'src', 'server', 'authoritative-server', 'index.html'), {
    // To run the scripts in the html file
    runScripts: 'dangerously',
    // Also load supported external resources
    resources: 'usable',
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true,
  }).then((dom) => {
    console.log('finished loading file');
    dom.window.URL.createObjectURL = (blob) => {
      if (blob) {
        return datauri.format(
          blob.type,
          blob[Object.getOwnPropertySymbols(blob)[0]]._buffer,
        ).content;
      }
    };
    dom.window.URL.revokeObjectURL = (objectURL) => {};
    dom.window.gameLoaded = () => {
      server.listen(8080, () => {
        console.log(`Listening on http://localhost:${server.address().port}`);
      });
    };
    dom.window.io = io;
  }).catch((error) => {
    console.log(error.message);
  });
}

setupAuthoritativePhaser();

console.log('Open the debugger at chrome://inspect/#devices');
