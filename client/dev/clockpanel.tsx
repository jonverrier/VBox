/*! Copyright TXPCo, 2020, 2021 */

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import { TriangleDownIcon, PlayIcon, StopIcon } from '@primer/octicons-react'

import * as CSS from 'csstype';

import { EGymClockDuration, EGymClockMusic, EGymClockState, EGymClockAction, GymClockSpec, GymClockState, GymClockAction } from '../../core/dev/GymClock';
import { StreamableTypes } from '../../core/dev/StreamableTypes'
import { IStreamable } from '../../core/dev/Streamable';
import { Person } from '../../core/dev/Person'
import { PeerConnection } from '../../core/dev/PeerConnection';
import { StoredWorkoutState } from '../../core/dev/LocalStore';
import { ICommand, ICommandProcessor, ILiveDocument } from '../../core/dev/LiveInterfaces';
import { LiveWorkout, LiveWhiteboardCommand, LiveResultsCommand, LiveClockSpecCommand, LiveWorkoutFactory } from '../../core/dev/LiveWorkout';

import { RunnableClock } from './RunnableClock';


const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
};

const thinAutoStyle: CSS.Properties = {
   margin: 'auto', padding: '0px',
};

const clockStyle: CSS.Properties = {
   color: 'red', fontFamily: 'digital-clock', fontSize: '64px', margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px'
};

const popdownBtnStyle: CSS.Properties = {
   margin: '0px', padding: '4px',
   fontSize: '14px'
};

const clockBtnStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
   fontSize: '14px'
};

const blockCharStyle: CSS.Properties = {
   margin: '0px',
   paddingLeft: '8px', paddingRight: '8px',
   paddingTop: '0px', paddingBottom: '0px',
};

export interface IRemoteClockProps {
   peers: PeerConnection;
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
}

export interface IRemoteClockState {
   isMounted: boolean;
   mm: number;
   ss: number;
   clock: RunnableClock | null;
}

export class RemoteClock extends React.Component<IRemoteClockProps, IRemoteClockState> {
   state: IRemoteClockState;

   constructor(props: IRemoteClockProps) {
      super(props);

      if (props.peers) {
         props.peers.addRemoteDataListener(this.onRemoteData.bind(this));
      }

      // watch for changes being made on our document
      props.commandProcessor.addChangeListener(this.onChange.bind(this));

      this.state = {
         isMounted : false,
         mm: 0,
         ss: 0,
         clock: null
      };
   }

