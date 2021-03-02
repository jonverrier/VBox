/*! Copyright TXPCo, 2020, 2021 */

// Core React
import ReactDOM from 'react-dom';
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
import Carousel from 'react-bootstrap/Carousel';

// Additional packages
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'; 
import axios from 'axios';
import * as CSS from 'csstype';

// This app, other components
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';
import { Person } from '../../core/dev/Person';
import { Facility } from '../../core/dev/Facility';
import { UserFacilities } from '../../core/dev/UserFacilities';

// This app, this component
import { ParticipantBanner, ParticipantSmall } from './participant';
import { RemoteConnectionStatus, MasterConnectionStatus } from './callpanel';
import { RemotePeople } from './peoplepanel';
import { LoginFb } from './loginfb';
import { LoginMc } from './loginmc';
import { PeerConnection } from './PeerConnection';
import { StoredMeetingState } from './localstore';
import { MasterClock, RemoteClock } from './clockpanel';
import { MasterWhiteboard, RemoteWhiteboard } from './whiteboardpanel';
import { LeaderResolve } from './leaderpanel';
import { Media } from './media';

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

const jumbotronStyle: CSS.Properties = {
   paddingLeft: '10px',
   paddingRight: '10px',
   marginBottom: '0px',
   background: 'gray',
   color: 'white'
};

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

const rowHorizontalSepStyle: CSS.Properties = {
   marginTop: '20px',
   paddingTop: '20px',
   borderTopWidth: "1px",
   borderTopColor: "black",
   borderTopStyle: 'solid'
};

const loginGroupStyleLeftBorder: CSS.Properties = {
   borderLeftWidth: "1px",
   borderLeftColor: "black",
   borderLeftStyle: 'solid'
};

const fieldTSepStyle: CSS.Properties = {
   marginTop: '20px'
};

const fieldBSepStyle: CSS.Properties = {
   marginBottom: '20px'
};

const emailUnderpinFieldStyle: CSS.Properties = {
   marginBottom: '20px',
   color: 'lightgray'
};

const lpanelStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

const rpanelStyle: CSS.Properties = {
   marginTop: '0px', paddingTop: '0px',
   marginBottom: '0px', paddingBottom: '0px',
   marginLeft: '10px', paddingLeft: '0px',
   marginRight: '2px', paddingRight: '0px'
};

const carouselMobileImageStyle: CSS.Properties = {
   width: '320px',
   opacity: '50%'
};

const carouselImageStyle: CSS.Properties = {
   width: '480px',
   opacity: '65%'
};

const carouselHeadingStyle: CSS.Properties = {
   color: 'black'
};

const footerElementStyle: CSS.Properties = {
   padding: '10px',
   fontSize: '14px',
   color: 'white'
};

interface IMemberPageProps {
}

interface IMemberPageState {
   isLoggedIn: boolean;
   pageData: UserFacilities;
   rtc: PeerConnection;
   meetCode: string;
   name: string;
   isValidMeetCode: boolean;
   isValidName: boolean;
   isReadyToLogInWithMeetCode: boolean;
   loginMc: LoginMc;
   intervalId: any;
}

export class MemberPage extends React.Component<IMemberPageProps, IMemberPageState> {

   //member variables
   pageData: UserFacilities;
   defaultPageData: UserFacilities;
   lastUserData: StoredMeetingState;

   constructor(props: IMemberPageProps) {
      super(props);

      this.lastUserData = new StoredMeetingState();

      this.defaultPageData = new UserFacilities(null,
         new Person(null, '', 'Waiting...', '', 'person-w-128x128.png', ''),
         new Facility(null, '', 'Waiting...', 'weightlifter-b-128x128.png', ''),
         new Array<Facility>());

      this.pageData = this.defaultPageData;

      this.state = {
         isLoggedIn: false,
         pageData: this.pageData,
         rtc: null,
         isReadyToLogInWithMeetCode: false,
         meetCode: this.lastUserData.loadMeetingId(),
         name: this.lastUserData.loadName(),
         isValidMeetCode: false,
         isValidName: false,
         loginMc: new LoginMc({
            autoLogin: false, onLoginStatusChange: this.onLoginStatusChangeMc.bind(this),
            onLoginReadinessChange: this.onLoginReadinessChangeMc.bind(this),
            name: this.lastUserData.loadName(),
            meetCode: this.lastUserData.loadMeetingId()
         }),
         intervalId : null
      };
   }

