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

import { LoggerFactory, ELoggerType } from './Logger';
import { IStreamable } from './Streamable'
import { StreamableTypes } from './StreamableTypes';
import { Person, PersonAttendance } from './Person';
import { CallParticipation } from './Call';
import { StoredWorkoutState } from './LocalStore';
import { ILiveDocument, ICommand, ISelection, ICommandProcessor, 
         ILiveDocumentChannel, ILiveDocumentChannelFactory, ILiveDocumentFactory} from './LiveInterfaces';
import { LiveCommandProcessor, LiveUndoCommand} from './LiveCommand';
import { PeerConnection } from './PeerConnection';
import { EGymClockDuration, EGymClockMusic, EGymClockState, GymClockSpec, GymClockState } from './GymClock';

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

////////////////////////////////////////
// LiveWorkout - class to represents the entire state of a workout. 
// Contains the workout brief(whiteboard), results, clock spec, clock state, call state.
////////////////////////////////////////
export class LiveWorkout implements ILiveDocument {

   static readonly __type: string = "LiveWorkout";

   private _whiteboardText: string;
   private _resultsText: string;
   private _clockSpec: GymClockSpec;
   private _clockState: GymClockState;
   private _channel: ILiveDocumentChannel | undefined;
   private _outbound: boolean | undefined;

   constructor(whiteboardText: string,
      resultsText: string,
      clockSpec: GymClockSpec,
      clockState: GymClockState,
      outbound?: boolean, channel?: ILiveDocumentChannel) {
      this._outbound = outbound;
      if (channel)
         this._channel = channel;
      this._whiteboardText = whiteboardText;
      this._resultsText = resultsText;
      this._clockSpec = clockSpec;
      this._clockState = clockState;
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
   // Getter and setter for clock state
   get clockState(): GymClockState {
      return this._clockState;
   }
   set clockState(clockState: GymClockState) {
      this._clockState = clockState;
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
            this._clockSpec.equals(workout._clockSpec) &&
            this._clockState.equals(workout._clockState));
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
         this._clockState = workout._clockState;
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
            _clockSpec: this._clockSpec,
            _clockState: this._clockState
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
         data._resultsText,
         GymClockSpec.revive(data._clockSpec),
         GymClockState.revive(data._clockState));
   };
}

////////////////////////////////////////
// LiveWhiteboardCommand - class to represents the whiteboard within a workout. 
////////////////////////////////////////
export class LiveWhiteboardCommand implements ICommand {

   private _selection: ISelection;
   private _next: string;
   private _prior: string;

   static readonly __type: string = "LiveWhiteboardCommand";

   constructor(next: string, prior: string) {
      this._selection = new LiveWhiteboardSelection(); // This command always has the same selection - the entire whiteboard. 
      this._next = next;
      this._prior = prior;                    // Caller has to make sure this === current state at time of calling.
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

         // Verify that the document has not changed since the command was created. 
         // In theory benigh since all commands are idempotent, but must be a logic error, so log it.
         if (!(this._prior === wo.whiteboardText)) {
            logger.logError(LiveWhiteboardCommand.__type, 'applyTo',
               'Error, current document state != prior from command:' + this._prior, wo.whiteboardText);
         }
         wo.whiteboardText = this._next;

         // save in local cache
         new StoredWorkoutState().saveWorkout(wo.whiteboardText);
      }
   }

   reverseFrom(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type == LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);
         wo.whiteboardText = this._prior;
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
            _next: this._next,
            _prior: this._prior
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

      return new LiveWhiteboardCommand(data._next, data._prior);
   };
}

////////////////////////////////////////
// LiveResultsCommand - class to represents the whiteboard within a workout.
////////////////////////////////////////
export class LiveResultsCommand implements ICommand {

   private _selection: ISelection;
   private _next: string;
   private _prior: string;

   static readonly __type: string = "LiveResultsCommand";

   constructor(next: string, prior: string) {
      this._selection = new LiveResultsSelection(); // This command always has the same selection - the entire whiteboard. 
      this._next = next;
      this._prior = prior;                 // Caller has to make sure this === current state at time of calling.
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
         // In theory benigh since all commands are idempotent, but must be a logic error, so log it.
         if (! (this._prior === wo.resultsText)) {
            logger.logError(LiveResultsCommand.__type, 'applyTo',
               'Error, current document state != prior from command:' + this._prior, wo.resultsText);
         }
         wo.resultsText = this._next;
      }
   }

   reverseFrom(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type == LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);
         wo.resultsText = this._prior;
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
            _next: this._next,
            _prior: this._prior
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

      return new LiveResultsCommand(data._next, data._prior);
   };
}

////////////////////////////////////////
// LiveClockSpecCommand - class to represents the clock spec within a workout.
////////////////////////////////////////
export class LiveClockSpecCommand implements ICommand {

   private _selection: ISelection;
   private _next: GymClockSpec;
   private _prior: GymClockSpec;

   static readonly __type: string = "LiveClockSpecCommand";

   constructor(next: GymClockSpec, prior: GymClockSpec) {
      this._selection = new LiveClockSpecSelection(); // This command always has the same selection - the entire whiteboard. 
      this._next = next;
      this._prior = prior;                 // Caller has to make sure this === current state at time of calling.
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
         // In theory benigh since all commands are idempotent, but must be a logic error, so log it.
         if (! this._prior.equals(wo.clockSpec)) {
            logger.logError(LiveClockSpecCommand.__type, 'applyTo',
               'Error, current document state != prior from command:' + this._prior, wo.clockSpec);
         }
         wo.clockSpec = this._next;
      }
   }

   reverseFrom(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type == LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);
         wo.clockSpec = this._prior;
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
            _next: this._next,
            _prior: this._prior
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

      return new LiveClockSpecCommand(GymClockSpec.revive(data._next),
         GymClockSpec.revive(data._prior));
   };
}

