declare var require: any

var ReactDOM = require('react-dom');

import * as React from 'react';

import { Helmet } from 'react-helmet';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';


const PartyBanner = (props: { name: string, thumbnailUrl: string }) => (
   <div style={{ lineHeight: '32px' }}>
      <Container fluid style={{ margin: '0px', padding: '0px', alignItems: 'left'}}>
         <Row style={{ margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px' }}>
            <img style={{ margin: '0px', paddingLeft: '4px', paddingRight: '2px', paddingTop: '0px', paddingBottom: '0px' }}src={props.thumbnailUrl} alt={props.name} height='32px' />
            <p style={{ fontSize: '32px', margin: '0px', paddingLeft: '2px', paddingRight: '4px', paddingTop: '0px', paddingBottom: '0px'  }}>{props.name}</p>
         </Row>
      </Container>
   </div>
);

const Party = (props: { name: string, thumbnailUrl: string }) => (
   <div style={{ lineHeight: '14px' }}>
      <Container style={{ margin: '0px', padding: '0px', alignItems: 'left'}}>
         <Row style={{ margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px', alignItems: 'center'}}>
            <img style={{ margin: '0px', paddingLeft: '4px', paddingRight: '2px', paddingTop: '0px', paddingBottom: '0px' }} src={props.thumbnailUrl} alt={props.name} height='32px' />
            <p style={{ fontSize: '14px', margin: '0px', paddingLeft: '2px', paddingRight: '4px', paddingTop: '0px', paddingBottom: '0px'  }}>{props.name}</p>
         </Row>
      </Container>
   </div>
);

const SectionHeader = (props: { name: string}) => (
   <div style={{ lineHeight: '32px' }}>
      <Container fluid style={{ margin: '0px', padding: '0px' }}>
         <Row style={{ margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px', alignItems: 'center' }}>
            <Col style={{ margin: '0px', padding: '0px' }}>
               <p style={{ fontSize: '24px', margin: '0px', padding: '0px' }}>{props.name}</p>
            </Col>
         </Row>
      </Container>
   </div>
);

const Clock = (props: { mm: Number, ss: Number }) => (
   <div style={{ lineHeight: '64px' }}>
      <Container fluid style={{ margin: '0px', padding: '0px' }}>
         <Row style={{ margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px', alignItems: 'center' }}>
            <p style={{ color: 'red', fontFamily: 'Orbitron', fontStyle: 'sans - serif', fontSize: '56px', margin: '0px', padding: '0px' }}>
               {("00" + props.mm).slice(-2)}:{("00" + props.ss).slice(-2)}</p>
         </Row>
      </Container>
   </div>
);

export class MemberPage extends React.Component {
   render() {
      return (
         <div className="memberpage">
            <Helmet>
               <title>Fortitude</title>
               <link rel="icon" href="FortitudeRoughSquare.png" type="image/png" />
               <link rel="shortcut icon" href="FortitudeRoughSquare.png" type="image/png" />
            </Helmet>
            <Navbar style={{ background: 'gray', color: 'white'}}>
               <Navbar.Brand href="/" style={{ color: 'white' }}>
                  <PartyBanner name="Fortitude" thumbnailUrl="FortitudeRoughSquare.png" />
               </Navbar.Brand>
            </Navbar>
            <Container fluid style={{ background: 'gray', color: 'white', margin: '0px', minWidth: '640px', maxWidth: '*', alignItems: 'left' }}>
               <Row >
                  <Clock mm={Number('00')} ss={Number('00')} />
               </Row>
               <Row >
                  <SectionHeader name="On the Whiteboard" />
               </Row>
               <Row>
                  <div style={{ minHeight: '120px', minWidth: '640px', background: 'white' }}>
                  </div>
               </Row>
               <br />

               <Row >
                  <SectionHeader name="In the Box" />
               </Row>
                  <div style={{minHeight: '120px' }}>
                  </div>
               <Row>
               </Row>
               <br />

               <Row >
                  <SectionHeader name="Athletes" />
               </Row>
               <Row>
                  <Party name="Another Person" thumbnailUrl="person-white-128x128.png" />
               </Row>
               <Row>
                  <Party name="Another Person with a Long Name" thumbnailUrl="person-white-128x128.png" />
               </Row>
               <Row>
                  <Party name="A B" thumbnailUrl="person-white-128x128.png" />
               </Row>
               <br />
            </Container>
         </div>
      );
   }
}

ReactDOM.render(<MemberPage />, document.getElementById('root'));
