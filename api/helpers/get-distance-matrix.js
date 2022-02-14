var distance = require("google-distance-matrix");
module.exports = {
  friendlyName: "Get distance matrix",

  description: "",

  inputs: {
    origin: {
      type: "ref",
      required: true,
    },
    destination: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Distance matrix",
    },
  },

  fn: async function (inputs, exits) {
    try {
      let origin = inputs.origin;
      let destination = inputs.destination;
      // dist = geolib.getDistance(
      //   { latitude: 24.9176, longitude: 67.097 },
      //   { latitude: 24.94307, longitude: 67.09177 }
      // );
      // sails.log({ dist, km: dist / 1000 });

      origins = [`${origin.lat}, ${origin.lng}`];
      destinations = [`${destination.lat}, ${destination.lng}`];
      //sails.log({ origins, destinations });
      result = function () {
        return new Promise((resolve, reject) => {
          distance.matrix(origins, destinations, function (err, distances) {
            if (err) {
              reject(err);
            }
            if (!distances) {
              reject("no distances");
            }
            if (
              !_.isUndefined(distances) &&
              !_.isUndefined(distances.status) &&
              distances.status == "OK"
            ) {
              response = {};
              for (var i = 0; i < origins.length; i++) {
                for (var j = 0; j < destinations.length; j++) {
                  var origin = distances.origin_addresses[i];
                  var destination = distances.destination_addresses[j];
                  if (distances.rows[0].elements[j].status == "OK") {
                    var distance = distances.rows[i].elements[j].distance.text;
                    response.distance = distances.rows[i].elements[j].distance;
                    response.duration = distances.rows[i].elements[j].duration;
                    resolve(response);
                    console.log(
                      "Distance from " +
                        origin +
                        " to " +
                        destination +
                        " is " +
                        distance
                    );
                  } else {
                    console.log(
                      destination + " is not reachable by land from " + origin
                    );
                    resolve(response);
                  }
                }
              }
            }
            reject(null);
          });
        });
      };

      return exits.success(await result());
    } catch (err) {
      sails.log(`Error in helper get-distance-matrix. ${err}`);
      return exits.success();
    }
  },
};
