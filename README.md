## VBox - Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Design](#design)
* [Installation](#installation)
* [Licence](#licence)

## General info
VBox is a responsive web app to implement an online version of a CrossFit workout. It is intended for use by Box operators to extend the reach of their classes in pandemic times, and/or extend their income by offering higher quality remote coaching & classes. 

## Technologies

On the Server, VBox uses Node.js & Mongo DB. Facebook login is used for authentication of coaches. Athletes are authenticated simply by having the meeting ID for a session. Coaches with admin rights for their facility can change meeting IDs. 

On the client, VBox uses Typescript, React.js, and WebRTC. 

## Design
VBox is composed of several different components:
* Server - a single Node module serves up 
  * Static content (HTML & javascript libraries)
  * Node.js routes for authentication of Coaches (via Facebook), authorisation against facilities, and a webRTC signalling server. The server implements replay logic for clients that become disconnected during signalling.
  * MongoDB tables & access classes
* Client - HTML5 & typescript front end. Most logic is in the webRTC & application sections. The entire application model is exchanged peer-peer over WebRTC. If webRTC cannot connect, there is a fallback to direct traffic through the web server.
* Common - Typescript componets implementing shared business logic used on both client & server, & to provide sparation of concerns in both. As much logic as possible goes in here to make it more easily testable.
* The Common component also has a 'LiveDocument' architecture, like M-V-C, where the LiveDocument is the Model, 'Commands' are applied by the leader of the live call and distributed to all nodes to apply locally, and each node then has a local 'View' of the LiveDocument. 
* Each component has a Test suite, generally in Javascript. Mocha for Client. 
* A STUN server. The public Google STUN severs are unreliable for production use. Ultrabox uses a STUN server, using Coturn (publically available) running on AWS, to cover the times when public servers are unavailable.

## Installation
* Download / Fork the repo. 
* Node server/dev/server.js
* Navigate to the root page (localhost:://)

## Licence

MIT.
Portions are (c) https://workoutmusic.co.uk/. These are NOT licenced for onward distribution, and must be replaced by any users other than TXP Co, Ltd.
