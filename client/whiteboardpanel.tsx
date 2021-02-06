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
import { DateUtility } from '../common/dates';
import { Person } from '../common/person';
import { Whiteboard, WhiteboardElement } from '../common/whiteboard';
import { MeetingWorkoutState } from './localstore';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
};

const thinishStyle: CSS.Properties = {
   margin: '2px', padding: '0px',
};

const thinCentredStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
   alignItems: 'center',
   verticalAlign: 'top',
   justifyContent: 'center'
};

const thinLeftStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
   alignItems: 'left'
};

const popdownBtnStyle: CSS.Properties = {
   margin: '0px', padding: '4px',
   fontSize: '14px'
};

const whiteboardStyle: CSS.Properties = {
   color: 'white', background: 'white',
   margin: '0px', padding: '0px',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat'
};

const whiteboardHeaderStyle: CSS.Properties = {
   color: 'black', background: 'white',
   fontFamily: 'Permanent Marker',
   fontSize: '64px',
   marginTop: '0px', paddingTop: '0px',
   marginBottom: '10px', paddingBottom: '0px',
   marginLeft: '0px', paddingLeft: '0px',
   marginRight: '0px', paddingRight: '0px',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat'
};

const whiteboardElementHeaderStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
   color: 'black', background: 'white',
   fontFamily: 'Permanent Marker',
   fontSize: '40px',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat'
};

const whiteboardElementBodyStyle: CSS.Properties = {
   margin: '0px', 
   paddingLeft: '8px', paddingRight: '8px',
   paddingTop: '0px', paddingBottom: '0px',
   color: 'black', background: 'white',
   fontFamily: 'Permanent Marker',
   fontSize: '24px',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat',
   minHeight: '100%',
   minWidth: '240px', maxWidth: '*',
   whiteSpace: 'pre-wrap'
};

const blockCharStyle: CSS.Properties = {
   margin: '0px',
   paddingLeft: '8px', paddingRight: '8px',
   paddingTop: '0px', paddingBottom: '0px',
};

const fieldXSepStyle: CSS.Properties = {
   marginLeft: '8px'
};

interface IMasterWhiteboardState {
   haveRealWorkout: boolean;
   haveRealResults: boolean;
   workout: WhiteboardElement;
   results: WhiteboardElement;
}

const initialBoardText : string = 'Waiting...';
const defaultMasterWorkoutText: string = 'Workout will show here - click the button above.';
const defaultMasterResultsText: string = 'Workout results will show here - click the button above.';

interface IMasterWhiteboardElementProps {
   rtc: Rtc;
   caption: string;
   placeholder: string;
   initialRows: number;
   displayValue: string;
   onchange: Function;
}

interface IMasterWhiteboardElementState {
   inEditMode: boolean;
   enableOk,
   enableCancel,
   caption: string;
   placeholder: string;
   editValue: string;
}

export class MasterWhiteboard extends React.Component<IConnectionProps, IMasterWhiteboardState> {
   //member variables
   state: IMasterWhiteboardState;
   storedWorkoutState: MeetingWorkoutState;

   constructor(props: IConnectionProps) {
      super(props);

      var haveWorkout: boolean = false;

      if (props.rtc) {
         props.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }

      this.storedWorkoutState = new MeetingWorkoutState();
      var workout;

      // Use cached copy of the workout if there is one
      var storedWorkout = this.storedWorkoutState.loadWorkout();
      if (storedWorkout.length > 0) {
         haveWorkout = true;
         workout = new WhiteboardElement(10, storedWorkout);
      } else
         workout = new WhiteboardElement(10, defaultMasterWorkoutText);

      var results = new WhiteboardElement(10, defaultMasterResultsText);

      this.state = {
         haveRealWorkout: haveWorkout,
         haveRealResults: false,
         workout: workout,
         results: results
      };

   }

   componentDidMount() {
   }

