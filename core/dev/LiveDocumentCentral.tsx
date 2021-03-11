/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Document architecture:
// DocumentInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - Master and Remote CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 

// This app, this component 
import { IStreamable } from './Streamable';
import { StreamableTypes } from './StreamableTypes';
import { CallParticipation } from './Call';
import { ILiveDocumentFactory, ILiveDocumentChannelFactory, ILiveDocument, ICommand, ICommandProcessor, ILiveDocumentChannel } from './LiveInterfaces';
import { Person } from './Person';

class LiveDocumentConnection {

   _meetingId: string;
   _localPerson: Person;
   _localCallParticipation: CallParticipation;
   _document: ILiveDocument;
   _commandProcessor: ICommandProcessor;
   _channel: ILiveDocumentChannel;

   constructor(meetingId: string,
      localPerson: Person,
      localCallParticipation,
      outbound: boolean,
      channelFactory: ILiveDocumentChannelFactory,
      documentFactory: ILiveDocumentFactory) {

      this._meetingId = meetingId;
      this._localPerson = localPerson;
      this._localCallParticipation = localCallParticipation;

      this._channel = outbound ? channelFactory.createConnectionOut() : channelFactory.createConnectionIn();
      this._document = documentFactory.createLiveDocument(outbound, this._channel);
      this._commandProcessor = this._document.createCommandProcessor();
   }

   /**
   * set of 'getters' & some 'setters' for private variables
   */
   get meetingId(): string {
      return this._meetingId;
   }
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

   constructor(meetingId: string,
      person: Person,
      localCallParticipation,
      channelFactory: ILiveDocumentChannelFactory,
      documentFactory: ILiveDocumentFactory) {

      super (meetingId, person, localCallParticipation, true, channelFactory, documentFactory);
   }
}

export class LiveDocumentRemote extends LiveDocumentConnection {

   constructor(meetingId: string,
      person: Person,
      localCallParticipation,
      channelFactory: ILiveDocumentChannelFactory,
      documentFactory: ILiveDocumentFactory) {

      super(meetingId, person, localCallParticipation, false, channelFactory, documentFactory);
   }
}
