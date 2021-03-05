/*! Copyright TXPCo, 2020, 2021 */

export class ClientUrl {

   private url: URL;

   constructor(url: string) {

      // instantiate a new URL with the settings defined above
      this.url = new URL(url);
   }

   queryParam(key: string): string {

      let search = (this.url).search;
      let params = (this.url).searchParams;
      let value = params.get(key);

      return value;
   }
}





