/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

declare var require: any

import * as React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
 
// This app
import { PartySmall } from './party';
import { FourStateRagEnum } from '../common/enum.js';
import { Rtc, RtcLink } from './rtc';

interface IConnectionStatusProps {
   rtc: Rtc;
}

interface IServerConnectionStatusState {
   status: any;
}

interface ILinkConnectionStatusState {
   linkStatusMap: Map<string, any>;
}

export class ServerConnectionStatus extends React.Component<IConnectionStatusProps, IServerConnectionStatusState> {

   constructor(props: IConnectionStatusProps) {
      super(props);
      if (props.rtc)
         props.rtc.onserverconnectionstatechange = this.onServerConnectionStateChange.bind(this);
      this.state = { status: FourStateRagEnum.Indeterminate };
   }

   onServerConnectionStateChange(status) {
      this.setState({ status: status });
   }

   render() {
      switch (this.state.status) {
         case FourStateRagEnum.Green:
            return <PartySmall name={'Connected to server.'} thumbnailUrl={'circle-black-green-128x128.png'} />;
         case FourStateRagEnum.Amber:
            return <PartySmall name={'Trying to re-connect to the server ...'} thumbnailUrl={'circle-black-yellow-128x128.png'} />;
         case FourStateRagEnum.Red:
            return <PartySmall name={'Sorry, experiencing issues connecting to the server.'} thumbnailUrl={'circle-black-red-128x128.png'} />;
         case FourStateRagEnum.Indeterminate:
         default:
            return <PartySmall name={'Connecting to server ...'} thumbnailUrl={'circle-black-grey-128x128.png'} />;
      }
   }
}

export class LinkConnectionStatus extends React.Component<IConnectionStatusProps, ILinkConnectionStatusState> {

   constructor(props: IConnectionStatusProps) {
      super(props);
      if (props.rtc)
         props.rtc.onlinkstatechange = this.onLinkStateChange.bind(this);

      var linkStatusMap = new Map<string, any>();
      this.state = { linkStatusMap: linkStatusMap}
   }

   onLinkStateChange(ev: Event, link: RtcLink) {

      // we store a map, indexed by person Id
      if (!this.state.linkStatusMap.has(link.to.personId)) {
         this.state.linkStatusMap.set(link.to.personId, new Map());    
      } 

      var personMap = this.state.linkStatusMap.get(link.to.personId);

      // That then stores a map, indexed by sessionSubId, that stores link status
      personMap.set(link.to.sessionSubId, link.linkStatus);

      // Finally, if event is null, its a removal
      if (ev == null && personMap.has(link.to.sessionSubId)) {
         personMap.delete(link.to.sessionSubId);

         var iter = personMap.keys();
         if (iter.next().done)
            this.state.linkStatusMap.delete (link.to.personId);  
      }

      this.setState ({ linkStatusMap: this.state.linkStatusMap });
   }

   render() {
      var items = new Array();

      this.state.linkStatusMap.forEach((value, key, map) => {
         var allGreen = true, allRed = true, count = 0;

         value.forEach((valueInner, keyInner, mapInner) => {
            if (valueInner === FourStateRagEnum.Green) {
               allRed = false;
            } else 
            if (valueInner === FourStateRagEnum.Red) {
               allGreen = false;
            } else
               allGreen = allRed = false;

            count++;
         });

         let newItem = { key: null, name: null, thumbnailUrl: null };
         newItem.key = key;
         newItem.name = "User " + key + " connected " + count + " times.";
         if (allGreen)
            newItem.thumbnailUrl = 'circle-black-green-128x128.png';
         else
         if (allRed)
            newItem.thumbnailUrl = 'circle-black-red-128x128.png';
         else
            newItem.thumbnailUrl = 'circle-black-yellow-128x128.png';

         items.push(Object.assign({}, newItem));
      });

      if (items.length === 0) {
         return (
            <Dropdown.Menu align="right">
               <Dropdown.ItemText>No-one else is connected.</Dropdown.ItemText>
            </Dropdown.Menu >);
      } else {
         return (
            <Dropdown.Menu align="right">
               {items.map((item) => <Dropdown.ItemText key={item.key}><PartySmall name={item.name} thumbnailUrl={item.thumbnailUrl} />
               </Dropdown.ItemText>)}
            </Dropdown.Menu >
         );
      }
   }
}
