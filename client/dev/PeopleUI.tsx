/*! Copyright TXPCo, 2020, 2021 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

import * as React from 'react';

import Row from 'react-bootstrap/Row';

// This app
import { Person, PersonAttendance } from '../../core/dev/Person';
import { IStreamable } from '../../core/dev/Streamable';
import { PeerConnection } from '../../core/dev/PeerConnection';
import { ICommand, ICommandProcessor, ILiveDocument } from '../../core/dev/LiveInterfaces';
import { LiveWorkout, LiveAttendanceCommand } from '../../core/dev/LiveWorkout';
import { Participant, ParticipantNoImage } from './ParticipantUI';

export interface IRemotePeopleProps {
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
}

interface IRemotePeopleState {
   people: Array<Person>;
}

export class RemotePeople extends React.Component<IRemotePeopleProps, IRemotePeopleState> {

   constructor(props: IRemotePeopleProps) {
      super(props);
      // watch for changes being made on our document
      props.commandProcessor.addChangeListener(this.onChange.bind(this));

      var people = new Array<Person>();
      this.state = { people: people }
   }

   onChange(doc: ILiveDocument, cmd?: ICommand) {

      if ((!cmd && doc.type === LiveWorkout.__type)
         || (cmd && cmd.type === LiveAttendanceCommand.__type)) {

         // Either a new document or a change to the list of people
         var workout: LiveWorkout = doc as LiveWorkout;
         let people = new Array<Person>();

         for (var i = 0; i < workout.attendances.length; i++) {
            people.push(workout.attendances[i].person);
         }

         this.setState({ people: people });
      }
   }

   render() {
      var items = new Array();
      var self = this;

      this.state.people.forEach((value, index, arr) => {
         let newItem = { key: index, name: value.name, caption: value.name, thumbnailUrl: 'person-w-128x128.png' };
         items.push(newItem);
      });

      if (this.state.people.length === 0) {
         return (
            <Row>
               <ParticipantNoImage name={'No-one else is connected.'} /> 
            </Row>
         );
      } else {
         return (<div>
            {
               items.map((item) =>
                  <Row key={item.key}>
                     <Participant name={item.name} thumbnailUrl={item.thumbnailUrl} />
                  </Row>)
            }
         </div>);
      }
   }
}

export interface IMasterPeopleProps {
   peerConnection: PeerConnection;
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
}

interface IMasterPeopleState {
   people: Array<Person>;
}

export class MasterPeople extends React.Component<IMasterPeopleProps, IMasterPeopleState> {

   constructor(props: IMasterPeopleProps) {
      super(props);
      // Listen for incoming People
      props.peerConnection.addRemoteDataListener (this.onRemoteData.bind(this));

      // watch for changes being made on our document
      props.commandProcessor.addChangeListener(this.onChange.bind(this));

      var people = new Array<Person>();
      this.state = { people: people }

      // add ourselves to the attendee list in the document
      var attendance = new PersonAttendance(null, props.peerConnection.person, new Date());
      let command = new LiveAttendanceCommand(attendance, attendance);
      this.props.commandProcessor.adoptAndApply(command);
   }

   onRemoteData(ev: IStreamable) {

      if (ev.type === Person.__type) {
         var person: Person = ev as Person;
         var attendance = new PersonAttendance(null, person, new Date());

         // Insert the new attendance into our document
         let command = new LiveAttendanceCommand(attendance, attendance);
         this.props.commandProcessor.adoptAndApply(command);
      }
   }

   onChange(doc: ILiveDocument, cmd?: ICommand) {

      if ((!cmd && doc.type === LiveWorkout.__type)
         || (cmd && cmd.type === LiveAttendanceCommand.__type)) {

         // Either a new document or a change to the list of people
         var workout: LiveWorkout = doc as LiveWorkout;
         let people = new Array<Person>();

         for (var i = 0; i < workout.attendances.length; i++) {
            people.push(workout.attendances[i].person);
         }

         this.setState({ people: people });
      }
   }

   render() {
      var items = new Array();
      var self = this;

      this.state.people.forEach((value, index, arr) => {
         let newItem = { key: index, name: value.name, caption: value.name, thumbnailUrl: 'person-w-128x128.png' };
         items.push(newItem);
      });

      if (this.state.people.length === 0) {
         return (
            <Row>
               <ParticipantNoImage name={'No-one else is connected.'} />
            </Row>
         );
      } else {
         return (<div>
            {
               items.map((item) =>
                  <Row key={item.key}>
                     <Participant name={item.name} thumbnailUrl={item.thumbnailUrl} />
                  </Row>)
            }
         </div>);
      }
   }
}