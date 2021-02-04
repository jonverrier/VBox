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
import { Whiteboard, WhiteboardElement } from '../common/whiteboard';

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
   margin: '0px', padding: '0px',
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
   workout: WhiteboardElement;
   results: WhiteboardElement;
}

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
   rows: number;
   displayValue: string;
   value: string;
}

export class MasterWhiteboard extends React.Component<IConnectionProps, IMasterWhiteboardState> {
   //member variables
   state: IMasterWhiteboardState;

   constructor(props: IConnectionProps) {
      super(props);

      var workout = new WhiteboardElement(10, 'Waiting');
      var results = new WhiteboardElement(10, 'Waiting');

      this.state = {
         workout: workout,
         results: results
      };

   }

   componentDidMount() {
   }

   componentWillUnmount() {
   }

   onworkoutchange(element) {
      this.setState({ workout: element });
      var board = new Whiteboard(element, this.state.results);
      this.props.rtc.broadcast(board);
   }

   onresultschange(element) {
      this.setState({ results: element });
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
                     displayValue={'Workout details will be here - click the button above.'}
                     onchange={this.onworkoutchange.bind(this)}></MasterWhiteboardElement>
               </Col>
               <Col style={thinishStyle}>
                  <MasterWhiteboardElement rtc={this.props.rtc}
                     caption={'Results'} placeholder={'Type results here after the workout.'}
                     initialRows={10}
                     displayValue={'Workout results will be here - click the button above.'}
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
         rows: props.initialRows,
         displayValue: props.displayValue,
         value: props.displayValue
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
         this.state.value = value;
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
      this.props.onchange(new WhiteboardElement(this.props.initialRows, this.state.value));
      this.setState({ inEditMode: false, enableOk: this.state.enableOk, enableCancel: this.state.enableCancel, displayValue: this.state.value });
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
                              placeholder={this.state.placeholder} rows={this.state.rows} cols={60} maxLength={1023}
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
               <p style={whiteboardElementBodyStyle}>{this.state.displayValue}</p>
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
         workoutValue: new WhiteboardElement(10, 'Waiting...'),
         resultsValue: new WhiteboardElement(10, 'Waiting...')
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