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
      },
    };

    const pro = {
      jwt: {
        access: process.env.JWT_ACCESS_KEY_DEV,
        refresh: process.env.JWT_REFRESH_KEY_DEV,
      },
      db: {
        host: process.env.DATABASE_URL_PRO,
      },
    };

    const env = { dev, pro };

    return env["dev"];
  }
};
