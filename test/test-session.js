
if (typeof exports !== 'undefined') {

   var sessionModule = require('../common/session.js');
   var Session = sessionModule.Session;

   var expect = require("chai").expect;
}

describe("Session", function () {
   var session1, session2;
   var recievedAt = new Date();
   
   beforeEach(function () {
      
      // id, email, sessionId, lastAccess 
      session1 = new Session ("madeupkey1", "account1", "jo@bloggs.com", "makeupsessionkey1", recievedAt);
      session2 = new Session ("madeupkey2", "account1", "jo@bloggs.com", "makeupsessionkey2", recievedAt);
  });

  it("Needs to compare for equality and inequality", function() {

     expect(session1.equals(session1)).to.equal(true);
     expect(session1.equals(session2)).to.equal(false);
  });

  it("Needs to correctly store attributes", function () {

     expect(session1._id).to.equal("madeupkey1");
     expect(session1.facility).to.equal("account1");
     expect(session1.email).to.equal("jo@bloggs.com");
     expect(session1.sessionId).to.equal("makeupsessionkey1");
     expect(session1.lastAccess).to.equal(recievedAt);
   });

   //it("Needs to save and restore to/from JSON", function () {
   //   
   //   var types = new TypeRegistry();
   //   var output = JSON.stringify(session1);
   //   var obj = types.reviveFromJSON(output);
      
   //   expect(session1.equals(obj)).to.equal(true);
   //});
});

