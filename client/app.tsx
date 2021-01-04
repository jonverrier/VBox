/*! Copyright TXPCo, 2020 */

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
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

// Additional packages
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'; 

import axios from 'axios';

// This app
import { Party } from './party';
import { PartyBanner } from './party';
import { PartySmall } from './party';
import { SectionHeader } from './section';
import { Clock } from './clock';
import { LoginComponent } from './facebook';
import { IRtcProps } from './rtc';
import { Rtc } from './rtc';

import { Person } from '../common/person';
import { Facility } from '../common/facility';
import { HomePageData } from '../common/homepagedata';
import { TypeRegistry } from '../common/types.js';


import * as CSS from 'csstype';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

const facilityNavStyle: CSS.Properties = {
   margin: '0px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '4px', paddingBottom: '0px', background: 'gray', color : 'gray'
};

const personNavStyle: CSS.Properties = {
   margin: '0px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '4px', paddingBottom: '0px', background: 'gray', color: 'gray'
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

interface IMemberPageProps {
}

interface IMemberPageState {
   pageData: HomePageData
}

export class MemberPage extends React.Component<IMemberPageProps, IMemberPageState> {

   //member variables
   pageData: HomePageData;
   defaultPageData: HomePageData;

   constructor(props: ICoachPageProps) {
      super(props);
      this.defaultPageData = new HomePageData(
         new Person(null, null, 'Waiting...', null, 'person-w-128x128.png', null),
         new Facility(null, null, 'Waiting...', 'weightlifter-b-128x128.png'),
         null);
      this.pageData = this.defaultPageData;

      this.state = { pageData: this.pageData };
   }

   componentDidMount() {
      var self = this;

      // Make a request for user data to populate the home page 
      axios.get('/api/home')
         .then(function (response) {
            // Success, set state to data for logged in user 
            self.pageData = self.pageData.revive(response.data);
            self.setState({ pageData: self.pageData });
         })
         .catch(function (error) {
            // handle error by setting state back to no user logged in
            self.pageData = self.defaultPageData;
            self.setState({ pageData: self.pageData });
         });
   }

   componentWillUnmount() {
   }

   render() {
      return (
         <div className="memberpage">
            <Helmet>
               <title>{this.state.pageData.currentFacility.name}</title>
               <link rel="icon" href={this.state.pageData.currentFacility.thumbnailUrl} type="image/png" />
               <link rel="shortcut icon" href={this.state.pageData.currentFacility.thumbnailUrl} type="image/png" />
            </Helmet>

            <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" style={thinStyle}>
               <Navbar.Toggle aria-controls="responsive-navbar-nav" />
               <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                     <Dropdown as={ButtonGroup} id="collasible-nav-facility">
                        <Button split="true" variant="secondary" style={thinStyle}>
                           <PartySmall name={this.state.pageData.currentFacility.name} thumbnailUrl={this.state.pageData.currentFacility.thumbnailUrl} />
                        </Button>
                        <Dropdown.Toggle variant="secondary" id="facility-split" size="sm" >
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="left">
                           <Dropdown.Item href={this.state.pageData.currentFacility.homepageUrl}>Homepage...</Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                  </Nav>
                  <Navbar.Brand href="">{this.state.pageData.currentFacility.name}</Navbar.Brand>
                  <Nav className="ml-auto">
                     <Dropdown as={ButtonGroup} id="collasible-nav-person">
                        <Button split="true" variant="secondary" style={thinStyle}>
                           <PartySmall name={this.state.pageData.personName} thumbnailUrl={"person-w-128x128.png"} />
                        </Button>
                        <Dropdown.Toggle variant="secondary" id="person-split" size="sm">
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="right">
                           <Dropdown.Item href="#/action-2">Sign Out...</Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                  </Nav>
               </Navbar.Collapse>
            </Navbar>

            <Rtc sessionId={this.state.pageData.sessionId}
               facilityId={this.state.pageData.currentFacility.externalId}
               personId={this.state.pageData.person.externalId}></Rtc>

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
                  <Party name="Another Person" thumbnailUrl="weightlifter-w-128x128.png" />
               </Row>
               <Row>
                  <Party name="Another Person with a Long Name" thumbnailUrl="weightlifter-w-128x128.png" />
               </Row>
               <Row>
                  <Party name="A B" thumbnailUrl="weightlifter-w-128x128.png" />
               </Row>
               </div>
               <br />
            </Container>
         </div>
      );
   }
}

interface ICoachPageProps {
}

interface ICoachPageState {
   isLoggedIn: boolean;
   pageData: HomePageData
}

export class CoachPage extends React.Component<ICoachPageProps, ICoachPageState> {

   //member variables
   isLoggedIn: boolean;
   pageData: HomePageData;
   defaultPageData: HomePageData;

   constructor(props: ICoachPageProps) {
      super(props);
      this.isLoggedIn = false;
      this.defaultPageData = new HomePageData(null,
         new Person(null, null, 'Waiting...', null, 'person-w-128x128.png', null),
         new Facility(null, null, 'Waiting...', 'weightlifter-b-128x128.png'),
         null);
      this.pageData = this.defaultPageData;

      this.state = { isLoggedIn: this.isLoggedIn, pageData: this.pageData };
   }

   componentDidMount() {

   }

   componentWillUnmount() {
   }

   onLoginStatusChange(isLoggedIn) {
      var self = this;

      // Make a request for user data to populate the home page 
      if (isLoggedIn) {
         axios.get('/api/home')
            .then(function (response) {
               // Success, set state to data for logged in user 
               self.pageData = self.pageData.revive(response.data);
               self.setState({ isLoggedIn: true, pageData: self.pageData });
            })
            .catch(function (error) {
               // handle error by setting state back to no user logged in
               self.pageData = self.defaultPageData;
               self.setState({ isLoggedIn: false, pageData: self.pageData });
            });
      } else {
         // handle error by setting state back to no user logged in
         self.pageData = self.defaultPageData;
         self.setState({ isLoggedIn: false, pageData: self.pageData });
      }
   }

   render() {
      if (!this.state.isLoggedIn) {
         return (
            <div className="loginpage">
               <Helmet>
                  <title>The Xperience Platform</title>
                  <link rel="icon" href="weightlifter-b-128x128.png" type="image/png" />
                  <link rel="shortcut icon" href="weightlifter-b-128x128.png" type="image/png" />
               </Helmet>
               <Navbar style={facilityNavStyle}>
                  <Navbar.Brand href="/" style={navbarBrandStyle}>
                     <PartyBanner name="The Xperience Platform" thumbnailUrl="weightlifter-w-128x128.png" />
                  </Navbar.Brand>
               </Navbar>
               <Container fluid style={pageStyle}>
                  <Jumbotron style={{ background: 'gray', color: 'white' }}>
                     <h1>Welcome!</h1>
                     <p>
                        Welcome to The Xperience Platform. Sign in below to get access to your class.
                     </p>
                     <LoginComponent show={true} onLoginStatusChange={this.onLoginStatusChange.bind(this)} />
                  </Jumbotron>
               </Container>
            </div>
         );
      } else {
         return (
            <div className="coachpage">
               <Helmet>
                  <title>{this.state.pageData.currentFacility.name}</title>
                  <link rel="icon" href={this.state.pageData.currentFacility.thumbnailUrl} type="image/png" />
                  <link rel="shortcut icon" href={this.state.pageData.currentFacility.thumbnailUrl} type="image/png" />
               </Helmet>

               <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" style={thinStyle}>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                     <Nav className="mr-auto">
                        <Dropdown as={ButtonGroup} id="collasible-nav-facility">
                           <Button split="true" variant="secondary" style={thinStyle}>
                              <PartySmall name={this.state.pageData.currentFacility.name} thumbnailUrl={this.state.pageData.currentFacility.thumbnailUrl} />
                           </Button>
                           <Dropdown.Toggle variant="secondary" id="facility-split" size="sm" >
                           </Dropdown.Toggle>
                           <Dropdown.Menu align="left">
                              <Dropdown.Item href={this.state.pageData.currentFacility.homepageUrl}>Homepage...</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </Nav>
                     <Navbar.Brand href="">{this.state.pageData.currentFacility.name}</Navbar.Brand>
                     <Nav className="ml-auto">
                        <Dropdown as={ButtonGroup} id="collasible-nav-person">
                           <Button split="true" variant="secondary" style={thinStyle}>
                              <PartySmall name={this.state.pageData.personName} thumbnailUrl={"person-w-128x128.png"} />
                           </Button>
                           <Dropdown.Toggle variant="secondary" id="person-split" size="sm">
                           </Dropdown.Toggle>
                           <Dropdown.Menu align="right">
                              <Dropdown.Item href="#/action-2">Sign Out...</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </Nav>
                  </Navbar.Collapse>
               </Navbar>

               <LoginComponent show={false} onLoginStatusChange={this.onLoginStatusChange.bind(this)} />

               <Rtc sessionId={this.state.pageData.sessionId}
                  facilityId={this.state.pageData.currentFacility.externalId}
                  personId={this.state.pageData.person.externalId}></Rtc>

               <Container fluid style={pageStyle}>
                  <Jumbotron style={{ background: 'gray', color: 'white' }}>
                     <h1>Coach Page</h1>
                  </Jumbotron>
               </Container>
            </div>
         );
      }
   }
}

interface ILoginPageProps {
}

interface ILoginPageState {
   isLoggedIn: boolean;
}

export class LoginPage extends React.Component<ILoginPageProps, ILoginPageState> {
   //member variables
   isLoggedIn: boolean;

   constructor(props: ICoachPageProps) {
      super(props);
      this.state = { isLoggedIn: false};
   }
   
   onLoginStatusChange(isLoggedIn) {
      this.setState ({ isLoggedIn: isLoggedIn});
   }

   render() {
      if (!this.state.isLoggedIn) {
         return (
            <div className="loginpage">
            <Helmet>
                  <title>The Xperience Platform</title>
               <link rel="icon" href="weightlifter-b-128x128.png" type="image/png" />
               <link rel="shortcut icon" href="weightlifter-b-128x128.png" type="image/png" />
            </Helmet>
            <Navbar style={facilityNavStyle}>
               <Navbar.Brand href="/" style={navbarBrandStyle}>
                  <PartyBanner name="The Xperience Platform" thumbnailUrl="weightlifter-w-128x128.png" />
               </Navbar.Brand>
            </Navbar>
            <Container fluid style={pageStyle}>
               <Jumbotron style={{ background: 'gray', color: 'white' }}>
                  <h1>Welcome!</h1>
                  <p>
                        Welcome to The Xperience Platform. Sign in below to get access to your class.
                  </p>
                  <LoginComponent show={true} onLoginStatusChange={this.onLoginStatusChange.bind(this)} />
               </Jumbotron>
            </Container>
            </div>
         );
      } else {
         return (
            <div className="loginpage">
               <Helmet>
                  <title>The Xperience Platform</title>
                  <link rel="icon" href="weightlifter-b-128x128.png" type="image/png" />
                  <link rel="shortcut icon" href="weightlifter-b-128x128.png" type="image/png" />
               </Helmet>
               <Navbar style={facilityNavStyle}>
                  <Navbar.Brand href="/" style={navbarBrandStyle}>
                     <PartyBanner name="The Xperience Platform" thumbnailUrl="weightlifter-w-128x128.png" />
                  </Navbar.Brand>
               </Navbar>
               <Container fluid style={pageStyle}>
                  <Jumbotron style={{ background: 'gray', color: 'white' }}>
                     <h1>Welcome!</h1>
                     <p>
                        You are logged in to The Xperience Platform.
                     </p>
                     <LoginComponent show={true} onLoginStatusChange={this.onLoginStatusChange.bind(this)} />
                  </Jumbotron>
               </Container>
            </div>
         );
      }
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
               <Route path="/coach">
                  <CoachPage />
               </Route>
            </Switch>  
         </BrowserRouter>  
      );
   }
}

ReactDOM.render(<PageSwitcher />, document.getElementById('root'));
