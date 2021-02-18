<template>
    <DefaultLayout class="day">
        <HeaderBar />
        <main id="home">
            <Content v-if="$page.home" :content="$page.home" :model="$page.home.model" :id="`content-${$page.home.uid}`" />
            <FooterBar />
        </main>
    </DefaultLayout>
</template>

<page-query>

query {
    home (path: "/76471668-e8ad-4bf0-b7cf-2095ad21d01b") {
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

export default {
    metaInfo() {
        return {
           title: this.$page.home.meta.title,
        };
    },
};

</script>
