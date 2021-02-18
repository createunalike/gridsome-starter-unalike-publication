const Unalike = require('@createunalike/unalike-js');

module.exports = function(api) {
    
    api.loadSource(async ({addCollection, addSchemaTypes}) => {

        // Add schema for home content.
        addSchemaTypes(`
            type Content implements Node {
                id: String
                name: String
                path: String
                data: JSON
                model: JSON
                meta: JSON
                url: String
                publishedAt: Date
                tags: [String]
                contributors: JSON
            }

            type Home implements Node {
                id: String
                name: String
                path: String
                data: JSON
                model: JSON
                meta: JSON
                url: String
                publishedAt: Date
                tags: [String]
                contributors: JSON
            }
        `);

        const contentDocs = addCollection('Content');
        const homeDocs = addCollection('Home');

        const client = new Unalike.Client();

        // Chnage this url to your publication public API
        client.setApi('https://your-publication-name.unalike.net/api/');
        
        const response = await client.query(`query contents($pageSize: Int, $sortBy: String, $sortDirection: SortDirection, $type: [String]) {
                    contents(pageSize: $pageSize, sortBy: $sortBy, sortDirection: $sortDirection, type: $type) {
                        id
                        name
                        data
                        meta
                        type
                        model
                        path
                        url
                        publishedAt
                        tags
                        contributors {
                            person {
                                id
                            }
                        }
                    }
                }`, {
            pageSize: 100,
            sortBy: 'publishedAt',
            sortDirection: 'DESC',
            type: ['home', 'story'],
        });

        for (const content of response.data.contents) {

            if (content.type == 'story') {

                content.path = `${content.path}/${content.name}`;
                contentDocs.addNode(content);

            } else if (content.type == 'home') {

                homeDocs.addNode(content);

            }

        }
 
    });

    api.afterBuild(() => {

        console.log('Woohoo, it built!');
        
    });

};
