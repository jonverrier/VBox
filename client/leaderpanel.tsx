/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Nav from 'react-bootstrap/Nav';

import * as CSS from 'csstype';

import { Rtc, RtcLink } from './rtc';
import { IConnectionProps } from './callpanel';
import { TypeRegistry } from '../common/types.js'
import { Person } from '../common/person.js';
import { CallLeaderResolve } from '../common/call.js';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
};

const alertStyle: CSS.Properties = {
   margin: '0px'
};

export interface ILeaderConnectionProps {
   rtc: Rtc;
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
      if (this.props.rtc) {
         this.props.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   componentDidMount() {
   }

   componentWillUnmount() {
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc && (!(nextProps.rtc === this.props.rtc))) {
         nextProps.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   onremotedata(ev: any, link: RtcLink) {
      // By convention, new joiners broadcast a 'Person' object
      if (Object.getPrototypeOf(ev).__type === Person.prototype.__type) {
         // Send them our CallLeaderResolve 
         this.forceUpdate(() => {
            this.props.rtc.broadcast(this.state.myLeaderResolve);
         });
      }
      // If we recieve a CallLeaderResolve that beats us, we are not leader.
      if (Object.getPrototypeOf(ev).__type === CallLeaderResolve.prototype.__type) {
         if (! this.state.myLeaderResolve.isWinnerVs(ev)) {
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
                  It looks like another coach is leading this session. Please click below to go back to the login page.
                  <Nav.Item>
                     <Nav.Link href="/login" eventKey="reJoinId">Rejoin</Nav.Link> 
                  </Nav.Item>                  
               </Alert>
            </div>);
      }
   }
}