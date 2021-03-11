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
import { StreamableTypes } from './StreamableTypes';
import { Person } from './Person';
import { CallParticipation } from './Call';
import { ILiveDocument, ICommand, ISelection, ICommandProcessor, 
         ILiveDocumentChannel, ILiveDocumentChannelFactory, ILiveDocumentFactory} from './LiveInterfaces';
import { LiveCommandProcessor, LiveUndoCommand} from './LiveCommand';
import { PeerConnection } from './PeerConnection';

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

   static readonly __type: string = "LiveWhiteboardCommand";

   constructor(text: string, _priorText: string) {
      this._selection = new LiveWhiteboardSelection(); // This command always has the same selection - the entire whiteboard. 
      this._text = text;
      this._priorText = _priorText;                    // Caller has to make sure this === current state at time of calling.
                                                       // Otherwise can lead to problems when commands are copied around between sessions
   }

   // type is read only
   get type(): string {
      return LiveWhiteboardCommand.__type;
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
            _priorText: this._priorText
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

// Class to represent the 'selection' of the whiteboard within a Workout document.
export class LiveWhiteboardSelection implements ISelection {

   constructor() {
   }

   type(): string {
      return "LiveWhiteboardSelection";
   }
}

// Implemntation of channl over RTC/peer architecture
class LiveWorkoutChannelPeer implements ILiveDocumentChannel {

   _types: StreamableTypes = new StreamableTypes;
   _peer: PeerConnection;
   _document: LiveWorkout;

   constructor(peer: PeerConnection) {
      this._peer = peer;
      peer.addRemoteDataListener(this.onData.bind(this));
   }

   // Override these for data from notifications 
   onNewCallParticipation: ((ev: IStreamable) => any) = function (ev) { };
   onCommandApply: ((ev: ICommand) => void) = function (ev) { };
   onCommandReverse: (() => void) = function () { };
   onDocument: ((ev: ILiveDocument) => void) = function (ev) { };

   onData(ev: IStreamable) {
      if (this._peer.isEdgeOnly()) {
         // Edge nodes listen for document updates
         if (ev.type === LiveWorkout.__type) {
            this.onDocument(ev as LiveWorkout);
         }
         if (ev.type === LiveWhiteboardCommand.__type) {
            this.onCommandApply(ev as LiveWhiteboardCommand);
         }
         if (ev.type === LiveUndoCommand.__type) {
            this.onCommandReverse();
         }
      }
      else {
         // Hub node listens for new participants and sends them the document when they join
         if (ev.type === CallParticipation.__type) {
            this.onNewCallParticipation(ev);
         }
      }
   }

   sendDocumentTo(recipient: CallParticipation, document: ILiveDocument): void {
      this._peer.sendTo(recipient, document);
   }
   broadcastCommandApply(command: ICommand): void {
      this._peer.broadcast(command);
   }
   broadcastCommandReverse(): void {
      this._peer.broadcast(new LiveUndoCommand());
   }
}

// Creates the type of channel we need to exchange Workout Documents
export class LiveWorkoutChannelFactoryPeer implements ILiveDocumentChannelFactory {

   _connection: PeerConnection;

   constructor(connection: PeerConnection) {
      this._connection = connection;
   }

   createConnectionIn(): ILiveDocumentChannel {
      return new LiveWorkoutChannelPeer(this._connection);
   }

   createConnectionOut(): ILiveDocumentChannel {
      return new LiveWorkoutChannelPeer(this._connection);
   }
}

// Creates the type of Workout Documents
export class LiveWorkoutFactory implements ILiveDocumentFactory {

   constructor() {
   }

   createLiveDocument(outbound: boolean, channel: ILiveDocumentChannel): ILiveDocument {
      return new LiveWorkout("Waiting...[doc version]", outbound, channel);
   }
}