   componentWillUnmount() {
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc) {
         nextProps.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   onremotedata(ev: any, link: RtcLink) {
      // By convention, new joiners broadcast a 'Person' object
      if (Object.getPrototypeOf(ev).__type === Person.prototype.__type) {

         // Add the new participant to the Results board element
         var text = this.state.results.text;
         var rows = this.state.results.rows;

         if (text === defaultMasterResultsText) {
            // Overrwite contents if its the first participant
            text = ev.name;
         }
         else 
         if (!text.includes(ev.name) ) {
            // append if the name is not already in the box. Can get double joins if they refresh the browser or join from multiple devices. 
            text = text + '\n' + ev.name;
            rows = rows + 1;
         }
         this.setState({ haveRealResults: true, results: new WhiteboardElement (rows, text) });

         this.forceUpdate(() => {
            // Send them the whole contents of the board
            var board = new Whiteboard(this.state.workout, this.state.results);
            this.props.rtc.broadcast(board);
         });
      }
   }

   onworkoutchange(element: WhiteboardElement) {
      this.setState({ haveRealWorkout: true, workout: element });
      var board = new Whiteboard(element, this.state.results);
      this.props.rtc.broadcast(board);

      // save in local cache
      this.storedWorkoutState.saveWorkout(element.text);
   }

   onresultschange(element: WhiteboardElement) {
      this.setState({ haveRealResults: true, results: element });
      var board = new Whiteboard(this.state.workout, element);
      this.props.rtc.broadcast(board);
   }

   render() {
      return (
         <div style={whiteboardStyle}>
            <Row style={thinStyle}>
               <Col style={whiteboardHeaderStyle}>
                  {new DateUtility(null).getWeekDay()}
               </Col>
            </Row>
            <Row style={thinStyle}>
               <Col style={thinishStyle}>
                  <MasterWhiteboardElement rtc={this.props.rtc}
                     caption={'Workout'} placeholder={'Type the workout details here.'}
                     initialRows={10}
                     displayValue={this.state.haveRealWorkout ? this.state.workout.text : defaultMasterWorkoutText}
                     onchange={this.onworkoutchange.bind(this)}></MasterWhiteboardElement>
               </Col>
               <Col style={thinishStyle}>
                  <MasterWhiteboardElement rtc={this.props.rtc}
                     caption={'Results'} placeholder={'Type results here after the workout.'}
                     initialRows={10}
                     displayValue={this.state.haveRealResults? this.state.results.text : defaultMasterResultsText}
                     onchange={this.onresultschange.bind(this)}></MasterWhiteboardElement>
               </Col>
            </Row>
         </div>
      );
   }
}

class MasterWhiteboardElement extends React.Component<IMasterWhiteboardElementProps, IMasterWhiteboardElementState> {
   //member variables
   state: IMasterWhiteboardElementState;

   constructor(props: IMasterWhiteboardElementProps) {
      super(props);

      this.state = {
         inEditMode: false,
         enableOk: false,
         enableCancel: false,
         caption: props.caption,
         placeholder: props.placeholder,
         editValue: props.displayValue
      };

   }

   componentDidMount() {

   }

   componentWillUnmount() {
   }

   processChange(value: string) {
      var enableOk: boolean;
      var enableCancel: boolean;

      if (value.length > 0) {
         this.state.editValue = value;
         enableOk = true;
         enableCancel = true;
      } else {
         enableOk = false;
         enableCancel = false;
      }

      this.setState({ enableOk: enableOk, enableCancel: enableCancel });
   }

   processSave() {
      this.state.enableCancel = this.state.enableOk = false;
      this.props.onchange(new WhiteboardElement(this.props.initialRows, this.state.editValue));
      this.setState({ inEditMode: false, enableOk: this.state.enableOk, enableCancel: this.state.enableCancel });
   }

   processCancel() {
      this.setState({ inEditMode: false });
   }

