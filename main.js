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
      var onGotDataCb = Meteor.bindEnvironment(function (err, res) {
        if (err) {
          console.log(err);
        } else {
          GreentingsJournal.insert({message: res, createdAt: new Date()});
        }
      });
      MyExternalEchoService.sayHelloToUser(userName, onGotDataCb);
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