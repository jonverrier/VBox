/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

declare var require: any

import * as React from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';

import * as CSS from 'csstype';

// This app
import { Person } from '../common/person';
import { Party, PartySmall, PartyCaption, PartyNoImage } from './party';
import { FourStateRagEnum } from '../common/enum.js';
import { Rtc, RtcLink } from './rtc';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

const thinishStyle: CSS.Properties = {
   padding: '2px'
};

export interface IRemoteConnectionProps {
   rtc: Rtc;
}

interface IRemoteConnectionStatusState {
   overallStatus: any;
   serverStatus: any;
   coachStatus: any;
   intervalId: number;
}


function overallStatusFromTwo(one : any, two : any) : any {
   var overallStatus: any = null;

   if (one === FourStateRagEnum.Red || two === FourStateRagEnum.Red) {
       // Red if either one is red
       overallStatus = FourStateRagEnum.Red;
   }
   else
   if (one === FourStateRagEnum.Amber || two === FourStateRagEnum.Amber) {
      // Amber if either one is amber
      overallStatus = FourStateRagEnum.Amber;
   }
   else
   if (one === FourStateRagEnum.Green && two === FourStateRagEnum.Green) {
      // Green if both are green 
      overallStatus = FourStateRagEnum.Green;
   }
   else {
      // else indeterminate
      overallStatus = FourStateRagEnum.Indeterminate;
   }

   return overallStatus;
}

function participant(status: any, name: string, okText: string, issueText: string, small: boolean): JSX.Element {
   if (small) {
      switch (status) {
         case FourStateRagEnum.Green:
            return <PartySmall name={okText} thumbnailUrl={'circle-black-green-128x128.png'} />;
         case FourStateRagEnum.Amber:
            return <PartySmall name={issueText} thumbnailUrl={'circle-black-yellow-128x128.png'} />;
         case FourStateRagEnum.Red:
            return <PartySmall name={issueText} thumbnailUrl={'circle-black-red-128x128.png'} />;
         case FourStateRagEnum.Indeterminate:
         default:
            return <PartySmall name={'Connecting ...'} thumbnailUrl={'circle-black-grey-128x128.png'} />;
      }
   } else {
      switch (status) {
         case FourStateRagEnum.Green:
            return <PartyCaption name={name} caption={okText} thumbnailUrl={'circle-black-green-128x128.png'} />;
         case FourStateRagEnum.Amber:
            return <PartyCaption name={name} caption={issueText} thumbnailUrl={'circle-black-yellow-128x128.png'} />;
         case FourStateRagEnum.Red:
            return <PartyCaption name={name} caption={issueText} thumbnailUrl={'circle-black-red-128x128.png'} />;
         case FourStateRagEnum.Indeterminate:
         default:
            return <PartyCaption name={name} caption={'Connecting ...'} thumbnailUrl={'circle-black-grey-128x128.png'} />;
      }
   }
}

export class RemoteConnectionStatus extends React.Component<IRemoteConnectionProps, IRemoteConnectionStatusState> {

   constructor(props: IRemoteConnectionProps) {
      super(props);

      this.state = {
         overallStatus: FourStateRagEnum.Indeterminate,
         serverStatus: FourStateRagEnum.Indeterminate,
         coachStatus: FourStateRagEnum.Indeterminate,
         intervalId: null
      };
   }

   componentDidMount() {
      var interval = setInterval(this.onInterval.bind(this), 200);
   }

   componentWillUnmount() {
      if (this.state.intervalId) {
         clearInterval(this.state.intervalId);
         this.setState({ intervalId: null });
      }
   }

   onInterval() {
      const serverStatus: any = this.props.rtc.serverLinkStatus;
      const coachStatus: any = this.props.rtc.coachLinkStatus();
      var overallStatus: any = overallStatusFromTwo(serverStatus, coachStatus);

      this.setState({ overallStatus: overallStatus, serverStatus: serverStatus, coachStatus: coachStatus });
   }

   render() {
      return (
            <Dropdown as={ButtonGroup} id="collasible-nav-call-status">
               <Button split="true" variant="secondary" style={thinStyle}>
                  { this.topButton() } 
               </Button>
            <Dropdown.Toggle variant="secondary" id="call-status-split" size="sm">
            </Dropdown.Toggle>
            { this.menu()}
            </Dropdown>);
   }

   topButton() {
      var isCoach: boolean = false;
      var isServer: boolean = false;
      var issueString: string = null;

      if (this.state.serverStatus != FourStateRagEnum.Green)
         isServer = true;
      if (this.state.coachStatus != FourStateRagEnum.Green)
         isCoach = true;

      if (isServer && isCoach)
         issueString = 'Not connected to web or to coach.'
      else
      if (isServer)
         issueString = 'Not connected to web.'
      else
         issueString = 'Not connected to web coach.'

      return participant(this.state.overallStatus, null, 'Web and coach connection OK.', issueString, true);
   }

   menu() {
      return (
         <Dropdown.Menu align="right">
            <Dropdown.ItemText style={thinishStyle}>
               {participant(this.state.serverStatus, "Web", "Web connection OK.", "Web connection issues.", false)}
            </Dropdown.ItemText>
            <Dropdown.ItemText style={thinishStyle}>
               {participant(this.state.coachStatus, "Coach", "Coach connection OK.", "Coach connection issues.", false)}
            </Dropdown.ItemText>
         </Dropdown.Menu >
      );
   }
}

