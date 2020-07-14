const Unalike = require('@createunalike/unalike-js');

module.exports = function(api) {
    
    api.loadSource(async ({addCollection, addSchemaTypes, schema}) => {

        // Add schema for home content.
        addSchemaTypes(`
            type Article implements Node {
                id: String
                path: String
                url: String
                meta: ArticleMeta
                publishedAt: Date
            }

            type ArticleMeta {
                title: String
                summary: String
                media: ArticleMedia
            }

            type ArticleMedia {
                content: Content
            }

            type Content {
                id: String
                data: Media
                name: String
            }

            type Media {
                url: String
                versions: MediaVersions
                type: String
            }

            type MediaVersions {
                preview: MediaVersionPreview
            }

            type MediaVersionPreview {
                url: String
                type: String
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
        
            const node = {
                id: content.id,
                path: content.path, 
                uid: content.id,
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
