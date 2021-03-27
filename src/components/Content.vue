<template>
    <article v-if="fields" :id="`content-${content.uid}`" class="content">
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
            <div v-if="item.type == 'tags' && $page.content.tag && $page.content.tag.length > 0" class="content__tags">
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
            <ContentList v-if="item.type == 'contentlist'" />
        </div>
    </article>
</template>

<script>

import Unalike from '@createunalike/unalike-js';
import ContentList from './ContentList.vue';

export default {
    components: {
        ContentList,
    },
    props: {
        content: {
            type: Object,
            default: null,
        },
        model: {
            type: Object,
            default: null,
        },
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

            } else if (field.type == 'heading' && this.content.data[key] && this.content.data[key].ops) {

                let html = Unalike.Transformer.convertDeltaToHtml(this.content.data[key], this.render);
                
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
    methods: {
        render(customOp) {

            switch (customOp.insert.type) {
                case 'embed': {
                    const value = customOp.insert.value;
                
                    let html = '<div class="embed">';
        
                    if (value.type == 'youtube') {
                        html += `<div class="embed__youtube"><iframe width="560" height="315" src="${value.url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
                    } else if (value.type == 'tweet') {
                        html += `<div class="embed__tweet" data-id="${value.id}"></div>`;
                    }
                    
                    html += '</div>';
        
                    return html;
                }
                
                case 'divider': {
                    return `<hr />`;
                }
        
                case 'code': {
                    return `<pre class="code"><code>${customOp.insert.value}</code></pre>`;
                }
                
                case 'media': {
        
                    const value = customOp.insert.value;
                    const classes = ['media'];
        
                    if (value.size) {
                        classes.push(`media--${value.size}`);
                    }

                    const content = value.content;

                    if (content && content.data) {
                    
                        const data = content.data;
                        const type = data.type ? content.data.type : null;
            
                        let html = `<figure${classes.length > 0 ? ` class="${classes.join(' ')}"` : ''}>`;
                        
                        if (type == 'image') {
            
                            classes.push(`media--image`);
            
                            html = `${html}<img src="${data.url}">
                            ${value.caption ? `<figcaption>${value.caption}</figcaption>` : ''}`;
            
                        } else if (type == 'video') {
            
                            classes.push(`media--video`);
            
                            let videos = '';
            
                            if (data.versions) {
                                for (const version of Object.values(data.versions)) {
                                    if (version.type == 'video') {
                                        videos += `<source src="${version.url}" type="${version.contentType}">`;
                                    }
                                }
                            }
            
                            html = `${html}<video width="100%" crossorigin playsinline>${videos}</video>
                            ${value.caption ? `<figcaption>${value.caption}</figcaption>` : ''}`;
            
                        } else if (type == 'audio') {
            
                            classes.push(`media--audio`);
            
                            html = `${html}<audio src="${data.url}" crossorigin></audio>
                            ${value.caption ? `<figcaption>${value.caption}</figcaption>` : ''}`;

                        }
            
                        html = `${html}</figure>`;
        
                        return html;

                    }

                    return '';
        
                }
            }
        },
    },
};

</script>
