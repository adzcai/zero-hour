
     ______     ______     ______     _____     __    __     _______
    /\  == \   /\  ___\   /\  __ \   /\  __-.  /\ "-./  \   /\  ____\
    \ \  __<   \ \  __\_  \ \  __ \  \ \ \/\ \ \ \ \-./\ \  \ \  __\__
     \ \_\ \_\  \ \_____\  \ \_\ \_\  \ \____-  \ \_\ \ \_\  \ \______\
      \/_/ /_/   \/_____/   \/_/\/_/   \/____/   \/_/  \/_/   \/______/


###########################################################################
###########################################################################
###########################################################################
#####                                                                 #####
#####   Game Engine: Phaser 3, Developed by: Photonstorm              #####
#####   Website: www.phaser.io, Git: https://github.com/photonstorm   #####
#####                                                                 #####
#####   Project: Basic Phaser3 Node Heroku, Developed by: scope2229   #####
#####   Date: 22/07/2018, Version: 1.0.0                              #####
#####                                                                 #####
#####    Phaser 3.11                                   	              #####
#####                                                                 #####
###########################################################################
###########################################################################
###########################################################################


///// NPM: 6.2.0 ///// node: 10.8.0 /////

Were going to create a simple Template for Phaser 3 that can be deployed to Heroku.
There are many ways to do this. Its really about personal preference and what is best for your skill level and probably most importantly what the end result should be. Different frameworks engines modules and languages all offer pros and cons and its up to you to plan accordingly.
we'll break this up into phases making it easier to track our progress and also giving us some sort of feeling of achievement even though to begin with there wont really be much there.

Phase1
  For phase 1 i'm going to set some basic configuration tasks for my development environment. What i will need to use to achieve the end result. I'll also need to take into account cross compatability for ease of use among many different systems.

  The ultimate goal is to deploy the final app to heroku so we need to make sure we remember to set up for this.

if we look at herokus docs as thats our end goal we can see what we have on offer for us today...

https://devcenter.heroku.com/

Looking here we can see we already have some great options to choose from

Node.js
Ruby
Python
Java
PHP
Go
Scala
Clojure

For my skill level and also my own preference i tend to sway towards the Ruby framework. Python is also great as you can really do so much and with the language being designed for kids to learn, its a great place to start and IMO a must have skill for all developers be it basic usage or full blown development. Nodejs is what we will be using today theres more documentation covering phaser and node than any other framework although later on i will show you how to use some other frame works.

For now go and google each of the frameworks find out for your self what they have to offer the pros and cons and limitations of each framework.

Once you've done that goto nodejs and start looking at the docs.

on the homepage we can see that we have two version on display. (There are more but you need to dive deeper into the page for now stick with these)
An LTS version and a current version.

This basically means one has long term support and likely to be more stable but lack certain capabilities the other is current its the latest stable version of nodejs

A simple google search will result in this explanation that is pretty self explanatory across the board.

https://stackoverflow.com/questions/33661274/what-are-the-differences-between-long-term-support-lts-and-stable-versions-of

now that we understand more about the two we can make better choice. We need to get used to googling for answers for a start. second this is not going to be a professional project for a company however we are going to adhere to certain practices. This helps us when transitioning from hobbyist/learner to a more professional setting, at the same time helping people help you a lot faster by making things clear from the beginning.

with these in mind were going to choose the most current version.

using nvm (node version manager - check my tutorial on building development environments) we are going to install 10.8.0

and set it to default for now.

how to do this is simple google is your friend haha

https://github.com/creationix/nvm

check out the page for usage.

the best explanation of node i found was this

Node.js is for creating server-side applications in javascript (see: node.js ).  The client side is expected to be done using another Javascript or web framework. In other words, node.js is not for building websites, it is for building what a website talks to on the back-end. Best wishes!
Michael Daconta, Software Engineer and Author


ok so we've chosen node now we need to choose how were going to build our project with a simple search results in many different routes. we know that our main game code is going to be javascript so that must come first so we need to find a module bundler that will work with nodejs and javascript.

https://medium.com/@rukshandangalla/what-is-best-javascript-module-bundler-316b73049660

i like this guys explanation of a lot of different aspects that you will see like AMD, UMD and also his explanations of modules ES5 and further aspects that you should know about.

and finally http://code.hootsuite.com/an-introduction-to-javascript-modules-and-bundling/

now we know about these we can see they all mention webpack so lets use webpack

and we also know we need to transpile es6 to es5 so we need babel

thats it for the research on our server side now we need to research webpack babel and nodejs to see what we need.

remember still no code yet. were not ready it will become messy and stressful.

we should have open

https://nodejs.org/en/
https://webpack.js.org/
https://babeljs.io/

now to get a better understanding of each component we should read the docs and take a look at some videos.
Nodejs
https://www.youtube.com/watch?v=pU9Q6oiQNd0

for webpack
https://www.youtube.com/watch?v=JdGnYNtuEtE&list=PLkEZWD8wbltnRp6nRR8kv97RbpcUdNawY
for babel
https://www.youtube.com/watch?v=C2PDAGCrk_g

after watching all 15 videos you should have a pretty good idea now what are tasks are so lets write them

  /################## TASKS ####################/

    create folder structure
    set up git
    set up heroku
    set up node current
    set up npm current
    webpack
    babel

  /#############################################/

