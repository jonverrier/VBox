/*! Copyright TXPCo, 2020, 2021 */
// Modules in the LiveDocument architecture:
// LiveInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - Master and Remote CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 

// This app, this component 
import { StreamableTypes } from './StreamableTypes';
import { CallParticipation } from './Call';
import { ILiveDocument, ICommand, ILiveDocumentChannel, ILiveDocumentChannelFactory } from './LiveInterfaces';

// Stubbing for testing
var docInOut: ILiveDocumentChannel | null = null;

// Stubbing for testing
class LiveChannelStub implements ILiveDocumentChannel {

   types: StreamableTypes = new StreamableTypes;

   constructor() {
   }

   // Override these for data from notifications 
   onCommandApply: ((ev: ICommand) => void) = function (ev) { };
   onCommandReverse: (() => void) = function () { };
   onDocument: ((ev: ILiveDocument) => void) = function (ev) { };

   private onCommandApplyInner(command: string): void {
      if (this.onCommandApply)
         this.onCommandApply(this.types.reviveFromJSON (command));
   }
   private onCommandReverseInner(): void {
      if (this.onCommandReverse)
         this.onCommandReverse();
   }
   private onDocumentInner(document: string): void {
      if (this.onDocument)
         this.onDocument(this.types.reviveFromJSON (document));
   }

   sendDocumentTo(recipient: CallParticipation, document: ILiveDocument): void {
      this.onDocumentInner(JSON.stringify (document));
   }
   broadcastCommandApply(command: ICommand): void {
      this.onCommandApplyInner(JSON.stringify(command));
   }
   broadcastCommandReverse(): void {
      this.onCommandReverseInner();
   }
}

export class LiveDocumentChannelFactoryStub implements ILiveDocumentChannelFactory {

   constructor() {
   }

   createConnectionIn(): ILiveDocumentChannel {
      if (!docInOut)
         docInOut = new LiveChannelStub ();
      return docInOut;
   }

   createConnectionOut(): ILiveDocumentChannel {
      if (!docInOut)
         docInOut = new LiveChannelStub ();
      return docInOut;
   }
}
