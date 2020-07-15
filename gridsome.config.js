function addStyleResource(rule) {
    rule.use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: [
                    './src/scss/common/mixins.scss',
                ],
            });
}

module.exports = {
    siteName: 'Unalike Publication',
    titleTemplate: '%s',
    chainWebpack(config) {
        
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        
        types.forEach((type) => {
            addStyleResource(config.module.rule('scss').oneOf(type));
        });

    },
};
