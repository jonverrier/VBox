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
import { IDocument, ICommand, ISelection } from './LiveDocumentInterfaces';
import { DocumentCommunicationFactory } from './LiveDocumentCommunication';

export class LiveWorkout implements IDocument {

   private static readonly _liveworkoutDocumentMagicNumber: number = 0xa15ac3eb; // pasted from
   // https://onlinehextools.com/generate-random-hex-numbers

   private _whiteboard: string;

   constructor() {

   }

   magicNumber(): number {
      return LiveWorkout._liveworkoutDocumentMagicNumber;
   }

   createCommandProcessor(): ICommandProcessor {

   }

   // Getter and setter for whitebard text
   get whiteboardText (): string {
      return this._whiteboard;
   }
   set whiteboardText(whiteboardText: string) {
      this._whiteboard = whiteboardText;
   }


}

export class ICommandProcessor {

   adoptAndDo(command: ICommand): void {

   }

}

export interface IMasterCommandProcessor {

   adoptAndDo(command: ICommand): void;
   canUndo(): boolean;
   canRedo(): boolean;
   undo(): void;
   redo(): void;

}

export interface IRemoteCommandProcessor {

   setDocument(document: IDocument);
   adoptAndDo(command: ICommand): void;
   onCommand(command: ICommand): void;
   onDocument(command: IDocument): void;

}

export class LiveWorkoutWhiteboardText implements ICommand {

   constructor() {

   }

   selection(): ISelection {

   }

   applyTo(document: IDocument): void {

   }

   reverseFrom(document: IDocument): void {

   }

   canReverse(): boolean {

   }

}

export class DocumentWorkoutText implements ISelection {

   constructor() {

   }

   type(): string {
      return "DocumentWorkoutText";
   }

}