async function getUser(user_id, input_obj) {
  loaded_user = await User.findOne(user_id);
  if (loaded_user.country_code) {
    loaded_user.currency_code = await sails.helpers.general.attachCountry(
      loaded_user.id,
      loaded_user.country_code,
      global.ROLE.USER
    );
  }

  loaded_user["is_approved"] = loaded_user.status == 1 ? true : false;
  delete loaded_user.password;
  delete loaded_user.status;
  user = await sails.helpers.jwt.generateToken.with({
    user: { ...loaded_user },
  });

  user.country = await sails.helpers.general.getCountry(
    user.id,
    global.ROLE.USER
  );
  user.country = user.country.country_code;
  if (!_.isUndefined(input_obj.language) && !_.isNull(input_obj.language)) {
    await sails.helpers.general.changeLanguage(
      user.id,
      input_obj.language.toLowerCase(),
      global.ROLE.USER
    );
    user.language = input_obj.language;
  }
  let rc_data = await sails.helpers.rocketChat.manageUser(
    user.id,
    global.rc_common_password,
    global.ROLE.USER
  );
  if (rc_data && !_.isUndefined(rc_data.rc_id)) {
    user.rc_id = rc_data.rc_id;
    user.rc_username = rc_data.rc_username;
    user.rc_auth_token = rc_data.rc_auth_token;

    let avatar = user.avatar
      ? user.avatar
      : "https://waspha.s3.amazonaws.com/users/D3oUbepki2.png";

    await sails.helpers.rocketChat.setAvatar(
      user.rc_id,
      user.rc_auth_token,
      avatar
    );
  }

  user.avg_rating = await sails.helpers.general.getAvgRating(
    user.id,
    global.ROLE.USER
  );
  if (!user.referral_code) {
    user.referral_code = await sails.helpers.general.getReferralCode(
      global.ROLE.USER
    );
    await User.updateOne({ id: user.id }).set({
      referral_code: user.referral_code,
    });
  }
  //#region verified & unverified
  user.verified = {};
  user.unverified = {};

  if (user.unverified_email) {
    user.unverified.email = user.unverified_email;
  }
  if (user.unverified_contact) {
    user.unverified.contact = {
      country_code: user.unverified_country_code,
      number: user.unverified_contact,
    };
  }

  if (user.is_email_verified) {
    user.verified.email = user.email;
  } else {
    user.unverified.email = user.email;
  }
  if (user.is_contact_verified) {
    user.verified.contact = {
      country_code: user.country_code,
      number: user.contact,
    };
  } else {
    user.unverified.contact = {
      country_code: user.country_code,
      number: user.contact,
    };
  }
  return user;
}
async function getDriver(driver_id, input_obj) {
  let loadedDriver = await Driver.findOne({ id: driver_id });
  if (input_obj.location) {
    rec.lat = input_obj.location.lat;
    rec.lng = input_obj.location.lng;
    await Driver.updateOne({ id: loadedDriver.id }).set({
      lat: input_obj.location.lat,
      lng: input_obj.location.lng,
    });
  }
  loadedDriver["is_approved"] = Boolean(loadedDriver.status);
  delete loadedDriver.password;
  delete loadedDriver.status;
  driver = await sails.helpers.jwt.generateToken.with({
    user: { ...loadedDriver },
  });

  let temp = driver;
  driver = {};
  driver.id = temp.id;
  driver.name = temp.name;

  //#region verified & unverified
  driver.verified = {};
  driver.unverified = {};

  if (temp.unverified_email) {
    driver.unverified.email = temp.unverified_email;
  }
  if (temp.unverified_contact) {
    driver.unverified.contact = {
      country_code: temp.unverified_country_code,
      number: temp.unverified_contact,
    };
  }

  if (temp.is_email_verified) {
    driver.verified.email = temp.email;
  } else {
    driver.unverified.email = temp.email;
  }
  if (temp.is_contact_verified) {
    driver.verified.contact = {
      country_code: temp.country_code,
      number: temp.contact,
    };
  } else {
    driver.unverified.contact = {
      country_code: temp.country_code,
      number: temp.contact,
    };
  }
  //#endregion verified & unverified

  if (loadedDriver.country_code) {
    driver.currency_code = await sails.helpers.general.attachCountry(
      loadedDriver.id,
      loadedDriver.country_code,
      global.ROLE.DRIVER
    );
  }
  driver.email = {
    address: temp.email,
    is_verified: true,
  };
  driver.contact = {
    country_code: temp.country_code,
    number: temp.contact,
    is_verified: true,
  };
  driver.vehicle = {
    id: temp.vehicle_id,
    name: temp.vehicle_name,
    number_plate: temp.number_plate,
    is_verified: true,
  };
  driver.avatar = temp.avatar;
  driver.gender = temp.gender;
  driver.language = temp.language;
  driver.is_online = temp.is_online;
  driver.location = {
    address: temp.address,
    lat: temp.lat,
    lng: temp.lng,
  };
  driver.type = temp.type;
  driver.store_id - temp.store_id;
  driver.delivery_mode_id = temp.delivery_mode_id;
  driver.is_approved = temp.is_approved;
  driver.zone_option = temp.zone_option;
  driver.is_zone_selected = Boolean(temp.is_zone_selected);
  driver.free_zone_radius = temp.free_zone_radius;
  driver.fixed_zone_id = null;
  fixed_zone = await Driver_fixed_zone.find({
    driver_id: driver.id,
  }).limit(1);
  if (fixed_zone.length) {
    driver.fixed_zone_id = fixed_zone[0].fixed_zone_id;
  }
  driver.refresh_token = temp.refresh_token;
  driver.access_token = temp.access_token;
  driver.country = await sails.helpers.general.getCountry(
    driver.id,
    global.ROLE.DRIVER
  );
  driver.country = driver.country.country_code;

  driver.loyalty_points = temp.loyalty_points;
  if (!_.isUndefined(input_obj.language) && !_.isNull(input_obj.language)) {
    await sails.helpers.general.changeLanguage(
      driver.id,
      input_obj.language.toLowerCase(),
      global.ROLE.DRIVER
    );
    driver.language = input_obj.language;
  }

  let rc_data = await sails.helpers.rocketChat.manageUser(
    driver.id,
    "123456",
    global.ROLE.DRIVER
  );
  if (rc_data && !_.isUndefined(rc_data.rc_id)) {
    driver.rc_id = rc_data.rc_id;
    driver.rc_username = rc_data.rc_username;
    driver.rc_auth_token = rc_data.rc_auth_token;

    let avatar = driver.avatar
      ? driver.avatar
      : "https://waspha.s3.amazonaws.com/users/D3oUbepki2.png";

    await sails.helpers.rocketChat.setAvatar(
      driver.rc_id,
      driver.rc_auth_token,
      avatar
    );
  }
  driver.avg_rating = await sails.helpers.general.getAvgRating(
    driver.id,
    global.ROLE.DRIVER
  );
  if (!driver.referral_code) {
    driver.referral_code = await sails.helpers.general.getReferralCode(
      global.ROLE.DRIVER
    );
    await Driver.updateOne({ id: driver.id }).set({
      referral_code: driver.referral_code,
    });
  }
  //sails.log({ rc_data: rc_data });
  driver.fixed_zones = await sails.helpers.getFixedZones();
  return driver;
}

