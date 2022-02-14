module.exports = {
  friendlyName: "Calculate loyalty points",

  description: "",

  inputs: {
    role: {
      type: "string",
      required: true,
    },
    based_on: {
      type: "string",
      required: true,
      isIn: ["total", "rating", "waspha_commission"],
    },
    value: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper calculate-loyalty-points");
    sails.log(inputs);
    let role = inputs.role;
    let based_on = inputs.based_on;
    let value = inputs.value;
    let loyalty_points = 0;
    switch (role) {
      case global.ROLE.USER: {
        switch (based_on) {
          case "total": {
            if (value > 0 && value < 10) {
              loyalty_points = 1;
            } else if (value >= 10 && value <= 30) {
              loyalty_points = 2;
            } else if (value > 30 && value <= 70) {
              loyalty_points = 20;
            } else if (value > 70 && value <= 100) {
              loyalty_points = 80;
            } else if (value > 100 && value <= 5000) {
              loyalty_points = 200;
            } else {
              loyalty_points = 500;
            }
            break;
          }
          case "rating": {
            value = inputs.value;
            if (value >= 2 && value < 3) {
              loyalty_points = 2;
            } else if (value >= 3 && value <= 4) {
              loyalty_points = 3;
            } else if (value == 5) {
              loyalty_points = 10;
            }
            break;
          }
        }
        break;
      }
      case global.ROLE.VENDOR: {
        switch (based_on) {
          case "waspha_commission": {
            if (value > 0.1 && value < 10) {
              loyalty_points = 2;
            } else if (value >= 10 && value <= 15) {
              loyalty_points = 3;
            } else {
              loyalty_points = 10;
            }
            break;
          }
          case "rating": {
            value = inputs.value;
            if (value >= 2 && value < 3) {
              loyalty_points = 2;
            } else if (value >= 3 && value <= 4) {
              loyalty_points = 3;
            } else if (value >= 4.5 && value <= 5) {
              loyalty_points = 10;
            }
            break;
          }
        }
        break;
      }
      case global.ROLE.DRIVER: {
        switch (based_on) {
          case "rating": {
            value = inputs.value;
            if (value >= 2 && value < 3) {
              loyalty_points = 2;
            } else if (value >= 3 && value <= 4) {
              loyalty_points = 3;
            } else if (value == 5) {
              loyalty_points = 10;
            }
            break;
          }
        }
        break;
      }
    }

    return exits.success(loyalty_points);
  },
};