   render() {
      return (
         <div>
            <Row style={thinCentredStyle}>
               <p style={whiteboardElementHeaderStyle}>{this.state.caption}</p><p style={blockCharStyle}></p>
               <Button style={popdownBtnStyle} variant="secondary" size="sm" onClick={() => this.setState({ inEditMode: !this.state.inEditMode })}>&#9660;</Button>
            </Row>      
            <Row style={thinStyle}>
            <Collapse in={this.state.inEditMode} style={thinLeftStyle}>
               <div>
                  <Form>
                     <Form.Group controlId="elementFormId">
                           <Form.Control as="textarea" style={fieldXSepStyle}
                              placeholder={this.state.placeholder} rows={this.props.initialRows} cols={60} maxLength={1023}
                              value={this.state.editValue}
                              onChange={(ev) => { this.processChange(ev.target.value) }} />
                     </Form.Group>
                     <Form.Row style={{ textAlign: 'centre' }}>
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
            </Row>
            <Row style={thinStyle}>
               <p style={whiteboardElementBodyStyle}>{this.props.displayValue}</p>
            </Row>
         </div>
      );
   }
}

interface IRemoteWhiteboardState {
   workoutValue: WhiteboardElement;
   resultsValue: WhiteboardElement;
}

export interface IRemoteWhiteboardElementProps {
   rtc: Rtc;
   caption: string;
   initialRows: number;
   value: WhiteboardElement;
}

export interface IRemoteWhiteboardElementState {
   caption: string;
}

export class RemoteWhiteboard extends React.Component<IConnectionProps, IRemoteWhiteboardState> {
   //member variables
   state: IRemoteWhiteboardState;

   constructor(props: IConnectionProps) {
      super(props);

      if (props.rtc) {
         props.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }

      this.state = {
         workoutValue: new WhiteboardElement(10, initialBoardText),
         resultsValue: new WhiteboardElement(10, initialBoardText)
      };

   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.rtc) {
         nextProps.rtc.addremotedatalistener(this.onremotedata.bind(this));
      }
   }

   onremotedata(ev: any, link: RtcLink) {
      if (Object.getPrototypeOf(ev).__type === Whiteboard.prototype.__type) {
         if (!this.state.workoutValue.equals(ev.workout)) {
            this.state.workoutValue.rows = ev.workout.rows;
            this.state.workoutValue.text = ev.workout.text;
            this.setState({ workoutValue: this.state.workoutValue });
            this.forceUpdate();
         }
         if (!this.state.resultsValue.equals(ev.results)) {
            this.state.resultsValue.rows = ev.results.rows;
            this.state.resultsValue.text = ev.results.text;
            this.setState({ resultsValue: this.state.resultsValue });
            this.forceUpdate();
         }
      }
   }

   render() {
      return (
         <div style={whiteboardStyle}>
            <Row style={thinStyle}>
               <Col style={whiteboardHeaderStyle}>
                  {new DateUtility(null).getWeekDay()}
               </Col>
            </Row>
            <Row style={thinStyle}>
               <Col style={thinStyle}>
                  <RemoteWhiteboardElement rtc={this.props.rtc}
                     caption={'Workout'}
                     initialRows={this.state.workoutValue.rows} value={this.state.workoutValue}> </RemoteWhiteboardElement>
               </Col>
               <Col style={thinStyle}>
                  <RemoteWhiteboardElement rtc={this.props.rtc}
                     caption={'Results'}
                     initialRows={this.state.resultsValue.rows} value={this.state.resultsValue}> </RemoteWhiteboardElement>
               </Col>
            </Row>
         </div>
      );
   }
}

export class RemoteWhiteboardElement extends React.Component<IRemoteWhiteboardElementProps, IRemoteWhiteboardElementState> {
   state: IRemoteWhiteboardElementState;

   constructor(props: IRemoteWhiteboardElementProps) {
      super(props);

      this.state = {
         caption: props.caption
      };
   }

   render() {
      return (
         <div>
            <Row style={thinCentredStyle}>
               <p style={whiteboardElementHeaderStyle}>{this.state.caption}</p><p style={blockCharStyle}></p>
            </Row>
            <Row style={thinStyle}>
               <p style={whiteboardElementBodyStyle}>{this.props.value.text}</p>
            </Row>
         </div>
      );
   }
}