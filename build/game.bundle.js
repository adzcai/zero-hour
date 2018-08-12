/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"game": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/game.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/images/logo.png":
/*!********************************!*\
  !*** ./assets/images/logo.png ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/logo.png";

/***/ }),

/***/ "./assets/images/shadow-of-the-beast2-karamoon.png":
/*!*********************************************************!*\
  !*** ./assets/images/shadow-of-the-beast2-karamoon.png ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/shadow-of-the-beast2-karamoon.png";

/***/ }),

/***/ "./assets/styles/home.css":
/*!********************************!*\
  !*** ./assets/styles/home.css ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
__webpack_require__(/*! ../assets/styles/home.css */ "./assets/styles/home.css");var _phaser=__webpack_require__(/*! phaser */ "./node_modules/phaser/src/phaser.js");var _phaser2=_interopRequireDefault(_phaser);var _boot=__webpack_require__(/*! ./scenes/boot */ "./src/scenes/boot.js");var _preloader=__webpack_require__(/*! ./scenes/preloader */ "./src/scenes/preloader.js");var _mainMenu=__webpack_require__(/*! ./scenes/mainMenu */ "./src/scenes/mainMenu.js");var _lvl=__webpack_require__(/*! ./levels/lvl1 */ "./src/levels/lvl1.js");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}alert('hi');//setup scenes
//levels
var config={type:_phaser2.default.AUTO,parent:'phaser-example',width:800,height:600,physics:{default:'arcade',arcade:{gravity:{y:0,x:0},debug:true}},scene:[_boot.Boot,_preloader.Preloader,_mainMenu.MainMenu,_lvl.Lvl_1]};var game=new _phaser2.default.Game(config);

/***/ }),

/***/ "./src/levels/lvl1.js":
/*!****************************!*\
  !*** ./src/levels/lvl1.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var Lvl_1=exports.Lvl_1=function(_Phaser$Scene){_inherits(Lvl_1,_Phaser$Scene);function Lvl_1(){_classCallCheck(this,Lvl_1);return _possibleConstructorReturn(this,(Lvl_1.__proto__||Object.getPrototypeOf(Lvl_1)).call(this,'lvl_1'));}_createClass(Lvl_1,[{key:'create',value:function create(){this.input.keyboard.on('keydown_SPACE',function(event){this.scene.start('mainMenu');},this);}},{key:'update',value:function update(){}}]);return Lvl_1;}(Phaser.Scene);

/***/ }),

/***/ "./src/scenes/boot.js":
/*!****************************!*\
  !*** ./src/scenes/boot.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.Boot=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _logo=__webpack_require__(/*! ../../assets/images/logo.png */ "./assets/images/logo.png");var _logo2=_interopRequireDefault(_logo);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var Boot=exports.Boot=function(_Phaser$Scene){_inherits(Boot,_Phaser$Scene);function Boot(){_classCallCheck(this,Boot);return _possibleConstructorReturn(this,(Boot.__proto__||Object.getPrototypeOf(Boot)).call(this,'boot'));}_createClass(Boot,[{key:'preload',value:function preload(){//console.log('Boot Preload')
this.load.image('logo',_logo2.default);}},{key:'create',value:function create(){this.scene.start('preloader');}}]);return Boot;}(Phaser.Scene);

/***/ }),

/***/ "./src/scenes/mainMenu.js":
/*!********************************!*\
  !*** ./src/scenes/mainMenu.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var MainMenu=exports.MainMenu=function(_Phaser$Scene){_inherits(MainMenu,_Phaser$Scene);function MainMenu(){_classCallCheck(this,MainMenu);return _possibleConstructorReturn(this,(MainMenu.__proto__||Object.getPrototypeOf(MainMenu)).call(this,{key:'mainMenu'}));}_createClass(MainMenu,[{key:'create',value:function create(){var menubg=this.add.image(400,300,'BkGrnd');var welcomeText=this.add.text(200,200,"- To start the game hit SPACEBAR -",{font:"25px Arial",fill:"#ff0044",align:"center"});this.input.keyboard.on('keydown_SPACE',function(event){this.scene.start('lvl_1');},this);}}]);return MainMenu;}(Phaser.Scene);

/***/ }),

