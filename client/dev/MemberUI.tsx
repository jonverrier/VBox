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

// Additional packages
import { Helmet } from 'react-helmet';
import axios from 'axios';
import * as CSS from 'csstype';

// This app, other library
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';
import { Person } from '../../core/dev/Person';
import { Facility } from '../../core/dev/Facility';
import { UserFacilities } from '../../core/dev/UserFacilities';
import { PeerConnection } from '../../core/dev/PeerConnection';
import { LiveDocumentRemote } from '../../core/dev/LiveDocumentCentral';
import { LiveWorkoutFactory, LiveWorkoutChannelFactoryPeer, LiveWorkout } from '../../core/dev/LiveWorkout';
import { StoredMeetingState } from '../../core/dev/LocalStore';

// This app, this component
import { MemberLoginData, MemberLoginProvider } from './LoginMember';
import { ParticipantBanner, ParticipantSmall } from './ParticipantUI';
import { RemoteConnectionStatus } from './CallPanelUI';
import { RemotePeople } from './PeopleUI';
import { RemoteClock } from './ClockUI';
import { RemoteCall } from './CallControlUI';
import { Footer, cmnNoMarginPad, navbarStyle, navbarBrandStyle, pageStyle, cmnExtraBtmPad, pageThinPanelStyle, pageIndentPanelStyle} from './CommonStylesUI';

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

interface IMemberPageProps {
}

interface IMemberPageState {
   isLoggedIn: boolean;
   userFacilities: UserFacilities;
   peerConnection: PeerConnection;
   remoteDocument: LiveDocumentRemote;
   isDataReady: boolean;
   meetCodeCopy: string;
   nameCopy: string;
   loginData: MemberLoginData;
   loginProvider: MemberLoginProvider;
   intervalId: any
}

export class MemberPage extends React.Component<IMemberPageProps, IMemberPageState> {

   //member variables
   userFacilities: UserFacilities;
   defaultUserFacilities: UserFacilities;
   lastUserData: StoredMeetingState;

   constructor(props: IMemberPageProps) {
      super(props);

      this.lastUserData = new StoredMeetingState();

      this.defaultUserFacilities = new UserFacilities(null,
         new Person(null, '', 'Waiting...', '', 'person-w-128x128.png', ''),
         new Facility(null, '', 'Waiting...', 'weightlifter-b-128x128.png', ''),
         null,
         new Array<Facility>());

      this.userFacilities = this.defaultUserFacilities;
      let loginData = new MemberLoginData(this.lastUserData.loadMeetingId(), this.lastUserData.loadName());
      let peerConnection = new PeerConnection(true); // Member nodes are edge only, coaches are full hubs

      this.state = {
         isLoggedIn: false,
         userFacilities: this.userFacilities,
         peerConnection: peerConnection,
         remoteDocument: undefined,
         isDataReady: false,
         meetCodeCopy: loginData.meetCode,
         nameCopy: loginData.name,
         loginData: loginData,
         loginProvider: new MemberLoginProvider(),
         intervalId: null
      };
   }

   componentDidMount() : void {
      // pre-load images that indicate a connection error, as they won't load later.
      const imgR = new Image();
      imgR.src = "./circle-black-red-128x128.png";
      const imgA = new Image();
      imgA.src = "./circle-black-yellow-128x128.png";

      // Initialise meeting code API
      this.state.loginProvider.load();
      this.state.loginData.onDataReadiness = this.onDataReadiness.bind(this);
      this.state.loginProvider.onLoginReadiness = this.onLoginReadiness.bind(this);
      this.state.loginProvider.onLoginResult = this.onLoginResult.bind(this);

      // probe to see if we are already logged in
      this.state.loginProvider.setLoginData(this.state.loginData);
      this.state.loginProvider.testLogin();
   }

   componentWillUnmount() : void {
      if (this.state.intervalId) {
         clearInterval(this.state.intervalId);
         this.setState({ intervalId: null });
      }
   }

   onClockInterval() : void {
      axios.post('/api/keepalive', { params: {} })
         .then((response) => {
         })
         .catch((e) => {
            logger.logError('MemberPage', 'onClockInterval', 'Error:', e);
         });
   }

   handleMeetCodeChange(ev: Event): void {
      var casting : any = ev.target;
      this.state.loginData.meetCode = casting.value;
      this.setState({ meetCodeCopy: casting.value });
   }

   handleNameChange(ev: Event) : void {
      var casting: any = ev.target;
      this.state.loginData.name = casting.value;
      this.setState({ nameCopy: casting.value });
   }

   onDataReadiness(isReady: boolean): void {
      if (isReady) {
         // If the data is OK, we can log in provided the subsystem is ready. we set the data, then it tells is if it ready via callback. 
         this.state.loginProvider.setLoginData(this.state.loginData);
      } else {
         // but we can unconditionally not log in if the data is wrong
         this.setState({ isDataReady: false });
      }
   }

   onLoginReadiness(isReady: boolean): void {
      this.setState({ isDataReady: isReady });
   }

