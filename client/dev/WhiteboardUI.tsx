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
import { PeerConnection } from '../../core/dev/PeerConnection';
import { ICommand, ICommandProcessor, ILiveDocument } from '../../core/dev/LiveInterfaces';
import { LiveWorkout, LiveWhiteboardCommand, LiveResultsCommand, LiveWorkoutFactory } from '../../core/dev/LiveWorkout';
import { StoredWorkoutState } from '../../core/dev/LocalStore';

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
   allowEdit: boolean;
}

interface IMasterWhiteboardState {
   workout: string;
   results: string;
}

interface IMasterWhiteboardElementProps {
   rtc: PeerConnection;
   commandProcessor: ICommandProcessor;
   liveWorkout: LiveWorkout;
   allowEdit: boolean;
   caption: string;
   placeholder: string;
   value: string;
   valueAsOf: Date;
   onChange: Function;
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

      if (props.peerConnection) {
         props.peerConnection.addRemoteDataListener(this.onRemoteData.bind(this));
      }

      var workout;

      this.state = {
         // Make copies of the strings, only change orginal via a command. 
         workout: props.liveWorkout.whiteboardText.slice(),
         results: props.liveWorkout.resultsText.slice()
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
         var text = this.state.results;

         if (!text.includes(ev2.name)) {

            // Overwrite what is there if we still have the default caption.
            if (text === LiveWorkoutFactory.defaultResultsTextRemote)
               text = '';

            // append if the name is not already in the results text.
            text = text + '\n' + ev2.name;
            let command = new LiveResultsCommand(text, this.props.liveWorkout.resultsText);
            this.props.commandProcessor.adoptAndApply(command);
         }
         this.setState({ results: text });
      }
   }

   onWorkoutChange(element: string) {

      let command = new LiveWhiteboardCommand(element, this.props.liveWorkout.whiteboardText);
      this.props.commandProcessor.adoptAndApply(command);
      // Make copies of the strings, only change orginal via a command. 
      this.setState({ workout: this.props.liveWorkout.whiteboardText.slice()});
   }

   onResultsChange(element: string) {
      let command = new LiveResultsCommand(element, this.props.liveWorkout.resultsText);
      this.props.commandProcessor.adoptAndApply(command);
      // Make copies of the strings, only change orginal via a command. 
      this.setState({ results: this.props.liveWorkout.resultsText.slice() });
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
                     value={this.state.workout} valueAsOf={new Date()}
                     onChange={this.onWorkoutChange.bind(this)}></MasterWhiteboardElement>
               </Col>
               <Col style={thinishStyle}>
                  <MasterWhiteboardElement allowEdit={this.props.allowEdit} rtc={this.props.peerConnection}
                     commandProcessor={this.props.commandProcessor}
                     liveWorkout={this.props.liveWorkout}
                     caption={'Results'} placeholder={'Type results here after the workout.'}
                     value={this.state.results} valueAsOf={new Date()}
                     onChange={this.onResultsChange.bind(this)}></MasterWhiteboardElement>
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
      this.props.onChange(this.state.value);
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

      // watch for changes being made on our document
      props.commandProcessor.addChangeListener(this.onChange.bind(this));

      this.state = {
         workoutText: props.whiteboardText,
         resultsText: props.whiteboardText
      };
   }

   onChange(doc: ILiveDocument, cmd?: ICommand) {
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