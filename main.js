//both
GreentingsJournal = new Mongo.Collection('greetings_journal');

//server
if (Meteor.isServer) {
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
      MyExternalEchoService.sayHelloToUser(userName, function (err, res) {
        if (err) {
          console.log(err)
        } else {
          GreentingsJournal.insert({message: res})
        }
      });
    }
  });
}

//client
if (Meteor.isClient) {
  Template.TestView.helpers({
    greetings: function () {
      return GreentingsJournal.find();
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