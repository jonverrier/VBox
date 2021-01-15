/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

declare var require: any

import * as React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
 
// This app
import { Person } from '../common/person';
import { PartySmall, PartyCaption } from './party';
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

   UNSAFE_componentWillReceiveProps (nextProps) {
      if (nextProps.rtc)
         nextProps.rtc.onserverconnectionstatechange = this.onServerConnectionStateChange.bind(this);
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
      if (props.rtc) {
         props.rtc.onlinkstatechange = this.onLinkStateChange.bind(this);
         props.rtc.onremoteperson = this.onremoteperson.bind(this);
      }
      var linkStatusMap = new Map<string, any>();
      this.state = { linkStatusMap: linkStatusMap}
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc) {
         nextProps.rtc.onlinkstatechange = this.onLinkStateChange.bind(this);
         nextProps.rtc.onremoteperson = this.onremoteperson.bind(this);
      }
   }

   onLinkStateChange(ev: Event, link: RtcLink) {

      // we store a map, indexed by person Id, name is initially null until we get it sent by the remote connection
      if (!this.state.linkStatusMap.has(link.to.personId)) {
         var linkTo = { name: null, statusMap: new Map() };
         this.state.linkStatusMap.set(link.to.personId, linkTo);    
      } 

      var personEntry = this.state.linkStatusMap.get(link.to.personId);

      // The person map then stores a staus map, indexed by sessionSubId, that stores link status
      personEntry.statusMap.set(link.to.sessionSubId, link.linkStatus);

      // Finally, if event is null, its a removal
      if (ev == null && personEntry.statusMap.has(link.to.sessionSubId)) {
         personEntry.statusMap.delete(link.to.sessionSubId);

         // Remove the person entry if there are no sub keys
         var iter = personEntry.statusMap.keys();
         if (iter.next().done)
            this.state.linkStatusMap.delete (link.to.personId);  
      }

      this.setState ({ linkStatusMap: this.state.linkStatusMap });
   }

   onremoteperson(ev: Person, link: RtcLink) {

      // we store a map, indexed by person Id
      if (!this.state.linkStatusMap.has(link.to.personId)) {
         var linkTo = { name: ev.name, statusMap: new Map() };
         this.state.linkStatusMap.set(link.to.personId, linkTo);
      }

      // Store the new name back in state
      var personEntry = this.state.linkStatusMap.get(link.to.personId);
      personEntry.name = ev.name;
      personEntry.statusMap.set(link.to.sessionSubId, FourStateRagEnum.Green); // Irrespective of previous link status, 
                                                                               // set it green as we have data flow.

      this.state.linkStatusMap.set(link.to.personId, personEntry);

      this.setState({ linkStatusMap: this.state.linkStatusMap });
   }

   render() {
      var items = new Array();
      var self = this;

      this.state.linkStatusMap.forEach((value, key, map) => {
         var allGreen = true, allRed = true, count = 0, name = value.name;

         value.statusMap.forEach((valueInner, keyInner, mapInner) => {
            if (valueInner === FourStateRagEnum.Green) {
               allRed = false;
            } else 
            if (valueInner === FourStateRagEnum.Red) {
               allGreen = false;
            } else
               allGreen = allRed = false;

            count++;
         });

         let newItem = { key: null, name: null, caption: null, thumbnailUrl: null };

         newItem.key = key;

         if (name) {
            newItem.name = name;
            newItem.caption = name + " connected " + count + " times.";
         } else {
            newItem.name = 'Unknown';
            newItem.caption = "User " + key + " connected " + count + " times.";
         }

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
               {items.map((item) => <Dropdown.ItemText key={item.key}><PartyCaption name={item.name} caption={item.caption} thumbnailUrl={item.thumbnailUrl} />
               </Dropdown.ItemText>)}
            </Dropdown.Menu >
         );
      }
   }
}
