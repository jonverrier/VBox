/*! Copyright TXPCo, 2020, 2021 */

export interface IStreamable {

   readonly type: string;
   toJSON(): any;
}

export interface IStreamableFor<T> extends IStreamable {

   // TODO - figure out how to include revive(), which is static, and in C++ need macros etc to create a static 'type' object
   // https://github.com/microsoft/TypeScript/issues/34516
}
