/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */


//==============================//
// Queue class
//==============================//
var Queue = (function invocation() {
   "use strict";

   /**
    * Creates a Queue 
    */
   function Queue() {

      // initialise the queue and offset
      this.queue = [];
      this.offset = 0;
   }
   
   // Returns the length of the queue.
   Queue.prototype.getLength = function () {
      return (this.queue.length - this.offset);
   }

   // Returns true if the queue is empty, and false otherwise.
   Queue.prototype.isEmpty = function () {
      return (this.queue.length == 0);
   }

   /* Enqueues the specified item. The parameter is:
    *
    * item - the item to enqueue
    */
   Queue.prototype.enqueue = function (item) {
      this.queue.push(item);
   }

   /* Dequeues an item and returns it. If the queue is empty, the value
    * 'undefined' is returned.
    */
   Queue.prototype.dequeue = function () {

      // if the queue is empty, return immediately
      if (this.queue.length == 0) return undefined;

      // store the item at the front of the queue
      var item = this.queue[this.offset];

      // increment the offset and remove the free space if necessary
      if (++(this.offset) * 2 >= this.queue.length) {
         this.queue = this.queue.slice(this.offset);
         this.offset = 0;
      }

      // return the dequeued item
      return item;

   }

   /* Returns the item at the front of the queue (without dequeuing it). If the
    * queue is empty then undefined is returned.
    */
   Queue.prototype.peek = function () {
      return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
   }

   return Queue;
}());


exports.Queue = Queue;
