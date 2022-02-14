function toRad(Value) 
{
    return Value * Math.PI / 180;
}
module.exports = {


  friendlyName: 'Get distance',


  description: '',


  inputs: {
    source: {
      type: 'json',
      required: true
    },
    destination: {
      type: 'json',
      required: true
    },
  },


  exits: {

    success: {
      outputFriendlyName: 'Distance',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper get-distance');
    
    var source = inputs.source;
    var destination = inputs.destination
    var R = 6371; // km
    var dLat = toRad(destination.lat-source.lat);
    var dLon = toRad(destination.lng-source.lng);
    var lat1 = toRad(source.lat);
    var lat2 = toRad(destination.lat);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(source.lat) * Math.cos(destination.lat); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;

    return exits.success(parseFloat(d.toFixed(2)));

  }


};

