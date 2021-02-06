/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

import * as CSS from 'csstype';

import { Rtc, RtcLink } from './rtc';
import { IConnectionProps } from './callpanel';
import { gymClockType, GymClockSpec, GymClock, GymClockTick } from '../common/gymclock.js';
import { MeetingWorkoutState } from './localstore';
import { TypeRegistry } from '../common/types.js'

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
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
      if (nextProps.rtc) {
         nextProps.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   onremotedata(ev: any, link: RtcLink) {
      if (Object.getPrototypeOf(ev).__type === GymClockTick.prototype.__type) {
         this.setState({ mm: ev.mm, ss: ev.ss });
      }
   }

   render() {
      return (
         <p style={clockStyle}>{("00" + this.state.mm).slice(-2)}:{("00" + this.state.ss).slice(-2)}</p>
      );
   }
}

interface IMasterClockState {
   inEditMode: boolean;
   isMounted: boolean;
   enableOk: boolean;
   enableCancel: boolean;
   clockSpec: GymClockSpec;
   clock: GymClock;
   mm: number;
   ss: number;
}

export class MasterClock extends React.Component<IConnectionProps, IMasterClockState> {
   //member variables
   state: IMasterClockState;
   storedWorkoutState: MeetingWorkoutState;

   constructor(props: IConnectionProps) {
      super(props);

      this.storedWorkoutState = new MeetingWorkoutState();

      // Use cached copy of the workout if there is one
      var storedClockSpec = this.storedWorkoutState.loadClock();
      var clockSpec;

      if (storedClockSpec.length > 0) {
         var types = new TypeRegistry()
         var loadedClockSpec = types.reviveFromJSON(storedClockSpec);
         clockSpec = new GymClockSpec(loadedClockSpec.clockEnum,
            new Number(loadedClockSpec.countTo),
            new Number(loadedClockSpec.intervals), new Number(loadedClockSpec.period1), new Number(loadedClockSpec.period2));

         // Just makes more sense to set the clock to a Wall clock on first load, not to start counting up or down etc
         clockSpec.setWall();
      } else
         clockSpec = new GymClockSpec(gymClockType.Wall, new Date(), 20, 3, 5, 2);

      this.state = {
         inEditMode: false,
         isMounted: false,
         enableOk: false,
         enableCancel: false,
         clockSpec: clockSpec,
         clock: new GymClock(clockSpec),
         mm: 0,
         ss: 0
      };

      this.state.clock.start(this.onTick.bind(this), null);
   }

