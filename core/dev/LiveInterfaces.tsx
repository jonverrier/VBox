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

   onCommandApply(command: ICommand): (void);
   onCommandReverse(command: ICommand): void;
   onDocument(command: ILiveDocument): void;

   sendDocumentTo(recipient: CallParticipation, document: ILiveDocument): void;
   broadcastCommandApply(command: ICommand): void;
   broadcastCommandReverse(command: ICommand): void;
}