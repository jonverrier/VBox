/*! Copyright TXPCo, 2020, 2021 */

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import { TriangleDownIcon } from '@primer/octicons-react'

import * as CSS from 'csstype';

import { IStreamable } from '../../core/dev/Streamable';
import { Person } from '../../core/dev/Person';
import { Whiteboard, WhiteboardElement } from '../../core/dev/Whiteboard';
import { PeerConnection } from '../../core/dev/PeerConnection';
import { ICommand, ICommandProcessor, ILiveDocument } from '../../core/dev/LiveInterfaces';
import { LiveWorkout, LiveWhiteboardCommand } from '../../core/dev/LiveWorkout';
import { StoredWorkoutState } from './LocalStore';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
};

const thinishStyle: CSS.Properties = {
   margin: '2px', padding: '0px',
};

const thinCentredStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
   alignItems: 'center',
   verticalAlign: 'top',
   justifyContent: 'center'
};

const popdownBtnStyle: CSS.Properties = {
   margin: '0px', padding: '4px',
   fontSize: '13.333px'
};

const whiteboardStyle: CSS.Properties = {
   color: 'white', background: 'white',
   margin: '0px', padding: '0px',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat'
};

const whiteboardHeaderStyle: CSS.Properties = {
   color: 'black', background: 'white',
   fontFamily: 'Permanent Marker',
   fontSize: '40px',
   marginTop: '0px', paddingTop: '0px',
   marginBottom: '10px', paddingBottom: '0px',
   marginLeft: '0px', paddingLeft: '0px',
   marginRight: '0px', paddingRight: '0px',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat'
};

const whiteboardElementHeaderStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
   color: 'black', background: 'white',
   fontFamily: 'Permanent Marker',
   fontSize: '32px',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat'
};

const whiteboardElementBodyStyle: CSS.Properties = {
   margin: '0px', 
   paddingLeft: '8px', paddingRight: '8px',
   paddingTop: '0px', paddingBottom: '0px',
   color: 'black', background: 'white',
   fontFamily: 'Permanent Marker',
   fontSize: '20px',
   backgroundImage: 'url("board.png")',
   backgroundRepeat: 'repeat',
   minWidth: '240px', maxWidth: '*',
   whiteSpace: 'pre-wrap'
};

const blockCharStyle: CSS.Properties = {
   margin: '0px',
   paddingLeft: '8px', paddingRight: '8px',
   paddingTop: '0px', paddingBottom: '0px',
};

const fieldXSepStyle: CSS.Properties = {
   marginLeft: '8px'
};

interface IMasterWhiteboardProps {
   peerConnection: PeerConnection;
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
   whiteboardText: string;
   allowEdit: boolean;
}

interface IMasterWhiteboardState {
   haveRealWorkout: boolean;
   haveRealResults: boolean;
   workout: WhiteboardElement;
   results: WhiteboardElement;
}

const defaultMasterWorkoutText: string = 'Workout will show here - click the button above.';
const defaultMasterResultsText: string = 'Workout results will show here - click the button above.';

interface IMasterWhiteboardElementProps {
   rtc: PeerConnection;
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
   allowEdit: boolean;
   caption: string;
   placeholder: string;
   value: string;
   valueAsOf: Date;
   onchange: Function;
}

interface IMasterWhiteboardElementState {
   inEditMode: boolean;
   enableOk : boolean,
   enableCancel : boolean,
   value: string;
   valueAsOf: Date;
}

export class MasterWhiteboard extends React.Component<IMasterWhiteboardProps, IMasterWhiteboardState> {
   //member variables
   state: IMasterWhiteboardState;
   storedWorkoutState: StoredWorkoutState;

   constructor(props: IMasterWhiteboardProps) {
      super(props);

      var haveWorkout: boolean = false;

      if (props.peerConnection) {
         props.peerConnection.addRemoteDataListener(this.onRemoteData.bind(this));
      }

      this.storedWorkoutState = new StoredWorkoutState();
      var workout;

      // Use cached copy of the workout if there is one
      var storedWorkout = this.storedWorkoutState.loadWorkout();
      if (storedWorkout.length > 0) {
         haveWorkout = true;
         workout = new WhiteboardElement(storedWorkout);
      } else
         workout = new WhiteboardElement(defaultMasterWorkoutText);

      var results = new WhiteboardElement(defaultMasterResultsText);

      this.state = {
         haveRealWorkout: haveWorkout,
         haveRealResults: false,
         workout: workout,
         results: results
      };
   }

