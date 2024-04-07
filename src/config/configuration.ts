export default () => {
  {
    const dev = {
      jwt: {
        access: process.env.JWT_ACCESS_KEY_PRO,
        refresh: process.env.JWT_REFRESH_KEY_PRO,
      },
      db: {
        host: process.env.DATABASE_URL_DEV,
      },
      aws: {
        region: process.env.AWS_CONFIG_REGION,
        access_id: process.env.AWS_ACCESS_KEY_ID,
        secret_key: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };

    const pro = {
      jwt: {
        access: process.env.JWT_ACCESS_KEY_PRO,
        refresh: process.env.JWT_REFRESH_KEY_PRO,
      },
      db: {
        host: process.env.DATABASE_URL_PRO,
      },
      aws: {
        region: process.env.AWS_CONFIG_REGION,
        access_id: process.env.AWS_ACCESS_KEY_ID,
        secret_key: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };

    const env = { dev, pro };

    return env["pro"];
  }
};
