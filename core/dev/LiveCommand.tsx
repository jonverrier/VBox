/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Document architecture:
// DocumentInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - Master and Remote CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 

// This app, this component 
import { ILiveDocument, ICommand, ICommandProcessor, ILiveDocumentChannel } from './LiveInterfaces';

export class LiveCommandProcessor implements ICommandProcessor {

   private _document: ILiveDocument;
   private _channel: ILiveDocumentChannel | undefined;
   private _outbound: boolean | undefined;
   private _commands: Array<ICommand>;
   private _lastCommandIndex: number = -1;

   constructor(document: ILiveDocument, outbound?: boolean, channel?: ILiveDocumentChannel) {
      this._document = document;
      this._channel = channel;
      this._outbound = outbound;
      this._commands = new Array<ICommand>();
      this.invalidateIndex();

      if (outbound !== undefined && (!outbound && channel)) {
         channel.onCommandApply = this.onCommandApply.bind(this);
         channel.onCommandReverse = this.onCommandReverse.bind(this);
         channel.onDocument = this.onDocument.bind(this);
      }
   }

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

      command.applyTo(this._document);
      if (this._channel && this._outbound)
         this._channel.broadcastCommandApply(command);
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

