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

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
};

const clockStyle: CSS.Properties = {
   color: 'red', fontFamily: 'Orbitron', fontStyle: 'sans - serif', fontSize: '48px', margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px'
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
   rtc: Rtc;
}

export class MasterClock extends React.Component<IConnectionProps, IClockState> {
   //member variables
   state: IClockState;

   constructor(props: IConnectionProps) {
      super(props);

      this.state = { openClockSpec: false, rtc: props.rtc };
   }

   render() {
      return (
         <div>
            <Container style={thinStyle}>
               <Row style={thinStyle}>
                  <Col style={thinStyle}><RemoteClock mm={Number('00')} ss={Number('00')} /></Col>
                  <Col style={thinStyle}><Button variant="secondary" size="sm" onClick={() => this.setState({ openClockSpec: !this.state.openClockSpec })}>&#9660;</Button></Col>
               </Row>
            </Container>
            <Collapse in={this.state.openClockSpec}>
               <div style={{ textAlign: 'left' }} >
                  <Form>
                     <Form.Row>
                        <Form.Group controlId="formWallClockDetails">
                           <Form.Check inline label="Wall clock" type="radio" id={'wall-clock-select'} />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group controlId="formCountUpClockDetails">
                           <Form.Check inline label="Count up to:" type="radio" id={'count-up-select'} />
                           <Form.Control type="text" placeholder="Mins" maxLength="2" style={fieldYSepStyleAuto}
                           />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group controlId="formCountDownClockDetails">
                           <Form.Check inline label="Count down from:" type="radio" id={'count-down-select'} />
                           <Form.Control type="text" placeholder="Mins" maxLength="2" style={fieldYSepStyleAuto}
                           />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group controlId="formIntervalClockDetails">
                           <Form.Check inline label="Intervals of:" type="radio" id={'interval-select'} />
                           <Form.Control type="text" placeholder="Intervals" maxLength="2" style={fieldYSepStyle}
                           />
                           <Form.Control type="text" placeholder="Work" maxLength="2" style={fieldYSepStyle}
                           />
                           <Form.Control type="text" placeholder="Rest" maxLength="2" style={fieldYSepStyle}
                           />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Button variant="secondary" className='mr' style={fieldXSepStyle}>Save</Button>
                        <Button variant="secondary">Cancel</Button>
                     </Form.Row>
                  </Form>
               </div>
            </Collapse>
         </div>);
   }
}