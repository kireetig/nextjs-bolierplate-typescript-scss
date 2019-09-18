const withSass = require('@zeit/next-sass');

module.exports = withSass({
        cssModules: true,
        cssLoaderOptions: {
            localIdentName: "[local]___[hash:base64:5]",
        },
        webpack(config, {isServer, buildId, dev}) {
            // Fixes npm packages that depend on `fs` module
            config.node = {
                fs: 'empty',
            };

            if (!isServer) {
                config.module.rules.forEach(rule => {
                    if (rule.test.toString().includes('.scss')) {
                        rule.rules = rule.use.map(useRule => {
                            if (typeof useRule === 'string') {
                                return {
                                    loader: useRule,
                                };
                            }
                            if (useRule.loader.startsWith('css-loader')) {
                                return {
                                    oneOf: [
                                        {
                                            test: /\.global\.scss$/,
                                            loader: useRule.loader,
                                            options: {
                                                ...useRule.options,
                                                modules: false,
                                            },
                                        },
                                        {
                                            loader: useRule.loader,
                                            options: useRule.options,
                                        },
                                    ],
                                };
                            }
                            return useRule;
                        });
                        delete rule.use;
                    }
                });
            }

            return config;
        }
    }
);
