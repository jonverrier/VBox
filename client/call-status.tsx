/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

declare var require: any

import * as React from 'react';
 
// This app
import { PartySmall } from './party';
import { FourStateRagEnum } from '../common/enum.js';
import { Rtc } from './rtc';

interface IServerConnectionStatusProps {
   rtc: Rtc;
}

interface IServerConnectionStatusState {
   status: any;
}

export class ServerConnectionStatus extends React.Component<IServerConnectionStatusProps, IServerConnectionStatusState> {

   constructor(props: IServerConnectionStatusProps) {
      super(props);
      if (props.rtc)
         props.rtc.onserverconnectionstatechange = this.onServerConnectionStateChange.bind(this);
      this.state = { status: FourStateRagEnum.Indeterminate };
   }

   onServerConnectionStateChange(status) {
      this.setState({ status: status });
   }

   render() {
      switch (this.state.status) {
         case FourStateRagEnum.Green:
            return <PartySmall name={'Connected to server.'} thumbnailUrl={'circle-black-green-128x128.png'} />;
         case FourStateRagEnum.Amber:
            return <PartySmall name={'Trying to re-connect to the server ...'} thumbnailUrl={'circle-black-yellow-128x128.png'} />;
         case FourStateRagEnum.Red:
            return <PartySmall name={'Sorry, experiencing issues connecting to the server.'} thumbnailUrl={'circle-black-red-128x128.png'} />;
         case FourStateRagEnum.Indeterminate:
         default:
            return <PartySmall name={'Connecting to server ...'} thumbnailUrl={'circle-black-grey-128x128.png'} />;
      }
   }
}

