declare var require: any

var ReactDOM = require('react-dom');

import * as React from 'react';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

import { Party } from './party';
import { PartyBanner } from './party';
import { SectionHeader } from './section';
import { Clock } from './clock';

import * as CSS from 'csstype';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

const navbarStyle: CSS.Properties = {
   margin: '0px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '4px', paddingBottom: '0px', background: 'gray', color : 'gray'
};

const navbarBrandStyle: CSS.Properties = {
   margin: '0px', padding: '0px', background: 'gray',  color: 'white'
};

const pageStyle: CSS.Properties = {
   background: 'gray', color: 'white', margin: '0px', padding : '0px', minWidth: '320px', maxWidth: '*', alignItems: 'left'
};

const placeholderStyle: CSS.Properties = {
   minHeight: '120px', minWidth: '320px', maxWidth: '*', color: 'white', background : 'white'
};

export class MemberPage extends React.Component {
   render() {
      return (
         <div className="memberpage">
            <Helmet>
               <title>Fortitude</title>
               <link rel="icon" href="FortitudeRoughSquare.png" type="image/png" />
               <link rel="shortcut icon" href="FortitudeRoughSquare.png" type="image/png" />
            </Helmet>
            <Navbar style={navbarStyle}>
               <Navbar.Brand href="/" style={navbarBrandStyle}>
                  <PartyBanner name="Fortitude" thumbnailUrl="FortitudeRoughSquare.png" />
               </Navbar.Brand>
            </Navbar>
            <Container fluid style={pageStyle}>
               <Row style={thinStyle}>
                  <Clock mm={Number('00')} ss={Number('00')} />
               </Row>
               <Row >
                  <SectionHeader name="On the Whiteboard" />
               </Row>
               <Row>
                  <div style={placeholderStyle}>
                  </div>
               </Row>
               <br />

               <Row >
                  <SectionHeader name="In the Box" />
               </Row>
               <Row>
                  <div style={placeholderStyle}>
                  </div>
               </Row>
               <br />

               <Row >
                  <SectionHeader name="Athletes" />
               </Row>
               <div>
               <Row>
                  <Party name="Another Person" thumbnailUrl="person-white-128x128.png" />
               </Row>
               <Row>
                  <Party name="Another Person with a Long Name" thumbnailUrl="person-white-128x128.png" />
               </Row>
               <Row>
                  <Party name="A B" thumbnailUrl="person-white-128x128.png" />
               </Row>
               </div>
               <br />
            </Container>
         </div>
      );
   }
}

ReactDOM.render(<MemberPage />, document.getElementById('root'));
