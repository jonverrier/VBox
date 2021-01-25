/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

declare var require: any

import * as React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';

// This app
import { Person } from '../common/person';
import { Party, PartySmall, PartyCaption, PartyNoImage } from './party';
import { FourStateRagEnum } from '../common/enum.js';
import { Rtc, RtcLink } from './rtc';

export interface IConnectionProps {
   rtc: Rtc;
}

interface IServerConnectionStatusState {
   status: any;
}

export class ServerConnectionStatus extends React.Component<IConnectionProps, IServerConnectionStatusState> {

   constructor(props: IConnectionProps) {
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

export class PartyMap {
   map: Map<string, any>;
   count: number;

   constructor() {
      this.map = new Map<string, any>();
      this.count = 0;
   }

   hasParty(key: string) : boolean {
      return this.map.has(key);
   }

   getPartyData(key: string): any {      
      return this.map.get(key);
   }

   addPartyData(key: string, data: any): any {
      if (! this.map.get(key))
         this.count++;
      this.map.set(key, data);

      return this.map.get(key);
   }

   deletePartyData(key: string) {
      if (this.map.get(key))
         this.count--;
      this.map.delete(key);
   }

   forEach(fn) {
      this.map.forEach(fn);
   }
};

interface ILinkConnectionStatusState {
   partyMap: PartyMap;
}

export class LinkConnectionStatus extends React.Component<IConnectionProps, ILinkConnectionStatusState> {

   constructor(props: IConnectionProps) {
      super(props);
      if (props.rtc) {
         props.rtc.addlinklistener (this.onlinkstatuschange.bind(this));
         props.rtc.addremotepersonlistener(this.onremoteperson.bind(this));
      }
      var partyMap = new PartyMap();
      this.state = { partyMap: partyMap}
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc) {
         nextProps.rtc.addlinklistener(this.onlinkstatuschange.bind(this));
         nextProps.rtc.onremoteperson = this.onremoteperson.bind(this);
      }
   }

   onlinkstatuschange(ev: Event, link: RtcLink) {
      var partyData;

      // we store a map, indexed by person Id, name is initially null until we get it sent by the remote connection
      if (!this.state.partyMap.hasParty(link.to.personId)) {
         partyData = { name: null, statusMap: new Map()};
         this.state.partyMap.addPartyData(link.to.personId, partyData);   
      } 

      partyData = this.state.partyMap.getPartyData (link.to.personId);

      // The person map then stores a staus map, indexed by sessionSubId, that stores link status
      partyData.statusMap.set(link.to.sessionSubId, link.linkStatus);

      // Finally, if event is null, its a removal
      if (ev == null && partyData.statusMap.has(link.to.sessionSubId)) {
         partyData.statusMap.delete(link.to.sessionSubId);

         // Remove the person entry if there are no sub keys
         var iter = partyData.statusMap.keys();
         if (iter.next().done)
            this.state.partyMap.deletePartyData (link.to.personId);  
      }

      this.setState({ partyMap: this.state.partyMap });
   }

   onremoteperson(ev: Person, link: RtcLink) {
      var partyData;

      // we store a map, indexed by person Id, name is initially null until we get it sent by the remote connection
      if (!this.state.partyMap.hasParty(link.to.personId)) {
         partyData = { name: null, statusMap: new Map() };
         this.state.partyMap.addPartyData(link.to.personId, partyData);
      } 

      // Store the new name back in state
      partyData = this.state.partyMap.getPartyData(link.to.personId);
      partyData.name = ev.name;
      partyData.statusMap.set(link.to.sessionSubId, FourStateRagEnum.Green); // Irrespective of previous link status, 
                                                                             // set it green as we have data flow.

      this.state.partyMap.addPartyData (link.to.personId, partyData);
      this.setState({ partyMap: this.state.partyMap });
   }

   render() {
      var items = new Array();
      var self = this;

      this.state.partyMap.forEach((value, key, map) => {
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

