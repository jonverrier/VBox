/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import { TriangleDownIcon, PlayIcon, StopIcon } from '@primer/octicons-react'

import * as CSS from 'csstype';

import { Rtc, RtcLink } from './rtc';
import { IConnectionProps } from './callpanel';
import { gymClockDurationEnum, gymClockMusicEnum, gymClockStateEnum, gymClockActionEnum, GymClockSpec, GymClock, GymClockState, GymClockAction } from '../common/gymclock.js';
import { MeetingWorkoutState } from './localstore';
import { TypeRegistry } from '../common/types.js'
import { Person } from '../common/person.js'

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

// Keep this function need declation in case an extra Enum is added above & this needs to change
function selectMusic(durationEnum, musicEnum) {
   var url: string;

   if (musicEnum == gymClockMusicEnum.None) {
      return null;
   }
   else
   if (musicEnum == gymClockMusicEnum.Uptempo) {
      switch (durationEnum) {
         case gymClockDurationEnum.Five:
            return null;

         default:
         case gymClockDurationEnum.Ten:
            return null;

         case gymClockDurationEnum.Fifteen:
            return '15-Minute-Timer.mp3';

         case gymClockDurationEnum.Twenty:
            return null;
      }
   }
   else
   if (musicEnum == gymClockMusicEnum.Midtempo) {
      switch (durationEnum) {
         case gymClockDurationEnum.Five:
            return null;

         default:
         case gymClockDurationEnum.Ten:
            return null;

         case gymClockDurationEnum.Fifteen:
            return null;

         case gymClockDurationEnum.Twenty:
            return null;
      }
   }
};

export interface IRemoteClockProps {
   rtc: Rtc;
}

export interface IRemoteClockState {
   isMounted: boolean;
   mm: number;
   ss: number;
   clock: GymClock;
}

export class RemoteClock extends React.Component<IRemoteClockProps, IRemoteClockState> {
   state: IRemoteClockState;

   constructor(props: IRemoteClockProps) {
      super(props);

      if (props.rtc) {
         props.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }

      this.state = {
         isMounted : false,
         mm: 0,
         ss: 0,
         clock: null
      };
   }

   componentDidMount() {
      // Allow data display from master
      this.setState({ isMounted: true });
   }

