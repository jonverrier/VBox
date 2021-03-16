/*! Copyright TXPCo, 2020, 2021 */
// Modules in the LiveDocument architecture:
// LiveChannelStub - contains a stub implementation of LiveChannel, short - circuits any streaming and just passes document & commands from publisher to subscriber in test harness.
// LiveCommand - contains LiveCommandProcessor - maintains a log of commands, drives undo/redo, and manages publish/scrscribe connection to channels
// LiveDocumentCentral - contains classes that aggregate creation of live documents. 
// LiveInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// LiveWorkout - contains a concrete implementation of a LiveDocument for the live workout app. 
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 

// This app, this component 
import { IStreamable } from './Streamable'
import { StreamableTypes } from './StreamableTypes';
import { CallParticipation } from './Call';
import { StoredWorkoutState } from './LocalStore';
import { ILiveDocument, ICommand, ISelection, ICommandProcessor, 
         ILiveDocumentChannel, ILiveDocumentChannelFactory, ILiveDocumentFactory} from './LiveInterfaces';
import { LiveCommandProcessor, LiveUndoCommand} from './LiveCommand';
import { PeerConnection } from './PeerConnection';
import { EGymClockDuration, EGymClockMusic, EGymClockState, GymClockSpec, GymClockState } from './GymClock';

////////////////////////////////////////
// LiveWorkout - class to represents the entire state of a workout. 
// Contains the workout brief(whiteboard), results, clock spec, clock state, call state.
////////////////////////////////////////
export class LiveWorkout implements ILiveDocument {

   static readonly __type: string = "LiveWorkout";

   private _whiteboardText: string;
   private _resultsText: string;
   private _clockSpec: GymClockSpec;
   private _channel: ILiveDocumentChannel | undefined;
   private _outbound: boolean | undefined;

   constructor(whiteboardText: string,
      resultsText: string,
      clockSpec: GymClockSpec,
      outbound?: boolean, channel?: ILiveDocumentChannel) {
      this._outbound = outbound;
      if (channel)
         this._channel = channel;
      this._whiteboardText = whiteboardText;
      this._resultsText = resultsText;
      this._clockSpec = clockSpec;
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
   // Getter and setter for results text
   get resultsText(): string {
      return this._resultsText;
   }
   set resultsText(resultsText: string) {
      this._resultsText = resultsText;
   }
   // Getter and setter for clock spec
   get clockSpec(): GymClockSpec {
      return this._clockSpec;
   }
   set clockSpec(clockSpec: GymClockSpec) {
      this._clockSpec = clockSpec;
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
         return (this._whiteboardText === workout._whiteboardText &&
            this._resultsText === workout._resultsText &&
            this._clockSpec.equals (workout._clockSpec));
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
         this._resultsText = workout._resultsText;
         this._clockSpec = workout._clockSpec;
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
            _whiteboardText: this._whiteboardText,
            _resultsText: this._resultsText,
            _clockSpec : this._clockSpec
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
   * Note: this ignores the 'channel' object. It is used by the channel to resurrect an incoming document when we are synchronising state,
   *  then the channel calls 'assign' on the current version to copy this state across.
   */
   static reviveDb(data: any): LiveWorkout {

      return new LiveWorkout(data._whiteboardText,
         data._resultsText, GymClockSpec.revive (data._clockSpec));
   };
}

////////////////////////////////////////
// LiveWhiteboardCommand - class to represents the whiteboard within a workout. 
////////////////////////////////////////
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

         // save in local cache
         new StoredWorkoutState().saveWorkout(wo.whiteboardText);
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

////////////////////////////////////////
// LiveResultsCommand - class to represents the whiteboard within a workout.
////////////////////////////////////////
export class LiveResultsCommand implements ICommand {

   private _selection: ISelection;
   private _text: string;
   private _priorText: string;

   static readonly __type: string = "LiveResultsCommand";

   constructor(text: string, _priorText: string) {
      this._selection = new LiveResultsSelection(); // This command always has the same selection - the entire whiteboard. 
      this._text = text;
      this._priorText = _priorText;                 // Caller has to make sure this === current state at time of calling.
      // Otherwise can lead to problems when commands are copied around between sessions
   }

   // type is read only
   get type(): string {
      return LiveResultsCommand.__type;
   }

   selection(): ISelection {
      return this._selection;
   }

   applyTo(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type === LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);

         // Verify that the document has not changed since the command was created
         if (this._priorText === wo.resultsText)
            wo.resultsText = this._text;
      }
   }

   reverseFrom(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type == LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);
         wo.resultsText = this._priorText;
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
         __type: LiveResultsCommand.__type,
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
   static revive(data: any): LiveResultsCommand {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return LiveResultsCommand.reviveDb(data.attributes);
      else
         return LiveResultsCommand.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any): LiveResultsCommand {

      return new LiveResultsCommand(data._text, data._priorText);
   };
}

////////////////////////////////////////
// LiveClockSpecCommand - class to represents the clock spec within a workout.
////////////////////////////////////////
export class LiveClockSpecCommand implements ICommand {

