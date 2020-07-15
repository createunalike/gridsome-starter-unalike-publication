<template>
    <div class="profile-image" :class="{ [`profile-image--${size}`]: size, 'profile-image--loading': loading }">
        <div :class="{[`profile-image__${imageclass}`]: imageclass != null}">
            <img v-if="base64 == null && src" :src="src" @error="error" @load="loaded">
            <img v-if="base64" :src="base64">
            <i v-if="invite" class="ri-add-line" />
        </div>
    </div>
</template>

<script>

import '../scss/components/profile-image.scss';

export default {
    name: 'ProfileImage',
    props: {
        person: {
            type: Object,
            required: false,
            default: null,
        },
        size: {
            type: String, // small, default, medium, large
            required: false,
            default: 'default',
        },
        invite: {
            type: Boolean,
            required: false,
        },
    },
    data() {
        return {
            base64: null,
            imageclass: null,
            loading: true,
            src: null,
        };
    },
    created() {
        this.setSource();
    },
    methods: {
        setSource() {

            this.base64 = null;

            if (this.person) {
                
                if (this.person.options && this.person.options.profileimage && this.person.options.profileimage.data && this.person.options.profileimage.data[this.size]) {
                    this.src = `${this.person.options.profileimage.data[this.size]}`;
                } else if (this.person.id) {
                    this.src = `https://contentthat.s3.amazonaws.com/u/${this.person.id}_small`;
                }

            } else if (this.invite) {

                this.imageclass = 'invite';
                
            } else {

                this.imageclass = 'default';

            }

        },
        reset() {
            this.setSource();
        },
        error() {
            this.imageclass = 'default';
            this.loading = false;
        },
        loaded() {
            this.loading = false;
        },
        setBase64(mime, base64) {
            this.base64 = base64;  
            this.imageclass = null;
        },
    },
};
</script>
