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
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'; 
import axios from 'axios';
import * as CSS from 'csstype';

// This app, other library
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';
import { Person } from '../../core/dev/Person';
import { Facility } from '../../core/dev/Facility';
import { UserFacilities } from '../../core/dev/UserFacilities';
import { DateHook } from '../../core/dev/DateHook';
import { ArrayHook } from '../../core/dev/ArrayHook';
import { PeerConnection } from '../../core/dev/PeerConnection';
import { LiveDocumentMaster, LiveDocumentRemote } from '../../core/dev/LiveDocumentCentral';
import { LiveWorkoutFactory, LiveWorkoutChannelFactoryPeer, LiveWorkout } from '../../core/dev/LiveWorkout';
import { StoredMeetingState } from '../../core/dev/LocalStore';

// This app, this component
import { ParticipantBanner, ParticipantSmall } from './ParticipantUI';
import { LandingPage } from './LandingUI';
import { MemberPage } from './MemberUI';
import { CoachPage } from './CoachUI';
import EntryPoints from './EntryPoints';

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

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

// Call static members that hook into java library
DateHook.initialise();
ArrayHook.initialise();

// This allows code to be loaded in node.js for tests, even if we dont run actual React methods
if (document !== undefined && document.getElementById !== undefined) {
   ReactDOM.render(<PageSwitcher />, document.getElementById('root'));
}