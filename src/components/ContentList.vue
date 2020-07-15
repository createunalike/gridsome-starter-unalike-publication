<template>
    <div v-if="items.length > 0" class="content-list">
        <ul>
            <li v-for="(item, index) in items" :key="index">
                <div class="content-list__title">
                    <g-link :to="item.path">{{ item.meta.title }}</g-link>
                </div>
                <div class="content-list__date">{{ item.publishedAt | dateFromNow }}</div>
            </li>
        </ul>
    </div>  
</template>

<static-query>

query {
    contents: allContent {
        edges {
            node {
                id
                path
                url
                publishedAt
                meta
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

            for (const content of this.$static.contents.edges.reverse()) {
                this.items.push(content.node);
            }

        },
    },
};
</script>
