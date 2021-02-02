/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import * as CSS from 'csstype';

import { Rtc, RtcLink } from './rtc';
import { IConnectionProps } from './callpanel';
import { DateUtility } from '../common/dates';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
};

const whiteboardStyle: CSS.Properties = {
   minHeight: '100%', minWidth: '320px', maxWidth: '*', color: 'white', background: 'white',
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

const whiteboardElementStyle: CSS.Properties = {
   color: 'black', background: 'white',
   fontFamily: 'Permanent Marker',
   fontSize: '32px',
   margin: '0px', padding: '0px',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat'
};

interface IMasterWhiteboardState {
   isMounted: boolean;
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
               <Col style={whiteboardElementStyle}>
                  Workout
                                 <Form>
                     <Form.Group controlId="idWorkout">
                        <Form.Control as="textarea" placeholder="Type the workout details here" rows={10}
                           backgroundImage={'url("board.png")'} backgroundRepeat={'repeat'} />
                     </Form.Group>
                  </Form>
               </Col>
               <Col style={whiteboardElementStyle}>
                  Results
                                 <Form>
                     <Form.Group controlId="idResults">
                        <Form.Control as="textarea" placeholder="Type results here after the workout" rows={10} />
                     </Form.Group>
                  </Form>
               </Col>
            </Row>
         </div>
      );
   }
}