   componentWillUnmount() {
      // Stop data display from master
      this.setState({ isMounted: false });
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc && (!(nextProps.rtc === this.props.rtc))) {
         nextProps.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   onremotedata(ev: any, link: RtcLink) {

      if (Object.getPrototypeOf(ev).__type === GymClockSpec.prototype.__type) {
         // we are sent a clock spec as soon as we connect

         // Stop current clock if it is going
         if (this.state.clock && this.state.clock.isRunning())
            this.state.clock.stop();

         // replace with a new one matching the spec
         let spec = new GymClockSpec(gymClockDurationEnum.getSymbol(ev.durationEnum.name), ev.musicEnum, ev.musicUrl);
         let clock = new GymClock (spec);
         this.setState({clock: clock});
      }
      else
      if (Object.getPrototypeOf(ev).__type === GymClockState.prototype.__type) {
         // Then we are sent the state of the clock (running/paused/stopped etc)
         let state = new GymClockState(gymClockStateEnum.getSymbol(ev.stateEnum.name), ev.secondsIn);
         this.state.clock.loadFromState(state, this.onTick.bind(this));
      }
      else
         if (Object.getPrototypeOf(ev).__type === GymClockAction.prototype.__type) {
         // Finally we are sent play/pause/stop etc when the coach selects an action
         switch (ev.actionEnum.name) {
            case gymClockActionEnum.Start.name:
               this.state.clock.start(this.onTick.bind(this));
               break;
            case gymClockActionEnum.Stop.name:
               this.state.clock.stop();
               break;
            case gymClockActionEnum.Pause.name:
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
   rtc: Rtc;
   allowEdit: boolean;
}

interface IMasterClockState {
   inEditMode: boolean;
   isMounted: boolean;
   enableOk: boolean;
   enableCancel: boolean;
   clockStateEnum: any;
   clockSpec: GymClockSpec;
   clock: GymClock;
   mm: number;
   ss: number;
}

export class MasterClock extends React.Component<IMasterClockProps, IMasterClockState> {
   //member variables
   state: IMasterClockState;
   storedWorkoutState: MeetingWorkoutState;

   constructor(props: IMasterClockProps) {
      super(props);

      this.storedWorkoutState = new MeetingWorkoutState();

      // Use cached copy of the workout clock if there is one
      var storedClockSpec = this.storedWorkoutState.loadClockSpec();
      var clockSpec : GymClockSpec;

      if (storedClockSpec && storedClockSpec.length > 0) {
         var types = new TypeRegistry()
         var loadedClockSpec = types.reviveFromJSON(storedClockSpec);
         clockSpec = new GymClockSpec(loadedClockSpec.durationEnum,
                                      loadedClockSpec.musicEnum,
                                      selectMusic(loadedClockSpec.durationEnum,
                                                  loadedClockSpec.musicEnum)
                                      );
      } else
         clockSpec = new GymClockSpec(gymClockDurationEnum.Ten, gymClockMusicEnum.None, null); 

      let clock = new GymClock(clockSpec);

      // Use cached copy of the workout clock state if there is one
      var storedClockState = this.storedWorkoutState.loadClockState();
      var clockState : GymClockState;

      if (storedClockState && storedClockState.length > 0) {
         var types = new TypeRegistry()
         var loadedClockState = types.reviveFromJSON(storedClockState);
         clockState = new GymClockState(loadedClockState.stateEnum,
                                        loadedClockState.secondsIn);
      } else
         clockState = new GymClockState(gymClockStateEnum.Stopped, 0); 

      this.state = {
         inEditMode: false,
         isMounted: false,
         enableOk: false,
         enableCancel: false,
         clockSpec: clockSpec,
         clockStateEnum: clock.clockStateEnum,
         clock: clock,
         mm: 0,
         ss: 0
      };

      if (props.rtc) {
         props.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }


      // Scynch our clock up to the state we load
      clock.loadFromState(clockState, this.onTick.bind(this));
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc && (!(nextProps.rtc === this.props.rtc))) {
         nextProps.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   onremotedata(ev: any, link: RtcLink) {

      // By convention, new joiners broadcast a 'Person' object
      if (Object.getPrototypeOf(ev).__type === Person.prototype.__type) {
         // Send them the clock
         this.props.rtc.broadcast(this.state.clockSpec);

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
      var spec: GymClockSpec = new GymClockSpec(this.state.clockSpec.durationEnum,
         this.state.clockSpec.musicEnum, this.state.clockSpec.musicUrl); 

      this.state.clock.stop();
      var clock = new GymClock(spec);

      this.setState({ clock: clock, enableOk: false, enableCancel: false, inEditMode: false });

      // Cache the clock spec as JSON
      this.storedWorkoutState.saveClockSpec(JSON.stringify(this.state.clockSpec));

      // broadcast the clock spec to remotes
      this.props.rtc.broadcast(spec);
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
      this.state.clock.start(this.onTick.bind(this));
      this.setState({ clockStateEnum: gymClockStateEnum.CountingDown });

      // broadcast the clock change to remotes
      let action = new GymClockAction(gymClockActionEnum.Start);
      this.props.rtc.broadcast(action);

      // Save state to local store - for recovery purposes
      this.storedWorkoutState.saveClockState(JSON.stringify(this.state.clock.saveToState()));
   }

   processPause() {
      this.state.clock.pause();
      this.setState({ clockStateEnum: gymClockStateEnum.Paused });

      // broadcast the clock change to remotes
      let action = new GymClockAction(gymClockActionEnum.Pause);
      this.props.rtc.broadcast(action);

      // Save state to local store - for recovery purposes
      this.storedWorkoutState.saveClockState(JSON.stringify(this.state.clock.saveToState()));
   }

   processStop() {
      this.state.clock.stop();
      this.setState({ clockStateEnum: gymClockStateEnum.Stopped });

      // broadcast the clock change to remotes
      let action = new GymClockAction(gymClockActionEnum.Stop);
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
                              checked={this.state.clockSpec.durationEnum === gymClockDurationEnum.Five}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockDurationEnum.Five,
                                          this.state.clockSpec.musicEnum, selectMusic(gymClockDurationEnum.Five, this.state.clockSpec.musicEnum)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="10m" type="radio" id={'10m-select'}
                              checked={this.state.clockSpec.durationEnum === gymClockDurationEnum.Ten}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockDurationEnum.Ten, 
                                          this.state.clockSpec.musicEnum, selectMusic(gymClockDurationEnum.Ten, this.state.clockSpec.musicEnum)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="15m" type="radio" id={'15m-select'}
                              checked={this.state.clockSpec.durationEnum === gymClockDurationEnum.Fifteen}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockDurationEnum.Fifteen,
                                          this.state.clockSpec.musicEnum, selectMusic(gymClockDurationEnum.Fifteen, this.state.clockSpec.musicEnum)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="20m" type="radio" id={'20m-select'}
                              checked={this.state.clockSpec.durationEnum === gymClockDurationEnum.Twenty}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockDurationEnum.Twenty,
                                          this.state.clockSpec.musicEnum, selectMusic(gymClockDurationEnum.Twenty, this.state.clockSpec.musicEnum)),
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
                              checked={this.state.clockSpec.musicEnum === gymClockMusicEnum.Uptempo}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(this.state.clockSpec.durationEnum,
                                          gymClockMusicEnum.Uptempo, selectMusic(this.state.clockSpec.durationEnum, gymClockMusicEnum.Uptempo)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="Mid tempo" type="radio" id={'midTempo-select'}
                              checked={this.state.clockSpec.musicEnum === gymClockMusicEnum.Midtempo}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(this.state.clockSpec.durationEnum,
                                          gymClockMusicEnum.Midtempo, selectMusic(this.state.clockSpec.durationEnum, gymClockMusicEnum.Midtempo)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="None" type="radio" id={'noMusic-select'}
                              checked={this.state.clockSpec.musicEnum === gymClockMusicEnum.None}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(this.state.clockSpec.durationEnum,
                                          gymClockMusicEnum.None, selectMusic(this.state.clockSpec.durationEnum, gymClockMusicEnum.None)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row style={{textAlign: 'centre'}}>
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