   componentDidMount() {
      // pre-load images that indicate a connection error, as they won't load later.
      const imgR = new Image();
      imgR.src = "./circle-black-red-128x128.png";
      const imgA = new Image();
      imgA.src = "./circle-black-yellow-128x128.png";

      var self = this;

      // Initialise meeting code API
      this.state.loginMc.loadAPI();

      // Keep alive to server every 25 seconds
      let intervalId = setInterval(this.onClockInterval.bind(this), 25000 + Math.random());
      this.setState({ intervalId: intervalId });
   }

   componentWillUnmount() {
      if (this.state.intervalId) {
         clearInterval(this.state.intervalId);
         this.setState({ intervalId: null });
      }
   }

   onClockInterval() {
      axios.post('/api/keepalive', { params: {} })
         .then((response) => {
         })
         .catch((e) => {
            logger.logError('MemberPage', 'onClockInterval', 'Error:', e);
         });
   }

   handleMeetCodeChange(ev: any) {
      this.state.loginMc.handleMeetCodeChange(ev);
      this.setState({ meetCode: this.state.loginMc.getMeetCode() });
   }

   handleNameChange(ev: any) {
      this.state.loginMc.handleNameChange(ev);
      this.setState({ name: this.state.loginMc.getName() });
   }

   onLoginStatusChangeMc(isLoggedIn) {

      var self = this;

      if (isLoggedIn) {
         // Make a request for user data to populate the home page 
         axios.get('/api/home', { params: { coach: encodeURIComponent(false) } })
            .then(function (response) {

               // Success, set state to data for logged in user 
               self.pageData = UserFacilities.revive(response.data);

               // Initialise WebRTC and connect
               var rtc = new PeerConnection({
                  isEdgeOnly: true, // Member nodes are edge only, coaches are full hubs
                  sessionId: self.pageData.sessionId,
                  facilityId: self.pageData.currentFacility.externalId,
                  personId: self.pageData.person.externalId,
                  personName: self.pageData.person.name,
                  personThumbnailUrl: self.pageData.person.thumbnailUrl
               });
               rtc.connect();

               self.setState({ isLoggedIn: true, pageData: self.pageData, rtc: rtc });
               self.forceUpdate();
            })
            .catch(function (error) {
               // handle error by setting state back to no user logged in
               self.pageData = self.defaultPageData;
               self.setState({ isLoggedIn: false, pageData: self.pageData, rtc: null });
            });
      }
   }

   onLoginReadinessChangeMc(isReady) {
      this.setState({
         isReadyToLogInWithMeetCode: isReady,
         isValidMeetCode: this.state.loginMc.isValidMeetCode(),
         isValidName: this.state.loginMc.isValidName()
      });
      if (isReady) {
         this.lastUserData.saveMeetingId(this.state.loginMc.getMeetCode());
         this.lastUserData.saveName(this.state.loginMc.getName());
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
                     <ParticipantBanner name="UltraBox" thumbnailUrl="weightlifter-w-128x128.png" />
                  </Navbar.Brand>
               </Navbar>
               <Container fluid style={pageStyle}>
                  <Jumbotron style={{ background: 'gray', color: 'white' }}>
                     <h1>Welcome!</h1>
                     <p>
                        Welcome to UltraBox. Sign in below to get access to your class.
                     </p>
                     <Row className="align-items-center">
                        <Col className="d-none d-md-block">
                        </Col>
                        <Col>
                           <Form.Group controlId="formMeetingCode">
                              <Form.Control type="text" placeholder="Enter meeting code." maxLength={10} style={fieldBSepStyle}
                                 onChange={this.handleMeetCodeChange.bind(this)}
                                 isValid={this.state.isValidMeetCode}
                                 value={this.state.meetCode} />
                           </Form.Group>
                           <Form.Group controlId="formName">
                              <Form.Control type="text" placeholder="Enter your display name." maxLength={30} style={fieldBSepStyle}
                                 onChange={this.handleNameChange.bind(this)}
                                 isValid={this.state.isValidName}
                                 value={this.state.name} />
                           </Form.Group>
                           <Button variant="secondary" disabled={!this.state.isReadyToLogInWithMeetCode}
                              onClick={this.state.loginMc.logIn.bind(this.state.loginMc)}>Join with a meeting code...
                           </Button>
                        </Col>
                        <Col className="d-none d-md-block">
                        </Col>
                     </Row>
                  </Jumbotron>
               </Container>
            </div>
         );
      }
      else {
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
                           <Button variant="secondary" style={thinStyle}>
                              <ParticipantSmall name={this.state.pageData.currentFacility.name} thumbnailUrl={this.state.pageData.currentFacility.thumbnailUrl} />
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
                        <RemoteConnectionStatus peers={this.state.rtc}> </RemoteConnectionStatus>
                        <Dropdown as={ButtonGroup} id="collasible-nav-person">
                           <Button variant="secondary" style={thinStyle}>
                              <ParticipantSmall name={this.state.pageData.person.name} thumbnailUrl={this.state.pageData.person.thumbnailUrl} />
                           </Button>
                           <Dropdown.Toggle variant="secondary" id="person-split" size="sm">
                           </Dropdown.Toggle>
                           <Dropdown.Menu align="right">
                              <Dropdown.Item onClick={this.state.loginMc.logOut}>Sign Out...</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </Nav>
                  </Navbar.Collapse>
               </Navbar>

               <Container fluid style={pageStyle}>
                  <Row style={thinStyle}>
                     <Col style={lpanelStyle}>
                        <RemoteWhiteboard rtc={this.state.rtc}> </RemoteWhiteboard>
                     </Col>
                     <Col md='auto' style={rpanelStyle}>
                        <RemoteClock peers={this.state.rtc}/>
                        <br />
                        <RemotePeople peers={this.state.rtc}> </RemotePeople>
                     </Col>
                  </Row>
                  <Footer></Footer>
               </Container>
            </div>
         );
      }
   }
}