export interface IMasterConnectionProps {
   rtc: Rtc;
}

interface IMasterConnectionStatusState {
   overallStatus: any;
   serverStatus: any;
   overallLinkStatus: any;
   members: Array<any>;
   memberStatuses: Array<any>;
   intervalId: number;
}

export class MasterConnectionStatus extends React.Component<IMasterConnectionProps, IMasterConnectionStatusState> {

   constructor(props: IMasterConnectionProps) {
      super(props);

      if (props.rtc)
         props.rtc.addremotedatalistener(this.onData.bind(this));

      var members = new Array();
      var memberStatuses = new Array();

      this.state = {
         overallStatus: FourStateRagEnum.Indeterminate,
         serverStatus: FourStateRagEnum.Indeterminate,
         overallLinkStatus: FourStateRagEnum.Indeterminate,
         members: members,
         memberStatuses: memberStatuses, 
         intervalId: null
      };
   }

   componentDidMount() {
      var interval = setInterval(this.onInterval.bind(this), 200);
   }

   componentWillUnmount() {
      if (this.state.intervalId) {
         clearInterval(this.state.intervalId);
         this.setState({ intervalId: null });
      }
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc && (!(nextProps.rtc === this.props.rtc))) {
         nextProps.rtc.addremotedatalistener(this.onData.bind(this));
      }
   }

   onData(ev: Person) {
      if (Object.getPrototypeOf(ev).__type === Person.prototype.__type) {

         var members = this.state.members;
         members.push(ev);

         var memberStatuses = this.state.memberStatuses;
         var memberStatus = this.props.rtc.memberLinkStatus(ev.name);
         memberStatuses.push(memberStatus);

         this.setState({ members: members, memberStatuses: memberStatuses});
      }
   }

   onInterval() {

      // First build up the overall status & get the status for the server link
      const serverStatus: any = this.props.rtc.serverLinkStatus;
      var worstLinkStatus: any = FourStateRagEnum.Green;

      for (var i: number = 0; i < this.state.members.length && worstLinkStatus === FourStateRagEnum.Green; i++) {
         if (this.props.rtc.memberLinkStatus(this.state.members[i].name) === FourStateRagEnum.Red) {
            worstLinkStatus = FourStateRagEnum.Red;
         }
         if (this.props.rtc.memberLinkStatus(this.state.members[i].name) === FourStateRagEnum.Amber) {
            // Amber if any one link is Amber
            worstLinkStatus = FourStateRagEnum.Amber;
         }
         if (this.props.rtc.memberLinkStatus(this.state.members[i].name) === FourStateRagEnum.Indeterminate) {
            // Indeterminate if any one link is Indeterminate
            worstLinkStatus = FourStateRagEnum.Indeterminate;
         }
      }

      // Then in a second pass, get all the link statuses
      // Could do all in one pass but not likely to be a relevant gain
      var memberStatuses = this.state.memberStatuses;

      for (var i: number = 0; i < this.state.members.length; i++) {
         memberStatuses[i] = this.props.rtc.memberLinkStatus(this.state.members[i].name);
      }

      this.setState({
         overallStatus: overallStatusFromTwo(serverStatus, worstLinkStatus),
         serverStatus: serverStatus,
         overallLinkStatus: worstLinkStatus,
         memberStatuses: memberStatuses
      });
   }

   render() {
      return (
         <Dropdown as={ButtonGroup} id="collasible-nav-call-status">
            <Button split="true" variant="secondary" style={thinStyle}>
               {this.topButton()}
            </Button>
            <Dropdown.Toggle variant="secondary" id="call-status-split" size="sm">
            </Dropdown.Toggle>
            { this.menu()}
         </Dropdown>);
   }

   topButton() {
      var isMember: boolean = false;
      var isServer: boolean = false;
      var issueString: string = null;

      if (this.state.serverStatus != FourStateRagEnum.Green)
         isServer = true;
      if (this.state.overallLinkStatus != FourStateRagEnum.Green)
         isMember = true;

      if (isServer && isMember)
         issueString = 'Not connected to web or to a member.'
      else
      if (isServer)
         issueString = 'Not connected to web.'
      else
         issueString = 'Not connected to a meember.'

      return participant(this.state.overallStatus, null, 'Web and member connections OK.', issueString, true);
   }

   menu() {
      var items: Array<any> = new Array();

      for (var i = 0; i < this.state.members.length; i++) {
         var item = { key: i, name: this.state.members[i].name, status: this.state.memberStatuses[i] };
         items.push(item);
      }

      return (
         <Dropdown.Menu align="right">
            <Dropdown.ItemText style={thinishStyle}>
               {participant(this.state.serverStatus, "Web", "Web connection OK.", "Web connection issues.", false)}
            </Dropdown.ItemText>
            <Dropdown.Divider />
               {items.map((item) => <Dropdown.ItemText key={item.key} style={thinishStyle}>
                  {participant(item.status, item.name, 'Connection OK', 'Not connected to Member', false)}
            </Dropdown.ItemText>)
            }
         </Dropdown.Menu >
      );
   }
}