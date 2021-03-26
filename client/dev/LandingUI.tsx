/*! Copyright TXPCo, 2020, 2021 */

// Core React
import ReactDOM from 'react-dom';
import * as React from 'react';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Carousel from 'react-bootstrap/Carousel';
import { Easel, MicMute, FileMusic, Clock, Wallet2, Binoculars} from 'react-bootstrap-icons';

// Additional packages
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'; 
import axios from 'axios';
import * as CSS from 'csstype';

// This app, other library
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';

// This app, this component
import { ParticipantBanner } from './ParticipantUI';
import { Media } from './Media';
import {Footer,
   landingJumbotronStyle, navbarStyle, navbarBrandStyle,
   cmnExtraTopPad, cmnExtraBtmPad, cmnNoMarginPad,
   landingFadeExtraBtmPad, landingMobileImageStyle, landingImageStyle, cmnNavButtonStyle, landingNavGroupStyle,
   pageStyle, pageHeaderStyle, pageSubStyle, pageParaStyle} from './CommonStylesUI';

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);


export interface ILandingPageProps {
}

export interface ILandingPageState {

   email: string;
   isValidEmail: boolean;
   sentEmail: boolean;
   playingAudio: boolean;
   isMobileFormFactor: boolean;
}

export class LandingPage extends React.Component<ILandingPageProps, ILandingPageState> {
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

   render(): JSX.Element {
         return (
            <div className="loginpage">
            <Helmet>
                  <title>UltraBox</title>
                  <link rel="icon" href="weightlifter-b-128x128.png" type="image/png" />
                  <link rel="shortcut icon" href="weightlifter-b-128x128.png" type="image/png" />
            </Helmet>
            <Navbar style={navbarStyle}>
               <Navbar.Brand href="/" style={navbarBrandStyle}>
                  <ParticipantBanner name="UltraBox" thumbnailUrl="weightlifter-b-128x128.png" />
               </Navbar.Brand>
               <Nav className="ml-auto">
                  <Container style={cmnNoMarginPad}>
                     <Row style={landingNavGroupStyle} className="align-items-center">
                        {this.state.isMobileFormFactor ? <div></div> : <div className='align-middle'>Sign In: </div>}
                        <Button variant="secondary" style={cmnNavButtonStyle}
                           onClick={this.goCoach.bind(this)}>Coach
                        </Button>
                        <Button variant="secondary" style={cmnNavButtonStyle}
                              onClick={this.goMember.bind(this)}>Members
                        </Button>
                     </Row>
                  </Container>
               </Nav>
            </Navbar>
            <Container style={pageStyle}>
               <Jumbotron className="align-items-center" style={landingJumbotronStyle}>
                  <Row className="align-items-top" >
                     <Col className="align-items-center" >
                        <Image width={64} height={64} src="weightlifter-boxed-b-128x128.png" />
                        <br />
                        <br />
                        <h1 style={pageHeaderStyle}>Deliver high production quality online workouts to grow new revenue for your Box and increase enjoyment for your clients.</h1>
                        <p style={pageSubStyle}>UltraBox provides online tools to help you deliver the experience of your Box to your clients when they can't be in your Box. A video, audio & digital experience tailored to delivering coached online & networked workouts. </p>
                        <br/>
                     </Col>
                  </Row>
                  <Row className="align-items-top" >
                        <Col className="align-items-center" >
                        <br />
                        <Image style={this.state.isMobileFormFactor ? landingMobileImageStyle : landingImageStyle} src="landing-video.png" />
                        <br />
                     </Col>
                  </Row>
                  <Row className="align-items-top" >
                     <Col className="align-items-center" >
                        <br />
                        <br />
                        <h1 style={pageHeaderStyle}>Key features.</h1>
                        <br />
                     </Col>
                  </Row>
                  <Row className="align-items-top" xs={1} md={3} lg={3}>
                     <Col className="align-items-left">
                        <Easel color="black" size={32} />
                        <br />
                        <p style={pageParaStyle}>Write up the workout of the day, just like you do in your Box. Your clients see it when they log in, and your coach can brief them round a virtual whiteboard at the start of the class.</p>
                        <br />
                     </Col>
                        <Col className="align-items-left">
                        <MicMute color="black" size={32} />
                        <br />
                        <p style={pageParaStyle}>Coach controls the screen & audio tracks - so clients look at & listen to what is most important, be that the whiteboard, Coach's instructions, or to see each other & listen to the music while they are working out. Coach always sees all participants.</p>
                        <br />
                     </Col>
                        <Col className="align-items-left">
                        <FileMusic color="black" size={32} />
                        <br />
                        <p style={pageParaStyle}>Play a mix of licenced, gym-suitable sounds to keep your clients moving through the workout.</p>
                        <br />
                     </Col>
                  </Row>
                  <Row className="align-items-top" xs={1} md={3} lg={3}>
                     <Col className="align-content-left">
                        <Clock color="black" size={32} />
                        <br />
                        <p style={pageParaStyle}>Start a count-down or count-up timer, just like your box.  You & your clients can see the timer throughout.</p>
                        <br />
                     </Col>
                        <Col className="align-content-left">
                        <Wallet2 color="black" size={32} />
                        <br />
                        <p style={pageParaStyle}>Cheaper than monthly subscriptions. Pay only for the time you use. No lock in. We hope you will stay, but you can leave whenever you wish.</p>
                        <br />
                     </Col>
                        <Col className="align-content-left">
                        <Binoculars color="black" size={32} />
                        <br />
                        <p style={pageParaStyle}>Focus on what you do best. UltraBox is laser focussed on coached workous. Don't waste time messing with conference call software meant for business meetings.</p>
                        <br />
                     </Col>
                  </Row>
                  <Row className="align-items-center">
                     <Col className="d-none d-md-block">
                     </Col>
                     <Col className="align-items-center">
                        <Form.Group controlId="signMeUpId">
                           <Form.Control type="email" placeholder="Enter your email here." maxLength={40} style={cmnExtraTopPad}
                              onChange={this.handleEmailChange.bind(this)}
                              isValid={this.state.isValidEmail}
                              disabled={this.state.sentEmail}
                              value={this.state.email} />
                           <Form.Text style={landingFadeExtraBtmPad}>
                              {this.state.sentEmail ? "Thank you, we will be in touch." : "We won't share your email with anyone else."}
                           </Form.Text>
                           <Button variant="secondary" disabled={!this.state.isValidEmail} style={cmnExtraBtmPad}
                              onClick={this.sendLead.bind(this)}>
                              Tell me more...
                           </Button>
                        </Form.Group>
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
