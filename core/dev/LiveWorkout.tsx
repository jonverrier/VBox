/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Document architecture:
// DocumentInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - Master and Remote CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 

// This app, this component 
import { IStreamable } from './Streamable'
import { ILiveDocument, ICommand, ISelection, ICommandProcessor, ILiveDocumentChannel } from './LiveInterfaces';
import { LiveCommandProcessor } from './LiveCommand';

export class LiveWorkout implements ILiveDocument {

   static readonly __type: string = "LiveWorkout";

   private _whiteboardText: string;
   private _channel: ILiveDocumentChannel | undefined;
   private _outbound: boolean | undefined;

   constructor(whiteboardText: string, outbound?: boolean, channel?: ILiveDocumentChannel) {
      this._outbound = outbound;
      if (channel)
         this._channel = channel;
      this._whiteboardText = whiteboardText;
   }

   createCommandProcessor(): ICommandProcessor {
      return new LiveCommandProcessor(this, this._outbound, this._channel);
   }

   // Getter and setter for whitebard text
   get whiteboardText (): string {
      return this._whiteboardText;
   }
   set whiteboardText(whiteboardText: string) {
      this._whiteboardText = whiteboardText;
   }

   // type is read only
   get type(): string {
      return LiveWorkout.__type;
   }

   // test for equality
   // Only tests content fields - excludes channel etc
   equals (rhs: ILiveDocument) : boolean {

      if (rhs.type === this.type) {
         var workout: LiveWorkout = (rhs as LiveWorkout);
         return (this._whiteboardText === workout._whiteboardText);
      }
      else
         return false;
   }

   assign (rhs: ILiveDocument) : void {

      // This is called if an entire new document gets sent e.g are just joining meeting
      // or had become detached
      if (rhs.type === this.type) {
         var workout: LiveWorkout = (rhs as LiveWorkout);
         this._whiteboardText = workout._whiteboardText;
      }
   }

   /**
       * Method that serializes to JSON 
       */
   toJSON(): Object {

      return {
         __type: LiveWorkout.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _whiteboardText: this._whiteboardText
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   static revive(data: any): LiveWorkout {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return LiveWorkout.reviveDb(data.attributes);
      else
         return LiveWorkout.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any): LiveWorkout {

      return new LiveWorkout(data._whiteboardText);
   };
}

export class LiveWhiteboardCommand implements ICommand {

   private _selection: ISelection;
   private _text: string;
   private _priorText: string;

   static readonly __type: string = "LiveWorkout";

   constructor(text: string, _priorText: string) {
      this._selection = new LiveWhiteboardSelection(); // This command always has the same selection - the entire whiteboard. 
      this._text = text;
      this._priorText = _priorText;                    // Caller has to make sure this === current state at time of calling.
                                                       // Otherwise can lead to problems when commands are copied around between sessions
   }

   // type is read only
   get type(): string {
      return LiveWorkout.__type;
   }

   selection(): ISelection {
      return this._selection;
   }

   applyTo(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type === LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);

         // Verify that the document has not changed since the command was created
         if (this._priorText === wo.whiteboardText)
            wo.whiteboardText = this._text;
      }
   }

   reverseFrom(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type == LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);
         wo.whiteboardText = this._priorText;
      }
   }

   canReverse(): boolean {
      return true;
   }

   /**
       * Method that serializes to JSON 
       */
   toJSON(): Object {

      return {
         __type: LiveWhiteboardCommand.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _text: this._text,
            _priortext: this._priorText
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   static revive(data: any): LiveWhiteboardCommand {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return LiveWhiteboardCommand.reviveDb(data.attributes);
      else
         return LiveWhiteboardCommand.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any): LiveWhiteboardCommand {

      return new LiveWhiteboardCommand(data._text, data._priorText);
   };
}

export class LiveWhiteboardSelection implements ISelection {

   constructor() {
   }

   type(): string {
      return "LiveWhiteboardSelection";
   }
}