/***/ "./src/scenes/preloader.js":
/*!*********************************!*\
  !*** ./src/scenes/preloader.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.Preloader=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _shadowOfTheBeast2Karamoon=__webpack_require__(/*! ../../assets/images/shadow-of-the-beast2-karamoon.png */ "./assets/images/shadow-of-the-beast2-karamoon.png");var _shadowOfTheBeast2Karamoon2=_interopRequireDefault(_shadowOfTheBeast2Karamoon);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var Preloader=exports.Preloader=function(_Phaser$Scene){_inherits(Preloader,_Phaser$Scene);function Preloader(){_classCallCheck(this,Preloader);return _possibleConstructorReturn(this,(Preloader.__proto__||Object.getPrototypeOf(Preloader)).call(this,'preloader'));}_createClass(Preloader,[{key:'preload',value:function preload(){console.log("Preloader preload");var ready=false;var progressBar=this.add.graphics();var progressBox=this.add.graphics();progressBox.fillStyle(0x222222,0.8);progressBox.fillRect(240,270,320,50);var width=this.cameras.main.width;var height=this.cameras.main.height;var loadingText=this.make.text({x:width/2,y:height/2-50,text:'Loading...',style:{font:'20px monospace',fill:'#ffffff'}});loadingText.setOrigin(0.5,0.5);var percentText=this.make.text({x:width/2,y:height/2-5,text:'0%',style:{font:'18px monospace',fill:'#ffffff'}});percentText.setOrigin(0.5,0.5);var assetText=this.make.text({x:width/2,y:height/2+50,text:'',style:{font:'18px monospace',fill:'#ffffff'}});assetText.setOrigin(0.5,0.5);this.load.on('progress',function(value){console.log(value);percentText.setText(parseInt(value*100)+'%');progressBar.clear();progressBar.fillStyle(0xffffff,1);progressBar.fillRect(250,280,300*value,30);});this.load.on('fileprogress',function(file){console.log(file.src);assetText.setText('Loading asset: '+file.key);});this.load.on('complete',function(){console.log('complete');progressBar.destroy();progressBox.destroy();loadingText.destroy();percentText.destroy();assetText.destroy();ready="true";console.log("on Complete should be one time");console.log(ready);});//-------------mainMenu-------------//
this.load.image('BkGrnd',_shadowOfTheBeast2Karamoon2.default);//-------------Lvl_1-------------//
}},{key:'create',value:function create(){//Create animations
this.scene.start('mainMenu');}}]);return Preloader;}(Phaser.Scene);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9sb2dvLnBuZyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvaW1hZ2VzL3NoYWRvdy1vZi10aGUtYmVhc3QyLWthcmFtb29uLnBuZyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc3R5bGVzL2hvbWUuY3NzP2Q4M2MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xldmVscy9sdmwxLmpzIiwid2VicGFjazovLy8uL3NyYy9zY2VuZXMvYm9vdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL21haW5NZW51LmpzIiwid2VicGFjazovLy8uL3NyYy9zY2VuZXMvcHJlbG9hZGVyLmpzIl0sIm5hbWVzIjpbImFsZXJ0IiwiY29uZmlnIiwidHlwZSIsIlBoYXNlciIsIkFVVE8iLCJwYXJlbnQiLCJ3aWR0aCIsImhlaWdodCIsInBoeXNpY3MiLCJkZWZhdWx0IiwiYXJjYWRlIiwiZ3Jhdml0eSIsInkiLCJ4IiwiZGVidWciLCJzY2VuZSIsIkJvb3QiLCJQcmVsb2FkZXIiLCJNYWluTWVudSIsIkx2bF8xIiwiZ2FtZSIsIkdhbWUiLCJpbnB1dCIsImtleWJvYXJkIiwib24iLCJldmVudCIsInN0YXJ0IiwiU2NlbmUiLCJsb2FkIiwiaW1hZ2UiLCJsb2dvIiwia2V5IiwibWVudWJnIiwiYWRkIiwid2VsY29tZVRleHQiLCJ0ZXh0IiwiZm9udCIsImZpbGwiLCJhbGlnbiIsImNvbnNvbGUiLCJsb2ciLCJyZWFkeSIsInByb2dyZXNzQmFyIiwiZ3JhcGhpY3MiLCJwcm9ncmVzc0JveCIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwiY2FtZXJhcyIsIm1haW4iLCJsb2FkaW5nVGV4dCIsIm1ha2UiLCJzdHlsZSIsInNldE9yaWdpbiIsInBlcmNlbnRUZXh0IiwiYXNzZXRUZXh0IiwidmFsdWUiLCJzZXRUZXh0IiwicGFyc2VJbnQiLCJjbGVh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Q0FBcUIsR0FBckIsQ0FBMEIsR0FBMUIsQ0FBK0IsSUFBTVMsS0FBckMsQ0FBNEMsRUFBNUMsRUFDRCxDQU5ELEVBT0EsS0FBSzNCLElBQUwsQ0FBVUosRUFBVixDQUFhLGNBQWIsQ0FBNkIsU0FBVW1DLElBQVYsQ0FBZ0IsQ0FDM0NwQixRQUFRQyxHQUFSLENBQVltQixLQUFLQyxHQUFqQixFQUNBTixVQUFVRSxPQUFWLENBQWtCLGtCQUFvQkcsS0FBSzVCLEdBQTNDLEVBQ0QsQ0FIRCxFQUlBLEtBQUtILElBQUwsQ0FBVUosRUFBVixDQUFhLFVBQWIsQ0FBeUIsVUFBWSxDQUNuQ2UsUUFBUUMsR0FBUixDQUFZLFVBQVosRUFDQUUsWUFBWW1CLE9BQVosR0FDQWpCLFlBQVlpQixPQUFaLEdBQ0FaLFlBQVlZLE9BQVosR0FDQVIsWUFBWVEsT0FBWixHQUNBUCxVQUFVTyxPQUFWLEdBQ0FwQixNQUFRLE1BQVIsQ0FDQUYsUUFBUUMsR0FBUixDQUFZLGdDQUFaLEVBQ0FELFFBQVFDLEdBQVIsQ0FBWUMsS0FBWixFQUNELENBVkQsRUFhQTtBQUNBLEtBQUtiLElBQUwsQ0FBVUMsS0FBVixDQUFnQixRQUFoQixDQUEwQmlDLG1DQUExQixFQUVBO0FBRUQsQyx1Q0FDTyxDQUNOO0FBQ0EsS0FBSy9DLEtBQUwsQ0FBV1csS0FBWCxDQUFpQixVQUFqQixFQUNELEMsdUJBakY0QnZCLE9BQU93QixLIiwiZmlsZSI6ImdhbWUuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4gXHQvLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0XCJnYW1lXCI6IDBcbiBcdH07XG5cbiBcdHZhciBkZWZlcnJlZE1vZHVsZXMgPSBbXTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0dmFyIGpzb25wQXJyYXkgPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gfHwgW107XG4gXHR2YXIgb2xkSnNvbnBGdW5jdGlvbiA9IGpzb25wQXJyYXkucHVzaC5iaW5kKGpzb25wQXJyYXkpO1xuIFx0anNvbnBBcnJheS5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2s7XG4gXHRqc29ucEFycmF5ID0ganNvbnBBcnJheS5zbGljZSgpO1xuIFx0Zm9yKHZhciBpID0gMDsgaSA8IGpzb25wQXJyYXkubGVuZ3RoOyBpKyspIHdlYnBhY2tKc29ucENhbGxiYWNrKGpzb25wQXJyYXlbaV0pO1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSBvbGRKc29ucEZ1bmN0aW9uO1xuXG5cbiBcdC8vIGFkZCBlbnRyeSBtb2R1bGUgdG8gZGVmZXJyZWQgbGlzdFxuIFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2goW1wiLi9zcmMvZ2FtZS5qc1wiLFwidmVuZG9yXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYXNzZXRzL2ltYWdlcy9sb2dvLnBuZ1wiOyIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImFzc2V0cy9pbWFnZXMvc2hhZG93LW9mLXRoZS1iZWFzdDIta2FyYW1vb24ucG5nXCI7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiaW1wb3J0ICcuLi9hc3NldHMvc3R5bGVzL2hvbWUuY3NzJ1xuYWxlcnQoJ2hpJylcbmltcG9ydCAncGhhc2VyJ1xuXG5pbXBvcnQgUGhhc2VyIGZyb20gJ3BoYXNlcic7XG4vL3NldHVwIHNjZW5lc1xuaW1wb3J0IHsgQm9vdCB9IGZyb20gJy4vc2NlbmVzL2Jvb3QnXG5pbXBvcnQgeyBQcmVsb2FkZXIgfSBmcm9tICcuL3NjZW5lcy9wcmVsb2FkZXInXG5pbXBvcnQgeyBNYWluTWVudSB9IGZyb20gJy4vc2NlbmVzL21haW5NZW51J1xuXG4vL2xldmVsc1xuaW1wb3J0IHsgTHZsXzEgfSBmcm9tICcuL2xldmVscy9sdmwxJ1xuXG5cblxuY29uc3QgY29uZmlnID0ge1xuICAgIHR5cGU6IFBoYXNlci5BVVRPLFxuICAgIHBhcmVudDogJ3BoYXNlci1leGFtcGxlJyxcbiAgICB3aWR0aDogODAwLFxuICAgIGhlaWdodDogNjAwLFxuICAgIHBoeXNpY3M6IHtcbiAgICAgIGRlZmF1bHQ6ICdhcmNhZGUnLFxuICAgICAgYXJjYWRlOiB7XG4gICAgICAgIGdyYXZpdHk6IHsgeTogMCwgeDogMCB9LFxuICAgICAgICBkZWJ1ZzogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgc2NlbmU6IFtcbiAgICAgIEJvb3QsXG4gICAgICBQcmVsb2FkZXIsXG4gICAgICBNYWluTWVudSxcbiAgICAgIEx2bF8xXG4gICAgXVxufTtcblxuY29uc3QgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZShjb25maWcpO1xuIiwiZXhwb3J0IGNsYXNzIEx2bF8xIGV4dGVuZHMgUGhhc2VyLlNjZW5le1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKCdsdmxfMScpXG4gIH1cbiAgY3JlYXRlKCl7XG4gICAgdGhpcy5pbnB1dC5rZXlib2FyZC5vbigna2V5ZG93bl9TUEFDRScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdGhpcy5zY2VuZS5zdGFydCgnbWFpbk1lbnUnKTtcbiAgICB9LHRoaXMpXG4gIH1cbiAgdXBkYXRlKCl7XG5cbiAgfVxufVxuIiwiaW1wb3J0IGxvZ28gZnJvbSAnLi4vLi4vYXNzZXRzL2ltYWdlcy9sb2dvLnBuZydcblxuZXhwb3J0IGNsYXNzIEJvb3QgZXh0ZW5kcyBQaGFzZXIuU2NlbmV7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoJ2Jvb3QnKVxuICB9XG4gIHByZWxvYWQoKXtcbiAgICAvL2NvbnNvbGUubG9nKCdCb290IFByZWxvYWQnKVxuICAgIHRoaXMubG9hZC5pbWFnZSgnbG9nbycsIGxvZ28pXG4gIH1cbiAgY3JlYXRlKCl7XG4gICAgdGhpcy5zY2VuZS5zdGFydCgncHJlbG9hZGVyJylcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIE1haW5NZW51IGV4dGVuZHMgUGhhc2VyLlNjZW5le1xuICBjb25zdHJ1Y3RvciAoKXtcbiAgICBzdXBlcih7IGtleTogJ21haW5NZW51J30pO1xuICB9XG4gIGNyZWF0ZSgpe1xuICAgIGxldCBtZW51YmcgPSB0aGlzLmFkZC5pbWFnZSg0MDAsIDMwMCwgJ0JrR3JuZCcpO1xuICAgIGxldCB3ZWxjb21lVGV4dCA9IHRoaXMuYWRkLnRleHQoMjAwLCAyMDAsIFwiLSBUbyBzdGFydCB0aGUgZ2FtZSBoaXQgU1BBQ0VCQVIgLVwiLCB7XG4gICAgICAgIGZvbnQ6IFwiMjVweCBBcmlhbFwiLFxuICAgICAgICBmaWxsOiBcIiNmZjAwNDRcIixcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICB9KTtcblxuICAgIHRoaXMuaW5wdXQua2V5Ym9hcmQub24oJ2tleWRvd25fU1BBQ0UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHRoaXMuc2NlbmUuc3RhcnQoJ2x2bF8xJyk7XG4gICAgfSwgdGhpcylcbiAgfVxufVxuIiwiaW1wb3J0IGJhY2tncm91bmRwbmcxIGZyb20gJy4uLy4uL2Fzc2V0cy9pbWFnZXMvc2hhZG93LW9mLXRoZS1iZWFzdDIta2FyYW1vb24ucG5nJ1xuXG5leHBvcnQgY2xhc3MgUHJlbG9hZGVyIGV4dGVuZHMgUGhhc2VyLlNjZW5le1xuICBjb25zdHJ1Y3RvciAoKXtcbiAgICBzdXBlcigncHJlbG9hZGVyJylcblxuICB9XG4gIHByZWxvYWQoKXtcbiAgICBjb25zb2xlLmxvZyhcIlByZWxvYWRlciBwcmVsb2FkXCIpXG4gICAgbGV0IHJlYWR5ID0gZmFsc2VcbiAgICBsZXQgcHJvZ3Jlc3NCYXIgPSB0aGlzLmFkZC5ncmFwaGljcygpXG4gICAgbGV0IHByb2dyZXNzQm94ID0gdGhpcy5hZGQuZ3JhcGhpY3MoKVxuICAgIHByb2dyZXNzQm94LmZpbGxTdHlsZSgweDIyMjIyMiwgMC44KVxuICAgIHByb2dyZXNzQm94LmZpbGxSZWN0KDI0MCwgMjcwLCAzMjAsIDUwKVxuXG4gICAgdmFyIHdpZHRoID0gdGhpcy5jYW1lcmFzLm1haW4ud2lkdGhcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5jYW1lcmFzLm1haW4uaGVpZ2h0XG4gICAgdmFyIGxvYWRpbmdUZXh0ID0gdGhpcy5tYWtlLnRleHQoe1xuICAgICAgeDogd2lkdGggLyAyLFxuICAgICAgeTogaGVpZ2h0IC8gMiAtIDUwLFxuICAgICAgdGV4dDogJ0xvYWRpbmcuLi4nLFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgZm9udDogJzIwcHggbW9ub3NwYWNlJyxcbiAgICAgICAgZmlsbDogJyNmZmZmZmYnXG4gICAgICB9XG4gICAgfSlcbiAgICBsb2FkaW5nVGV4dC5zZXRPcmlnaW4oMC41LCAwLjUpXG5cbiAgICB2YXIgcGVyY2VudFRleHQgPSB0aGlzLm1ha2UudGV4dCh7XG4gICAgICB4OiB3aWR0aCAvIDIsXG4gICAgICB5OiBoZWlnaHQgLyAyIC0gNSxcbiAgICAgIHRleHQ6ICcwJScsXG4gICAgICBzdHlsZToge1xuICAgICAgICBmb250OiAnMThweCBtb25vc3BhY2UnLFxuICAgICAgICBmaWxsOiAnI2ZmZmZmZidcbiAgICAgIH1cbiAgICB9KVxuICAgIHBlcmNlbnRUZXh0LnNldE9yaWdpbigwLjUsIDAuNSlcblxuICAgIHZhciBhc3NldFRleHQgPSB0aGlzLm1ha2UudGV4dCh7XG4gICAgICB4OiB3aWR0aCAvIDIsXG4gICAgICB5OiBoZWlnaHQgLyAyICsgNTAsXG4gICAgICB0ZXh0OiAnJyxcbiAgICAgIHN0eWxlOiB7XG4gICAgICAgIGZvbnQ6ICcxOHB4IG1vbm9zcGFjZScsXG4gICAgICAgIGZpbGw6ICcjZmZmZmZmJ1xuICAgICAgfVxuICAgIH0pXG4gICAgYXNzZXRUZXh0LnNldE9yaWdpbigwLjUsIDAuNSlcblxuICAgIHRoaXMubG9hZC5vbigncHJvZ3Jlc3MnLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKHZhbHVlKVxuICAgICAgcGVyY2VudFRleHQuc2V0VGV4dChwYXJzZUludCh2YWx1ZSAqIDEwMCkgKyAnJScpXG4gICAgICBwcm9ncmVzc0Jhci5jbGVhcigpXG4gICAgICBwcm9ncmVzc0Jhci5maWxsU3R5bGUoMHhmZmZmZmYsIDEpXG4gICAgICBwcm9ncmVzc0Jhci5maWxsUmVjdCgyNTAsIDI4MCwgMzAwICogdmFsdWUsIDMwKVxuICAgIH0pXG4gICAgdGhpcy5sb2FkLm9uKCdmaWxlcHJvZ3Jlc3MnLCBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgY29uc29sZS5sb2coZmlsZS5zcmMpXG4gICAgICBhc3NldFRleHQuc2V0VGV4dCgnTG9hZGluZyBhc3NldDogJyArIGZpbGUua2V5KVxuICAgIH0pXG4gICAgdGhpcy5sb2FkLm9uKCdjb21wbGV0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdjb21wbGV0ZScpXG4gICAgICBwcm9ncmVzc0Jhci5kZXN0cm95KClcbiAgICAgIHByb2dyZXNzQm94LmRlc3Ryb3koKVxuICAgICAgbG9hZGluZ1RleHQuZGVzdHJveSgpXG4gICAgICBwZXJjZW50VGV4dC5kZXN0cm95KClcbiAgICAgIGFzc2V0VGV4dC5kZXN0cm95KClcbiAgICAgIHJlYWR5ID0gXCJ0cnVlXCJcbiAgICAgIGNvbnNvbGUubG9nKFwib24gQ29tcGxldGUgc2hvdWxkIGJlIG9uZSB0aW1lXCIpXG4gICAgICBjb25zb2xlLmxvZyhyZWFkeSlcbiAgICB9KVxuXG5cbiAgICAvLy0tLS0tLS0tLS0tLS1tYWluTWVudS0tLS0tLS0tLS0tLS0vL1xuICAgIHRoaXMubG9hZC5pbWFnZSgnQmtHcm5kJywgYmFja2dyb3VuZHBuZzEpXG5cbiAgICAvLy0tLS0tLS0tLS0tLS1MdmxfMS0tLS0tLS0tLS0tLS0vL1xuXG4gIH1cbiAgY3JlYXRlKCl7XG4gICAgLy9DcmVhdGUgYW5pbWF0aW9uc1xuICAgIHRoaXMuc2NlbmUuc3RhcnQoJ21haW5NZW51Jyk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=