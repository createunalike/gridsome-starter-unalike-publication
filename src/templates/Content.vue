<template>
    <DefaultLayout>
        <HeaderBar />
        <main>
            <Content class="content" :content="$page.content" :model="$page.content.model" :id="`content-${$page.content.uid}`" />
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

export default {
    metaInfo() {
        return {
            title: this.$page.content.meta.title,
        };
    },
};

</script>
