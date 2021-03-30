/*! Copyright TXPCo, 2020, 2021 */

import * as React from 'react';

import { LiveWorkout} from '../../core/dev/LiveWorkout';

export interface IRemoteCoachVideoProps {
   liveWorkout: LiveWorkout;
}

export interface IRemoteCoachVideoState {
   isMounted: boolean;
}

export class RemoteCoachVideo extends React.Component<IRemoteCoachVideoProps, IRemoteCoachVideoState> {
   state: IRemoteCoachVideoState;

   constructor(props: IRemoteCoachVideoProps) {
      super(props);

      this.state = {
         isMounted: false
      };
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