////////////////////////////////////////
// LiveClockStateCommand - class to represents the clock state within a workout.
////////////////////////////////////////
export class LiveClockStateCommand implements ICommand {

   private _selection: ISelection;
   private _next: GymClockState;
   private _prior: GymClockState;

   static readonly __type: string = "LiveClockStateCommand";

   constructor(next: GymClockState, prior: GymClockState) {
      this._selection = new LiveClockStateSelection(); // This command always has the same selection - the entire whiteboard.
      this._next = next;
      this._prior = prior;                 // Caller has to make sure this === current state at time of calling.
      // Otherwise can lead to problems when commands are copied around between sessions
   }

   // type is read only
   get type(): string {
      return LiveClockStateCommand.__type;
   }

   selection(): ISelection {
      return this._selection;
   }

   applyTo(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type === LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);

         // Verify that the document has not changed since the command was created
         // In theory benigh since all commands are idempotent, but must be a logic error, so log it.
         // Note we only compare state, since the tick count can drift between participants
         if (this._prior.stateEnum !== wo.clockState.stateEnum) {
            logger.logError(LiveClockStateCommand.__type, 'applyTo',
               'Error, current document state != prior from command:' + this._prior.stateEnum, wo.clockState.stateEnum);
         }
         wo.clockState = this._next;
      }
   }

   reverseFrom(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type == LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);
         wo.clockState = this._prior;
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
         __type: LiveClockStateCommand.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _next: this._next,
            _prior: this._prior
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   static revive(data: any): LiveClockStateCommand {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return LiveClockStateCommand.reviveDb(data.attributes);
      else
         return LiveClockStateCommand.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any): LiveClockStateCommand {

      return new LiveClockStateCommand(GymClockState.revive(data._next),
         GymClockState.revive(data._prior));
   };
}

////////////////////////////////////////
// LiveParticipationListCommand - class to represents the participation list within a workout.
////////////////////////////////////////
export class LiveParticipationListCommand implements ICommand {

   private _selection: ISelection;
   private _next: PersonAttendance;
   private _prior: PersonAttendance;

   static readonly __type: string = "LiveParticipationListCommand";

   constructor(next: PersonAttendance, prior: PersonAttendance) {
      this._selection = new LiveParticipationListSelection(); // This command always has the same selection - the entire whiteboard.
      this._next = next;
      this._prior = prior;                 // Caller has to make sure this === current state at time of calling.
      // Otherwise can lead to problems when commands are copied around between sessions
   }

   // type is read only
   get type(): string {
      return LiveParticipationListCommand.__type;
   }

   selection(): ISelection {
      return this._selection;
   }

   applyTo(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type === LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);

         // Verify that the document has not changed since the command was created
         // In theory benigh since all commands are idempotent, but must be a logic error, so log it.
         // TODO 
         /* if (this._prior.stateEnum !== wo.clockState.stateEnum) {
            logger.logError(LiveClockStateCommand.__type, 'applyTo',
               'Error, current document state != prior from command:' + this._prior.stateEnum, wo.clockState.stateEnum);
         }
         wo.clockState = this._next; */
      }
   }

   reverseFrom(document: ILiveDocument): void {
      // Since we downcast, need to check type
      if (document.type == LiveWorkout.__type) {
         var wo: LiveWorkout = (document as LiveWorkout);
         // TODO wo.clockState = this._prior;
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
         __type: LiveParticipationListCommand.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _next: this._next,
            _prior: this._prior
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   static revive(data: any): LiveParticipationListCommand {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return LiveParticipationListCommand.reviveDb(data.attributes);
      else
         return LiveParticipationListCommand.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any): LiveParticipationListCommand {

      return new LiveParticipationListCommand(PersonAttendance.revive (data._next),
         PersonAttendance.revive(data._prior));
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
// LiveResultsSelection - Class to represent the 'selection' of the results within a Workout document.
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
// LiveClockStateSelection - Class to represent the 'state' of the clock within a Workout document.
////////////////////////////////////////
export class LiveClockStateSelection implements ISelection {

   constructor() {
   }

   type(): string {
      return "LiveClockStateSelection";
   }
}

////////////////////////////////////////
// LiveParticipationListSelection - Class to represent the 'state' of the partipation list within a Workout document.
////////////////////////////////////////
export class LiveParticipationListSelection implements ISelection {

   constructor() {
   }

   type(): string {
      return "LiveParticipationListSelection";
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
         if (ev.type === LiveClockStateCommand.__type) {
            this.onCommandApply(ev as LiveClockStateCommand);
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

      // Use cached copy of the workout clock state if there is one
      var storedClockState = storedWorkoutState.loadClockState();
      var clockState: GymClockState;

      if (storedClockState && storedClockState.length > 0) {
         var types = new StreamableTypes()
         var loadedClockState = types.reviveFromJSON(storedClockState);
         clockState = new GymClockState(loadedClockState.stateEnum,
            loadedClockState.secondsIn);
      } else
         clockState = new GymClockState(EGymClockState.Stopped, 0);

      return new LiveWorkout(storedWorkout,
         resultsText,
         clockSpec,
         clockState,
         outbound, channel);
   }
}