   componentDidMount() {
   }

   componentWillUnmount() {
   }

   onRemoteData(ev: IStreamable) {
      var ev2 = ev as Person;

      // By convention, new joiners broadcast a 'Person' object
      if (ev.type === Person.__type) {

         // Add the new participant to the Results board element
         var text = this.state.results.text;

         if (text === defaultMasterResultsText) {
            // Overrwite contents if its the first participant
            text = ev2.name;
         }
         else 
         if (!text.includes(ev2.name) ) {
            // append if the name is not already in the box. Can get double joins if they refresh the browser or join from multiple devices. 
            text = text + '\n' + ev2.name;
         }
         this.setState({ haveRealResults: true, results: new WhiteboardElement (text) });

         this.forceUpdate(() => {
            // Send them the whole contents of the board
            var board = new Whiteboard(this.state.workout, this.state.results);
            this.props.peerConnection.broadcast(board);
         });
      }
   }

   onworkoutchange(element: WhiteboardElement) {

      let command = new LiveWhiteboardCommand(element.text + ' from doc2', this.props.liveWorkout.whiteboardText);
      this.props.commandProcessor.adoptAndApply(command);

      this.setState({ haveRealWorkout: true, workout: element });
      var board = new Whiteboard(element, this.state.results);
      this.props.peerConnection.broadcast(board);

      // save in local cache
      this.storedWorkoutState.saveWorkout(element.text);
   }

   onresultschange(element: WhiteboardElement) {
      this.setState({ haveRealResults: true, results: element });
      var board = new Whiteboard(this.state.workout, element);
      this.props.peerConnection.broadcast(board);
   }

   render() {
      return (
         <div style={whiteboardStyle}>
            <Row style={thinStyle}>
               <Col style={whiteboardHeaderStyle}>
                  {((new Date()) as any).getWeekDay() /* Uses the extra method in DateHook */}
               </Col>
            </Row>
            <Row style={thinStyle}>
               <Col style={thinishStyle}>
                  <MasterWhiteboardElement allowEdit={this.props.allowEdit} rtc={this.props.peerConnection}
                     commandProcessor={this.props.commandProcessor}
                     liveWorkout={this.props.liveWorkout}
                     caption={'Workout'} placeholder={'Type the workout details here.'}
                     value={this.state.workout.text} valueAsOf={new Date()}
                     onchange={this.onworkoutchange.bind(this)}></MasterWhiteboardElement>
               </Col>
               <Col style={thinishStyle}>
                  <MasterWhiteboardElement allowEdit={this.props.allowEdit} rtc={this.props.peerConnection}
                     commandProcessor={this.props.commandProcessor}
                     liveWorkout={this.props.liveWorkout}
                     caption={'Results'} placeholder={'Type results here after the workout.'}
                     value={this.state.results.text} valueAsOf={new Date()}
                     onchange={this.onresultschange.bind(this)}></MasterWhiteboardElement>
               </Col>
            </Row>
         </div>
      );
   }
}

class MasterWhiteboardElement extends React.Component<IMasterWhiteboardElementProps, IMasterWhiteboardElementState> {
   //member variables
   state: IMasterWhiteboardElementState;

   constructor(props: IMasterWhiteboardElementProps) {
      super(props);

      this.state = {
         inEditMode: false,
         enableOk: false,
         enableCancel: false,
         value: props.value,
         valueAsOf: new Date()
      };

   }

   componentDidMount() {
   }

   componentWillUnmount() {
   }

   processChange(value: string) {
      var enableOk: boolean;
      var enableCancel: boolean;

      if (value.length > 0) {
         this.state.value = value;
         enableOk = true;
         enableCancel = true;
      } else {
         this.state.value = "";
         enableOk = false;
         enableCancel = false;
      }

      if (!this.props.allowEdit) {
         enableOk = false;
      }
      this.setState({ enableOk: enableOk, enableCancel: enableCancel, valueAsOf: new Date() });
   }

   processSave() {
      this.state.enableCancel = this.state.enableOk = false;
      this.props.onchange(new WhiteboardElement(this.state.value));
      this.setState({ inEditMode: false, enableOk: this.state.enableOk, enableCancel: this.state.enableCancel });
   }

   processCancel() {
      this.setState({ inEditMode: false });
   }

   latestValue() {
      // if latest value was saved from local edit, use it, else the property has been updated, so should be used. 
      if (this.state.valueAsOf.getTime() > this.props.valueAsOf.getTime())
         return this.state.value;
      else
         return this.props.value;
   }

