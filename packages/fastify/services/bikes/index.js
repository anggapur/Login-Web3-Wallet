const { ethers } = require("ethers");

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
const routes = async fastify => {
  fastify.route({
    method: 'POST',
    url: '/get-data',    
    schema: {     
      headers: {
        type: 'object',
        properties: {
          'message' : { type: 'string' },
          'signature' : { type: 'string' }
        },
        required: ['message','signature']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            signature: { type: 'string' },
            recoverAddress: { type: 'string' },
            data: { type: 'array' }
          }
        }
      }
    },
    handler: async function (request, reply) {
      // Get Data
      const {message, signature} = request.headers
      
      // Recover Address
      const messageUtf8Bytes = ethers.utils.toUtf8Bytes(message);
      const arrayifyMessage = ethers.utils.arrayify(messageUtf8Bytes);
      const recoveredAddress = ethers.utils.verifyMessage(
        arrayifyMessage,
        signature
      );      
      const recoveredAddressLowerCase = recoveredAddress.toLowerCase();

      // Supabase
      const { supabase } = fastify
      const { data, error } = await supabase
      .from('bikes')
      .select()
      .eq('owner', recoveredAddressLowerCase)

      reply.send({ message, signature, recoverAddress: recoveredAddressLowerCase, data })
    }
  })
};

module.exports = routes;
