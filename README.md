## VBox - Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Design](#design)
* [Installation](#installation)
* [Licence](#licence)

## General info
VBox is a responsive web app to implement an online version of a CrossFit workout. It is intended for use by Box operators to extend the reach of their classes in pandemic times, and/or extend their income by offering higher quality remote coaching & classes. 

## Technologies
On the Server, VBox uses Node.js & Mongo DB. Facebook login is used for authentication of coaches & athletes.

On the client, VBox uses Typescript, React.js, and WebRTC. 

## Design
VBox is composed of several different components:
* Server - a single Node module serves up 
  * Static content (HTML & javascript libraries)
  * Node.js routes for REST APIs to Facilities, FacilityVisits, FacilityMembers, FacilityCoaches, & People. 
  * MongoDB tables & access classes
* Client - HTML5 & typescript front end, Javascript for webRTC. 
* Components - Javascript componets implementing shared business logic used on both client & server, & to provide sparation of concerns in both. 
* Test - contains the test suite. Written in Javascript, tests all Components and Server REST APIs.

## Installation
* Download / Fork the rep. 
* Node server/server.js

## Licence

MIT.
