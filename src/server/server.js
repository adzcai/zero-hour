// reads in our .env file and makes those values available as environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');

// Set up express server and socket.io
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Load routes from other files
const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');
const passwordRoutes = require('./routes/password');

const asyncMiddleware = require('./middleware/asyncMiddleware');
const ChatModel = require('./models/chatModel');

const players = {};
const ARENA_WIDTH = 6400;
const ARENA_HEIGHT = 6400;

io.on('connection', (socket) => {
  console.log(`A user connected at socket ${socket.id}`);

  socket
    .on('joinGame', (x, y, texture) => {
      console.log(`Player ${socket.id} joined the game`);
      players[socket.id] = {
        x, y,
        rotation: Math.floor(Math.random() * 2 * Math.PI),
        playerId: socket.id,
        playerTexture: texture,
      };
      // We send the client the information of the current players
      socket.emit('currentPlayers', players);
      socket.emit('arenaBounds', ARENA_WIDTH, ARENA_HEIGHT);
      // And tell all of the other clients that a new player has joined
      socket.broadcast.emit('newPlayer', players[socket.id]);
    })
    .on('playerMovement', (data) => {
      if (!players[socket.id]) return;
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      players[socket.id].rotation = data.rotation;
      socket.broadcast.emit('playerMoved', players[socket.id]);
    })
    .on('laserFired', (laser) => {
      socket.broadcast.emit('laserFired', laser);
    })
    .on('laserHit', (laserId) => {
      socket.broadcast.emit('laserHit', laserId);
    })
    .on('leaveGame', () => {
      console.log(`Player ${socket.id} left the game`);
      delete players[socket.id];
      socket.broadcast.emit('leaveGame', socket.id);
    })
    .on('disconnect', () => {
      console.log(`The user at socket ${socket.id} disconnected`);
      if (players[socket.id]) {
        console.log(`Player ${socket.id} left the game`);
        delete players[socket.id];
        socket.broadcast.emit('leaveGame', socket.id);
      }
    });
});

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

// update express settings
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());

// require passport auth
require('./auth/auth');

app.get('/game.html', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../build/game.html'));
});

app.use(express.static(path.resolve(__dirname, '../../build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../build/index.html'));
});

// main routes
app.use('/', routes);
app.use('/', passwordRoutes);
app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

// We put this here to have access to io
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

app.get('/messages', passport.authenticate('jwt', { session: false }), asyncMiddleware(async (req, res, next) => {
  const messages = await ChatModel.find({}, 'email name message createdAt -_id')
    .sort({ createdAt: -1 })
    .limit(30);
  res.status(200).json(messages.reverse());
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

// have the server start listening on the provided port
http.listen(process.env.PORT || 8080, () => {
  console.log(`Server started at http://localhost:${process.env.PORT || 8080}`);
});
