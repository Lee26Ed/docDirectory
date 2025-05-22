module.exports = {
  apps: [
    {
      name: "MediApp",
      script: "npm",
      args: "run build-and-start",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
