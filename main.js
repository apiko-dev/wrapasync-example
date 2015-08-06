//both
GreentingsJournal = new Mongo.Collection('greetings_journal');

//server
if (Meteor.isServer) {

  //npm package or smart package that wraps npm package
  MyExternalEchoService = {
    sayHelloToUser: function (userName, onResultCb) {
      var processName = function () {
        var helloMessage = 'Hello, ' + userName;
        onResultCb(null, helloMessage);
      };

      setTimeout(processName, 1000);
    }
  };

  Meteor.methods({
    queryExternalService: function (userName) {
      var serviceFunc = MyExternalEchoService.sayHelloToUser;

      var syncServiceFunc = Meteor.wrapAsync(serviceFunc);

      //call our service in synchronous manner
      var greetingMessage = syncServiceFunc(userName);

      GreentingsJournal.insert({message: greetingMessage, createdAt: new Date()});

      return greetingMessage;
    }
  });
}

//client
if (Meteor.isClient) {
  Template.TestView.helpers({
    greetings: function () {
      return GreentingsJournal.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.TestView.events({
    'click .send': function (event, tmpl) {
      var userName = tmpl.$('#user-name').val();

      Meteor.call('queryExternalService', userName, function (err, res) {
        if (err) {
          alert(err)
        }
      });
    }
  })
}