   private _selection: ISelection;
   private _clockSpec: GymClockSpec;
   private _priorSpec: GymClockSpec;

   static readonly __type: string = "LiveClockSpecCommand";

   constructor(clockSpec: GymClockSpec, priorSpec: GymClockSpec) {
      this._selection = new LiveResultsSelection(); // This command always has the same selection - the entire whiteboard. 
      this._clockSpec = clockSpec;
      this._priorSpec = priorSpec;                 // Caller has to make sure this === current state at time of calling.
      // Otherwise can lead to problems when commands are copied around between sessions
   }

   // type is read only
   get type(): string {
      return LiveClockSpecCommand.__type;
   }

   selection(): ISelection {
      return this._selection;
   }

   applyTo(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type === LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);

         // Verify that the document has not changed since the command was created
         if (this._priorSpec.equals ( wo.clockSpec))
            wo.clockSpec = this._clockSpec;
      }
   }

   reverseFrom(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type == LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);
         wo.clockSpec = this._priorSpec;
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
         __type: LiveClockSpecCommand.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _clockSpec: this._clockSpec,
            _priorSpec: this._priorSpec
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   static revive(data: any): LiveClockSpecCommand {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return LiveClockSpecCommand.reviveDb(data.attributes);
      else
         return LiveClockSpecCommand.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any): LiveClockSpecCommand {

      return new LiveClockSpecCommand(GymClockSpec.revive(data._clockSpec), GymClockSpec.revive(data._priorSpec));
   };
}

////////////////////////////////////////
// LiveWhiteboardSelection - Class to represent the 'selection' of the whiteboard within a Workout document.
////////////////////////////////////////
export class LiveWhiteboardSelection implements ISelection {

   constructor() {
   }

   type(): string {
      return "LiveWhiteboardSelection";
   }
}

////////////////////////////////////////
// LiveWhiteboardSelection - Class to represent the 'selection' of the results within a Workout document.
////////////////////////////////////////
export class LiveResultsSelection implements ISelection {

   constructor() {
   }

   type(): string {
      return "LiveResultsSelection";
   }
}

////////////////////////////////////////
// LiveClockSpecSelection - Class to represent the 'selection' of the clock spec within a Workout document.
////////////////////////////////////////
export class LiveClockSpecSelection implements ISelection {

   constructor() {
   }

   type(): string {
      return "LiveClockSpecSelection";
   }
}

////////////////////////////////////////
// LiveWorkoutChannelPeer - Implemntation of ILiveDocumentChannel over RTC/peer architecture
////////////////////////////////////////
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
         if (ev.type === LiveResultsCommand.__type) {
            this.onCommandApply(ev as LiveResultsCommand);
         }
         if (ev.type === LiveClockSpecCommand.__type) {
            this.onCommandApply(ev as LiveClockSpecCommand);
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

////////////////////////////////////////
// LiveWorkoutChannelFactoryPeer - Creates the type of channel we need to exchange Workout Documents
// pass this to ILiveDocumentMaster / Remote in LiveDocumentCentral.
////////////////////////////////////////
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

////////////////////////////////////////
// LiveWorkoutFactory - Creates the Workout Documents, pass this to ILiveDocumentMaster / Remote in LiveDocumentCentral. 
////////////////////////////////////////
export class LiveWorkoutFactory implements ILiveDocumentFactory {

   static defaultWorkoutTextMaster: string = "No workout set. Click the button above ?.";
   static defaultWorkoutTextRemote: string = "Waiting for Coach to join.";
   static defaultResultsTextMaster: string = "Waiting for people to join.";
   static defaultResultsTextRemote: string = "Waiting for people to join.";

   constructor() {
   }

   createLiveDocument(outbound: boolean, channel: ILiveDocumentChannel): ILiveDocument {

      // Use cached copy of the workout if there is one
      let storedWorkoutState = new StoredWorkoutState();
      let storedWorkout = storedWorkoutState.loadWorkout();
      if (storedWorkout.length === 0) {
         if (outbound)
            storedWorkout = LiveWorkoutFactory.defaultWorkoutTextMaster;
         else
            storedWorkout = LiveWorkoutFactory.defaultWorkoutTextRemote;
      }

      // Results text set according to if we are coach or member.
      var resultsText: string = outbound ? LiveWorkoutFactory.defaultResultsTextMaster : LiveWorkoutFactory.defaultWorkoutTextRemote;

      // Use cached copy of the workout clock spec if there is one
      var storedClockSpec = storedWorkoutState.loadClockSpec();
      var clockSpec: GymClockSpec;

      if (storedClockSpec && storedClockSpec.length > 0) {

         var types = new StreamableTypes();
         var loadedClockSpec = types.reviveFromJSON(storedClockSpec);
         clockSpec = new GymClockSpec(loadedClockSpec.durationEnum,
            loadedClockSpec.musicEnum);

      } else {
         clockSpec = new GymClockSpec(EGymClockDuration.Ten, EGymClockMusic.None);
      }

      return new LiveWorkout(storedWorkout,
         resultsText,
         clockSpec,
         outbound, channel);
   }
}