interface ICoachPageProps {
}

interface ICoachPageState {
   isLoggedIn: boolean;
   isLeader: boolean;
   haveAccess: boolean;
   pageData: UserFacilities;
   rtc: PeerConnection;
   loginFb: LoginFb;
   openClockSpec: boolean;
   intervalId: any;
}

export class CoachPage extends React.Component<ICoachPageProps, ICoachPageState> {

   //member variables
   pageData: UserFacilities;
   defaultPageData: UserFacilities;

   constructor(props: ICoachPageProps) {
      super(props);

      this.defaultPageData = new UserFacilities(null,
         new Person(null, null, 'Waiting...', null, 'person-w-128x128.png', null),
         new Facility(null, null, 'Waiting...', 'weightlifter-b-128x128.png', null),
         null);

      this.pageData = this.defaultPageData;

      this.state = {
         isLoggedIn: false,
         isLeader: true, // we are leader until someone beats us in 'glareResolve' exchange
         haveAccess: false, //  Canny access mic or speaker until users does something. 
         pageData: this.pageData,
         rtc: null,
         loginFb: new LoginFb({
            autoLogin: true, onLoginStatusChange: this.onLoginStatusChange.bind(this)
         }),
         openClockSpec: false,
         intervalId: null
      };
   }

   componentDidMount() {
      // pre-load images that indicate a connection error, as they won't load later.
      const imgR = new Image();
      imgR.src = "./circle-black-red-128x128.png";
      const imgA = new Image();
      imgA.src = "./circle-black-yellow-128x128.png";

      // Initialise the facebook API for this page
      this.state.loginFb.loadAPI();

      // Keep alive to server every 25 seconds
      let intervalId = setInterval(this.onClockInterval.bind(this), 25000 + Math.random());
      this.setState({ intervalId: intervalId });
   }

   componentWillUnmount() {
      if (this.state.intervalId) {
         clearInterval(this.state.intervalId);
         this.setState({ intervalId: null });
      }
   }

   onClockInterval() {
      axios.post('/api/keepalive', { params: {} })
         .then((response) => {
         })
         .catch((e) => {
            logger.logError('CoachPage', 'onClockInterval', 'Error:', e);
         });
   }

   onAccessChange(haveAccess) {
      var self = this;
      this.setState({ haveAccess: haveAccess });
   }

   onLeaderChange (isLeader) {
      var self = this;
      this.setState({isLeader: isLeader});
   }

