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
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';

// Additional packages
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'; 

import axios from 'axios';

// This app
import { PartyBanner } from './party';
import { PartySmall } from './party';
import { MasterClock, RemoteClock } from './clockpanel';
import { MasterWhiteboard } from './whiteboardpanel';
import { ServerConnectionStatus, LinkConnectionStatus } from './callpanel';
import { RemotePeople } from './peoplepanel';
import { LoginFb } from './loginfb';
import { LoginMc } from './loginmc';
import { Rtc } from './rtc';
import { MeetingScreenState } from './localstore';

import { Person } from '../common/person';
import { Facility } from '../common/facility';
import { HomePageData } from '../common/homepagedata';

import * as CSS from 'csstype';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

const facilityNavStyle: CSS.Properties = {
   margin: '0px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '4px', paddingBottom: '0px', background: 'gray', color : 'gray'
};

const navbarBrandStyle: CSS.Properties = {
   margin: '0px', padding: '0px', background: 'gray',  color: 'white'
};

const pageStyle: CSS.Properties = {
   background: 'gray', color: 'white', margin: '0px', padding : '0px', minWidth: '320px', maxWidth: '*', alignItems: 'left'
};

const placeholderStyle: CSS.Properties = {
   minHeight: '100%', minWidth: '320px', maxWidth: '*', color: 'white', background: 'white',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat'
};

const loginGroupStyle: CSS.Properties = {
   borderLeftWidth: "2px",
   borderLeftColor: "black",
   borderLeftStyle: 'solid'
};

const fieldYSepStyle: CSS.Properties = {
   marginBottom: '10px'
};

const lpanelStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

const rpanelStyle: CSS.Properties = {
   marginTop: '0px', paddingTop: '0px',
   marginBottom: '0px', paddingBottom: '0px',
   marginLeft: '10px', paddingLeft: '0px',
   marginRight: '2px', paddingRight: '0px',
   minHeight: '575px'
};

interface IMemberPageProps {
}

interface IMemberPageState {
   isLoggedIn: boolean;
   pageData: HomePageData;
   rtc: Rtc;
}

export class MemberPage extends React.Component<IMemberPageProps, IMemberPageState> {

   //member variables
   isLoggedIn: boolean;
   pageData: HomePageData;
   defaultPageData: HomePageData;

   constructor(props: ICoachPageProps) {
      super(props);

      this.defaultPageData = new HomePageData(null,
         new Person(null, null, 'Waiting...', null, 'person-w-128x128.png', null),
         new Facility(null, null, 'Waiting...', 'weightlifter-b-128x128.png'),
         null);

      this.isLoggedIn = false;
      this.pageData = this.defaultPageData;

      this.state = {isLoggedIn: this.isLoggedIn, pageData: this.pageData, rtc: null};
   }

   componentDidMount() {
      // pre-load images that indicate a connection error, as they won't load later.
      const imgR = new Image();
      imgR.src = "./circle-black-red-128x128.png";
      const imgA = new Image();
      imgA.src = "./circle-black-yellow-128x128.png";

      var self = this;

      // Make a request for user data to populate the home page 
      axios.get('/api/home', { params: { coach: encodeURIComponent(false) } })
         .then(function (response) {

            // Success, set state to data for logged in user 
            self.pageData = self.pageData.revive(response.data);

            // Initialise WebRTC and connect
            var rtc = new Rtc({
               sessionId: self.pageData.sessionId,
               facilityId: self.pageData.currentFacility.externalId,
               personId: self.pageData.person.externalId,
               personName: self.pageData.person.name,
               personThumbnailUrl: self.pageData.person.thumbnailUrl
            });
            rtc.connectFirst();

            self.setState({ isLoggedIn: true, pageData: self.pageData, rtc: rtc });
            self.forceUpdate();
         })
         .catch(function (error) {
            // handle error by setting state back to no user logged in
            self.pageData = self.defaultPageData;
            self.setState({ isLoggedIn: false, pageData: self.pageData, rtc: null });
         });
   }

