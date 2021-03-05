/*! Copyright TXPCo, 2020, 2021 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

import * as React from 'react';

import Row from 'react-bootstrap/Row';

// This app
import { Person } from '../../core/dev/Person';
import { IStreamable } from '../../core/dev/Streamable';
import { Participant, ParticipantNoImage } from './ParticipantUI';
import { PeerConnection } from './PeerConnection';

export interface IRemotePeopleProps {
   peers: PeerConnection;
}

interface IRemotePeopleState {
   people: Array<Person>;
}

export class RemotePeople extends React.Component<IRemotePeopleProps, IRemotePeopleState> {

   constructor(props: IRemotePeopleProps) {
      super(props);
      if (props.peers) {
         props.peers.addRemoteDataListener(this.onRemoteData.bind(this));
      }
      var people = new Array<Person>();
      this.state = { people: people }
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc && (!(nextProps.rtc === this.props.peers))) {
         nextProps.rtc.addremotedatalistener(this.onRemoteData.bind(this));
      }
   }

   onRemoteData(ev: IStreamable) {

      if (ev.type === Person.__type) {
         var person: Person = ev as Person;

         let people = this.state.people;
         people.push(person);

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
            }  </div>                                                               
         );
      }
   }
}
