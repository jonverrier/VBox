/*! Copyright TXPCo, 2020, 2021 */


export interface IStreamable<T> {
   readonly type: string;
   toJSON(): any;

   // TODO - figure out how to include revive(), which is static
   // https://github.com/microsoft/TypeScript/issues/34516
}
