const Unalike = require('@createunalike/unalike-js');

module.exports = function(api) {
    
    api.loadSource(async ({addCollection, addSchemaTypes}) => {

        // Add schema for home content.
        addSchemaTypes(`
            type Article implements Node {
                id: String
                name: String
                path: String
                data: JSON
                url: String
                meta: JSON
                publishedAt: Date
            }
        `);

        const articleDocs = addCollection('Article');

        // Prefetch the blog.
        const client = new Unalike();
        client.setApi('https://your-publication-name.unalike.net/api/');
    
        const response = await client.query(`query contents($pageSize: Int, $sortBy: String, $sortDirection: SortDirection, $type: [String]) {
                    contents(pageSize: $pageSize, sortBy: $sortBy, sortDirection: $sortDirection, type: $type) {
                        id
                        name
                        data
                        meta
                        path
                        url
                        publishedAt
                    }
                }`, {
            pageSize: 20,
            sortBy: 'publishedAt',
            sortDirection: 'DESC',
            type: ['articlemedia', 'article'],
        });

        for (const content of response.data.contents) {

            content.path = `${content.path}/${content.name}`;
        
            const node = {
                id: content.id,
                name: content.name, 
                path: content.path, 
                data: content.data,
                meta: content.meta,
                url: content.url,
                publishedAt: content.publishedAt,
            };

            articleDocs.addNode(node);

        }
 
    });

    api.afterBuild(() => {

        console.log('Woohoo, it built!');
        
    });

};
