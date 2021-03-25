/*! Copyright TXPCo, 2020, 2021 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

import * as React from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';

import * as CSS from 'csstype';

// This app, other library
import { Person } from '../../core/dev/Person';
import { EThreeStateSwitchEnum } from '../../core/dev/Enum';
import { ParticipantSmall, ParticipantCaption } from './ParticipantUI';
import { PeerConnection } from '../../core/dev/PeerConnection';
import { cmnNoMarginPad } from './CommonStylesUI';

const thinishStyle: CSS.Properties = {
   padding: '2px'
};

export interface IRemoteConnectionProps {
   peers: PeerConnection;
}

interface IRemoteConnectionStatusState {
   overallStatus: EThreeStateSwitchEnum;
   serverStatus: boolean;
   coachStatus: boolean;
   intervalId: NodeJS.Timeout;
}

function overallStatusFromTwo(one: boolean, two: boolean): EThreeStateSwitchEnum {

   if (one && two) {
      return EThreeStateSwitchEnum.On;
   }
   else if (!one && !two) {
      return EThreeStateSwitchEnum.Off;
   } else {
      return EThreeStateSwitchEnum.Indeterminate;
   }
}

function overallStatusFromOne(one: boolean): EThreeStateSwitchEnum {

   if (one ) {
      return EThreeStateSwitchEnum.On;
   }
   else {
      return EThreeStateSwitchEnum.Off;
   } 
}

function participant(status: EThreeStateSwitchEnum, name: string, okText: string, issueText: string, small: boolean): JSX.Element {
   if (small) {
      if (status === EThreeStateSwitchEnum.On)
         return <ParticipantSmall name={okText} thumbnailUrl={'circle-black-green-128x128.png'} />;
      else
      if (status === EThreeStateSwitchEnum.Off)
         return <ParticipantSmall name={issueText} thumbnailUrl={'circle-black-red-128x128.png'} />;
      else
         return <ParticipantSmall name={issueText} thumbnailUrl={'circle-black-grey-128x128.png'} />;
   } else {
      if (status === EThreeStateSwitchEnum.On)
         return <ParticipantCaption name={name} caption={okText} thumbnailUrl={'circle-black-green-128x128.png'} />;
      else
      if (status === EThreeStateSwitchEnum.Off)
         return <ParticipantCaption name={name} caption={issueText} thumbnailUrl={'circle-black-red-128x128.png'} />;
      else
         return <ParticipantCaption name={name} caption={issueText} thumbnailUrl={'circle-black-grey-128x128.png'} />;
   }
}

export class RemoteConnectionStatus extends React.Component<IRemoteConnectionProps, IRemoteConnectionStatusState> {

   constructor(props: IRemoteConnectionProps) {
      super(props);

      this.state = {
         overallStatus: EThreeStateSwitchEnum.Indeterminate,
         serverStatus: false,
         coachStatus: false,
         intervalId: undefined
      };
   }

   componentDidMount() : void {
      var interval = setInterval(this.onInterval.bind(this), 5000); // Refresh every 5 seconds
   }

   componentWillUnmount() : void  {
      if (this.state.intervalId) {
         clearInterval(this.state.intervalId);
         this.setState({ intervalId: null });
      }
   }

   onInterval() : void {
      const serverStatus: boolean = this.props.peers.isConnectedToServer();
      const coachStatus: boolean = this.props.peers.isConnectedToLeader();
      var overallStatus: EThreeStateSwitchEnum = overallStatusFromTwo(serverStatus, coachStatus);

      this.setState({ overallStatus: overallStatus, serverStatus: serverStatus, coachStatus: coachStatus });
   }

   render() {
      return (
            <Dropdown as={ButtonGroup} id="collasible-nav-call-status">
               <Button variant="secondary" style={cmnNoMarginPad}>
                  { this.overallStatus() } 
               </Button>
            <Dropdown.Toggle variant="secondary" id="call-status-split" size="sm">
            </Dropdown.Toggle>
            { this.detailedStatusList ()}
            </Dropdown>);
   }

   overallStatus() {
      var isCoach: boolean = false;
      var isServer: boolean = false;
      var issueString: string = undefined;

      if (!this.state.serverStatus)
         isServer = true;
      if (this.state.coachStatus)
         isCoach = true;

      if (isServer && isCoach)
         issueString = 'Sorry, cannot connect to Web or to Coach.'
      else
      if (isServer)
         issueString = 'Sorry, cannot connect to Web.'
      else
         issueString = 'Sorry, cannot connect to Coach.'

      return participant(this.state.overallStatus, null, 'All connections Ok.', issueString, true);
   }

   detailedStatusList () {
      return (
         <Dropdown.Menu align="right">
            <Dropdown.ItemText style={thinishStyle}>
               {participant(overallStatusFromOne(this.state.serverStatus), "Web", "Connected to Web.", "Sorry, cannot connect to Web.", false)}
            </Dropdown.ItemText>
            <Dropdown.ItemText style={thinishStyle}>
               {participant(overallStatusFromOne(this.state.coachStatus), "Coach", "Connected to Coach.", "Sorry, cannot connect to Coach.", false)}
            </Dropdown.ItemText>
         </Dropdown.Menu >
      );
   }
}

export interface IMasterConnectionProps {
   peers: PeerConnection;
}

interface IMasterConnectionStatusState {
   overallStatus: EThreeStateSwitchEnum;
   serverStatus: boolean;
   members: Array<Person>;
   memberStatuses: Array<boolean>;
   intervalId: number;
}

export class MasterConnectionStatus extends React.Component<IMasterConnectionProps, IMasterConnectionStatusState> {

   constructor(props: IMasterConnectionProps) {
      super(props);

      if (props.peers)
         props.peers.addRemoteDataListener(this.onData.bind(this));

      var members = new Array();
      var memberStatuses = new Array();

      this.state = {
         overallStatus: EThreeStateSwitchEnum.Indeterminate,
         serverStatus: false,
         members: members,
         memberStatuses: memberStatuses, 
         intervalId: null
      };
   }

   componentDidMount() : void {
      var interval = setInterval(this.onInterval.bind(this), 5000);
   }

   componentWillUnmount() : void {
      if (this.state.intervalId) {
         clearInterval(this.state.intervalId);
         this.setState({ intervalId: null });
      }
   }

   onData(ev: Person) {
      if (ev.type === Person.__type) {

         var members = this.state.members;
         members.push(ev);

         var memberStatuses = this.state.memberStatuses;
         var memberStatus: boolean = this.props.peers.isConnectedToMember(ev.name);
         memberStatuses.push(memberStatus);

         this.setState({ members: members, memberStatuses: memberStatuses});
      }
   }

   onInterval() : void {

      // First build up the overall status & get the status for the server link
      const serverStatus: boolean = this.props.peers.isConnectedToServer();
      var worstLinkStatus: boolean = true;

      for (var i: number = 0; i < this.state.members.length && worstLinkStatus === true; i++) {
         if (! this.props.peers.isConnectedToMember (this.state.members[i].name)) {
            worstLinkStatus = false;
         }
      }

      // Then in a second pass, get all the link statuses
      // Could do all in one pass but not likely to be a relevant gain
      var memberStatuses = this.state.memberStatuses;

      for (var i: number = 0; i < this.state.members.length; i++) {
         memberStatuses[i] = this.props.peers.isConnectedToMember(this.state.members[i].name);
      }

      this.setState({
         overallStatus: overallStatusFromTwo(serverStatus, worstLinkStatus),
         serverStatus: serverStatus,
         memberStatuses: memberStatuses
      });
   }

   render() {
      return (
         <Dropdown as={ButtonGroup} id="collasible-nav-call-status">
            <Button variant="secondary" style={cmnNoMarginPad}>
               {this.overallStatus()}
            </Button>
            <Dropdown.Toggle variant="secondary" id="call-status-split" size="sm">
            </Dropdown.Toggle>
            { this.detailedStatusList() }
         </Dropdown>);
   }

   overallStatus() {
      var isMember: boolean = false;
      var isServer: boolean = false;
      var issueString: string = null;

      if (!this.state.serverStatus)
         isServer = true;

      for (var i: number = 0; i < this.state.members.length; i++) {
         if (!this.props.peers.isConnectedToMember(this.state.members[i].name))
            isMember = true;
      }

      if (isServer && isMember)
         issueString = 'Sorry, cannot connect to Web or to a Member.';
      else
      if (isServer)
         issueString = 'Sorry, cannot connect to Web.';
      else
         issueString = 'Sorry, cannot connect to a Member.';

      return participant(this.state.overallStatus, null, 'All connections Ok.', issueString, true);
   }

   detailedStatusList() {

      if (this.state.members.length === 0) {
         return (<Dropdown.Menu align="right">
            <Dropdown.ItemText style={thinishStyle}>
               {participant(overallStatusFromOne(this.state.serverStatus), "Web", "Connected to Web.", "Sorry, cannot connect to Web.", false)}
            </Dropdown.ItemText>
            <Dropdown.Divider />
            <Dropdown.ItemText style={thinishStyle}>
               {participant(EThreeStateSwitchEnum.Indeterminate, 'No-one else is connected.', 'No-one else is connected.', 'No-one else is connected.', false)}
            </Dropdown.ItemText>)
         </Dropdown.Menu >);
      }
      
      var items: Array<any> = new Array();

      for (var i = 0; i < this.state.members.length; i++) {
         var item = { key: i, name: this.state.members[i].name, status: this.state.memberStatuses[i] };
         items.push(item);
      }

      return (
         <Dropdown.Menu align="right">
            <Dropdown.ItemText style={thinishStyle}>
               {participant(overallStatusFromOne(this.state.serverStatus), "Web", "Connected to Web.", "Sorry, cannot connect to Web.", false)}
            </Dropdown.ItemText>
            <Dropdown.Divider />
               {items.map((item) => <Dropdown.ItemText key={item.key} style={thinishStyle}>
                  {participant(overallStatusFromOne(item.status), item.name, 'Connected to Member.', 'Sorry, cannot connect to Member.', false)}
            </Dropdown.ItemText>)
            }
         </Dropdown.Menu >
      );
   }
}