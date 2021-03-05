/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Login architecture:
// LoginInterfaces - defines abstract interfaces for LoginProvider, LoginData, ...
// LoginMeetingCode - helper class to encapsulate validating a meeting code
// LonginMember - login classes to log members in with just meeting code and name
// LoginOauth - login via Oath, currently facebook.

// This app, external components
import { Person } from '../../core/dev/Person';

export enum ELoginType {
   StrongLogin,
   MemberViaMeetingCode
}

export interface ILoginData {
   magicNumber(): number;
   isValid(): boolean;
   onDataReadiness(isSuccessful: boolean): void;
}

export interface ILoginProvider {
   load(): void;
   setLoginData(loginData: ILoginData): void;
   testLogin(): boolean;
   login (fromUserClick?: boolean) : void;
   logout () : void;
   onLoginReadiness(isSuccessful: boolean): void;
   onLoginResult (isSuccessful: boolean): void;
}
