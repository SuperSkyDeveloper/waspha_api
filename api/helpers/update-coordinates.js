module.exports = {


  friendlyName: 'Update coordinates',


  description: '',


  inputs: {
    coordinates: {
      type: 'json',
      required: true
    },
    id: {
      type: 'number',
      required: true
    },
    table_name: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper update-coordinates');
    sails.log(`Updating coordinates for table: '${inputs.table_name}', id: '${inputs.id}', coordinates: { lat: ${inputs.coordinates.lat}, lng: ${inputs.coordinates.lng} }`);
    query = `UPDATE ${inputs.table_name} SET location_coordinates = ST_GEOMFROMTEXT('POINT(${inputs.coordinates.lng} ${inputs.coordinates.lat})') WHERE id = ${inputs.id};`
    let result = await sails.sendNativeQuery(query);
    //sails.log({result: result});
    return exits.success(true);
  }


};

