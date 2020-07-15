<template>
    <DefaultLayout class="day">
        <HeaderBar />
        <main id="home">
            <article class="content">
                <div class="content__body">
                    <h1>Welcome to the example Unalike publication</h1>
                </div>
                <div class="content__body">
                    <p>This is a simple static publication built with the Gridsome framework and using Unalike for the headless publication management. With the headless approach, we want to give publishers and developers a way to create publications and membership communities that don't rely solely on the Unalike platform.</p>
                </div>
                <ContentList />
            </article>
            <FooterBar />
        </main>
    </DefaultLayout>
</template>

<script>

import '~/scss/home.scss';

import ContentList from '../components/ContentList.vue';

export default {
    metaInfo() {
        return {
            title: 'Unalike Publication',
            meta: [
                {name: 'description', content: ''},
            ],
        };
    },
    components: {
        ContentList,
    },
};

</script>
