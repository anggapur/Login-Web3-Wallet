'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 */
module.exports = async function (fastify, opts) {
  // Place here your custom code!  
  await fastify.register(require('fastify-formbody'))

  fastify.register(require('fastify-supabase'), {
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yd2ZxYWN3eGpiYm1qcmhzYmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMzMTk4MzUsImV4cCI6MTk2ODg5NTgzNX0.BI4EuiJZXkm24lbpcB5mCVSMjHP5JLMSZlftwY51TBo',
    supabaseUrl: 'https://orwfqacwxjbbmjrhsblt.supabase.co'
  })

  fastify.register(require('@fastify/cors'), { 
    // put your options here
  })
  
  
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  });

  // This loads all plugins defined in services
  // define your routes in one of these
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({ prefix: '/api' }, opts)
  });

  if (process.env.NODE_ENV === 'development') {
    fastify.log.info(fastify.printRoutes());
  }
}
