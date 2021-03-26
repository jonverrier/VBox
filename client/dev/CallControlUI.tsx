/*! Copyright TXPCo, 2020, 2021 */

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

import * as CSS from 'csstype';

import { StreamableTypes } from '../../core/dev/StreamableTypes'
import { IStreamable } from '../../core/dev/Streamable';
import { StoredWorkoutState } from '../../core/dev/LocalStore';
import { ICommand, ICommandProcessor, ILiveDocument } from '../../core/dev/LiveInterfaces';
import { LiveWorkout, LiveClockSpecCommand, LiveClockStateCommand} from '../../core/dev/LiveWorkout';

import { RunnableClock } from './RunnableClock';
import { cmnNoMarginPad, cmnToolButtonStyle } from './CommonStylesUI';

export interface IRemoteCallProps {
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
}

export interface IRemoteCallState {
   isMounted: boolean;
   userAllowsMicCamera: boolean;
}

export class RemoteCall extends React.Component<IRemoteCallProps, IRemoteCallState> {
   state: IRemoteCallState;

   constructor(props: IRemoteCallProps) {
      super(props);

      // watch for changes being made on our document
      props.commandProcessor.addChangeListener(this.onChange.bind(this));

      this.state = {
         isMounted : false,
         userAllowsMicCamera: false
      };
   }

   onChange(doc: ILiveDocument, cmd?: ICommand) : void {
      // TODO - add logic for call change commd execution
   }

   componentDidMount() {
      // Allow data display from master
      this.setState({ isMounted: true });
   }

   componentWillUnmount() {
      // Stop data display from master
      this.setState({ isMounted: false });
   }

   mute(): void {
      this.setState({ userAllowsMicCamera: false });
   }

   unMute(): void {
      this.setState({ userAllowsMicCamera: true });
   }


   render() {
      return (
         <Container style={cmnNoMarginPad}>
            <Row style={cmnNoMarginPad}>
               <Button variant="secondary" size="sm" style={cmnToolButtonStyle}
                  title="Don't play sound from the video call through my speakers."
                  disabled={!this.state.userAllowsMicCamera}
                  onClick={this.mute.bind(this)}>
                  <i className="fa fa-volume-off" style={cmnToolButtonStyle}></i>
               </Button>
               <Button variant="secondary" size="sm" style={cmnToolButtonStyle}
                  title="Let Coach control sound from the video call through my speakers."
                  disabled={this.state.userAllowsMicCamera}
                  onClick={this.unMute.bind(this)}>
                  <i className="fa fa-volume-up" style={cmnToolButtonStyle}></i>
               </Button>           
            </Row>
         </Container>
      );
   }
}

interface IMasterCallProps {
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
   allowEdit: boolean;
}

interface IMasterCallState {
   userAllowsMicCamera: boolean;
}

export class MasterCall extends React.Component<IMasterCallProps, IMasterCallState> {
   //member variables
   state: IMasterCallState;
   storedWorkoutState: StoredWorkoutState = new StoredWorkoutState();

   constructor(props: IMasterCallProps) {
      super(props);

      let clock = new RunnableClock(props.liveWorkout.clockSpec); 

      this.state = {
         userAllowsMicCamera: false
      };
   }

   mute(): void {
      this.setState({ userAllowsMicCamera: false });
   }

   unMute(): void {
      this.setState({ userAllowsMicCamera: true });
   }

   render() {
      return (
         <div>
            <Container style={cmnNoMarginPad}>
               <Row style={cmnNoMarginPad}>
                  <Button variant="secondary" size="sm" style={cmnToolButtonStyle}
                     title="Don't play sounds from the video call from my speakers."
                     disabled={!this.state.userAllowsMicCamera}
                     onClick={this.mute.bind(this)}>
                     <i className="fa fa-volume-off" style={cmnToolButtonStyle}></i>
                  </Button>
                  <Button variant="secondary" size="sm" style={cmnToolButtonStyle}
                     title="Play sounds from the video call from my speakers."
                     disabled={this.state.userAllowsMicCamera}
                     onClick={this.unMute.bind(this)}>
                     <i className="fa fa-volume-up" style={cmnToolButtonStyle}></i>
                  </Button>
                  <Button variant="secondary" size="sm" style={cmnToolButtonStyle}
                     title="Participants see the whiteboard."
                     >
                     <i className="fa fa-television" style={cmnToolButtonStyle}></i>
                  </Button>
                  <Button variant="secondary" size="sm" style={cmnToolButtonStyle}
                     title="Participants see video of me."
                     > 
                     <i className="fa fa-user" style={cmnToolButtonStyle}></i>
                  </Button>
                  <Button variant="secondary" size="sm" style={cmnToolButtonStyle}
                     title="Participants see video of each other."
                     >
                     <i className="fa fa-users" style={cmnToolButtonStyle}></i>
                  </Button>
               </Row>
            </Container>           
         </div>);
   }
}