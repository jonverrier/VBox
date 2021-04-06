/*! Copyright TXPCo, 2020, 2021 */

import * as React from 'react';

import { ICommand, ICommandProcessor, ILiveDocument } from '../../core/dev/LiveInterfaces';
import { LiveWorkout} from '../../core/dev/LiveWorkout';

export interface IRemoteCoachVideoProps {
   liveWorkout: LiveWorkout;
   commandProcessor: ICommandProcessor;
}

export interface IRemoteCoachVideoState {
   isMounted: boolean;
}

export class RemoteCoachVideo extends React.Component<IRemoteCoachVideoProps, IRemoteCoachVideoState> {
   state: IRemoteCoachVideoState;

   constructor(props: IRemoteCoachVideoProps) {
      super(props);

      // watch for changes being made on our document
      props.commandProcessor.addChangeListener(this.onChange.bind(this));

      this.state = {
         isMounted: false
      };
   }

   onChange(doc: ILiveDocument, cmd?: ICommand): void {
      if (this.state.isMounted) {
      }
   }

   componentDidMount() {
      // Allow data display from master
      this.setState({ isMounted: true });
   }

   componentWillUnmount() {
      // Stop data display from master
      this.setState({ isMounted: false });
   }

   render() {
      return (
         <div>
            Video
         </div>
      );
   }
}

interface IMasterCoachVideoProps {
   liveWorkout: LiveWorkout;
   commandProcessor: ICommandProcessor;
}

interface IMasterCoachVideoState {
}

export class MasterCoachVideo extends React.Component<IMasterCoachVideoProps, IMasterCoachVideoState> {
   //member variables
   state: IMasterCoachVideoState;

   constructor(props: IMasterCoachVideoProps) {
      super(props);

   }

   render() {
      return (
         <div>
            Video
         </div>
      );
   }
}