   onChange(doc: ILiveDocument, cmd?: ICommand) {
      if (doc.type === LiveWorkout.__type) {
         var workout: LiveWorkout = doc as LiveWorkout;

         // Stop current clock if it is going
         if (this.state.clock && this.state.clock.isRunning())
            this.state.clock.stop();

         // replace with a new one matching the spec
         let clock = new RunnableClock(workout.clockSpec);
         this.setState({ clock: clock });
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

   onRemoteData(ev: IStreamable) {

      if (ev.type === GymClockState.__type) {
         // Then we are sent the state of the clock (running/paused/stopped etc)
         var evState = ev as GymClockState;

         let state = new GymClockState(evState.stateEnum, evState.secondsIn);
         if (this.state.clock)
            this.state.clock.loadFromState(state, this.onTick.bind(this));
      }
      else
      if (ev.type === GymClockAction.__type) {
         // Finally we are sent play/pause/stop etc when the coach selects an action
         var evAction= ev as GymClockAction;

         switch (evAction.actionEnum) {
            case EGymClockAction.Start:
               if (this.state.clock)
                  this.state.clock.start(this.onTick.bind(this));
               break;
            case EGymClockAction.Stop:
               if (this.state.clock)
                  this.state.clock.stop();
               break;
            case EGymClockAction.Pause:
               if (this.state.clock)
                  this.state.clock.pause();
               break;
         }
      }
   }

   onTick(mm, ss) {
      if (this.state.isMounted) {
         this.setState({ mm: mm, ss: ss });
      }
   }

   render() {
      return (
         <p style={clockStyle}>{("00" + this.state.mm).slice(-2)}:{("00" + this.state.ss).slice(-2)}</p>
      );
   }
}

interface IMasterClockProps {
   rtc: PeerConnection;
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
   allowEdit: boolean;
}

interface IMasterClockState {
   inEditMode: boolean;
   isMounted: boolean;
   enableOk: boolean;
   enableCancel: boolean;
   durationEnum: EGymClockDuration;
   musicEnum: EGymClockMusic;
   clockStateEnum: any;
   clock: RunnableClock;
   mm: number;
   ss: number;
}

export class MasterClock extends React.Component<IMasterClockProps, IMasterClockState> {
   //member variables
   state: IMasterClockState;
   storedWorkoutState: StoredWorkoutState;

   constructor(props: IMasterClockProps) {
      super(props);

      this.storedWorkoutState = new StoredWorkoutState();

      let clock = new RunnableClock(props.liveWorkout.clockSpec);

      // Use cached copy of the workout clock state if there is one
      var storedClockState = this.storedWorkoutState.loadClockState();
      var clockState : GymClockState;

      if (storedClockState && storedClockState.length > 0) {
         var types = new StreamableTypes()
         var loadedClockState = types.reviveFromJSON(storedClockState);
         clockState = new GymClockState(loadedClockState.stateEnum,
                                        loadedClockState.secondsIn);
      } else
         clockState = new GymClockState(EGymClockState.Stopped, 0); 

      this.state = {
         inEditMode: false,
         isMounted: false,
         enableOk: false,
         enableCancel: false,
         durationEnum: props.liveWorkout.clockSpec.durationEnum,
         musicEnum: props.liveWorkout.clockSpec.musicEnum,
         clockStateEnum: clock.clockStateEnum,
         clock: clock,
         mm: 0,
         ss: 0
      };

      if (props.rtc) {
         props.rtc.addRemoteDataListener(this.onRemoteData.bind(this));
      }


      // Scynch our clock up to the state we load
      clock.loadFromState(clockState, this.onTick.bind(this));
   }

   onRemoteData(ev: IStreamable) {

      // By convention, new joiners broadcast a 'Person' object
      if (ev.type === Person.__type) {
         // Send them the clock
         this.props.rtc.broadcast(this.props.liveWorkout.clockSpec);

         // Send clock state including the offset. 
         this.props.rtc.broadcast(this.state.clock.saveToState());
      }
   }

   onTick(mm, ss) {
      if (this.state.isMounted) {
         // slight optimisation in case clock is ticking faster than 1 second
         if (this.state.mm != mm || this.state.ss != ss)
            this.setState({ mm: mm, ss: ss });

         // this is tracked in case the clock rolls over from countdown to running, running to stopped. 
         this.setState({ clockStateEnum: this.state.clock.clockStateEnum });

         // Save state to local store - for recovery purposes
         this.storedWorkoutState.saveClockState(JSON.stringify(this.state.clock.saveToState()));
      }
   }

   componentDidMount() {
      // Initialise sending to remotes
      this.setState({ isMounted: true});
   }

   componentWillUnmount() {
      // Stop sending data to remotes
      this.setState({ isMounted: false });
   }

   testEnableSave() {

      // Since the user is just slecting from radio buttons, they cannt make any invalid choices
      this.setState({ enableOk: true });
   }

   processSave() {
      var spec: GymClockSpec = new GymClockSpec(this.state.durationEnum,
                                                this.state.musicEnum); 

      this.state.clock.stop();
      var clock = new RunnableClock (spec);

      this.setState({ clock: clock, enableOk: false, enableCancel: false, inEditMode: false });

      // Cache the clock spec as JSON
      this.storedWorkoutState.saveClockSpec(JSON.stringify(spec));

      let command = new LiveClockSpecCommand(spec, this.props.liveWorkout.clockSpec);
      this.props.commandProcessor.adoptAndApply(command);
   }

   processCancel() {
      this.setState({ inEditMode: false });
   }

   canStop() {
      return this.state.clock.canStop();
   }

   canPause() {
      return this.state.clock.canPause();
   }

   canPlay() {
      return this.state.clock.canStart();
   }

   processPlay() {
      this.state.clock.start(this.onTick.bind(this), this.state.clock.secondsCounted);
      this.setState({ clockStateEnum: EGymClockState.CountingDown });

      // broadcast the clock change to remotes
      let action = new GymClockAction(EGymClockAction.Start);
      this.props.rtc.broadcast(action);

      // Save state to local store - for recovery purposes
      this.storedWorkoutState.saveClockState(JSON.stringify(this.state.clock.saveToState()));
   }

   processPause() {
      this.state.clock.pause();
      this.setState({ clockStateEnum: EGymClockState.Paused });

      // broadcast the clock change to remotes
      let action = new GymClockAction(EGymClockAction.Pause);
      this.props.rtc.broadcast(action);

      // Save state to local store - for recovery purposes
      this.storedWorkoutState.saveClockState(JSON.stringify(this.state.clock.saveToState()));
   }

   processStop() {
      this.state.clock.stop();
      this.setState({ clockStateEnum: EGymClockState.Stopped });

      // broadcast the clock change to remotes
      let action = new GymClockAction(EGymClockAction.Stop);
      this.props.rtc.broadcast(action);

      // Save state to local store - for recovery purposes
      this.storedWorkoutState.saveClockState(JSON.stringify(this.state.clock.saveToState()));
   }

   render() {
      return (
         <div>
            <Container style={thinStyle}>
               <Row style={thinStyle}>
                  <Col style={thinStyle}><p style={clockStyle}>{("00" + this.state.mm).slice(-2)}:{("00" + this.state.ss).slice(-2)}</p></Col>
                  <Col style={thinAutoStyle}>
                     <Row style={thinStyle}>
                        <Button variant="secondary" size="sm" style={clockBtnStyle}
                           disabled={!this.canPlay()}
                           onClick={this.processPlay.bind(this) }>
                        <i className="fa fa-play"></i>
                        </Button>
                     </Row>
                     <Row style={thinStyle}>
                        <Button variant="secondary" size="sm" style={clockBtnStyle}
                           disabled={!this.canPause()}
                           onClick={this.processPause.bind(this)}> 
                        <i className="fa fa-pause"></i>
                        </Button>
                     </Row>
                     <Row style={thinStyle}>
                        <Button variant="secondary" size="sm" style={clockBtnStyle}
                           disabled={!this.canStop()}
                           onClick={this.processStop.bind(this)}>
                        <i className="fa fa-stop"></i>
                        </Button>
                     </Row>
                  </Col>
                  <Col style={thinStyle}>
                     <Button variant="secondary" size="sm" style={popdownBtnStyle}
                        onClick={() => this.setState({ inEditMode: !this.state.inEditMode })}>
                        <TriangleDownIcon />
                     </Button>
                  </Col>
               </Row>
            </Container>
            <Collapse in={this.state.inEditMode}>
               <div>
                  <Form style={{ textAlign: 'left' }}>
                     <Form.Row style={{ textAlign: 'left'}}>
                        <Form.Group controlId="durationGroupId">
                           <Form.Label>Run timer for:</Form.Label>
                           <Form.Check label="5m" type="radio" id={'10m-select'}
                              checked={this.state.durationEnum === EGymClockDuration.Five}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       durationEnum: EGymClockDuration.Five,
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="10m" type="radio" id={'10m-select'}
                              checked={this.state.durationEnum === EGymClockDuration.Ten}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       durationEnum: EGymClockDuration.Ten,
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="15m" type="radio" id={'15m-select'}
                              checked={this.state.durationEnum === EGymClockDuration.Fifteen}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       durationEnum: EGymClockDuration.Fifteen,
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="20m" type="radio" id={'20m-select'}
                              checked={this.state.durationEnum === EGymClockDuration.Twenty}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       durationEnum: EGymClockDuration.Twenty,
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row style={{ textAlign: 'left' }}>
                        <Form.Group controlId="musicId">
                           <Form.Label>Music:</Form.Label>
                           <Form.Check label="Up tempo" type="radio" id={'upTempo-select'}
                              // TODO - should be able to remove 'name' from all these 
                              checked={this.state.musicEnum === EGymClockMusic.Uptempo}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       musicEnum: EGymClockMusic.Uptempo,
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="Mid tempo" type="radio" id={'midTempo-select'}
                              checked={this.state.musicEnum === EGymClockMusic.Midtempo}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       musicEnum: EGymClockMusic.Midtempo,
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="None" type="radio" id={'noMusic-select'}
                              checked={this.state.musicEnum === EGymClockMusic.None}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       musicEnum: EGymClockMusic.None,
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row style={{textAlign: 'center'}}>
                        <p style={blockCharStyle}></p>
                        <Button variant="secondary" disabled={!this.state.enableOk} className='mr' 
                           onClick={this.processSave.bind(this)}>Save</Button>
                        <p style={blockCharStyle}></p>
                        <Button variant="secondary" disabled={!this.state.enableCancel}
                           onClick={this.processCancel.bind(this)}>Cancel</Button>
                     </Form.Row>
                  </Form>
               </div>
            </Collapse>
         </div>);
   }
}