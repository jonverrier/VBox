/*! Copyright TXPCo, 2020, 2021 */

import { LoggerFactory, LoggerType } from './Logger';
import { Person } from './Person';
import { Facility } from './Facility';
import { TypeRegistry } from './Types';
import { DateWithDays } from './Dates'
import { Queue, QueueString, QueueNumber, QueueAny } from './Queue'
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate, CallLeaderResolve, CallKeepAlive } from './Call'
import { SignalMessage } from './Signal';
import { UserFacilities } from './UserFacilities';
import { Whiteboard, WhiteboardElement } from './Whiteboard';
import { GymClockDurationEnum, GymClockMusicEnum, GymClockStateEnum, GymClockActionEnum, GymClockSpec, GymClockAction, GymClockState } from './GymClock'

var EntryPoints = {
   LoggerFactory: LoggerFactory,
   LoggerType: LoggerType,
   TypeRegistry: TypeRegistry,
   Person: Person,
   Facility: Facility,
   DateWithDays: DateWithDays,
   Queue: Queue,
   QueueString: QueueString,
   QueueNumber: QueueNumber,
   QueueAny: QueueAny,
   CallParticipation: CallParticipation,
   CallOffer: CallOffer,
   CallAnswer: CallAnswer,
   CallIceCandidate: CallIceCandidate,
   CallLeaderResolve: CallLeaderResolve,
   CallKeepAlive: CallKeepAlive,
   SignalMessage: SignalMessage,
   UserFacilities: UserFacilities,
   Whiteboard: Whiteboard,
   WhiteboardElement: WhiteboardElement,
   GymClockDurationEnum: GymClockDurationEnum,
   GymClockMusicEnum: GymClockMusicEnum,
   GymClockStateEnum: GymClockStateEnum,
   GymClockActionEnum: GymClockActionEnum,
   GymClockSpec: GymClockSpec,
   GymClockAction: GymClockAction,
   GymClockState: GymClockState

};

export default EntryPoints;




