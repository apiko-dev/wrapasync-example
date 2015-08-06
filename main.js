//both


//server
if (Meteor.isServer) {
  Meteor.methods({
    queryExternalService: function (userName) {
      return 'Hello, ' + userName;
    }
  });
}

//client
if (Meteor.isClient) {
  Template.TestView.events({
    'click .send': function (event, tmpl) {
      var userName = tmpl.$('#user-name').val();

      Meteor.call('queryExternalService', userName, function (err, res) {
        var response = err && err.toString() || res;
        tmpl.$('.service-response').text(response)
      });
    }
  })
}