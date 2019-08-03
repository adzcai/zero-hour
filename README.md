# Zero Hour

A space shmup game I made for a school project using the HTML5 game framework [Phaser 3](https://phaser.io/phaser3). This project was made with help from [these amazing tutorials](https://phasertutorials.com/creating-a-simple-multiplayer-game-in-phaser-3-with-an-authoritative-server-part-1/) on Zenva.

## How to play

This app is hosted using heroku. Simply go to the site https://thepiguy-zero-hour.herokuapp.com/ to view the game. The source code is located under the js/ repository.

## How to develop

1. First of all, install [Node.js](https://nodejs.org/) if you haven't already.
2. Clone this repository and navigate to it in your terminal or command prompt.
3. Run `npm install` to install all of the dependencies.
4. Run `npm run dev` to build the files. This project uses [`concurrently`](https://www.npmjs.com/package/concurrently) to run three processes at once:
  - Starts a local `mongod` server for testing
  - Bundles your files using webpack, watching your files for any changes and automatically updating them
  - Begins the server with `src/server/server.js` as the entry point

## How to run
1. Run `npm run build` to build the webpack files, and then run `npm start` to launch the server.
2. Navigate to http://localhost:8080/ in your browserto view the game.