   onLoginResult(isLoggedIn: boolean) : void {

      var self = this as MemberPage;

      if (isLoggedIn) {
         // Make a request for user data to populate the home page 
         axios.get('/api/home', {
            params: {
               coach: encodeURIComponent(false),
               meetingId: encodeURIComponent(self.state.loginData.meetCode)
            }
         })
            .then(function (response) {

               // Success, set state to data for logged in user 
               self.userFacilities = UserFacilities.revive(response.data);

               var person = new Person(null,
                  self.userFacilities.person.externalId,
                  self.userFacilities.person.name,
                  null,
                  self.userFacilities.person.thumbnailUrl, null);

               // Initialise WebRTC and connect
               self.state.peerConnection.connect(self.state.loginData.meetCode,
                  person);

               // Create a shared document hooked up to the connection
               self.setState({
                  remoteDocument: new LiveDocumentRemote(person,
                     self.state.peerConnection.localCallParticipation,
                     new LiveWorkoutChannelFactoryPeer(self.state.peerConnection),
                     new LiveWorkoutFactory())
               });

               // Keep alive to server every 25 seconds
               let intervalId = setInterval(self.onClockInterval.bind(self), 25000 + Math.random());
               self.setState({ isLoggedIn: true, userFacilities: self.userFacilities, intervalId: intervalId  });
               self.forceUpdate();

               // Save valid credentials for pre-population next time
               self.lastUserData.saveMeetingId(self.state.loginData.meetCode);
               self.lastUserData.saveName(self.state.loginData.name);
            })
            .catch(function (error) {
               // handle error by setting state back to no user logged in
               self.userFacilities = self.defaultUserFacilities;
               if (self.state.intervalId)
                  clearInterval(self.state.intervalId);
               self.setState({ isLoggedIn: false, userFacilities: self.userFacilities, intervalId: null });
            });
      } else {
         if (this.state.intervalId)
            clearInterval(this.state.intervalId);
         this.setState({ intervalId: null });
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
               <Navbar style={navbarStyle}>
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
                              <Form.Control type="text" placeholder="Enter meeting code." maxLength={10} style={cmnExtraBtmPad}
                                 onChange={this.handleMeetCodeChange.bind(this)}
                                 isValid={this.state.loginData.isValidMeetCode()}
                                 value={this.state.meetCodeCopy} />
                           </Form.Group>
                           <Form.Group controlId="formName">
                              <Form.Control type="text" placeholder="Enter your display name." maxLength={30} style={cmnExtraBtmPad}
                                 onChange={this.handleNameChange.bind(this)}
                                 isValid={this.state.loginData.isValidName()}
                                 value={this.state.nameCopy} />
                           </Form.Group>
                           <Button variant="secondary" disabled={!this.state.isDataReady}
                              onClick={this.state.loginProvider.login.bind(this.state.loginProvider)}>Join with a meeting code...
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
                  <title>{this.state.userFacilities.currentFacility.name}</title>
                  <link rel="icon" href={this.state.userFacilities.currentFacility.thumbnailUrl} type="image/png" />
                  <link rel="shortcut icon" href={this.state.userFacilities.currentFacility.thumbnailUrl} type="image/png" />
               </Helmet>

               <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" style={cmnNoMarginPad}>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                     <Nav className="mr-auto">
                        <Dropdown as={ButtonGroup} id="collasible-nav-facility">
                           <Button variant="secondary" style={cmnNoMarginPad}
                              title="See connection details."
                              >
                              <ParticipantSmall name={this.state.userFacilities.currentFacility.name} thumbnailUrl={this.state.userFacilities.currentFacility.thumbnailUrl} />
                           </Button>
                           <Dropdown.Toggle variant="secondary" id="facility-split" size="sm" >
                           </Dropdown.Toggle>
                           <Dropdown.Menu align="left">
                              <Dropdown.Item href={this.state.userFacilities.currentFacility.homepageUrl}>Homepage...</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </Nav>
                     <Navbar.Brand href="">{this.state.userFacilities.currentFacility.name}</Navbar.Brand>
                     <Nav className="ml-auto">
                        <RemoteConnectionStatus peerConnection={this.state.peerConnection}> </RemoteConnectionStatus>
                        <Dropdown as={ButtonGroup} id="collasible-nav-person">
                           <Button variant="secondary" style={cmnNoMarginPad}>
                              <ParticipantSmall name={this.state.userFacilities.person.name} thumbnailUrl={this.state.userFacilities.person.thumbnailUrl} />
                           </Button>
                           <Dropdown.Toggle variant="secondary" id="person-split" size="sm">
                           </Dropdown.Toggle>
                           <Dropdown.Menu align="right">
                              <Dropdown.Item onClick={this.state.loginProvider.logout.bind(this.state.loginProvider)}>Sign Out...</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </Nav>
                  </Navbar.Collapse>
               </Navbar>

               <Container fluid style={pageStyle}>
                  <Row style={cmnNoMarginPad}>
                     <Col style={pageThinPanelStyle}>
                        <RemoteCall 
                           commandProcessor={this.state.remoteDocument.commandProcessor}
                           liveWorkout={(this.state.remoteDocument.document as LiveWorkout)}> </RemoteCall>
                     </Col>
                     <Col md='auto' style={pageThinPanelStyle}>
                        <RemoteClock 
                           commandProcessor={this.state.remoteDocument.commandProcessor}
                           liveWorkout={(this.state.remoteDocument.document as LiveWorkout)}/>
                        <br />
                        <RemotePeople 
                           commandProcessor={this.state.remoteDocument.commandProcessor}
                           liveWorkout={(this.state.remoteDocument.document as LiveWorkout)}> </RemotePeople>
                     </Col>
                  </Row>
                  <Footer></Footer>
               </Container>
            </div>
         );
      }
   }
}