Now we can start to do something finally. really that only took a couple of hours though.

  -- Create folder structure.
      --/Root
        --/assets
        --/src

        README.md

  Root will be named what ever you like but mine is called Phaser-node-heroku
  assets will hold all our styles, images, fonts and videos including audio.
  src will hold our template HTML and all of our game code. along with and otherr pages to the site you want to add.
  Finally inside the read me you need to include What your using an the versions references and credit where due.

  For example we are using phaser3 HTML5 game framework so in the top of my readme i want to credit the owner because its well deserved.

  Next is the project name and author. along with date and version also what plugin and modules have been used there versions and site reference.

  This makes it much faster for you in the future you can just goto your read me click the link and bam you've got the docs to support your code. it also make development a little faster and not so conjested and wish wash.

  because you have already looked over everyting you will use and will have a good idea what you need to do.

Next is to set up git.

git init inside Root

goto github or bitBucket
Whats the difference you might ask, why did i choose github over bit bucket. simples. I use bitbucket for private work and github for public and testing work.

You can choose its really up to you just remember to check the docs and its basically the same set up

Create a repo
Name it
select the option to upload an existing repo
now you should be able to follow the steps either from here or there

https://help.github.com/
https://confluence.atlassian.com/get-started-with-bitbucket/set-up-a-repository-861178557.html

in our root directory we want to follow the step in the links to add the repo remote

we have a choice to set up our creds either local per repo or global
i always choose local because of changing dev environments depending what im doing

i dont log in with passwords i use ssh keys so goto the docs and have a look

https://help.github.com/articles/connecting-to-github-with-ssh/

register new key like so
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

i have many keys that i manage and update frequently so i always name my keys placing them in folders

adding the keygen they say to use xclip but if you dont want to install a new piece of soft just for this open the file in nano or vim etc copy then paste to github etc

you need to copy uour public key not private

now we can push to github with ssh and not pasword username

so lets create a .gitinore for node from template.
now use git add .
git commit -m "Initial commit"

set the remote to our app

git remote add origin git@github.com:username/project.git

git push -u origin master

check github make sure your readme and folders are there.

now for heroku

even in learning you should get into the habbit of doing things proffesionally as possible.
this means as little down time as possible server side with a way thats effortless to test both locally and in production

to do this we create two application in heroku one for staging and one for production
we link these apps through pipelines

git hub is our source heroku is our hosting we dont really want to be sending the same app twice its a pain so what we do is only send to git hub link our staging application to our github repo. set to auto update when github updates.

that means when we send commits to master on github the master with be pushed to heroku staging ready for production testing.

the next step is to have heroku production app link with pipeline again but to the staging app
this we want as manual update so we can test first and when were happy promote to production.

Key note here is you must adhere to the workflow structure and not create a decelopment environment in heroku. Remember you are developing locally  and only using heroku for staging and production and github or bitbucket etc to store your repo.
this is due to environment variables that are set in each type of application that affect the way our application will do things.
This will become more clear latter on but for now think of it as this 1 is everything and very big lots of tests extra config 2 is minimal almost prod with testing ability and 3 is production with no testing just your app with optimal performance settings

your app will look for either 1 2 or 3 and change settings based on the value

to be more specific the variables for this project that the app will look for are development, staging, production

now thats all set up we can ignore heroku for some time as it wont work yet. we dont have anyting to display.

use nvm  to install our node version
nvm install 10.8.0
check npm and node version
if you get something like please install or not found

check nvm ls
then if your node is there use nvm use 10.8.0 this will now give you node and npm versions

now we need to create our node project with npm init

package name: ProjectName
version: (1.0.0)
description: "what it is what is does and maybe what it uses briefly"
entry point: (index.js) ours will be index.js
test command:
git repository: link to your git repo
keywords: relevant to your app
author: Scope2229
license: MIT for lisensing its really to long to explain so please read this book Understanding Open Source and Free Software Licensing
by Andrew M. St. Laurent here
https://www.safaribooksonline.com/library/view/understanding-open-source/0596005814/

it explains most of what you need to know about the different lisenses and how to use them.

