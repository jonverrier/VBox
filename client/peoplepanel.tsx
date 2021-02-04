/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

declare var require: any

import * as React from 'react';

import Row from 'react-bootstrap/Row';

// This app
import { Person } from '../common/person';
import { Party, PartyNoImage } from './party';
import { IConnectionProps, PartyMap } from './callpanel';
import { Rtc, RtcLink } from './rtc';

interface IRemotePeopleState {
   partyMap: PartyMap;
}

export class RemotePeople extends React.Component<IConnectionProps, IRemotePeopleState> {

   constructor(props: IConnectionProps) {
      super(props);
      if (props.rtc) {
         props.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
      var partyMap = new PartyMap();
      this.state = { partyMap: partyMap }
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc) {
         nextProps.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   onremotedata(ev: any, link: RtcLink) {

      if (Object.getPrototypeOf(ev).__type === Person.prototype.__type) {
         var partyData;

         // we store a map, indexed by person Id, name is initially null until we get it sent by the remote connection
         if (!this.state.partyMap.hasParty(link.to.personId)) {
            partyData = { name: 'Unknown' };
            this.state.partyMap.addPartyData(link.to.personId, partyData);
         }

         // Store the new name back in state
         partyData = this.state.partyMap.getPartyData(link.to.personId);
         partyData.name = ev.name;
         this.state.partyMap.addPartyData(link.to.personId, partyData);

         this.setState({ partyMap: this.state.partyMap });
      }
   }

   render() {
      var items = new Array();
      var self = this;

      this.state.partyMap.forEach((value, key, map) => {
         let newItem = { key: key, name: value.name, caption: value.name, thumbnailUrl: 'person-w-128x128.png' };
         items.push(newItem);
      });

      if (this.state.partyMap.count === 0) {
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
