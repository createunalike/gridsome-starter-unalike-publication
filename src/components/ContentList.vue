<template>
    <section v-if="items.length > 0" class="content-list">
        <div class="inner">
            <div class="content-list__list">
                <a v-for="(item, index) in items" :key="index" :href="item.url" class="content-list__list__item" target="_blank">
                    <figure v-if="item.meta.media && item.meta.media.content">
                        <img loading="lazy" :src="item.meta.media.content.data.url">
                    </figure>

                    <div class="label">
                        <strong>{{ item.meta.title }}</strong>
                        {{ item.meta.summary }}
                    </div>

                    <div class="date">
                        {{ item.publishedAt | dateFromNow }}
                    </div>
                </a>
            </div>
        </div>
    </section>  
</template>

<static-query>

query {
    articles: allArticle {
        edges {
            node {
                id
                path
                url
                publishedAt
                meta {
                    title
                    summary
                    media {
                        content {
                            id
                            name
                            data {
                                url
                                type
                                versions {
                                    preview {
                                        url
                                        type
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

</static-query>

<script>

import '~/scss/components/content-list.scss';

export default {
    name: 'ContentList',
    data() {
        return {
            items: [],
        };
    },
    async mounted() {

        this.applyStaticArticle();

    },
    methods: {
        applyStaticArticle() {

            for (const article of this.$static.articles.edges.reverse()) {
                this.items.push(article.node);
            }

        },
    },
};
</script>
