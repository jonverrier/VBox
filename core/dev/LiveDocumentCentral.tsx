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
import { IStreamable } from './Streamable';
import { StreamableTypes } from './StreamableTypes';
import { CallParticipation } from './Call';
import { ILiveDocumentFactory, ILiveDocumentChannelFactory, ILiveDocument, ICommand, ICommandProcessor, ILiveDocumentChannel } from './LiveInterfaces';
import { Person } from './Person';

class LiveDocumentConnection {

   _localPerson: Person;
   _localCallParticipation: CallParticipation;
   _document: ILiveDocument;
   _commandProcessor: ICommandProcessor;
   _channel: ILiveDocumentChannel;

   constructor(localPerson: Person,
      localCallParticipation,
      outbound: boolean,
      channelFactory: ILiveDocumentChannelFactory,
      documentFactory: ILiveDocumentFactory) {

      this._localPerson = localPerson;
      this._localCallParticipation = localCallParticipation;

      this._channel = outbound ? channelFactory.createConnectionOut() : channelFactory.createConnectionIn();
      this._document = documentFactory.createLiveDocument(outbound, this._channel);
      this._commandProcessor = this._document.createCommandProcessor();

      // If we are outbound, when there is a new joiner, send them the document
      if (outbound) {
         var self: LiveDocumentConnection = this;
         this._channel.onNewCallParticipation = function (ev: CallParticipation) {
            self.channel.sendDocumentTo(ev, self._document);
         };
      }
   }

   /**
   * set of 'getters' & some 'setters' for private variables
   */
   get localCallParticipation(): CallParticipation {
      return this._localCallParticipation;
   }
   get localPerson(): Person {
      return this._localPerson;
   }
   get document(): ILiveDocument {
      return this._document;
   }
   get channel(): ILiveDocumentChannel {
      return this._channel;
   }
   get commandProcessor(): ICommandProcessor {
      return this._commandProcessor;
   }
}

export class LiveDocumentMaster extends LiveDocumentConnection {

   constructor(person: Person,
      localCallParticipation,
      channelFactory: ILiveDocumentChannelFactory,
      documentFactory: ILiveDocumentFactory) {

      super(person, localCallParticipation, true, channelFactory, documentFactory);
   }
}

export class LiveDocumentRemote extends LiveDocumentConnection {

   constructor(person: Person,
      localCallParticipation,
      channelFactory: ILiveDocumentChannelFactory,
      documentFactory: ILiveDocumentFactory) {

      super(person, localCallParticipation, false, channelFactory, documentFactory);
   }
}
