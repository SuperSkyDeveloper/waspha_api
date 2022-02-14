const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Add user",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description:'Logged in admin'
    },
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
    contact: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.country_code) &&
          //!_.isUndefined(value.phone_number) &&
          !_.isUndefined(value.number)
        );
      },
    },
    password: {
      type: "string",
      required: true,
    },
    country_code: {
      type: "string",
      required: false,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
      isIn: ["en", "ar"],
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
      invalidRequest: {
      description: "Send invalidRequest response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/signup-request");
    sails.log(inputs);
    
    const strings = sails.config.strings[inputs.admin.language];
    const name = inputs.name;
    const email = inputs.email.toLowerCase();
    const password = inputs.password;
    const contact = inputs.contact.number.replace(/\s/g, "");
    const country_code = inputs.contact.country_code.replace(/\s/g, "");

    user = await User.findOne({ email: email });
    console.log("user:", user);
    if (user && user.deletedAt == null) {
      sails.log.warn(
        `User with email ${inputs.email} already exists, returning response`
      );
      // return exits.success({
      //   status: false,
      //   message: strings.EMAIL_ALREADY_EXIST,
      //   data: [],
      // });
      return exits.invalidRequest({
        status: false,
        message: strings.EMAIL_ALREADY_EXIST,
        data: null,
      });
    }
    user = await User.findOne({ contact: contact, country_code: country_code });

      const rec = {
            name: name,
            email: email,            
            country_code: country_code,
            contact: contact,          
          };

    if (user && user.deletedAt == null) {
      sails.log.warn(
        `user with contact ${contact} already exists, returning response`
      );
      return exits.invalidRequest({
        status: false,
        message: strings.CONTACT_ALREADY_EXIST,
        data: null,
      });
    }else{
     // delete rec.email;
    }
//sails.log({user:user});return exits.success();
    sails.log(`Encrypting user password`);
    bcrypt
      .hash(password, 12)
      .then(async (hashedPassword) => {
        sails.log(`Password encrypted, now signing user up`);
        try {
      
          rec.password = hashedPassword;
          if (inputs.language) {
            rec.language = inputs.language;
          }
         
         if(user){
           rec.deletedAt = null;
             user = await User.updateOne({id:user.id}).set(rec);
         }else{
             user = await User.create(rec).fetch();
         }
           
          

          if (user.id) {
            sails.log(`User added with email '${inputs.email}'`);
            delete user.password;
         
            return exits.success({
              status: true,
              message: strings.ADDED,
              data: user,
            });
          }
        } catch (err) {
          sails.log.error(`Exception occured: ${err}`);
          return exits.serverError(err);
          // …
        }
      })
      .catch((err) => {
        return exits.serverError(err);
      });
  },
};
