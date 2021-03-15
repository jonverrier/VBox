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
import { CallParticipation } from './Call';

export interface ILiveDocumentFactory {

   createLiveDocument(outbound: boolean, channel: ILiveDocumentChannel): ILiveDocument;
}

export interface ILiveDocumentChannelFactory {

   createConnectionIn(): ILiveDocumentChannel;
   createConnectionOut(): ILiveDocumentChannel;
}

export interface ILiveDocument extends IStreamable {

   createCommandProcessor(): ICommandProcessor;
   assign(rhs: ILiveDocument);
}

export interface ICommandProcessor {

   adoptAndApply(command: ICommand): void;
   canUndo(): boolean;
   canRedo(): boolean;
   undo(): void;
   redo(): void;
   clearCommands(): void;
   addChangeListener(fn: Function ): void;
}

export interface ICommand extends IStreamable {

   selection(): ISelection;
   applyTo (document: ILiveDocument): void;
   reverseFrom (document: ILiveDocument): void;
   canReverse(): boolean;
}

export interface ISelection {

   type(): string;

}

// This enables easy stubbing for testing
export interface ILiveDocumentChannel {

   onNewCallParticipation(ev: IStreamable): void;
   onCommandApply(command: ICommand): void;
   onCommandReverse(command: ICommand): void;
   onDocument(command: ILiveDocument): void;

   sendDocumentTo(recipient: CallParticipation, document: ILiveDocument): void;
   broadcastCommandApply(command: ICommand): void;
   broadcastCommandReverse(command: ICommand): void;
}