now we install phaser as a dependency (https://docs.npmjs.com/files/package.json check these docs to find out the options and why you use what you do etc )

next is webpack and its dep

npm i -D webpack webpack-cli

we want to use css images videos and audio

to do that following the video and docs we install

npm i -D css-loader file-loader raw-loader

to separate our css into its own file we'll use mini-css-extract-plugin
The docs also mention about cleaning our build which is a good idea so add that along with the html-webpack-plugin to add our bundled code automatically to a template.

npm i -D clean-webpack-plugin html-webpack-plugin mini-css-extract-plugin

now if you read the docs fully and watched the videos you should know about  a section on the webpack-dev-server this allows to watch and reload the browser when a file changes that we are watching.

https://webpack.js.org/guides/development/#using-webpack-dev-server

npm i -D webpack-dev-server

finally we add babel
npm i -D babel-loader babel-core babel-preset-env


ok we done for the dependcies. lets get to some coding and configuration

remember this phase is just for development however we still want to remember about the future plan.

under main in the package.json

add the following

"babel": {
  "presets": [
    "env"
  ]
},

the config in babel tells us to create a babelrc file but it also says if it isnt there it will look inside package.json. i like less files especially when the file just contains 5 lines

next we want a development script and a way to test the development build without the webpack dev server so we can see what is being built etc clearly. without needing to change anything other than what runs the config file.

"scripts": {
  "dev": "webpack-dev-server --config webpack.config.dev.js",
  "devTest": "webpack --config webpack.config.dev.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},

so when we use npm run dev it will use the webpack dev server with a config file specified.

next is to test the build so webpack dev server stores its files in memory and doesnt build anything that we can physically see in out ide
we might want this just to have a reference about whats going on whats being created and where.

we just use webpack and the same config for dev

next is test but we will come to that later on. for now we need a basic dev setup.

create file webpack.config.dev.js

follow the information from the docs and the videos bearing in mind we are using the latest version of webpack so videos as reference but the docs take priority.

so we want to use fixed variables to hold our requires as shown in the docs. but they use var but we are using es6 which allows access to let and const

https://blog.mariusschulz.com/2015/12/31/constant-variables-in-javascript-or-when-const-isnt-constant

we have two options that i like to use to access files fs or path i stick to path with basic sites but have a look at fs and get used to it as you will need it in the future.

we need to initalise  our plugins we need for our development environment

const path = require('path'),st webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

this is messy and long so too clean it up and DRY our code as const is repeated too many times we can chain our const as it has been initalised aswell.

const path = require('path'), webpack = require('webpack'), HtmlWebpackPlugin = require('html-webpack-plugin'), CleanWebpackPlugin = require('clean-webpack-plugin'), MiniCssExtractPlugin = require('mini-css-extract-plugin'), CopyWebpackPlugin = require('copy-webpack-plugin');

this is much better and most importantly DRY.

if your typing the same thing ten times there is normally a better way for you to achieve the end result.

now we will declare some DIRs you dont have to but look at it this way if i right my code and everything is fine but later change directories i need only change then next few lines. Makes sense. Makes code more manageable.

so we have assets src and we also want to include node_modules. if your ide hides files from the gitignore then you may not see node_modules but its there trust me. if its not you got problems.

const nm = path.join(__dirname, 'node_modules'), srcPath = path.join(__dirname, 'src'), assetsPath = path.join(__dirname, 'assets');

so we use path.join but wee could use resolve

https://stackoverflow.com/questions/35048686/difference-between-path-resolve-and-path-join-invocation

we'll use join.

then __dirname is different depending how its used but for webpack you need to know it returns the root directory or '/' if you were using webpack you could still use __dirname but it would have a different output all together. rather than '/' you'd get something like

/home/User/Documents/ProjectFolder/

varies from system to system and also on your own personal organization

and finally the folder you want inthis case node_modules if nested it would be __dirname, 'folder1', 'folder2' etc

now for the webpack dev config

we set mode to development devtool to inline-source-map but check out the others here

https://webpack.js.org/configuration/devtool/#devtool

use them all have a look at how they perform later on when the end project is finished now you dont have anything to play with so stick with inline-source-map till you do.

spiffy
now the dev server
  contentBase https://webpack.js.org/configuration/dev-server/#devserver-contentbase
  so this is what the public will be able to see when they visit your site. so we'll set this to our output which will be build
  for this example our game is going to be our root page nice and simple

  so set publicPath to /
  if we want to see the progress of the build we set that to true
  we can also compress our assets to make them smaller by setting compress to true finally define our port.

  https://webpack.js.org/configuration/watch/#watch

  watch is set to default false but while developing it would be good to not keep restarting the server unless we change the server config.

  set watch to true

  now to make things a bit quicker we are going to resolve all of our absalute path for our files including node modules. This is because node modules contains our phaser code.

now its time to set our entry file this is the initial javascript file that will start the whole application

in this example game.js is our only initialising js file but you could have one for each page.

create game.js inside src and home.css in assets/styles/

inside home.css

body {
  background-color: black;
}
h1 {
  color: red;
}

This is just to test that the import of css actually works.

now inside game.js
import '../assets/styles/home.css'
alert('hi')

this tells the bundle to make sure the css file is bundled with the application as webpack works by looking for all the files associated with game.js. A note to make you dont need to import everything here. i called this an initialising js file because thats how i treat it. i use this to initiate any other modules i have created games or not.

in our config set the entry we also want to specifiy the entry but we want to remember about maybe in the future adding extra pages etc.

so we will name our entry game as were making a game and we dont really need an absolute path but because we needed it for our modules its best to use it again only this time we dont need to use __dirname we can use our defined const dir for src

because we have installed phaser with npm and not using a downloaded src file we can set a vendor: setting to phaser
https://webpack.js.org/concepts/entry-points/#separate-app-and-vendor-entries


entry: {
  game: path.resolve(srcPath, 'game.js'),
  vendor: ['phaser']
},

now its the output this is where webpack will put the final build.
by default webpack uses dist but we are learning so were going to change it.
outputpaths want to be absolute and our public path needs to be the same.
because we can see we have at least 2 files to build already we'll use a name array to give our bundle a unique name automatically.

output: {
  path: path.resolve(__dirname, "build"),
  filename: '[name].bundle.js',
  publicPath: 'build'
},

now for the plugins.

looking at previous examples of phaser they all have some things in common but one is
'CANVAS_RENDERER': JSON.stringify(true),
'WEBGL_RENDERER': JSON.stringify(true)

to better understand why we need this have a look at the chat below
this explains the need and why youd use it.

Scope [1:08 AM]
what is this actually doing 'CANVAS_RENDERER': JSON.stringify(true),
     'WEBGL_RENDERER': JSON.stringify(true)
i know it uses json to stringify the canvas_renderer but what is it actually stringing

rich [1:09 AM]
https://webpack.js.org/plugins/define-plugin/

Scope [1:10 AM]
that explains all the development asking but why only development
is there something servers do that local servers dont ?? (thats actually really broad as there as lot either do and do not do lol but i mean specifically for this instance) (edited)

rich [1:11 AM]
you what?

Scope [1:12 AM]
why would i only need the global variable during development and not production

jane [1:13 AM]
joined #general.

rich [1:13 AM]
you don't, you need it for both

Scope [1:17 AM]
that makes a lot of sense now

Joe [2:18 AM]
It just declares that both can be used. Phaser picks up on those choices as (true, true) and use its best judgments when selecting the proper type, assuming you used `.AUTO` in your gameconfig
turn one or both to false and see the magic happen

Scope [2:19 AM]
ah ok so its letting the browser know it needs either canvas or webgl if either or both come back to true then fallback to phaser.auto which will then choose
unless phaser.canvas or webgl then either or vice versa would cause an error

Joe [2:43 AM]
not the browser, phaser. you can turn off webgl globally, so like a global variable

rich [2:47 AM]
think of it as an ‘include’ switch - if you disable WebGL in the config it won’t include any of the WebGL classes into the build

with this in mind and the link provided we can set a two global constants that phaser actually needs to run.

thats because phaser uses html5 canvas or it can use webgl technology
its important to note that When you send data to a web server, the data has to be a string. for this we can use json and convert our object to a string like so

new webpack.DefinePlugin({
  'CANVAS_RENDERER': JSON.stringify(true),
  'WEBGL_RENDERER': JSON.stringify(true)
}),

next we create the plugin options for our HtmlWebpackPlugin
our main html template is inside src and its called index.html

so create that file.

then reference it using template: path.resolve(srcPath, 'index.html'),
title: "Name your template" the title will be used in the tab bar of your browser so dont just leave it blank

next is the plugin for our separate css files

new MiniCssExtractPlugin({
  filename: "./assets/styles/[name].css",
  chunkFilename: "./assets/styles/[id].css"
})

we dont need to use path here we can just type the location that we wish to place the bundled files.

now to clean our bundle so we dont have to as the docs state
new CleanWebpackPlugin(['build'])

if your using the default location not a custom one then it would be dist not build

thats great for our plugins but it still doesnt do anything we have set any rules for the modules no assets are being rendered etc

so next we do this with module rules
  we set an array and inside the array goes each object which will eb a rule

first we need babel

https://babeljs.io/setup#installation

a basic config would be this but if we look further into the docs we can see we have a lot more option to play with

https://babeljs.io/docs/en/babel-preset-env

so using the two links we should be able to set our plugin to test for any file ending in .js
the loader obvously is babel-loader
but we only want to include our game as that is our es6 code which is located in source
so include: srcPath
we dont want to include node_modules
so exclude: nm
and we want to compact the results with options compact: true

check out these docs for more options
https://babeljs.io/docs/en/babel-core.htm

next is our css for this we used out MiniCssExtractPlugin
so set the test for css
and use the MiniCssExtractPlugin.loader
for the options we can set the publicPath to assets/styles/
but its not really needed and for basic config it can be left out all toether as we have defined most of what we need already

and the next use or loader is the css-loader

when chaining loaders webpack works in a set order if we were to place css-loader first it would fail as the MiniCssExtractPlugin hasnt done anything with the files yet.

for images its the same process
search the docs find file-loader check out the info and start you rules

test jpeg jpg png gif
loader file-loader
include our assets path
exclude node
give it a path and name with ext

its worth noting that file-loader can handle a lot more files with phaser you can use bitmap fonts aswell as other standard fonts in your game code. we'll keep this in mind for later.

last but not least its the raw loader
A loader for webpack that allows importing files as a String.
thats what the docs say but why we need it is something completely different.

if we dont add this last loader we will get an error like this

Module parse failed: /home/User/Documents/phaserheroku/app/node_modules/phaser/(some phaser component).frag Unexpected character '#' (1:0)
You may need an appropriate loader to handle this file type.

this is because phaser uses .frag and .vert files in its design and construction to speak with webgl
so we need to test for these and load them with the raw loader like so

{
  test: [ /\.vert$/, /\.frag$/ ],
  use: 'raw-loader'
}

At this stage this next section is optional but i like to add it for test sake remember we want to get as close to production as possible ideally

https://webpack.js.org/configuration/optimization/
https://webpack.js.org/plugins/split-chunks-plugin/

but i like to optimize phaser a bit
by using splitChunks
using name vendor and chunks all

check out the docs and videos online see what other options are available like uglify plugin


now our webpack config for dev should be finished and working. we should have two scripts we can run one for live reloading development with the browser and another for checking whats being built and where

to test we can use npm run dev or npm run devTest

but this application still wont display anthing other than whats inside the html template the css file and our intialising js file an alert to say hi

with this done its time to add to git commit the changes check out to the master branch and merge the last working branch to the master branch

finaly push via ssh to github

now goto github and heroku and have a look

github should have

assets
src
.gitignore
README.md
package-lock.json
package.json
webpack.config.dev.js

and heroku should fail to build giving an error about start dont worry about this at the minute just look to see that github has pushed to heroku automatically

but as we can see phase 1 is complete.

now we can move on to phase 2 initalise phaser and get a simple structure ready for our game.

reading the examples from phaser.io i can see i need to set up the config for our game inside my initialising js file but the examples are all for a single filed application. where as we are going to create a game that is not just simple but can also be scaled up later on as our skill progresses.

First phaser uses javascript so if you already know javascript you can skip this section but for those that dont ill just breifly give you what you need to be able to do something and have the skills and confidence to grow.

Theres many different ways to develop with phaser each have pros and cons but to list a few that i have often used javascript jquery coffeescript you also see typescript within the phaser docs.

but it will all come down to what you are comfortable with and what you can learn. in the begining learn javascript with es6 or 5 so you can understand more of what is going on. later move to a superset of javascript, but as with all languages you just need the basics to be able to understand what is going on and have the patience to search the internet before asking questions.

The bare basics you need for most languages are things like

conditional statements, conditional expressions and conditional constructs
how to perform iterations
loops and loops with conditions
while statements
variables
arrays
objects
lists

not all languages have all of these but understanding the basics on a fundamental level will help you pass on that knowledge to other languages that also use the same methodology but in a diferent language for instance

if you learn python to an intermediate level you could quite easily pass on much of that knowledge into learning javascript, C++ or Java,  

each of those languages perform in different ways and are structured intirely different but the fundamental knowledge can still be used and passed on.
another example is, python, c++, and Java have networking abilities. if you understand fundamentally how tcp and udp work and how to initiate them all you need to do is learn how each language uniquely deals with each task.

It does get much deeper than that but thats how you can quickly learn a new language by really focusing on fundamental practices.
Using searches and time to keep reading while testing.

for phaser you really need to understand scope and 'this' not this litterally like oh this is a pen but javascripts often confused keyword 'this'
there are many sources out there explaining scope and 'this'. so take some time to find out more about it a starting point could be here

 https://javascriptplayground.com/javascript-variable-scope-this/

lets read how phaser works on the website in getting started we see the game config and then a preload create and update. remember we are always thinking scale.

so find out what they do and see if we can break them up.

googling give us some outdated results as we are using phaser 3 not 2 but they are still usefull. we can use that understanding and pass on to phaser 3

now it should seem clear why we chose es6 and set up our developmetn the way we did.

it helps in breaking everything up into manageable pieces.

readng through the phaser forum http://www.html5gamedevs.com/forum/33-phaser-3/

you will find this https://github.com/jdotrjs/phaser-guides/blob/master/Basics/Part3.md

this is how phaser scenes work so after reading this i can already say that the example on the homepage is basically just one whole scene with all the config at the top of the file to initialise everything with the game following.
after searching some more we see that phaser works like so

we have our game config here we can define window size if we want global arcade properties we can set it here otherwise the physics can be set in the scene itself. However there are limitations
you can have matter, ninja or arcade physics together in a scene but they wont be able to interact with each other only with themselves

during development we set debug to true this will give us more info about what is going on with the arcade system

next it tells the game config what scenes are available in an array
these could be as below

Boot scene
Preloader scene
Title scene or main menu
and then a game scene

and finally a variable or object  that starts phaser with our config object

https://jwiese.eu/en/blog/2017/08/phaser-3---game-configuration/

next is more with how each scene functions

we see preload create update along with further functions underneath.

preload is done before the game starts its kinda in the name, the docs show us thats where we load our assets.
the create function again is self explanatory again here we create the objects used in the game we can apply additional functions later on that are called when this function is ran.

finially update is our game loop.
the loop only ends when the scene is paused or destroyed.

go and google more about game loops and how they work try to understand more about fps

using the examples on the website and a few videos from youtube and google we should be able to get a better understanding and know now how to split our code so phase 2 we can now set some tasks

/###################Task####################/

create boot preloader mainMenu lvl1
inside boot load a simple logo and any further configs you need. and start the preloader.
there is a great tutorial here on this

https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13

also inside our preloader we can create any animations that we will use. to do this we place them all in our create function before starting the next scene.

but we'll use that later.
now that we have a bassic preloader we can start our main menu.

here we want a simple background. our games name and maybe some information on how to play the game.
we can create an input to start the game too

level 1 is going to be a bit more complex.

here we are going to have parralax scrolling background to give a 3 dimentional effect.
the game will run from top to bottom with the player at the bottom
we want arcade physics to keep things simple but you will soon learn its limitations.
we are going to want to shoot and be shot at
have the ability to kill and be killed.
and also we'll add a bullet count that we can increase or decrease.
we'll want a score count with a ui to hold all this information
we'll also need something to happen when we die

so now we have a better idea lets get started on tasks.

next create a new branch

git checkout -b initphaser

inside your src folder create levels/ objects/ scenes/ dirs

next inside scenes/
create boot.js preloader.js mainmenu.js gameOver.js UiScene.js
inside levels/ place lvl1.js
inside objects have a bullet.js and player.js

in our initialising js file we need to import our scene modules

import { Boot } from './scenes/boot'
mport { Preloader } from './scenes/preloader'
import { MainMenu } from './scenes/mainMenu'
import { GameOver } from './scenes/gameOver'
//active scenes for data
import { StoreData } from './scenes/UiScene'
//levels
import { Lvl_1 } from './levels/lvl1'

then we have our game config type can be set to canvas or webgl but here we use auto. if the browser accepts webgl its used if not canvas.

the parent is the id of the dom element this will be added to our html template.
pyshics will be different for each engine but here we use arcade

next is our scenes that we imported

and finally place all the im a new phaser game using the predefined config

next lets set up the scenes so we can can just skip through and check its working

export class Boot extends Phaser.Scene{
  constructor(){
    super('boot')
  }
  preload() {

  }
  create() (
    this.scene.start('preloader')
  )
  update() {

  }
}

this is the basic construct for all our scenes

we export a class that extends phasers config settings for Scene
what config settings look at the docs
https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.html

by default the scene is already set up using the default configs which you can see by going through the documentation.

you've got classes namespaces members and methods if you dont understand these you need to spend some time finding out becuase to understand how to use phaser you need to be able to read the docs along side the source code.

here we have created a scene plugin if we click that in the docs we can understand more about whats inside the super its just setting the scenes key

next we want to add a logo to use with our preloader. remember the boot is just the inital system config
so we only want a couple of images as small as possible.

to access phasers features we want to access the global scope using this

in the website example we see this.load.image('logo', 'assets/logo.png')

thats because they are using the phaser project template available here

https://github.com/photonstorm/phaser3-project-template

you can use this too as a basic just for getting phaser working and then add on any extras you require like we did here.

our app allows us to use not only phaser and javascript but es6 css and also html which is a more complete web application.

so we need to import and load images. thats why at the top we have import logo from 'path/to/logo.png'

and then we just reference logo instead of the path

finally when the image is loaded the next secene should start.
Phaser wont start the create function untill the preload function is complete or not included

to start a new scene we want to grab phasers scene from the global scope then use its method to start a new scene

to give a very very basic idea of what this means take a look below

this.scene.start('preloader')
(scope).(phasersystem).(method).(values)

when we created our initialising js file we imported phaser to the scope

we can then access phasers individual phaser systems and there members and methods giving a value or values based on the docs and examples.

Getting used to the docs source code and examples will help you not only to learn how to use phaser but will also help you with your javascript development and any other language you use.

next we want a preloader that can load all of our assets in one shot and create any animations we might want.

import a background image, and a logo. you could make these with gimp or ms paint or for learning you can goto https://opengameart.org/. When ever you publish a game make sure you credit the author of the work.

inside preloader.js copy the code abode changing the class name to Preloader along with the key. next we need to import our files at the top of the preloader before any other code.

import your logo and background

inside your preload function we are going to manage all the loading information of the assets so the user knows when its going to be ready

im not going to explain how to do this as an amazing tutorial is already here

https://phaser.io/news/2018/05/phaser-3-preloader-tutorial

once you've created the preloader underneath you can start to load your images you imported earlier (the import is for webpack)

  finally the start key change to mainMenu

The create function will not run until our reload function is complete this is great for us it means when the create function is ran we have access to all of those images we just added.

That means in the preloader we can also set up all of our animations here in one file rather than that messy code all over the place filling our levels and other scenes

with the main menu we are going to need a key to push to start our game.

so again copying our skeleton structure change the class to MainMenu same with the key
add a simple background
let menubg = this.add.image(400,300, 'BkGrnd');

this will place our image in the center of the page. if we use 0,0 the top left corner we see the images center is now in the top left corner. this is call the image origin.
we'll learn more about it further on but for now remember if your image isnt in the correct place its usually due to origin.
knowing that we know that 400 300 is the middle of our screen so its attaching the origin of the image to the above position.

we'll add some text to say what key, lets goto the examples in the top corner there is a search.

search for text

this gives us a lot of examples but at the minute we dont have a clue what those are so instead lets break it down

the text is going to be a game object that we can either pre-define and then dis-plaid or define and display when we need to.
the difference between the two is this. one would be for text used over and over again simply moving position or size and the other for text that always changes or dynamic text. A message about our keys or the title of the game would be static but our score or health etc would be dynamic and updated with every game tick

let welcomeText = this.add.text(200, 200, "- To start the game hit SPACEBAR -", {
    font: "25px Arial",
    fill: "#ff0044",
    align: "center"
});

again looking through the examples we can see that there are modules in the phaser system that we can access for this purpose for now we just want something simple like pushing space bar

this.input.keyboard.on('keydown_SPACE', function (event) {
  this.scene.start('lvl_1');
}

finally lvl_1

copy mainMenu and replace the scene key with mainMenu

Its a good chance now to test and also have a look at the this keyword being passed with the key input.

If you remove this you remove the scope from the function. because of that when this is removed you are no longer able to access phasers systems. Why? becuase phaser is stored inside our scope.

Even if we import phaser at the top of our file it will still have no effect, this needs to be passed to be able to access the scope


Now we should have the following

an html page with black background red header text and a phaser 3 game window 800 x 600

the game should first load boot loading our logo then it should move on to the preloader for all of our assets and animations

once complete our main menu will pop up, pushing spacebar allows us to move to level 1 pushing again moves back to main menu for now.
our image doesnt fill the screen because of the original size of the image and the fact we didnt tell it to scale etc we just told it to put it as is at 400 300 anchored to its origin

now all this is done its time to commit our changes to the branch then merge to master and finally push to github via ssh

check your files in git hub make sure everything pushed ok.

now goto our heroku staging application and check to see if it works.

if we look at our pipeline we see it was just updated along with github if not you need to check your settings for auto update if not manually merge

now open the application and you should receive an error telling you more info is available in the logs so lets go to the logs

2018-08-11T08:53:04.690404+00:00 app[web.1]: npm ERR!
2018-08-11T08:53:04.690565+00:00 app[web.1]: npm ERR! Failed at the phaser-spaceshooter@1.0.0 start script.
2018-08-11T08:53:04.690727+00:00 app[web.1]: npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
2018-08-11T08:53:04.732083+00:00 app[web.1]:
2018-08-11T08:53:04.732596+00:00 app[web.1]: npm ERR! A complete log of this run can be found in:
2018-08-11T08:53:04.732760+00:00 app[web.1]: npm ERR!     /app/.npm/_logs/2018-08-11T08_53_04_708Z-debug.log
2018-08-11T08:53:04.816392+00:00 heroku[web.1]: State changed from starting to crashed
2018-08-11T08:53:04.789960+00:00 heroku[web.1]: Process exited with status 1
2018-08-11T08:57:52.625902+00:00 heroku[router]: at=error code=H10 desc="App crashed" method=GET path="/" host=immense-cliffs-44507.herokuapp.com request_id=e956574a-2454-4f6d-aafe-ccf5ce0b385b fwd="161.142.49.105" dyno= connect= service= status=503 bytes= protocol=https
2018-08-11T08:57:52.924211+00:00 heroku[router]: at=error code=H10 desc="App crashed" method=GET path="/favicon.ico" host=immense-cliffs-44507.herokuapp.com request_id=c681f24c-ff3e-4c89-b07d-ce4fc1b88211 fwd="161.142.49.105" dyno= connect= service= status=503 bytes= protocol=https

we see a couple of errors here one is serious its why our application didnt run heroku couldnt find a script called start.
but ill let you in on a spoiler even if we added a start script for webpack to build our application it still wouldn't run thats because we've been using webpack-dev-server to run our application locally but heroku is not a dev server its a working host provider so lets find out through google how we can resolve our build with heroku

just to be sure add

"start": "webpack --config webpack.config.dev.js",

to scripts add commit and push then test heroku again and you should get something like

2018-08-11T14:20:12.529897+00:00 app[web.1]: > webpack --config webpack.config.prod.js
2018-08-11T14:20:12.529899+00:00 app[web.1]:
2018-08-11T14:20:14.276077+00:00 app[web.1]: clean-webpack-plugin: /app/build has been removed.
2018-08-11T14:20:50.244153+00:00 heroku[web.1]: Process running mem=737M(144.0%)
2018-08-11T14:20:50.244153+00:00 heroku[web.1]: Error R14 (Memory quota exceeded)
2018-08-11T14:21:10.317607+00:00 app[web.1]: Error waiting for process to terminate: No child processes
2018-08-11T14:21:10.241523+00:00 heroku[web.1]: Error R10 (Boot timeout) -> Web process failed to bind to $PORT within 60 seconds of launch
2018-08-11T14:21:10.241775+00:00 heroku[web.1]: Stopping process with SIGKILL
2018-08-11T14:21:10.442159+00:00 heroku[web.1]: Process exited with status 22
2018-08-11T14:21:10.466511+00:00 heroku[web.1]: State changed from starting to crashed

This is because we need a server to handle how our application will be build.

if you download the heroku node example we see they use express as their web application framework to display the data so lets go read up on express here

https://expressjs.com/


first create a new local branch called herokuprod

this is what we are working on and so far everything is working. we dont want to go and read up on things run some tests then forget to create a branch and edit our master so best to do now it also gives us an idea of where we are in our project also

Create file in our root folder called server.js

var express = require('express');
var app = express();
var path = require('path');

const buildPath = path.resolve(__dirname, 'build');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(8080);

run our npm run devTest to create our bundled build

then finally npm start
we get our text but we dont get any of our assets
looking at the express docs

https://expressjs.com/en/starter/static-files.html

this says we need to tell our application where our assets are and to use them

add this line below your dir path

app.use(express.static('build'));

the path should be where you place all of your static assets

restart npm start and goto localhost and you should now see our application

add commit and push to github

check github for changes now heres where we will mix it up a little bit.

Remember in heroku we have 2 applications staging and production

goto the stagging application and click the tab for deploy. at the very bottom you will see an option to manually deploy.

Remember earlier i said we want to create a branch before we work so we dont bugger the master branch well now we are going to see another amazing reason why to this.

so we now want to test the application in heroku if you click open app the exact same error will come up again. this is because heroku is only tracking the master branch automatically. but we want to test the branch we have just worked on before we merge our branch with the master branch.

select our branch from the drop down menu and click deploy wait till the output says complete.

now open the app again and see what errors we get this time.
We see we have further errors in our application.

if we have install heroku cli (which you should have) we can check our logs by simply entering

heroku logs -a name-of-app

there are other options to choose but take a look at herokus docs to see what options we have available.


2018-08-12T21:09:42.147942+00:00 heroku[web.1]: State changed from crashed to starting
2018-08-12T21:09:47.210846+00:00 heroku[web.1]: Starting process with command `npm start`
2018-08-12T21:09:49.355697+00:00 app[web.1]:
2018-08-12T21:09:49.355739+00:00 app[web.1]: > phaser-spaceshooter@1.0.0 start /app
2018-08-12T21:09:49.355741+00:00 app[web.1]: > node server.js
2018-08-12T21:09:49.355743+00:00 app[web.1]:
2018-08-12T21:10:47.227298+00:00 heroku[web.1]: Error R10 (Boot timeout) -> Web process failed to bind to $PORT within 60 seconds of launch
2018-08-12T21:10:47.227543+00:00 heroku[web.1]: Stopping process with SIGKILL
2018-08-12T21:10:47.336774+00:00 heroku[web.1]: Process exited with status 137
2018-08-12T21:10:47.374732+00:00 heroku[web.1]: State changed from starting to crashed

2018-08-12T21:12:20.594577+00:00 heroku[router]: at=error code=H10 desc="App crashed" method=GET path="/" host=immense-cliffs-44507.herokuapp.com request_id=19061201-7adb-4458-8eca-2a56b12f9328 fwd="161.142.49.105" dyno= connect= service= status=503 bytes= protocol=https

2018-08-12T21:12:20.901364+00:00 heroku[router]: at=error code=H10 desc="App crashed" method=GET path="/favicon.ico" host=immense-cliffs-44507.herokuapp.com request_id=b3bdcb23-1d19-4bdb-9bb5-911d4fe2806c fwd="161.142.49.105" dyno= connect= service= status=503 bytes= protocol=https


ok so we have a few errors here, firstly heroku is not building our application befor startin the server.
Next is an error code 503.

You dont need to remember all of the codes for http instead remember these 5.

100++ is informational
200++ is Success
300++ is redirection
400++ is a client error
and finally 500++ is a server error.

eventually the important ones or the ones you see the most will stick in your memory like 404 is not found and 502 is a bad gateway.

we got 503 this is actually a server error telling us that the esvice is unavailable
the next 503 is a favicon but we havent added one so this error we can ignore.

lets check the build logs see what happens when we build our application seeing as though we have a server error.

-----> Node.js app detected
-----> Creating runtime environment

       NPM_CONFIG_LOGLEVEL=error
       NODE_VERBOSE=false
       NODE_ENV=production
       NODE_MODULES_CACHE=true
-----> Installing binaries
       engines.node (package.json):  unspecified
       engines.npm (package.json):   unspecified (use default)

       Resolving node version 8.x...
       Downloading and installing node 8.11.3...
       Using default npm version: 5.6.0
-----> Restoring cache
       Loading 2 from cacheDirectories (default):
       - node_modules
       - bower_components (not cached - skipping)
-----> Building dependencies
       Installing node modules (package.json + package-lock)
       up to date in 6.471s
-----> Caching build
       Clearing previous node cache
       Saving 2 cacheDirectories (default):
       - node_modules
       - bower_components (nothing to cache)
-----> Pruning devDependencies
       Skipping because npm 5.6.0 sometimes fails when running 'npm prune' due to a known issue
       https://github.com/npm/npm/issues/19356

       You can silence this warning by updating to at least npm 5.7.1 in your package.json
       https://devcenter.heroku.com/articles/nodejs-support#specifying-an-npm-version
-----> Build succeeded!
-----> Discovering process types
       Procfile declares types     -> (none)
       Default types for buildpack -> web
-----> Compressing...
       Done: 35.3M
-----> Launching...
       Released v13
       https://immense-cliffs-44507.herokuapp.com/ deployed to Heroku




well we can already see a lot we need to fix. remember when we created the application we made a list of versions none of them match what heroku is using. This will later be a problem for our dependencies and backward compatability.  we also see that once it installs our application it doesnt run webpack to build our bundles. so there is nothing to display on the page.

https://devcenter.heroku.com/articles/node-best-practices#start-every-new-project-with-npm-init

For the npm and node errors we can see here that we need to specifiy our node version

"engines": {
  "node": "6.2.0"
}

that should solve our mis match node versions

now lets see if we can get our application to build. heroku says we can use post install to run webpack on our application

"postinstall": "webpack --config webpack.config.dev.js",

for now we should just have a config for dev so use this save commit your changes and push then build your branch in heroku again

-----> Node.js app detected
-----> Creating runtime environment

       NPM_CONFIG_LOGLEVEL=error
       NODE_VERBOSE=false
       NODE_ENV=production
       NODE_MODULES_CACHE=true
-----> Installing binaries
       engines.node (package.json):  10.8.0
       engines.npm (package.json):   unspecified (use default)

       Resolving node version 10.8.0...
       Downloading and installing node 10.8.0...
       Using default npm version: 6.2.0
-----> Restoring cache
       Skipping cache restore (new-signature)
-----> Building dependencies
       Installing node modules (package.json + package-lock)

       > phaser@3.11.0 postinstall /tmp/build_8631d6d546f06e2c32bda8e316eed573/node_modules/phaser
       > node scripts/support.js

       ❤ Please help support Phaser development ❤
       https://www.patreon.com/photonstorm/

       added 753 packages from 448 contributors and audited 8758 packages in 18.217s
       found 0 vulnerabilities

-----> Caching build
       Clearing previous node cache
       Saving 2 cacheDirectories (default):
       - node_modules
       - bower_components (nothing to cache)
-----> Pruning devDependencies
       removed 751 packages and audited 2 packages in 8.364s
       found 0 vulnerabilities

-----> Build succeeded!
-----> Discovering process types
       Procfile declares types     -> (none)
       Default types for buildpack -> web
-----> Compressing...
       Done: 25M
-----> Launching...
       Released v14
       https://immense-cliffs-44507.herokuapp.com/ deployed to Heroku

ok we fixed the node mis match but now we have a npm mis match lets fix this

add npm: '6.3.0' to our engines

push then test but we are still getting errors why is this lets check the logs

seems it cant find module express meaning we didnt instlal to our dependices

also we see it keeps failing to bind to the port lets see if we can change that.

inside server.js

we want a variable or object that first detects if process.env.PORT herokus global variable that you can access. if its not there then use our defined port

const PORT = process.env.PORT || 5000

now update our listening argument with PORT

lets also add a webpack config for production and strip out the uncessary things

remove our devserver change our mode to production and for now that should do it.

also remove watch true

git add commit push and deploy then test

and voila we have our black bg red text our game in the middle and it loaded to our main menu keep hitting space and it will switch between the two.

but wait we've been testing our branch not our master so lets merge and deploy one last time for testing

Later i'll add compression to make the assets smaller and better for the user but this is too much at the minute so for now we'll leave it there.
