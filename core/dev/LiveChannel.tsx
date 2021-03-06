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
//    - Master and Remote CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 

// This app, this component 
import { IStreamable } from './Streamable';
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
   onNewCallParticipation: ((ev: IStreamable) => any) = function (ev) { };
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
