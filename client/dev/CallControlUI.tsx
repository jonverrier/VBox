/*! Copyright TXPCo, 2020, 2021 */

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { ICommand, ICommandProcessor, ILiveDocument } from '../../core/dev/LiveInterfaces';
import { LiveWorkout, LiveViewStateCommand, EViewState} from '../../core/dev/LiveWorkout';
import { PeerConnection } from '../../core/dev/PeerConnection';
import { cmnNoMarginPad, cmnToolButtonStyle } from './CommonStylesUI';
import { RemoteWhiteboard, MasterWhiteboard } from './WhiteboardUI';
import { RemoteCoachVideo, MasterCoachVideo } from './VideoUI';

export interface IRemoteCallProps {
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
}

export interface IRemoteCallState {
   isMounted: boolean;
   userAllowsMicCamera: boolean;
   viewState: EViewState;
}

export class RemoteCall extends React.Component<IRemoteCallProps, IRemoteCallState> {
   state: IRemoteCallState;

   constructor(props: IRemoteCallProps) {
      super(props);

      // watch for changes being made on our document
      props.commandProcessor.addChangeListener(this.onChange.bind(this));

      this.state = {
         isMounted: false,
         viewState: EViewState.Whiteboard,
         userAllowsMicCamera: false
      };
   }

   onChange(doc: ILiveDocument, cmd?: ICommand) : void {
      // TODO - add logic for call change commd execution
      if (this.state.isMounted) {
         if ((!cmd && doc.type === LiveWorkout.__type)
            || (cmd && cmd.type === LiveViewStateCommand.__type)) {

            // Either a new document or a new view state 
            var workout: LiveWorkout = doc as LiveWorkout;

            this.setState({ viewState: workout.viewState });
         }
      }
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
         <div>
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
            {this.state.viewState === EViewState.Whiteboard ?
               <RemoteWhiteboard
                  commandProcessor={this.props.commandProcessor}
                  liveWorkout={this.props.liveWorkout}> </RemoteWhiteboard>
               : <RemoteCoachVideo
                  commandProcessor={this.props.commandProcessor}
                  liveWorkout={this.props.liveWorkout}></RemoteCoachVideo>}
         </div>
      );
   }
}

interface IMasterCallProps {
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
   allowEdit: boolean;
   peerConnection: PeerConnection;
}

interface IMasterCallState {
   userAllowsMicCamera: boolean;
   viewState: EViewState;
}

export class MasterCall extends React.Component<IMasterCallProps, IMasterCallState> {
   //member variables
   state: IMasterCallState;

   constructor(props: IMasterCallProps) {
      super(props);

      this.state = {
         userAllowsMicCamera: false,
         viewState: EViewState.Whiteboard
      };
   }

   mute(): void {
      this.setState({ userAllowsMicCamera: false });
   }

   unMute(): void {
      this.setState({ userAllowsMicCamera: true });
   }

   whiteboard(): void {
      // Change the view state in our document
      let command = new LiveViewStateCommand(EViewState.Whiteboard, this.props.liveWorkout.viewState);
      this.props.commandProcessor.adoptAndApply(command);
      this.setState({ viewState: EViewState.Whiteboard });
   }

   coachVideo(): void {
      // Change the view state in our document
      let command = new LiveViewStateCommand(EViewState.CoachVideo, this.props.liveWorkout.viewState);
      this.props.commandProcessor.adoptAndApply(command);
      this.setState({ viewState: EViewState.CoachVideo });
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
                     disabled={(this.props.liveWorkout.viewState === EViewState.Whiteboard)}
                     onClick={this.whiteboard.bind(this)}
                     >
                     <i className="fa fa-television" style={cmnToolButtonStyle}></i>
                  </Button>
                  <Button variant="secondary" size="sm" style={cmnToolButtonStyle}
                     title="Participants see video of me."
                     disabled={(this.props.liveWorkout.viewState === EViewState.CoachVideo)}
                     onClick={this.coachVideo.bind(this)}
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
            {this.state.viewState === EViewState.Whiteboard ?
               <MasterWhiteboard allowEdit={this.props.allowEdit} peerConnection={this.props.peerConnection}
                  commandProcessor={this.props.commandProcessor}
                  liveWorkout={(this.props.liveWorkout)}> </MasterWhiteboard>
             : <MasterCoachVideo
                  commandProcessor={this.props.commandProcessor}
                  liveWorkout={this.props.liveWorkout}></MasterCoachVideo>}            
         </div>);
   }
}