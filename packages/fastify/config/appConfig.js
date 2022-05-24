function loadEnvironmentVariable(keyname) {
  const envVar = process.env[keyname];

  if (!envVar) {
    throw new Error(`Must include ${keyname} as an environment variable.`);
  }

  return envVar;
}

function loadArrayEnvVariable(keyname) {
  return loadEnvironmentVariable(keyname).split(',');
}

module.exports = {
  supabaseUri: loadEnvironmentVariable('SUPABASE_URI'),  
};
