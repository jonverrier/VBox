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
import { CallParticipation } from './Call';
import { ILiveDocument, ICommand, ICommandProcessor, ILiveDocumentChannel } from './LiveInterfaces';

// Stubbing for testing
var docInOut: ILiveDocumentChannel = null;

// Stubbing for testing
class LiveChannelStub implements ILiveDocumentChannel {

   constructor() {
   }

   // Override these for data from notifications 
   onCommandApply: ((this: LiveChannelStub, ev: ICommand) => any) | null;
   onCommandReverse: ((this: LiveChannelStub) => any) | null;
   onDocument: ((this: LiveChannelStub, ev: ILiveDocument) => void) | null;

   private onCommandApplyInner (command: ICommand): void {
      if (this.onCommandApply)
         this.onCommandApply(command);
   }
   private onCommandReverseInner(): void {
      if (this.onCommandReverse)
         this.onCommandReverse();
   }
   private onDocumentInner(document: ILiveDocument): void {
      if (this.onDocument)
         this.onDocument(document);
   }

   sendDocumentTo(recipient: CallParticipation, document: ILiveDocument): void {
      this.onDocumentInner (document);
   }
   broadcastCommandApply(command: ICommand): void {
      this.onCommandApplyInner (command);
   }
   broadcastCommandReverse(): void {
      this.onCommandReverseInner();
   }
}

export class LiveDocumentChannelFactory {
   constructor() {
   }

   createConnectionIn(): ILiveDocumentChannel {
      if (!docInOut)
         docInOut = new LiveChannelStub ();
      return docInOut;
   }

   createConnectionOut(document: ILiveDocument, commandProcessor: ICommandProcessor): ILiveDocumentChannel {
      if (!docInOut)
         docInOut = new LiveChannelStub ();
      return docInOut;
   }
}

