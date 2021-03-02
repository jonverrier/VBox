/*! Copyright TXPCo, 2020, 2021 */

// External components
import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Nav from 'react-bootstrap/Nav';

import * as CSS from 'csstype';

// This app, other components
import { IStreamable } from '../../core/dev/Streamable';
import { Person } from '../../core/dev/Person';
import { CallLeaderResolve } from '../../core/dev/Call';

// This app, this component
import { PeerConnection } from './PeerConnection';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
};

const alertStyle: CSS.Properties = {
   margin: '0px'
};

export interface ILeaderConnectionProps {
   peers: PeerConnection;
   onLeaderChange: Function;
}

interface ILeaderResolveState {
   isLeader: boolean;
   myLeaderResolve: CallLeaderResolve;
}

export class LeaderResolve extends React.Component<ILeaderConnectionProps, ILeaderResolveState> {
   //member variables

   constructor(props: ILeaderConnectionProps) {
      super(props);

      // Store a resolve object as early as possible to avoid race conditions when we send CallLeaderResolve to each other.
      // This ensures we have one before we hook data updates
      var resolve = new CallLeaderResolve();
      this.state = { isLeader: true, myLeaderResolve: resolve };
      if (this.props.peers) {
         this.props.peers.addRemoteDataListener(this.onRemoteData.bind(this));
      }
   }

   componentDidMount() {
   }

   componentWillUnmount() {
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc && (!(nextProps.rtc === this.props.peers))) {
         nextProps.rtc.addremotedatalistener(this.onRemoteData.bind(this));
      }
   }

   onRemoteData(ev: IStreamable) {
      // By convention, new joiners broadcast a 'Person' object
      if (ev.type === Person.__type) {
         // Send them our CallLeaderResolve 
         this.forceUpdate(() => {
            this.props.peers.broadcast(this.state.myLeaderResolve);
         });
      }
      // If we recieve a CallLeaderResolve that beats us, we are not leader.
      if (ev.type === CallLeaderResolve.__type) {
         if (!this.state.myLeaderResolve.isWinnerVs(ev as CallLeaderResolve)) {
            this.setState({ isLeader: false });
            if (this.props.onLeaderChange)
               this.props.onLeaderChange(false);
         }
      }
   }

   render() {
      if (this.state.isLeader) {
         return (
            <div style={thinStyle}>
            </div>);
      } else {
         return (
            <div style={thinStyle}>
               <Alert style={alertStyle} key={'notLeaderId'} variant={'secondary'}>  
                  It looks like another coach is leading this session. Please click below to go back to the home page.
                  <Nav.Item>
                     <Nav.Link href="/" eventKey="reJoinId">Rejoin</Nav.Link> 
                  </Nav.Item>                  
               </Alert>
            </div>);
      }
   }
}