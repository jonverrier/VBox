if (typeof exports !== 'undefined') {

   var userModule = require('../common/person.js');
   var Person = userModule.Person;

   var expect = require("chai").expect;
}


describe("Person", function () {
   var person1, person2;
   
   beforeEach(function () {
      person1 = new Person(1, "Joe", "Joe@mail.com", "https://jo.pics.com", "1234");

      person2 = new Person(2, "Joe", "Joe@mail.com", "https://jo.pics.com", "5678");
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(person1).to.equal(person1);
      expect(person1).to.not.equal(person2);
   });
   
   it("Needs to correctly store attributes", function () {
      
      expect(person1._id).to.equal(1);      
      expect(person1.name).to.equal("Joe");
      expect(person1.email).to.equal("Joe@mail.com");
      expect(person1.thumbnailUrl).to.equal("https://jo.pics.com");
      expect(person1.lastAuthCode).to.equal("1234");
   });
   
   //it("Needs to save and restore to/from JSON", function () {
      
      //var types = new TypeRegistry();
     // var output = JSON.stringify(person1);
      //var obj = types.reviveFromJSON(output);

      //expect(person1.equals(obj)).to.equal(true);
   //});
});

