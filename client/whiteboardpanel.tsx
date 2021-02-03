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

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
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
   minWidth: '320px', maxWidth: '*' 
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
   isMounted: boolean;
}

interface IMasterWhiteboardElementProps {
   rtc: Rtc;
   caption: string;
   placeholder: string;
   initialRows: number;
   defaultValue: string;
}

interface IMasterWhiteboardElementState {
   isMounted: boolean;
   inEditMode: boolean;
   enableOk,
   enableCancel,
   caption: string;
   placeholder: string;
   rows: number;
   defaultValue: string;
}

export class MasterWhiteboard extends React.Component<IConnectionProps, IMasterWhiteboardState> {
   //member variables
   state: IMasterWhiteboardState;

   constructor(props: IConnectionProps) {
      super(props);

      this.state = {
         isMounted: false
      };

   }

   componentDidMount() {
      // Initialise sending data to remotes
      this.setState({ isMounted: true });
   }

   componentWillUnmount() {
      // Stop sending data to remotes
      this.setState({ isMounted: false });
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
                  <MasterWhiteboardElement rtc={this.props.rtc}
                     caption={'Workout'} placeholder={'Type the workout details here.'}
                     initialRows={10}
                     defaultValue={'Workout details will be here - click the button above.'}></MasterWhiteboardElement>
               </Col>
               <Col style={thinStyle}>
                  <MasterWhiteboardElement rtc={this.props.rtc}
                     caption={'Results'} placeholder={'Type results here after the workout.'}
                     initialRows={10}
                     defaultValue={'Workout results will be here - click the button above.'}></MasterWhiteboardElement>
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
         isMounted: false,
         inEditMode: false,
         enableOk: false,
         enableCancel: false,
         caption: props.caption,
         placeholder: props.placeholder,
         rows: props.initialRows,
         defaultValue: props.defaultValue
      };

   }

   componentDidMount() {
      // Initialise sending data to remotes
      this.setState({ isMounted: true });
   }

   componentWillUnmount() {
      // Stop sending data to remotes
      this.setState({ isMounted: false });
   }

   processChange(value: string) {
      var enableOk: boolean;
      var enableCancel: boolean;

      if (value.length > 0) {
         enableOk = true;
         enableCancel = true;
      } else {
         enableOk = false;
         enableCancel = false;
      }

      this.setState({ enableOk: enableOk, enableCancel: enableCancel });
   }

   processSave() {
      this.setState({ inEditMode: false });
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
               <p style={whiteboardElementBodyStyle}>{this.state.defaultValue}</p>
            </Row>
         </div>
      );
   }
}
