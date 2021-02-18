<template>
    <article class="content" :id="`content-${content.uid}`">
        <div v-if="fields" v-for="(item, itemIndex) in fields" :key="itemIndex">
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
            <div v-if="item.type == 'tags' && $page.content.tag && $page.content.tag.length > 0"  class="content__tags">
                {{ content.tags | tags }}
            </div>
            <div v-if="item.type == 'publisheddate'" class="content__publisheddate">
                <div class="date">{{ content.publishedAt | dateFromNow }}</div>
            </div>
            <div v-if="item.type == 'info'" class="content__info">
                <div class="content__info__details">
                    <div class="contributors">
                        <div v-for="(contributor, contributorIndex) in content.contributors" :key="contributorIndex">
                            <ProfileImage size="medium" :person="contributor.person" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<script>

import Unalike from '@createunalike/unalike-js';

export default {
    metaInfo() {
        return {
            title: this.$page.content.meta.title,
        };
    },
    props: {
        content: {
            type: Object,
            default: null,
        },
        model: {
            type: Object,
            default: null,
        }
    },
    data() {
        return {
            fields: [],
        };
    },
    mounted() {

        const ordered = {};

        Object.keys(this.model.fields).sort((a, b) => {
            return this.model.fields[a]._index - this.model.fields[b]._index;
        }).forEach((key) => {
            ordered[key] = this.model.fields[key];
        });

        for (const [key, field] of Object.entries(ordered)) {

            if (field.type == 'text' && this.content.data[key] && this.content.data[key].ops) {

                const html = Unalike.Transformer.convertDeltaToHtml(this.content.data[key]);    
                
                field.value = html;
                this.fields.push(field);

            } else if (field.type == 'heading' && this.$page.content.data[key] && this.content.data[key].ops) {

                let html = Unalike.Transformer.convertDeltaToHtml(this.content.data[key]);
                
                // TODO: Not ideal with new heading deltas, need to introduce custom render.
                html = html.replace('<p>', '');
                html = html.replace('</p>', '');

                field.value = html;
                this.fields.push(field);
            
            } else {
                    
                field.value = this.content.data[key];
                this.fields.push(field);

            }
        }
    },
};

</script>
