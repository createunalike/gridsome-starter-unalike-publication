<template>
    <DefaultLayout :content="$page.content">
        <HeaderBar />
        <main :id="`content-${$page.content.uid}`">
            <article class="content">
                <div v-for="(item, itemIndex) in fields" :key="itemIndex">
                    <div v-if="item.type == 'media'" class="content__media" :class="{[`content__media--${item.value.size}`]: item.value.size}">
                        <figure v-if="item.value.type == 'giphy'" class="media">
                            <img :src="`//media.giphy.com/media/${item.value.id}/giphy.gif`">
                            <figcaption v-if="item.value.caption">{{ item.value.caption }}</figcaption>
                        </figure>

                        <figure v-if="item.value.type == 'youtube'" class="media media--youtube">
                            <iframe width="560" height="315" :src="item.value.url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
                            <figcaption v-if="item.value.caption">{{ item.value.caption }}</figcaption>
                        </figure>

                        <figure v-if="item.value.content" class="media">
                            <img v-if="item.value.content.data.type == 'image' && item.value.content.data.versions.primary" loading="lazy" :src="item.value.content.data.versions.primary.url">
                            <img v-if="item.value.content.data.type == 'image' && !item.value.content.data.versions.primary" loading="lazy" :src="item.value.content.data.url">
                            <figcaption v-if="item.value.caption">{{ item.value.caption }}</figcaption>
                        </figure>
                    </div>
                    <div v-if="item.type == 'heading'" class="content__body">
                        <h1>{{ item.value }}</h1>
                    </div>
                    <div v-if="item.type == 'text'" class="content__body" v-html="item.value" />
                    <div v-if="item.type == 'tags'" class="content__tags">
                        {{ $page.content.tags | tags }}
                    </div>
                    <div v-if="item.type == 'info'" class="content__info">
                        <div class="content__info__details">
                            <div class="contributors">
                                <div v-for="(contributor, contributorIndex) in $page.content.contributors" :key="contributorIndex">
                                    <ProfileImage size="medium" :person="item.person" />
                                </div>
                            </div>
                            <div class="date">{{ $page.content.publishedAt | dateFromNow }}</div>
                        </div>
                    </div>
                </div>
            </article>
            <FooterBar /> 
        </main>
    </DefaultLayout>
</template>

<page-query>

query Content ($path: String!) {
    content: content (path: $path) {
        id
        name
        data
        meta
        model
        tags
        contributors
        publishedAt
    }
}

</page-query>

<script>

import Unalike from '@createunalike/unalike-js';

export default {
    metaInfo() {
        return {
            title: this.$page.content.meta.title,
        };
    },
    data() {
        return {
            fields: [],
        };
    },
    mounted() {

        const ordered = {};

        Object.keys(this.$page.content.model.fields).sort((a, b) => {
            return this.$page.content.model.fields[a].index - this.$page.content.model.fields[b].index;
        }).forEach((key) => {
            ordered[key] = this.$page.content.model.fields[key];
        });

        for (const [key, field] of Object.entries(ordered)) {

            if (field.type == 'text' && this.$page.content.data[key] && this.$page.content.data[key].ops) {

                const html = Unalike.Transformer.convertDeltaToHtml(this.$page.content.data[key]);    
                
                field.value = html;
                this.fields.push(field);
            
            } else {
                    
                field.value = this.$page.content.data[key];
                this.fields.push(field);

            }
        }
    },
};

</script>
