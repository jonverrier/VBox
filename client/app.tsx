declare var require: any

var ReactDOM = require('react-dom');

// Core React
import * as React from 'react';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

// Additional packages
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'; 

// This app
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

export class LoginPage extends React.Component {
   render() {
      return ( 
         <div className="loginpage">
            <Helmet>
               <title>Virtual Box</title>
               <link rel="icon" href="building-black128x128.png" type="image/png" />
               <link rel="shortcut icon" href="building-black128x128.png" type="image/png" />
            </Helmet>
            <Navbar style={navbarStyle}>
               <Navbar.Brand href="/" style={navbarBrandStyle}>
                  <PartyBanner name="Virtual Box" thumbnailUrl="building-white128x128.png" />
               </Navbar.Brand>
            </Navbar>
            <Container fluid style={pageStyle}>
<Jumbotron style={{background: 'gray', color: 'white'}}>
  <h1>Welcome!</h1>
  <p>
    Welcome to Virtual Box. Sign in below to get access to your class. 
  </p>
  <p>
    <Button variant="primary">Sign In with Facebook</Button>
  </p>
</Jumbotron>            
            </Container>
         </div>
      );
   }
}

export class PageSwitcher extends React.Component {
   render() {
      return ( 
         <BrowserRouter>   
            <Switch>
               <Route exact path="/">  
                  <Redirect to="/login" />  
               </Route> 
               <Route path="/login">
                  <LoginPage />
               </Route>
               <Route path="/member">
                  <MemberPage />
               </Route>
            </Switch>  
         </BrowserRouter>  
      );
   }
}

ReactDOM.render(<PageSwitcher />, document.getElementById('root'));
