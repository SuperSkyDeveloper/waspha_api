/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on any of these options, check out:
 * https://sailsjs.com/config/globals
 */

global.rc_common_password = "123456";
global.number_of_revisions = 3;
global.strings = require("./strings").strings;
global.notification = require("./strings").notification;
global.STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  ASSIGNED: "assigned",
  ASSIGNED_ONLINE: "assigned_online",
  ASSIGNED_OFFLINE: "assigned_offline",
  ASSIGNED_WASPHA: "assigned_waspha",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DELETED: "deleted",
  CONFIRMATION_PENDING: "confirmation_pending",
  AT_PICKUP: "at_pickup",
  PICKED_UP: "picked_up",
  DELIVERY_STARTED: "delivery_started",
  AT_DELIVERY: "at_delivery",
  DELIVERY_CONFIRMED: "delivery_confirmed",
  PAYMENT_RECEIVED: "payment_received",
  DELIVERED: "delivered",
  REQUIRE_QUEUE: "require_queue",
  QUEUE_STOPPED: "queue_stopped",
  EXPIRED: "expired",
  CLOSED: "closed",
  CURRENT: "current",
  UPCOMING: "upcoming",
  PAST: "past",
  PREPARED: "prepared",
  USER_APPROVAL_PENDING: "user_approval_pending",
};

global.ROLE = {
  USER: "user",
  DRIVER: "driver",
  VENDOR: "vendor",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

global.DRIVER_TYPE = {
  ONLINE: "online",
  OFFLINE: "offline",
  WASPHA_EXPRESS: "waspha_express",
  ALL: "all",
};
global.DRIVERY_MODE = {
  ONLINE: "online",
  OFFLINE: "offline",
  WASPHA_EXPRESS: "waspha_express",
};
global.DRIVER_STATUS = {
  0: "pending",
  1: "approved",
  2: "rejected",
};
global.ZONE_OPTION = {
  FIXED_ZONE: "fixed_zone",
  FREE_ZONE: "free_zone",
  ALL: "all",
};

global.RFP_TYPE = {
  DELIVERY: "delivery",
  PICKUP: "pickup",
  DESCRIPTION: {
    delivery: "Delivery",
    pickup: "Pickup",
  },
};

global.PAYMENT_METHOD = {
  WALLET: "wallet",
  CARD: "card",
  CASH_ON_DELIVERY: "cash_on_delivery",
  DESCRIPTION: {
    wallet: "Wallet",
    card: "Card",
    cash_on_delivery: "Cash on delivery",
  },
};

global.PROMO_CODE_TYPE = {
  GENERAL: "general",
  SPECIFIC: "specific",
};
global.PROMO_APPLY_ON = {
  SUBTOTAL: "subtotal",
  TOTAL: "total",
  WASPHA_FEE: "waspha_fee_amount",
  DELIVERY_FEE: "delivery_fee",
};
global.ORDER_TYPE = {
  NORMAL: "normal",
  TRADITIONAL: "traditional",
};
global.FEE_TYPE = {
  FIXED: "fixed",
  PERCENTAGE: "percentage",
};
global.AD_TYPE = {
  popup_ad: "popup_ad",
  PRIZE_AD: "prize_ad",
  NOTIFICATION_AD: "notification_ad",
  DESCRIPTION: {
    popup_ad: "Popup Ad",
    PRIZE_AD: "Prize Ad",
    NOTIFICATION_AD: "Notification Ad",
  },
};

module.exports.globals = {
  status: {
    pending: "pending",
    accepted: "accepted",
    rejected: "rejected",
    assigned: "assigned",
    completed: "completed",
    cancelled: "cancelled",
  },
  order: {
    type: {
      delivery: "delivery",
      pickup: "pickup",
    },
  },
  vendor_notifictions: {},

  /****************************************************************************
   *                                                                           *
   * Whether to expose the locally-installed Lodash as a global variable       *
   * (`_`), making  it accessible throughout your app.                         *
   *                                                                           *
   ****************************************************************************/

  _: require("@sailshq/lodash"),
  "process.env": require("dotenv").config({ path: ".env" }),

  /****************************************************************************
   *                                                                           *
   * This app was generated without a dependency on the "async" NPM package.   *
   *                                                                           *
   * > Don't worry!  This is totally unrelated to JavaScript's "async/await".  *
   * > Your code can (and probably should) use `await` as much as possible.    *
   *                                                                           *
   ****************************************************************************/

  async: false,

  /****************************************************************************
   *                                                                           *
   * Whether to expose each of your app's models as global variables.          *
   * (See the link at the top of this file for more information.)              *
   *                                                                           *
   ****************************************************************************/

  models: true,

  /****************************************************************************
   *                                                                           *
   * Whether to expose the Sails app instance as a global variable (`sails`),  *
   * making it accessible throughout your app.                                 *
   *                                                                           *
   ****************************************************************************/

  sails: true,
};