   componentWillUnmount() {
   }

   render() {
      var loggedIn = false;
      if (!this.state.isLoggedIn) {
      }
      else {
         loggedIn = true;
      }

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
                     <Dropdown as={ButtonGroup} id="collasible-nav-call-status">
                        <Button split="true" variant="secondary" style={thinStyle}>
                           <ServerConnectionStatus rtc={this.state.rtc}> </ServerConnectionStatus>
                        </Button>
                        <Dropdown.Toggle variant="secondary" id="call-status-split" size="sm">
                        </Dropdown.Toggle>
                        <LinkConnectionStatus rtc={this.state.rtc}> </LinkConnectionStatus>
                     </Dropdown>
                     <Dropdown as={ButtonGroup} id="collasible-nav-person">
                        <Button split="true" variant="secondary" style={thinStyle}>
                           <PartySmall name={this.state.pageData.person.name} thumbnailUrl={this.state.pageData.person.thumbnailUrl} />
                        </Button>
                        <Dropdown.Toggle variant="secondary" id="person-split" size="sm">
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="right">
                           <Dropdown.Item>Sign Out...</Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                  </Nav>
               </Navbar.Collapse>
            </Navbar>

            <Container fluid style={pageStyle}>
               <Row style={thinStyle}>
                  <Col style={lpanelStyle}>
                     <div style={placeholderStyle}>
                     </div>
                  </Col>
                  <Col md='auto' style={rpanelStyle}>
                     <RemoteClock rtc={this.state.rtc} />
                     <br />
                     <RemotePeople rtc={this.state.rtc}> </RemotePeople>
                  </Col>
               </Row>
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
   rtc: Rtc;
   login: LoginFb;
   openClockSpec: boolean;
}

export class CoachPage extends React.Component<ICoachPageProps, ICoachPageState> {

   //member variables
   pageData: HomePageData;
   defaultPageData: HomePageData;

   constructor(props: ICoachPageProps) {
      super(props);

      this.defaultPageData = new HomePageData(null,
         new Person(null, null, 'Waiting...', null, 'person-w-128x128.png', null),
         new Facility(null, null, 'Waiting...', 'weightlifter-b-128x128.png'),
         null);

      this.pageData = this.defaultPageData;

      this.state = {
         isLoggedIn: false,
         pageData: this.pageData,
         rtc: null,
         login: new LoginFb({
            autoLogin: true, onLoginStatusChange: this.onLoginStatusChange.bind(this)
         }),
         openClockSpec: false
      };
   }

   componentDidMount() {
      // pre-load images that indicate a connection error, as they won't load later.
      const imgR = new Image();
      imgR.src = "./circle-black-red-128x128.png";
      const imgA = new Image();
      imgA.src = "./circle-black-yellow-128x128.png";

      // Initialise the facebook API for this page
      this.state.login.loadAPI();
   }

   componentWillUnmount() {
   }

   onLoginStatusChange(isLoggedIn) {
      var self = this;

      // Make a request for user data to populate the home page 
      if (isLoggedIn) {
         axios.get('/api/home', { params: { coach: encodeURIComponent(true)} })
            .then(function (response) {
               // Success, set state to data for logged in user 
               self.pageData = self.pageData.revive(response.data);

               // Initialise WebRTC and connect
               var rtc = new Rtc({
                  sessionId: self.pageData.sessionId,
                  facilityId: self.pageData.currentFacility.externalId,
                  personId: self.pageData.person.externalId,
                  personName: self.pageData.person.name,
                  personThumbnailUrl: self.pageData.person.thumbnailUrl
               });
               rtc.connectFirst();

               self.setState({ isLoggedIn: true, pageData: self.pageData, rtc: rtc});
            })
            .catch(function (error) {
               // handle error by setting state back to no user logged in
               self.pageData = self.defaultPageData;
               self.setState({ isLoggedIn: false, pageData: self.pageData, rtc: null });
            });
      } else {
         // handle error by setting state back to no user logged in
         self.pageData = self.defaultPageData;
         self.setState({ isLoggedIn: false, pageData: self.pageData, rtc: null});
      }
   }

