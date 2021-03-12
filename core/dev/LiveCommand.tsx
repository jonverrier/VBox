/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Document architecture:
// DocumentInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - Master and Remote CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 

// This app, this component 
import { IStreamableFor } from './Streamable';
import { ILiveDocument, ICommand, ICommandProcessor, ILiveDocumentChannel } from './LiveInterfaces';

export class LiveCommandProcessor implements ICommandProcessor {

   private _document: ILiveDocument;
   private _channel: ILiveDocumentChannel | undefined;
   private _outbound: boolean | undefined;
   private _commands: Array<ICommand>;
   private _lastCommandIndex: number = -1;
   private _changeListeners: Array<Function>;

   constructor(document: ILiveDocument, outbound?: boolean, channel?: ILiveDocumentChannel) {
      this._document = document;
      this._channel = channel;
      this._outbound = outbound;
      this._commands = new Array<ICommand>();
      this.invalidateIndex();
      this._changeListeners = new Array<Function>();

      if (outbound !== undefined && (!outbound && channel)) {
         channel.onCommandApply = this.onCommandApply.bind(this);
         channel.onCommandReverse = this.onCommandReverse.bind(this);
         channel.onDocument = this.onDocument.bind(this);
      }
   }

   addChangeListener(fn: Function): void {
      this._changeListeners.push(fn);
   };

   adoptAndApply (command: ICommand): void {

      if (!this.isValidIndex()) {
         // This case is the first command since a new document
         this._lastCommandIndex = 0;
         this._commands.unshift (command);
      } else {
         // If we have undone a series of commands, need to throw away irrelevant ones & put the new command at the head
         if (this._lastCommandIndex != 0) {
            this._commands = this._commands.splice(this._lastCommandIndex);
         }
         this._commands.unshift(command);
      }

      // Apply the comment
      command.applyTo(this._document);

      // Broadcast to remote listeners
      if (this._outbound !== undefined && this._channel && this._outbound)
         this._channel.broadcastCommandApply(command);

      // notify local listeners
      if (this._changeListeners) {
         for (var i = 0; i < this._changeListeners.length; i++) {
            this._changeListeners[i](command, this._document);
         }
      }
   }

   canUndo(): boolean {
      // can undo if we have anything in the list and we are not at the end
      if (this._commands.length > 0 && this.isValidIndex() && this._lastCommandIndex < this._commands.length) {
         return (this._commands[this._lastCommandIndex].canReverse());
      }
      else
         return false;
   }

   canRedo(): boolean {
      // can redo if we have anything in the list and we are not at the start
      if (this._commands.length > 0 && this.isValidIndex() && this._lastCommandIndex > 0)
         return true;
      else
         return false;
   }

   undo(): void {

      if (this.canUndo()) {
         // move forward one step after undoing - opposite of 'redo' 
         this._commands[this._lastCommandIndex].reverseFrom(this._document);
         if (this._channel && this._outbound)
            this._channel.broadcastCommandReverse(this._commands[this._lastCommandIndex]);
         this._lastCommandIndex++;
      }
   }

   redo(): void {
      if (this.canRedo()) {
         // move back one step before applying - opposite of 'undo' 
         this._lastCommandIndex--;
         this._commands[this._lastCommandIndex].applyTo(this._document);
         if (this._channel && this._outbound)
            this._channel.broadcastCommandApply(this._commands[this._lastCommandIndex]);
      }
   }

   clearCommands(): void {
      this._commands = new Array<ICommand>();
      this.invalidateIndex(); 
   }

   private onCommandApply(command: ICommand): void {
      this.adoptAndApply(command);
   }

   private onCommandReverse(command: ICommand): void {
      this.undo();
   }

   private onDocument (document: ILiveDocument): void {
      this._document.assign(document);
      this.clearCommands();
   }

   private invalidateIndex(): void {
      this._lastCommandIndex = -1;
   }
   private isValidIndex(): boolean {
      return (this._lastCommandIndex != -1);
   }
}

// Streamable object that is sent to instruct an 'undo'
export class LiveUndoCommand implements IStreamableFor<LiveUndoCommand> {

   private _sequenceNo: number;

   static readonly __type = "LiveUndoCommand";

   /**
    * Create a LiveUndoCommand object
    */
   constructor(sequenceNo: number = 0) {

      this._sequenceNo = sequenceNo;
   }

   /**
   * set of 'getters' for private variables
   */
   get sequenceNo(): number {
      return this._sequenceNo;
   }
   get type(): string {
      return LiveUndoCommand.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: LiveUndoCommand): boolean {

      return ((this._sequenceNo === rhs._sequenceNo));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): any {

      return {
         __type: LiveUndoCommand.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _sequenceNo: this._sequenceNo,
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): LiveUndoCommand {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return LiveUndoCommand.reviveDb(data.attributes);

      return LiveUndoCommand.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): LiveUndoCommand {

      return new LiveUndoCommand(data._sequenceNo);
   };
}
