<template>
    <DefaultLayout>
        <HeaderBar />
        <main id="home">
            <ContentList />
        </main>
        <FooterBar />
    </DefaultLayout>
</template>

<script>

import '~/scss/home.scss';

import ContentList from '../components/ContentList.vue';

export default {
    metaInfo() {
        return {
            title: 'Blog Home',
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
