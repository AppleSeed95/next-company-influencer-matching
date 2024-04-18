/** @type {import('next').NextConfig} */

const dotenv = require('dotenv');
dotenv.config();

const nextConfig = {
    reactStrictMode: false,
    webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    ) => {
        // Important: return the modified config
        let modifiedConfig = {
            ...config, optimization: {
                minimize: false
            }

        }
        return modifiedConfig
    },
}

module.exports = nextConfig
