import { User } from '/imports/api/users/users.js';
const myPostLogout = function(){
    //example redirect after logout
    FlowRouter.go('/signin');
};
const mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      // Successfully logged in
      // ...
    }
    if (state === "signUp") {
      // Successfully registered
      // ...
    }
  }
};
function myPreSubmitFunc()  { console.log("Pre:  ", arguments); }
function myPostSubmitFunc() { console.log("Post: ", arguments); }
AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,
    
    // Routing
    
    defaultTemplate: 'Auth_page',
    defaultLayout: 'App_body',
    defaultContentRegion: 'main',
    defaultLayoutRegions: {},

    // Hooks
    onLogoutHook: myPostLogout,
    onSubmitHook: mySubmitFunc,
    preSignUpHook: myPreSubmitFunc,
    postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
      inputIcons: {
          isValidating: "fa fa-spinner fa-spin",
          hasSuccess: "fa fa-check",
          hasError: "fa fa-times",
      }
    },
});

// Define these routes in a file loaded on both client and server
AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/signin'
});
AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/join'
});
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reset-password'
});

AccountsTemplates.addFields([{
    _id: "first_name",
    type: "text",
    required: true,
    displayName: "First Name",
    func: function(value) {
        //if(Meteor.isClient) {
            console.log("Firstname validation: ", value);
            
        //}
        return;
    }},{
    _id: "last_name",
    type: "text",
    required: true,
    displayName: "Last Name",
    func: function(value) {
        //if(Meteor.isClient) {
            console.log("Lastname validation: ", value);
            
        //}
        return;
    }},{
    _id: "gender",
    type: "select",
    required: true,
    displayName: "Gender",
    select: [
        {
            text: "Male",
            value: "male",
        },
        {
            text: "Female",
            value: "female",
        },
    ],
}]);
if(Meteor.isServer) {
    Accounts.onCreateUser((options, user) => {
        user.slug = options.email;
        user.updateAt = user.createdAt;
        user.MyProfile = { 
            firstName: options.profile.first_name,
            lastName: options.profile.last_name,
            gender: (options.profile.gender === "female"),
            UserType: {
                Personality: {
                    IE: {},
                    NS: {},
                    TF: {},
                    JP: {}
                },
                AnsweredQuestions: []
            },
            birthDate: undefined,
            age: undefined
        };
        user.roles = [];
        user.profile = options.profile;
        return user;
    });
    Accounts.validateNewUser(function (user) {
        var loggedInUser = Meteor.user();

        if (!loggedInUser || Roles.userIsInRole(loggedInUser, ['admin','manage-users'], Roles.GLOBAL_GROUP)) {
          // NOTE: This example assumes the user is not using groups.
          return true;
        }

        throw new Meteor.Error(403, "Not authorized to create new users");
    });
}