   render() {
      if (!this.state.isLoggedIn) {
         return (
            <div className="loginpage">
               <Helmet>
                  <title>UltraBox</title>
                  <link rel="icon" href="weightlifter-b-128x128.png" type="image/png" />
                  <link rel="shortcut icon" href="weightlifter-b-128x128.png" type="image/png" />
               </Helmet>
               <Navbar style={facilityNavStyle}>
                  <Navbar.Brand href="/" style={navbarBrandStyle}>
                     <PartyBanner name="UltraBox" thumbnailUrl="weightlifter-w-128x128.png" />
                  </Navbar.Brand>
               </Navbar>
               <Container fluid style={pageStyle}>
                  <Jumbotron style={{ background: 'gray', color: 'white' }}>
                     <h1>Welcome!</h1>
                     <p>
                        Welcome to UltraBox. Sign in below to get access to your class.
                     </p>
                     <Button variant="primary" onClick={this.state.login.logIn}>Coaches login with Facebook...</Button>
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
                        <Dropdown as={ButtonGroup} id="collasible-nav-call-status">
                           <Button split="true" variant="secondary" style={thinStyle}>                             
                              <ServerConnectionStatus rtc={this.state.rtc}> </ServerConnectionStatus>
                           </Button>
                           <Dropdown.Toggle variant="secondary" id="call-status-split" size="sm">
                           </Dropdown.Toggle>
                           <LinkConnectionStatus rtc={this.state.rtc}> </LinkConnectionStatus>
                        </Dropdown>
                        <Dropdown as={ButtonGroup} id="collasible-nav-person">
                           <Button split="true" variant="secondary" style={thinStyle}>
                              <PartySmall name={this.state.pageData.person.name} thumbnailUrl={this.state.pageData.person.thumbnailUrl} />
                           </Button>
                           <Dropdown.Toggle variant="secondary" id="person-split" size="sm">
                           </Dropdown.Toggle>
                           <Dropdown.Menu align="right">
                              <Dropdown.Item onClick={this.state.login.logOut}>Sign Out...</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </Nav>
                  </Navbar.Collapse>
               </Navbar>

               <Container fluid style={pageStyle}>
                  <Row style={thinStyle}>
                     <Col style={lpanelStyle}>
                        <MasterWhiteboard rtc={this.state.rtc}> </MasterWhiteboard>                        
                     </Col>
                     <Col md='auto' style={rpanelStyle}>
                        <MasterClock rtc={this.state.rtc}> </MasterClock>
                        <br />
                        <RemotePeople rtc={this.state.rtc}> </RemotePeople>
                     </Col>
                  </Row>
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
   isMcReadyToLogin: boolean;
   meetCode: string;
   name: string;
   isValidMeetCode: boolean;
   isValidName: boolean;
   loginFb: LoginFb;
   loginMc: LoginMc;
}

export class LoginPage extends React.Component<ILoginPageProps, ILoginPageState> {
   //member variables
   isLoggedIn: boolean;
   lastUserData: MeetingScreenState;

   constructor(props: ILoginPageProps) {
      super(props);
      this.lastUserData = new MeetingScreenState();

      this.state = {
         isLoggedIn: false,
         isMcReadyToLogin: false,
         meetCode: this.lastUserData.loadMeetingId(),
         name: this.lastUserData.loadName(),
         isValidMeetCode: false,
         isValidName: false,
         loginFb: new LoginFb({ autoLogin: false, onLoginStatusChange: this.onLoginStatusChangeFb.bind(this) }),
         loginMc: new LoginMc({
            autoLogin: false, onLoginStatusChange: this.onLoginStatusChangeMc.bind(this),
            onLoginReadinessChange: this.onLoginReadinessChangeMc.bind(this),
            name: this.lastUserData.loadName(),
            meetCode: this.lastUserData.loadMeetingId()
         })
      };
   }
   
   onLoginStatusChangeMc(isLoggedIn) {
      this.setState ({ isLoggedIn: isLoggedIn});
   }

   onLoginReadinessChangeMc(isReady) {
      this.setState({
         isMcReadyToLogin: isReady,
         isValidMeetCode: this.state.loginMc.isValidMeetCode(),
         isValidName: this.state.loginMc.isValidName()
      });
      if (isReady) {
         this.lastUserData.saveMeetingId(this.state.loginMc.getMeetCode());
         this.lastUserData.saveName(this.state.loginMc.getName());
      }
   }

   onLoginStatusChangeFb(isLoggedIn) {
      this.setState({ isLoggedIn: isLoggedIn });
   }

   componentDidMount() {
      // Initialise facebook API
      this.state.loginFb.loadAPI();

      // Initialise meeting code API
      this.state.loginMc.loadAPI();
   }

   componentWillUnmount() {
   }

   handleMeetCodeChange(ev: any) {
      this.state.loginMc.handleMeetCodeChange(ev);
      this.setState({ meetCode: this.state.loginMc.getMeetCode() });
   }

   handleNameChange(ev: any) {
      this.state.loginMc.handleNameChange(ev);
      this.setState({ name: this.state.loginMc.getName() });
   }

   render() {
         return (
            <div className="loginpage">
            <Helmet>
                  <title>UltraBox</title>
               <link rel="icon" href="weightlifter-b-128x128.png" type="image/png" />
               <link rel="shortcut icon" href="weightlifter-b-128x128.png" type="image/png" />
            </Helmet>
            <Navbar style={facilityNavStyle}>
               <Navbar.Brand href="/" style={navbarBrandStyle}>
                  <PartyBanner name="UltraBox" thumbnailUrl="weightlifter-w-128x128.png" />
               </Navbar.Brand>
            </Navbar>
            <Container fluid style={pageStyle}>
               <Jumbotron style={{ background: 'gray', color: 'white' }}>
                  <h1>Welcome!</h1>
                  <p>Welcome to UltraBox. Sign in below to get access to your class.</p>
                  <Row className="align-items-center">
                     <Col className="d-none d-md-block">
                     </Col>
                     <Col>
                        <Button variant="primary" onClick={this.state.loginFb.logIn}>Coaches login with Facebook...</Button>
                     </Col>
                     <Col style={loginGroupStyle}>
                        <Form.Group controlId="formMeetingCode">
                              <Form.Control type="text" placeholder="Enter meeting code." maxLength="10" style={fieldYSepStyle}
                                 onChange={this.handleMeetCodeChange.bind(this)}
                                 isValid={this.state.isValidMeetCode}
                                 value={this.state.meetCode} />
                        </Form.Group>
                        <Form.Group controlId="formName">
                              <Form.Control type="text" placeholder="Enter your display name." maxLength="30" style={fieldYSepStyle}
                                 onChange={this.handleNameChange.bind(this)}
                                 isValid={this.state.isValidName}
                                 value={this.state.name}/>
                        </Form.Group>
                        <Button variant="primary" disabled={!this.state.isMcReadyToLogin}
                           onClick={this.state.loginMc.logIn.bind(this.state.loginMc)}>Join with a meeting code...
                        </Button>
                     </Col>
                     <Col className="d-none d-md-block ">
                     </Col>
                  </Row>
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
               <Route path="/coach">
                  <CoachPage />
               </Route>
            </Switch>  
         </BrowserRouter>  
      );
   }
}

ReactDOM.render(<PageSwitcher />, document.getElementById('root'));
