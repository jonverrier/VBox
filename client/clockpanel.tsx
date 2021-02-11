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
import { gymClockDurationEnum, gymClockMusicEnum, gymClockStateEnum, gymClockActionEnum, GymClockSpec, GymClock, GymClockAction } from '../common/gymclock.js';
import { MeetingWorkoutState } from './localstore';
import { TypeRegistry } from '../common/types.js'

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
};

const thinAutoStyle: CSS.Properties = {
   margin: 'auto', padding: '0px',
};

const clockStyle: CSS.Properties = {
   color: 'red', fontFamily: 'digital-clock', fontSize: '64px', margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px'
};

const fieldYSepStyle: CSS.Properties = {
   marginBottom: '10px'
};

const fieldYSepStyleAuto: CSS.Properties = {
   marginBottom: '10px',
   width: "auto"
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

var first = true;

export interface IRemoteClockState {
   mm: number;
   ss: number;
}

export class RemoteClock extends React.Component<IConnectionProps, IRemoteClockState> {
   state: IRemoteClockState;

   constructor(props: IConnectionProps) {
      super(props);

      if (props.rtc) {
         props.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }

      this.state = {
         mm: 0,
         ss: 0
      };
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc && (!(nextProps.rtc === this.props.rtc))) {
         nextProps.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   onremotedata(ev: any, link: RtcLink) {
      if (Object.getPrototypeOf(ev).__type === GymClockAction.prototype.__type) {
         this.setState({ mm: ev.mm, ss: ev.ss });
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

      // Use cached copy of the workout if there is one
      var storedClockSpec; // = this.storedWorkoutState.loadClock();
      var clockSpec;

      if (storedClockSpec && storedClockSpec.length > 0) {
         var types = new TypeRegistry()
         var loadedClockSpec = types.reviveFromJSON(storedClockSpec);
         clockSpec = new GymClockSpec(loadedClockSpec.durationEnum,
                                      loadedClockSpec.musicEnum);
      } else
         clockSpec = new GymClockSpec(gymClockDurationEnum.Ten, gymClockMusicEnum.None, null); 

      let clock = new GymClock(clockSpec);

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
   }

   onTick(mm, ss) {
      if (this.state.isMounted) {
         this.setState({ mm: mm, ss: ss });

         this.setState({ clockStateEnum: this.state.clock.clockStateEnum });
         //let tick = new GymClockAction(mm, ss);
         //this.props.rtc.broadcast(tick);
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
      var self = this;

      if (!this.props.allowEdit) {
         self.setState({ enableOk: false });
         return;
      }

      // Need to get the latest values for cross-field validation
      self.forceUpdate(() => {
         // Since the user is just slecting from radio buttons, they cannt make any invalid choices
         self.setState({ enableOk: true });
      });
   }

   processSave() {
      var spec: GymClockSpec = new GymClockSpec(this.state.clockSpec.durationEnum,
         this.state.clockSpec.musicEnum); 

      this.state.clock.stop();
      var clock = new GymClock(spec);

      this.setState({ clock: clock, enableOk: false, enableCancel: false, inEditMode: false });

      // TODO - move to a 'play' button.
      clock.start(this.onTick.bind(this), 0);

      // Cache the clock as JSON
      this.storedWorkoutState.saveClock(JSON.stringify(this.state.clockSpec));
   }

   processCancel() {
      this.setState({ inEditMode: false });
   }

   canPauseOrStop() {
      return (this.state.clockStateEnum.name == gymClockStateEnum.CountingDown.name)
         || (this.state.clockStateEnum.name == gymClockStateEnum.Running.name)
   }

   canPlay() {
      return (this.state.clockStateEnum.name == gymClockStateEnum.Paused.name) || (this.state.clockStateEnum.name == gymClockStateEnum.Stopped.name);
   }

   processPlay() {
      this.state.clock.start(this.onTick.bind(this), 0);
      this.setState({ clockStateEnum: gymClockStateEnum.CountingDown });
   }

   processPause() {
      this.state.clock.pause();
      this.setState({ clockStateEnum: gymClockStateEnum.Paused });
   }

   processStop() {
      this.state.clock.stop();
      this.setState({ clockStateEnum: gymClockStateEnum.Stopped });
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
                           enabled={this.canPlay()}
                           onClick={this.processPlay.bind(this) }>
                        <i className="fa fa-play"></i>
                        </Button>
                     </Row>
                     <Row style={thinStyle}>
                        <Button variant="secondary" size="sm" style={clockBtnStyle}
                           enabled={this.canPauseOrStop()}
                           onClick={this.processPause.bind(this)}> 
                        <i className="fa fa-pause"></i>
                        </Button>
                     </Row>
                     <Row style={thinStyle}>
                        <Button variant="secondary" size="sm" style={clockBtnStyle}
                           enabled={this.canPauseOrStop()}
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
                  <Form>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="10 mins:" type="radio" id={'wall-clock-select'}
                              // TODO - do not understand why we have to use'name'.
                              // The GymClockSpec class explicitly checks for a match on restore from JSON 
                              // and should be using the actual local symbon, not a copy.
                              // TODO marker                          HERE                       HERE
                              checked={this.state.clockSpec.durationEnum.name === gymClockDurationEnum.Ten.name}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockDurationEnum.Ten, 
                                          this.state.clockSpec.musicEnum, this.state.clockSpec.musicUrl),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="15 mins:" type="radio" id={'count-up-select'}
                              checked={this.state.clockSpec.durationEnum.name === gymClockDurationEnum.Fifteen.name}
                              onChange={(ev) => {
                                 if (ev.target.checked)
                                 {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockDurationEnum.Fifteen,
                                          this.state.clockSpec.musicEnum, this.state.clockSpec.musicUrl),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="20 mins:" type="radio" id={'count-down-select'}
                              checked={this.state.clockSpec.durationEnum.name === gymClockDurationEnum.Twenty.name}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockDurationEnum.Twenty,
                                          this.state.clockSpec.musicEnum, this.state.clockSpec.musicUrl),
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