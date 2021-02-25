/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */

import { isEqual } from './Equals';
import { IStreamable } from './Streamable';

//==============================//
// Whiteboard class
//==============================//
export class Whiteboard implements IStreamable<Whiteboard> {

   private _workout: WhiteboardElement;
   private _results: WhiteboardElement;

   static readonly __type = "Whiteboard";

  /**
   * Create a Whiteboard object
   * @param workout - text description to display for the workout
   * @param results - text description to display for the results
   */
   constructor (workout, results) {
      
      this._workout = workout;
      this._results = results;
   }

   /**
   * set of 'getters' for private variables
   */
   get workout(): WhiteboardElement {
      return this._workout;
   }
   get results(): WhiteboardElement {
      return this._results;
   }
   get type(): string {
      return Whiteboard.__type;
   }

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   equals(rhs: Whiteboard) : boolean {

      return (
         (this._workout.equals(rhs._workout)) &&
         (this._results.equals(rhs._results)));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON () : any {

      return {
         __type: Whiteboard.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _workout: this._workout,
            _results: this._results
         }
      };
   }

  /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static revive(data: any): Whiteboard {
      
      // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return Whiteboard.reviveDb(data.attributes);
      else
         return Whiteboard.reviveDb(data);
   }
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any) : Whiteboard {
      return new Whiteboard (WhiteboardElement.revive(data._workout),
                             WhiteboardElement.revive(data._results));      
   }
}

//==============================//
// WhiteboardElement class
//==============================//
export class WhiteboardElement implements IStreamable<WhiteboardElement> {
   "use strict";

   private _rows: number;
   private _text: string;

   static readonly __type = "WhiteboardElement";

   /**
    * Create a WhiteboardWorkout object
     * @param rows - the number of rows (to set visible field size).
     * @param text - the text to display.
    */
   constructor (rows: number, text: string) {

      this._rows = rows;
      this._text = text;
   }   

   /**
   * set of 'getters' for private variables
   */
   get rows(): number {
      return this._rows;
   }
   get text(): string {
      return this._text;
   }
   get type(): string {
      return WhiteboardElement.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: WhiteboardElement) : boolean {

      return (
         (this._rows === rhs._rows) &&
         (this._text === rhs._text));
   };

   /**
 * test for equality - checks all fields are the same. 
 * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
 * @param rhs - the object to compare this one to.  
 */
   assign(rhs: WhiteboardElement): void {
      this._rows = rhs._rows;
      this._text = rhs._text;
   };


   /**
    * Method that serializes to JSON 
    */
   toJSON () : any {

      return {
         __type: WhiteboardElement.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _rows: this._rows,
            _text: this._text
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   static revive(data: any) : WhiteboardElement {

      // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return WhiteboardElement.reviveDb(data.attributes);
      else
         return WhiteboardElement.reviveDb(data);
   }

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any) : WhiteboardElement {

      return new WhiteboardElement(data._rows, data._text);
   }
}