   onLoginStatusChange(isLoggedIn) {
      var self = this;

      // Make a request for user data to populate the home page 
      if (isLoggedIn) {
         axios.get('/api/home', { params: { coach: encodeURIComponent(true)} })
            .then(function (response) {

               if (response.data) {
                  // Success, set state to data for logged in user 
                  self.pageData = UserFacilities.revive(response.data);

                  // Initialise WebRTC and connect
                  var rtc = new PeerConnection({
                     isEdgeOnly: false, // Member nodes are edge only, coaches are full hubs
                     sessionId: self.pageData.sessionId,
                     facilityId: self.pageData.currentFacility.externalId,
                     personId: self.pageData.person.externalId,
                     personName: self.pageData.person.name,
                     personThumbnailUrl: self.pageData.person.thumbnailUrl
                  });
                  rtc.connect ();

                  self.setState({ isLoggedIn: true, pageData: self.pageData, rtc: rtc });
               } else {
                  // handle error by setting state back to no user logged in
                  self.pageData = self.defaultPageData;
                  self.setState({ isLoggedIn: false, pageData: self.pageData, rtc: null });
               }
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
                     <ParticipantBanner name="UltraBox" thumbnailUrl="weightlifter-w-128x128.png" />
                  </Navbar.Brand>
               </Navbar>
               <Container fluid style={pageStyle}>
                  <Jumbotron style={{ background: 'gray', color: 'white' }}>
                     <h1>Welcome!</h1>
                     <p>
                        Welcome to UltraBox. Sign in below to get access to your class.
                     </p>
                     <Button variant="secondary" onClick={this.state.loginFb.logInFromClick.bind(this.state.loginFb)}>Coaches login with Facebook...</Button>
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
                           <Button variant="secondary" style={thinStyle}>
                              <ParticipantSmall name={this.state.pageData.currentFacility.name} thumbnailUrl={this.state.pageData.currentFacility.thumbnailUrl} />
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
                        <MasterConnectionStatus peers={this.state.rtc} />
                        <Dropdown as={ButtonGroup} id="collasible-nav-person">
                           <Button variant="secondary" style={thinStyle}>
                              <ParticipantSmall name={this.state.pageData.person.name} thumbnailUrl={this.state.pageData.person.thumbnailUrl} />
                           </Button>
                           <Dropdown.Toggle variant="secondary" id="person-split" size="sm">
                           </Dropdown.Toggle>
                           <Dropdown.Menu align="right">
                              <Dropdown.Item onClick={this.state.loginFb.logOut}>Sign Out...</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </Nav>
                  </Navbar.Collapse>
               </Navbar>

               <Container fluid style={pageStyle}>
                  <Row style={thinStyle}>
                     <Col style={thinStyle}>
                        <LeaderResolve onLeaderChange={this.onLeaderChange.bind(this)} peers={this.state.rtc}> </LeaderResolve>
                     </Col>
                  </Row>
                  <Row style={thinStyle}>
                     <Col style={lpanelStyle}>
                        <MasterWhiteboard allowEdit={this.state.isLeader} peers={this.state.rtc}> </MasterWhiteboard>                        
                     </Col>
                     <Col md='auto' style={rpanelStyle}>
                        <MasterClock allowEdit={this.state.isLeader} rtc={this.state.rtc}> </MasterClock>
                        <br />
                        <RemotePeople peers={this.state.rtc}> </RemotePeople>
                     </Col>
                  </Row>
                  <Footer></Footer>
               </Container>
            </div>
         );
      }
   }
}

interface ILandingPageProps {
}

interface ILoginPageState {

   email: string;
   isValidEmail: boolean;
   sentEmail: boolean;
   playingAudio: boolean;
   isMobileFormFactor: boolean;
}

export class LandingPage extends React.Component<ILandingPageProps, ILoginPageState> {
   //member variables - shared across instances, although for this class we have only one anyway
   media: Media;

   constructor(props: ILandingPageProps) {
      super(props);

      this.state = {
         email: "",
         isValidEmail: false,
         sentEmail: false,
         playingAudio: (false),
         isMobileFormFactor: true // Assume mobile first !
      };

      // Can have a single media object across all instances
      this.media = new Media();
      this.media.addMobileFormFactorChangeListener(this.onMobileFormFactorChange.bind(this));
   }
   
   componentDidMount() {

      this.setState({ isMobileFormFactor: this.media.isSmallFormFactor() });
   }

   componentWillUnmount() {
   }

   onMobileFormFactorChange(isMobile: boolean) {
      this.setState({ isMobileFormFactor: isMobile });
   }

   playAudio() {
      if (!this.state.playingAudio) {
         var audioEl: any = document.getElementsByClassName("audio-element")[0];
         audioEl.play();
         this.setState({ playingAudio: true });
      }
   }

   validateEmail(email : string) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
   }

   handleEmailChange(ev: any) {
      // Only allow one email per page refresh. 
      if (!this.state.sentEmail && this.validateEmail(ev.target.value)) {
         this.setState({ isValidEmail: true, email: ev.target.value});
      } else {
         this.setState({ isValidEmail: false, email: ev.target.value });
      }
   }

   sendLead() {
      if (this.validateEmail(this.state.email)) {
         axios.post('/api/lead', { params: { email: encodeURIComponent (this.state.email) } })
            .then((response) => {
               this.setState({ isValidEmail: false, email: "", sentEmail: true });
               logger.logInfo('LoginPage', 'sendLead', 'Post Ok, email:', new Object (this.state.email));
            })
            .catch((e) => {
               logger.logError('LoginPage', 'sendLead', 'Post error:', e);
            });
      }
   }

