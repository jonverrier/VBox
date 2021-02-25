/*! Copyright TXPCo, 2020 */

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import { TriangleDownIcon, PlayIcon, StopIcon } from '@primer/octicons-react'

import * as CSS from 'csstype';

import { GymClockDurationEnum, GymClockMusicEnum, GymClockStateEnum, GymClockActionEnum, GymClockSpec, GymClockState, GymClockAction } from '../../core/dev/GymClock';
import { TypeRegistry } from '../../core/dev/Types'
import { Person } from '../../core/dev/Person'

import { GymClock } from './gymclock';
import { MeetingWorkoutState } from './localstore';
import { Rtc, RtcLink } from './rtc';

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
function selectMusic(durationEnum, musicEnum) : string {
   var url: string;

   if (musicEnum == GymClockMusicEnum.None) {
      return null;
   }
   else
   if (musicEnum == GymClockMusicEnum.Uptempo) {
      switch (durationEnum) {
         case GymClockDurationEnum.Five:
            return '130-bpm-workout-V2 trimmed.mp3';

         default:
         case GymClockDurationEnum.Ten:
            return '10-Minute-Timer.mp3';

         case GymClockDurationEnum.Fifteen:
            return '15-Minute-Timer.mp3';

         case GymClockDurationEnum.Twenty:
            return '20-Minute-Timer.mp3';
      }
   }
   else
   if (musicEnum == GymClockMusicEnum.Midtempo) {
      switch (durationEnum) {
         case GymClockDurationEnum.Five:
            return '130-bpm-workout-V2 trimmed.mp3';

         default:
         case GymClockDurationEnum.Ten:
            return '130-bpm-workout-V2 trimmed.mp3';

         case GymClockDurationEnum.Fifteen:
            return '130-bpm-workout-V2 trimmed.mp3';

         case GymClockDurationEnum.Twenty:
            return '130-bpm-workout-V2 trimmed.mp3';
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
   clock: GymClock | null;
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

      if (ev.type === GymClockSpec.__type) {
         // we are sent a clock spec as soon as we connect

         // Stop current clock if it is going
         if (this.state.clock && this.state.clock.isRunning())
            this.state.clock.stop();

         // replace with a new one matching the spec
         let spec = new GymClockSpec(ev.durationEnum, ev.musicEnum, ev.musicUrl);
         let clock = new GymClock (spec);
         this.setState({clock: clock});
      }
      else
      if (ev.type === GymClockState.__type) {
         // Then we are sent the state of the clock (running/paused/stopped etc)
         let state = new GymClockState(ev.stateEnum, ev.secondsIn);
         if (this.state.clock)
            this.state.clock.loadFromState(state, this.onTick.bind(this));
      }
      else
      if (ev.type === GymClockAction.__type) {
         // Finally we are sent play/pause/stop etc when the coach selects an action
         switch (ev.actionEnum) {
            case GymClockActionEnum.Start:
               if (this.state.clock)
                  this.state.clock.start(this.onTick.bind(this), ev.secondsIn);
               break;
            case GymClockActionEnum.Stop:
               if (this.state.clock)
                  this.state.clock.stop();
               break;
            case GymClockActionEnum.Pause:
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
         clockSpec = new GymClockSpec(GymClockDurationEnum.Ten, GymClockMusicEnum.None, undefined); 

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
         clockState = new GymClockState(GymClockStateEnum.Stopped, 0); 

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
      if (ev.type === Person.__type) {
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
      this.state.clock.start(this.onTick.bind(this), this.state.clock.secondsCounted);
      this.setState({ clockStateEnum: GymClockStateEnum.CountingDown });

      // broadcast the clock change to remotes
      let action = new GymClockAction(GymClockActionEnum.Start);
      this.props.rtc.broadcast(action);

      // Save state to local store - for recovery purposes
      this.storedWorkoutState.saveClockState(JSON.stringify(this.state.clock.saveToState()));
   }

   processPause() {
      this.state.clock.pause();
      this.setState({ clockStateEnum: GymClockStateEnum.Paused });

      // broadcast the clock change to remotes
      let action = new GymClockAction(GymClockActionEnum.Pause);
      this.props.rtc.broadcast(action);

      // Save state to local store - for recovery purposes
      this.storedWorkoutState.saveClockState(JSON.stringify(this.state.clock.saveToState()));
   }

   processStop() {
      this.state.clock.stop();
      this.setState({ clockStateEnum: GymClockStateEnum.Stopped });

      // broadcast the clock change to remotes
      let action = new GymClockAction(GymClockActionEnum.Stop);
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
                              checked={this.state.clockSpec.durationEnum === GymClockDurationEnum.Five}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(GymClockDurationEnum.Five,
                                          this.state.clockSpec.musicEnum, selectMusic(GymClockDurationEnum.Five, this.state.clockSpec.musicEnum)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="10m" type="radio" id={'10m-select'}
                              checked={this.state.clockSpec.durationEnum === GymClockDurationEnum.Ten}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(GymClockDurationEnum.Ten, 
                                          this.state.clockSpec.musicEnum, selectMusic(GymClockDurationEnum.Ten, this.state.clockSpec.musicEnum)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="15m" type="radio" id={'15m-select'}
                              checked={this.state.clockSpec.durationEnum === GymClockDurationEnum.Fifteen}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(GymClockDurationEnum.Fifteen,
                                          this.state.clockSpec.musicEnum, selectMusic(GymClockDurationEnum.Fifteen, this.state.clockSpec.musicEnum)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="20m" type="radio" id={'20m-select'}
                              checked={this.state.clockSpec.durationEnum === GymClockDurationEnum.Twenty}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(GymClockDurationEnum.Twenty,
                                          this.state.clockSpec.musicEnum, selectMusic(GymClockDurationEnum.Twenty, this.state.clockSpec.musicEnum)),
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
                              checked={this.state.clockSpec.musicEnum === GymClockMusicEnum.Uptempo}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(this.state.clockSpec.durationEnum,
                                          GymClockMusicEnum.Uptempo, selectMusic(this.state.clockSpec.durationEnum, GymClockMusicEnum.Uptempo)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="Mid tempo" type="radio" id={'midTempo-select'}
                              checked={this.state.clockSpec.musicEnum === GymClockMusicEnum.Midtempo}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(this.state.clockSpec.durationEnum,
                                          GymClockMusicEnum.Midtempo, selectMusic(this.state.clockSpec.durationEnum, GymClockMusicEnum.Midtempo)),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Check label="None" type="radio" id={'noMusic-select'}
                              checked={this.state.clockSpec.musicEnum === GymClockMusicEnum.None}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(this.state.clockSpec.durationEnum,
                                          GymClockMusicEnum.None, selectMusic(this.state.clockSpec.durationEnum, GymClockMusicEnum.None)),
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