   render() {
      return (
         <div>
            <Row style={thinCentredStyle}>
               <p style={whiteboardElementHeaderStyle}>{this.props.caption}</p><p style={blockCharStyle}></p>
               <Button style={popdownBtnStyle} variant="secondary" size="sm" onClick={() => this.setState({ inEditMode: !this.state.inEditMode })}>
                  <TriangleDownIcon />
               </Button>
            </Row>      
            <Row style={thinStyle}>
            <Collapse in={this.state.inEditMode}>
               <div>
                  <Form>
                     <Form.Group controlId="elementFormId">
                        <Form.Control as="textarea" style={fieldXSepStyle}
                              placeholder={this.props.placeholder} cols={60} maxLength={1023} minLength={0}
                              value={this.latestValue()}
                           onChange={(ev) => { this.processChange(ev.target.value) }} />
                     </Form.Group>
                     <Form.Row style={{ textAlign: 'center' }}>
                        <p style={blockCharStyle}></p>
                        <Button variant="secondary" disabled={!this.state.enableOk} className='mr'
                           onClick={this.processSave.bind(this)}>Save</Button>
                        <p style={blockCharStyle}></p>
                        <Button variant="secondary" disabled={!this.state.enableCancel}
                           onClick={this.processCancel.bind(this)}>Cancel</Button>
                     </Form.Row>
                  </Form>
               </div>
               </Collapse>
            </Row>
            <Row style={thinStyle}>
               <p style={whiteboardElementBodyStyle}>{this.props.value}</p>
            </Row>
         </div>
      );
   }
}

export interface IRemoteWhiteboardProps {
   rtc: PeerConnection;
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
   whiteboardText: string;
}

interface IRemoteWhiteboardState {
   workoutText: string;
   resultsText: string;
}

interface IRemoteWhiteboardElementProps {
   rtc: PeerConnection;
   caption: string;
   value: string;
}

interface IRemoteWhiteboardElementState {
   caption: string;
}

export class RemoteWhiteboard extends React.Component<IRemoteWhiteboardProps, IRemoteWhiteboardState> {
   //member variables
   state: IRemoteWhiteboardState;

   constructor(props: IRemoteWhiteboardProps) {
      super(props);

      // watch for changes being made to on our document
      props.commandProcessor.addChangeListener(this.onChange.bind(this));

      this.state = {
         workoutText: props.whiteboardText,
         resultsText: props.whiteboardText
      };
   }

   onChange(cmd: ICommand, doc: ILiveDocument) {
      if (doc.type === LiveWorkout.__type) {
         var workout: LiveWorkout = doc as LiveWorkout;

         if (! (this.state.workoutText === workout.whiteboardText)) {
            this.setState({ workoutText: workout.whiteboardText });
         }
         if (!(this.state.resultsText === workout.resultsText)) {
            this.setState({ resultsText: workout.resultsText });
         }
      }
   }

   render() {
      return (
         <div style={whiteboardStyle}>
            <Row style={thinStyle}>
               <Col style={whiteboardHeaderStyle}>
                  {((new Date()) as any).getWeekDay() /* Uses the extra method in DateHook */}
               </Col>
            </Row>
            <Row style={thinStyle}>
               <Col style={thinStyle}>
                  <RemoteWhiteboardElement rtc={this.props.rtc}
                     caption={'Workout'}
                     value={this.state.workoutText}> </RemoteWhiteboardElement>
               </Col>
               <Col style={thinStyle}>
                  <RemoteWhiteboardElement rtc={this.props.rtc}
                     caption={'Results'}
                     value={this.state.resultsText}> </RemoteWhiteboardElement>
               </Col>
            </Row>
         </div>
      );
   }
}

class RemoteWhiteboardElement extends React.Component<IRemoteWhiteboardElementProps, IRemoteWhiteboardElementState> {
   state: IRemoteWhiteboardElementState;

   constructor(props: IRemoteWhiteboardElementProps) {
      super(props);

      this.state = {
         caption: props.caption
      };
   }

   render() {
      return (
         <div>
            <Row style={thinCentredStyle}>
               <p style={whiteboardElementHeaderStyle}>{this.state.caption}</p><p style={blockCharStyle}></p>
            </Row>
            <Row style={thinStyle}>
               <p style={whiteboardElementBodyStyle}>{this.props.value}</p>
            </Row>
         </div>
      );
   }
}