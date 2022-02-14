

module.exports = {


  friendlyName: 'Get waspha settings',


  description: '',


  inputs: {
    key: {
      type: 'string',
      required: false,
      //isIn: ['terms_and_conditions','privacy_policy']
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Waspha settings',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper get-waspha-settings');
    let where = {};
    let result = null;
    let data = [];
    if(!_.isUndefined(inputs.key)){      
      where.key = inputs.key;
      result = await Waspha_setting.find({
        where: where,
        select: ['id','key','en','ar']
      }).limit(1)
      data = result;
    }else{      
        result = await Waspha_setting.find({        
        select: ['en','ar']
      });
      data = result.rows;
      
    }
    
    return exits.success(data);

   
  }


};