   goMember() {
      window.location.href = "/member";
   }

   goCoach() {
      window.location.href = "/coach";
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
                  <ParticipantBanner name="UltraBox" thumbnailUrl="weightlifter-w-128x128.png" />
               </Navbar.Brand>
            </Navbar>
               <Container fluid style={pageStyle}>
                  <audio className="audio-element" loop={true}>
                     <source src="15-Minute-Timer.mp3"></source>
                  </audio>
                  <Jumbotron style={jumbotronStyle}>
                     <h1 style={fieldBSepStyle}>Deliver the experience of your Box to your clients, when they can't be in your Box.</h1>
                     <Row className="align-items-center">
                        <Col className="d-none d-md-block">
                        </Col>
                        <Col className="align-items-center">
                           <Carousel className="align-items-center"  fade={true}>
                              <Carousel.Item interval={7500}>
                                 <img style={this.state.isMobileFormFactor ? carouselMobileImageStyle : carouselImageStyle}
                                    src={'landing-workout.png'} />
                              <Carousel.Caption>
                                 <h3 style={carouselHeadingStyle}>Share the whiteboard.</h3>
                              </Carousel.Caption>
                           </Carousel.Item  >
                              <Carousel.Item interval={7500}>
                                 <img style={this.state.isMobileFormFactor ? carouselMobileImageStyle : carouselImageStyle}
                                 src={'landing-video.png'} />
                              <Carousel.Caption>
                                 <h3 style={carouselHeadingStyle}>Manage the video call.</h3>
                              </Carousel.Caption>
                           </Carousel.Item>
                           <Carousel.Item interval={7500}>
                                 <img style={this.state.isMobileFormFactor ? carouselMobileImageStyle : carouselImageStyle}
                                 src={'landing-music.png'} />
                                 <Carousel.Caption>
                                    <h3 style={carouselHeadingStyle}>Play licenced music&nbsp;
                                       <a onClick={this.playAudio.bind(this)}><u>(try)</u></a>.
                                    </h3>
                              </Carousel.Caption>
                           </Carousel.Item>
                           </Carousel>  
                        </Col>
                        <Col className="align-items-center">
                           <Form.Group controlId="signMeUpId">
                              <Form.Control type="email" placeholder="Enter your email here." maxLength={40} style={fieldTSepStyle}
                                 onChange={this.handleEmailChange.bind(this)}
                                 isValid={this.state.isValidEmail}
                                 disabled={this.state.sentEmail}
                                 value={this.state.email} />
                              <Form.Text style={emailUnderpinFieldStyle}>
                                 {this.state.sentEmail ? "Thank you, we will be in touch." : "We'll never share your email with anyone else."}
                              </Form.Text>
                              <Button variant="secondary" disabled={!this.state.isValidEmail} style={fieldBSepStyle}
                                 onClick={this.sendLead.bind(this)}>
                                 Tell me more...
                              </Button>
                           </Form.Group>
                        </Col>
                        <Col className="d-none d-md-block">
                        </Col>
                     </Row>
                     <Row className="align-items-center" style={rowHorizontalSepStyle}>
                        <Col>
                           <h1 style={fieldBSepStyle}>Already joined?</h1>
                           <p>Welcome to UltraBox. Sign in below to get access to your class.</p>
                        </Col>
                     </Row>
                     <Row className="align-items-center">
                        <Col className="d-none d-md-block">
                        </Col>
                        <Col>
                           <Button variant="secondary"
                              onClick={this.goCoach.bind(this)}>Coaches
                           </Button>
                        </Col>
                        <Col style={loginGroupStyleLeftBorder}>
                           <Button variant="secondary" 
                              onClick={this.goMember.bind(this)}>Members
                           </Button>
                        </Col>
                        <Col className="d-none d-md-block">
                        </Col>
                     </Row>
                  </Jumbotron>
                  <Footer></Footer>
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
                  <Redirect to="/landing" />  
               </Route> 
               <Route path="/landing">
                  <LandingPage />
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

export class Footer extends React.Component {
   render() {
      return (
         <div>
            <Container>
               <Row>
                  <Col>
                     <a style={footerElementStyle} href="/">Home</a>
                     <a style={footerElementStyle} href="privacy">Privacy</a>
                     <a style={footerElementStyle} href="mailto:ultrabox.servicet@gmail.com">Contact Us</a>
                  </Col>
               </Row>
            </Container>
         </div>);
   }
}

// This allows code to be loaded in node.js for tests, even if we dont run actual React methods
if (document !== undefined && document.getElementById !== undefined) {
   ReactDOM.render(<PageSwitcher />, document.getElementById('root'));
}