/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Login architecture:
// LoginInterfaces - defines abstract interfaces for LoginProvider, LoginData, ...


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
   setLoginData (loginData: ILoginData) : void;
   login (fromUserClick: boolean);
   logout ();
   onLoginReadiness(isSuccessful: boolean): void;
   onLoginResult (isSuccessful: boolean): void;
}