   onTick(mm, ss) {
      if (this.state.isMounted) {
         this.setState({ mm: mm, ss: ss });

         // distribute the tick to all clients
         let tick = new GymClockTick(mm, ss);
         this.props.rtc.broadcast(tick);
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

      // Need to get the latest values for cross-field validation
      self.forceUpdate(() => {
         self.setState({ enableOk: false });

         // test for valid wall clock selection
         if (self.state.clockSpec.clockEnum === gymClockType.Wall &&
            self.state.clockSpec.isValidWallSpec(new Date())) {
            self.setState({ enableOk : true});
         }

         // test for valid countUp selection
         if (self.state.clockSpec.clockEnum === gymClockType.CountUp &&
            self.state.clockSpec.isValidCountUpSpec(new Number(self.state.clockSpec.countTo))) {
            self.setState({ enableOk: true });
         }

         // test for valid countDown selection
         if (self.state.clockSpec.clockEnum === gymClockType.CountDown &&
            self.state.clockSpec.isValidCountDownSpec(new Number(self.state.clockSpec.countTo))) {
            self.setState({ enableOk: true });
         }

         // test for valid interval selection
         if (self.state.clockSpec.clockEnum === gymClockType.Interval &&
            self.state.clockSpec.isValidIntervalSpec(new Number(self.state.clockSpec.intervals),
                                                     new Number(self.state.clockSpec.period1), 
                                                     new Number(self.state.clockSpec.period2))) {
            self.setState({ enableOk: true });
         }
      });
   }

   processSave() {
      var spec: GymClockSpec = new GymClockSpec(this.state.clockSpec.clockEnum, 
         this.state.clockSpec.countTo,
         this.state.clockSpec.intervals, this.state.clockSpec.period1, this.state.clockSpec.period2);
      var clock : GymClock;

      // test for valid wall clock selection
      if (this.state.clockSpec.clockEnum === gymClockType.Wall && spec.isValidWallSpec(new Date())) {
         this.state.clock.stop();
         spec.setWall(new Date());
         clock = new GymClock(spec);
         this.setState({ clock: clock});
      }

      // test for valid countUp selection
      if (this.state.clockSpec.clockEnum === gymClockType.CountUp && spec.isValidCountUpSpec(this.state.clockSpec.countTo)) {
         this.state.clock.stop();
         spec.setCountUp(new Number(this.state.clockSpec.countTo));
         clock = new GymClock(spec);
         this.setState({ clock: clock});
      }

      // test for valid countDown selection
      if (this.state.clockSpec.clockEnum === gymClockType.CountDown && spec.isValidCountDownSpec(this.state.clockSpec.countTo)) {
         this.state.clock.stop();
         spec.setCountDown(new Number(this.state.clockSpec.countTo));
         clock = new GymClock(spec);
         this.setState({ clock: clock});
      }

      // test for valid interval selection
      if (this.state.clockSpec.clockEnum === gymClockType.Interval && spec.isValidIntervalSpec(this.state.clockSpec.intervals,
                                                                                     this.state.clockSpec.period1,
                                                                                     this.state.clockSpec.period2)) {
         this.state.clock.stop();
         spec.setInterval(new Number(this.state.clockSpec.intervals),
                          new Number(this.state.clockSpec.period1), 
                          new Number(this.state.clockSpec.period2));
         clock = new GymClock(spec);
         this.setState({ clock: clock });
      }

      this.setState({ enableOk: false, enableCancel: false, inEditMode: false});
      clock.start(this.onTick.bind(this), null);

      // Cache the clock as JSON
      this.storedWorkoutState.saveClock(JSON.stringify(this.state.clockSpec));
   }

   processCancel() {
      this.setState({ inEditMode: false});
   }

   render() {
      return (
         <div>
            <Container style={thinStyle}>
               <Row style={thinStyle}>
                  <Col style={thinStyle}><p style={clockStyle}>{("00" + this.state.mm).slice(-2)}:{("00" + this.state.ss).slice(-2)}</p></Col>
                  <Col style={thinStyle}>
                     <Button variant="secondary" size="sm" style={popdownBtnStyle}
                     onClick={() => this.setState({ inEditMode: !this.state.inEditMode })}>&#9660;
                     </Button>
                  </Col>
               </Row>
            </Container>
            <Collapse in={this.state.inEditMode}>
               <div>
                  <Form>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="Wall clock" type="radio" id={'wall-clock-select'}
                              // TODO - do not understand why we have to use'name'.
                              // The GymClockSpec class explicitly checks for a match on restore from JSON 
                              // and should be using the actual local symbon, not a copy.
                              // TODO marker                          HERE                       HERE
                              checked={this.state.clockSpec.clockEnum.name === gymClockType.Wall.name}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockType.Wall, 
                                          this.state.clockSpec.countTo, this.state.clockSpec.intervals, this.state.clockSpec.period1, this.state.clockSpec.period2),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="Count up to:" type="radio" id={'count-up-select'}
                              checked={this.state.clockSpec.clockEnum.name === gymClockType.CountUp.name}
                              onChange={(ev) => {
                                 if (ev.target.checked)
                                 {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockType.CountUp,
                                          this.state.clockSpec.countTo, this.state.clockSpec.intervals, this.state.clockSpec.period1, this.state.clockSpec.period2),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Control type="number" placeholder="Mins" min='1' max='60' step='1' style={fieldYSepStyleAuto}
                              disabled={!(this.state.clockSpec.clockEnum.name === gymClockType.CountUp.name)} id={'count-up-value'}
                              value={this.state.clockSpec.countTo}
                              onChange={(ev) => {
                                 this.setState({
                                    clockSpec: new GymClockSpec(gymClockType.CountUp, 
                                       new Number(ev.target.value), this.state.clockSpec.intervals, this.state.clockSpec.period1, this.state.clockSpec.period2),
                                    enableCancel: true
                                 }); this.testEnableSave();
                              }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="Count down from:" type="radio" id={'count-down-select'}
                              checked={this.state.clockSpec.clockEnum.name === gymClockType.CountDown.name}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockType.CountDown,
                                          this.state.clockSpec.countTo, this.state.clockSpec.intervals, this.state.clockSpec.period1, this.state.clockSpec.period2),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Control type="number" placeholder="Mins" min='1' max='60' step='1' style={fieldYSepStyleAuto} id={'count-down-value'}
                              disabled={!(this.state.clockSpec.clockEnum.name === gymClockType.CountDown.name)}
                              value={this.state.clockSpec.countTo}
                              onChange={(ev) => {
                                 this.setState({
                                    clockSpec: new GymClockSpec(gymClockType.CountDown, 
                                       new Number(ev.target.value), this.state.clockSpec.intervals, this.state.clockSpec.period1, this.state.clockSpec.period2),
                                    enableCancel: true
                                 }); this.testEnableSave();
                              }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="Intervals of:" type="radio" id={'interval-select'}
                              checked={this.state.clockSpec.clockEnum.name === gymClockType.Interval.name}
                              onChange={(ev) => {
                                 if (ev.target.checked) {
                                    this.setState({
                                       clockSpec: new GymClockSpec(gymClockType.Interval,
                                          this.state.clockSpec.countTo, this.state.clockSpec.intervals, this.state.clockSpec.period1, this.state.clockSpec.period2),
                                       enableCancel: true
                                    }); this.testEnableSave();
                                 }
                              }} />
                           <Form.Control type="number" placeholder="Intervals" min='1' max='60' step='1' style={fieldYSepStyle} id={'interval-value'}
                              disabled={!(this.state.clockSpec.clockEnum.name === gymClockType.Interval.name)}
                              value={this.state.clockSpec.intervals}
                              onChange={(ev) => {
                                 this.setState({
                                    clockSpec: new GymClockSpec(gymClockType.Interval, 
                                       this.state.clockSpec.countTo, new Number(ev.target.value), this.state.clockSpec.period1, this.state.clockSpec.period2),
                                    enableCancel: true
                                 }); this.testEnableSave();
                              }} />
                           <Form.Control type="number" placeholder="Work" min='0' max='60' step='1' style={fieldYSepStyle} id={'period1-value'}
                              disabled={!(this.state.clockSpec.clockEnum.name === gymClockType.Interval.name)} 
                              value={this.state.clockSpec.period1}
                              onChange={(ev) => {
                                 this.setState({
                                    clockSpec: new GymClockSpec(gymClockType.Interval, 
                                       this.state.clockSpec.countTo, this.state.clockSpec.intervals, new Number(ev.target.value), this.state.clockSpec.period2),
                                    enableCancel: true
                                 }); this.testEnableSave();
                              }} />
                           <Form.Control type="number" placeholder="Rest" min='0' max='60' step='1' style={fieldYSepStyle} id={'period2-value'}
                              disabled={!(this.state.clockSpec.clockEnum.name === gymClockType.Interval.name)}
                              value={this.state.clockSpec.period2}
                              onChange={(ev) => {
                                 this.setState({
                                    clockSpec: new GymClockSpec(gymClockType.Interval, 
                                       this.state.clockSpec.countTo, this.state.clockSpec.intervals, this.state.clockSpec.period1, new Number(ev.target.value)),
                                    enableCancel: true
                                 }); this.testEnableSave();
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