async function getVendor(vendor_id, input_obj) {
  let loadedVendor = await Vendor.findOne({ id: vendor_id });
  if (loadedVendor.country_code) {
    loadedVendor.currency_code = await sails.helpers.general.attachCountry(
      loadedVendor.id,
      loadedVendor.country_code,
      global.ROLE.VENDOR
    );
  }

  loadedVendor["is_approved"] = loadedVendor.status == 1 ? true : false;
  loadedVendor["message"] = await sails.helpers.getMessageFromAdmin(
    loadedVendor.id,
    global.ROLE.VENDOR
  );
  delete loadedVendor.password;
  delete loadedVendor.status;
  vendor = await sails.helpers.jwt.generateToken.with({
    user: { ...loadedVendor },
  });

  vendor.country = await sails.helpers.general.getCountry(
    vendor.id,
    global.ROLE.VENDOR
  );
  vendor.country = vendor.country.country_code;

  if (!_.isUndefined(input_obj.language) && !_.isNull(input_obj.language)) {
    await sails.helpers.general.changeLanguage(
      vendor.id,
      input_obj.language.toLowerCase(),
      global.ROLE.VENDOR
    );
    vendor.language = input_obj.language;
  }
  let rc_data = await sails.helpers.rocketChat.manageUser(
    vendor.id,
    "123456",
    global.ROLE.VENDOR
  );
  if (rc_data && !_.isUndefined(rc_data.rc_id)) {
    vendor.rc_id = rc_data.rc_id;
    vendor.rc_username = rc_data.rc_username;
    vendor.rc_auth_token = rc_data.rc_auth_token;

    let avatar = vendor.avatar
      ? vendor.avatar
      : "https://waspha.s3.amazonaws.com/users/D3oUbepki2.png";

    await sails.helpers.rocketChat.setAvatar(
      vendor.rc_id,
      vendor.rc_auth_token,
      avatar
    );
  }

  if (!vendor.referral_code) {
    vendor.referral_code = await sails.helpers.general.getReferralCode(
      global.ROLE.VENDOR
    );
    await Vendor.updateOne({ id: vendor.id }).set({
      referral_code: vendor.referral_code,
    });
  }
  vendor.is_form_submitted = false;
  let store = await Store.find({ vendor_id: vendor.id }).limit(1);
  if (store[0]) {
    vendor.is_form_submitted = true;
    vendor.avg_rating = await sails.helpers.getStoreAvgRating(store[0].id);
  }
  //#region verified & unverified
  vendor.verified = {};
  vendor.unverified = {};

  if (vendor.unverified_email) {
    vendor.unverified.email = vendor.unverified_email;
  }
  if (vendor.unverified_contact) {
    vendor.unverified.contact = {
      country_code: vendor.unverified_country_code,
      number: vendor.unverified_contact,
    };
  }

  if (vendor.is_email_verified) {
    vendor.verified.email = vendor.email;
  } else {
    vendor.unverified.email = vendor.email;
  }
  if (vendor.is_contact_verified) {
    vendor.verified.contact = {
      country_code: vendor.country_code,
      number: vendor.contact,
    };
  } else {
    vendor.unverified.contact = {
      country_code: vendor.country_code,
      number: vendor.contact,
    };
  }
  //#endregion verified & unverified
  return vendor;
}
module.exports = {
  friendlyName: "Get loggedin user",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    input_obj: {
      type: "ref",
      required: true,
    },
    role: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Loggedin user",
    },
  },

  fn: async function (inputs, exits) {
    let user = null;
    switch (inputs.role) {
      case global.ROLE.USER: {
        user = await getUser(inputs.id, inputs.input_obj);
        break;
      }
      case global.ROLE.DRIVER: {
        user = await getDriver(inputs.id, inputs.input_obj);
        break;
      }
      case global.ROLE.VENDOR: {
        user = await getVendor(inputs.id, inputs.input_obj);
        break;
      }
    }
    return exits.success(user);
  },
};
