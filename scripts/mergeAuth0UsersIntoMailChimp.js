'use strict';

var mergeAuth0UsersIntoMailChimp = function (config, mailchimp) {
  return function (context, callback) {
    // Upload users (add new or update existing ones)

    var listId = context.mailChimpList.id;
    var users = context.auth0Users;

    mailchimp.lists_batch_subscribe({
      id: listId,
      batch: users.map(function (user) {
        var firstName = user.given_name || '';
        var lastName = user.family_name || '';

        if(user.user_metadata) {
          firstName = user.user_metadata.firstName;
          lastName = user.user_metadata.firstName;
        }
        
        return {
          email: {
            email: user.email
          },
          email_type: 'text',
          merge_vars: {
            'FNAME': firstName,
            'LNAME': lastName
          }
        };
      }),
      double_optin: false,
      update_existing: true,
      replace_interests: true
    }, function (err, res) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      console.log('Batch List update completed successfully');
      return callback(null, context)
    });
  };
};

module.exports = mergeAuth0UsersIntoMailChimp;
