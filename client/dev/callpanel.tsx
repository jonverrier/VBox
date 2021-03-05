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

// This app
import { Person } from '../../core/dev/Person';
import { FourStateRagEnum } from '../../core/dev/Enum';
import { ParticipantSmall, ParticipantCaption } from './participant';
import { PeerConnection } from './PeerConnection';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

const thinishStyle: CSS.Properties = {
   padding: '2px'
};

export interface IRemoteConnectionProps {
   peers: PeerConnection;
}

interface IRemoteConnectionStatusState {
   overallStatus: boolean;
   serverStatus: boolean;
   coachStatus: boolean;
   intervalId: NodeJS.Timeout;
}

function overallStatusFromTwo(one: boolean, two: boolean): boolean {
   var overallStatus: any = null;

   if (!one || !two ) {
       // Red if either one is red
      return false;
   }
   else
      return true;
}

function participant(status: boolean, name: string, okText: string, issueText: string, small: boolean): JSX.Element {
   if (small) {
      if (status) 
         return <ParticipantSmall name={okText} thumbnailUrl={'circle-black-green-128x128.png'} />;
      else
         return <ParticipantSmall name={issueText} thumbnailUrl={'circle-black-red-128x128.png'} />;
   } else {
      if (status) 
         return <ParticipantCaption name={name} caption={okText} thumbnailUrl={'circle-black-green-128x128.png'} />;
      else
         return <ParticipantCaption name={name} caption={issueText} thumbnailUrl={'circle-black-red-128x128.png'} />;
   }
}

export class RemoteConnectionStatus extends React.Component<IRemoteConnectionProps, IRemoteConnectionStatusState> {

   constructor(props: IRemoteConnectionProps) {
      super(props);

      this.state = {
         overallStatus: false,
         serverStatus: false,
         coachStatus: false,
         intervalId: undefined
      };
   }

   componentDidMount() {
      var interval = setInterval(this.onInterval.bind(this), 5000); // Refresh every 5 seconds
   }

   componentWillUnmount() {
      if (this.state.intervalId) {
         clearInterval(this.state.intervalId);
         this.setState({ intervalId: null });
      }
   }

   onInterval() {
      const serverStatus: boolean = this.props.peers.isConnectedToServer();
      const coachStatus: boolean = this.props.peers.isConnectedToLeader();
      var overallStatus: boolean = overallStatusFromTwo(serverStatus, coachStatus);

      this.setState({ overallStatus: overallStatus, serverStatus: serverStatus, coachStatus: coachStatus });
   }

   render() {
      return (
            <Dropdown as={ButtonGroup} id="collasible-nav-call-status">
               <Button variant="secondary" style={thinStyle}>
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
      var issueString: string = undefined;

      if (!this.state.serverStatus)
         isServer = true;
      if (this.state.coachStatus)
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
   peers: PeerConnection;
}

interface IMasterConnectionStatusState {
   overallStatus: any;
   serverStatus: any;
   overallLinkStatus: any;
   members: Array<Person>;
   memberStatuses: Array<FourStateRagEnum>;
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
      if (nextProps.rtc && (!(nextProps.rtc === this.props.peers))) {
         nextProps.rtc.addremotedatalistener(this.onData.bind(this));
      }
   }

   onData(ev: Person) {
      if (ev.type === Person.__type) {

         var members = this.state.members;
         members.push(ev);

         var memberStatuses = this.state.memberStatuses;
         var memberStatus = this.props.peers.isConnectedToMember(ev.name) ? FourStateRagEnum.Green : FourStateRagEnum.Red;
         memberStatuses.push(memberStatus);

         this.setState({ members: members, memberStatuses: memberStatuses});
      }
   }

   onInterval() {

      // First build up the overall status & get the status for the server link
      const serverStatus: any = this.props.peers.isConnectedToServer;
      var worstLinkStatus: any = FourStateRagEnum.Green;

      for (var i: number = 0; i < this.state.members.length && worstLinkStatus === FourStateRagEnum.Green; i++) {
         if (! this.props.peers.isConnectedToMember (this.state.members[i].name)) {
            worstLinkStatus = FourStateRagEnum.Red;
         }
      }

      // Then in a second pass, get all the link statuses
      // Could do all in one pass but not likely to be a relevant gain
      var memberStatuses = this.state.memberStatuses;

      for (var i: number = 0; i < this.state.members.length; i++) {
         memberStatuses[i] = this.props.peers.isConnectedToMember(this.state.members[i].name) ? FourStateRagEnum.Green : FourStateRagEnum.Red;
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
            <Button variant="secondary" style={thinStyle}>
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