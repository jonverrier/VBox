/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

import * as React from 'react';

import Row from 'react-bootstrap/Row';

// This app
import { Person } from '../../core/dev/Person';
import { Party, PartyNoImage } from './party';
import { Rtc, RtcLink } from './rtc';

export interface IRemotePeopleProps {
   rtc: Rtc;
}

interface IRemotePeopleState {
   people: Array<Person>;
}

export class RemotePeople extends React.Component<IRemotePeopleProps, IRemotePeopleState> {

   constructor(props: IRemotePeopleProps) {
      super(props);
      if (props.rtc) {
         props.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
      var people = new Array<Person>();
      this.state = { people: people }
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc && (!(nextProps.rtc === this.props.rtc))) {
         nextProps.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   onremotedata(ev: any, link: RtcLink) {

      if (ev.type === Person.__type) {
         var person: Person = ev;

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
               <PartyNoImage name={'No-one else is connected.'} /> 
            </Row>
         );
      } else {
         return (<div>
            {
               items.map((item) =>
                  <Row key={item.key}>
                     <Party name={item.name} thumbnailUrl={item.thumbnailUrl} />
                  </Row>)
            }  </div>                                                               
         );
      }
   }
}
