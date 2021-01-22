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
import { IConnectionProps } from './call-status';
import { workoutClockType, WorkoutClockSpec, WorkoutClock} from '../common/workout-clock.js';

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

const fieldXSepStyle: CSS.Properties = {
   marginRight: '10px'
};

export const RemoteClock = (props: { mm: Number, ss: Number }) => (
   <p style={clockStyle}>{("00" + props.mm).slice(-2)}:{("00" + props.ss).slice(-2)}</p>
);

interface IClockState {
   openClockSpec: boolean;
   isMounted: boolean;
   rtc: Rtc;
   clockType: workoutClockType;
   countUpTo: number,
   countDownFrom: number,
   intervals: number,
   period1: number,
   period2: number,
   enableOK: boolean;
   enableCancel: boolean;
   clock: WorkoutClock;
   mm: number;
   ss: number;
}

export class MasterClock extends React.Component<IConnectionProps, IClockState> {
   //member variables
   state: IClockState;

   constructor(props: IConnectionProps) {
      super(props);

      var spec = new WorkoutClockSpec();
      spec.setWall(new Date());

      this.state = {
         openClockSpec: false,
         isMounted: false,
         rtc: props.rtc,
         clockType: workoutClockType.Wall,
         countUpTo: 20,
         countDownFrom: 20,
         intervals: 3,
         period1: 5,
         period2: 2,
         enableOK: false,
         enableCancel: false,
         clock: new WorkoutClock(spec),
         mm: 0,
         ss: 0
      };

      this.state.clock.start(this.onTick.bind(this), null);
   }

   onTick(mm, ss) {
      if (this.state.isMounted)
         this.setState({mm: mm, ss: ss});
   }

   componentDidMount() {
      // Initialise form validation.
      this.setState({ isMounted: true});
   }

   componentWillUnmount() {
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc) {
         // nextProps.rtc.onremotedata = this.onremotedata.bind(this);
      }
   }

   testEnableSave() {
      var spec = new WorkoutClockSpec();

      // Need to get the latest values for cross-field validation
      this.forceUpdate(() => {
         this.setState({ enableOK: false });

         // test for valid wall clock selection
         if (this.state.clockType === workoutClockType.Wall && spec.isValidWallSpec(new Date())) {
            this.setState({ enableOK : true});
         }

         // test for valid countUp selection
         if (this.state.clockType === workoutClockType.CountUp && spec.isValidCountUpSpec(this.state.countUpTo)) {
            this.setState({ enableOK: true });
         }

         // test for valid countDown selection
         if (this.state.clockType === workoutClockType.CountDown && spec.isValidCountDownSpec(this.state.countDownFrom)) {
            this.setState({ enableOK: true });
         }

         // test for valid interval selection
         if (this.state.clockType === workoutClockType.Interval && spec.isValidIntervalSpec(this.state.intervals,
                                                                                            this.state.period1, 
                                                                                            this.state.period2)) {
            this.setState({ enableOK: true });
         }
      });
   }

   processSave() {
      // To do 
      this.setState({ openClockSpec: false });
   }

   processCancel() {
      this.setState({ openClockSpec: false});
   }

   render() {
      return (
         <div>
            <Container style={thinStyle}>
               <Row style={thinStyle}>
                  <Col style={thinStyle}><RemoteClock mm={this.state.mm} ss={this.state.ss} /></Col>
                  <Col style={thinStyle}><Button variant="secondary" size="sm" onClick={() => this.setState({ openClockSpec: !this.state.openClockSpec })}>&#9660;</Button></Col>
               </Row>
            </Container>
            <Collapse in={this.state.openClockSpec}>
               <div style={{ textAlign: 'left' }} >
                  <Form>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="Wall clock" type="radio" id={'wall-clock-select'}
                              checked={this.state.clockType === workoutClockType.Wall}
                              onChange={(ev) => { if (ev.target.checked) { this.setState({ clockType: workoutClockType.Wall }); this.testEnableSave(); } }}/>
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="Count up to:" type="radio" id={'count-up-select'}
                              checked={this.state.clockType === workoutClockType.CountUp}
                                onChange={(ev) => { if (ev.target.checked) { this.setState({ clockType: workoutClockType.CountUp }); this.testEnableSave(); } }}/>
                           <Form.Control type="number" placeholder="Mins" min='1' max='60' step='1' style={fieldYSepStyleAuto}
                              disabled={!(this.state.clockType === workoutClockType.CountUp)} id={'count-up-value'}
                              value={this.state.countUpTo}
                              onChange={(ev) => { this.setState({ countUpTo: ev.target.value, enableCancel: true }); this.testEnableSave();}}/>
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="Count down from:" type="radio" id={'count-down-select'}
                              checked={this.state.clockType === workoutClockType.CountDown}
                              onChange={(ev) => { if (ev.target.checked) { this.setState({ clockType: workoutClockType.CountDown }); this.testEnableSave(); } }}/>
                           <Form.Control type="number" placeholder="Mins" min='1' max='60' step='1' style={fieldYSepStyleAuto} id={'count-down-value'}
                              disabled={!(this.state.clockType === workoutClockType.CountDown)}
                              value={this.state.countDownFrom}
                              onChange={(ev) => { this.setState({ countDownFrom: ev.target.value, enableCancel: true }); this.testEnableSave(); }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group>
                           <Form.Check inline label="Intervals of:" type="radio" id={'interval-select'}
                              checked={this.state.clockType === workoutClockType.Interval}
                              onChange={(ev) => { if (ev.target.checked) { this.setState({ clockType: workoutClockType.Interval }); this.testEnableSave(); }}}/>
                           <Form.Control type="number" placeholder="Intervals" min='1' max='60' step='1' style={fieldYSepStyle} id={'interval-value'}
                              disabled={!(this.state.clockType === workoutClockType.Interval)}
                              value={this.state.intervals}
                              onChange={(ev) => { this.setState({ intervals: ev.target.value, enableCancel: true }); this.testEnableSave(); }}/>
                           <Form.Control type="number" placeholder="Work" min='0' max='60' step='1' style={fieldYSepStyle} id={'period1-value'}
                              disabled={!(this.state.clockType === workoutClockType.Interval)} 
                              value={this.state.period1}
                              onChange={(ev) => { this.setState({ period1: ev.target.value,  enableCancel: true }); this.testEnableSave(); }} />
                           <Form.Control type="number" placeholder="Rest" min='0' max='60' step='1' style={fieldYSepStyle} id={'period2-value'}
                              disabled={!(this.state.clockType === workoutClockType.Interval)}
                              value={this.state.period2}
                              onChange={(ev) => { this.setState({ period2: ev.target.value, enableCancel: true }); this.testEnableSave(); }} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Button variant="secondary" disabled={!this.state.enableOK} className='mr' style={fieldXSepStyle}
                           onClick={this.processSave.bind(this)}>Save</Button>
                        <Button variant="secondary" disabled={!this.state.enableCancel}
                           onClick={this.processCancel.bind(this)}>Cancel</Button>
                     </Form.Row>
                  </Form>
               </div>
            </Collapse>
         </div>);
   }
}