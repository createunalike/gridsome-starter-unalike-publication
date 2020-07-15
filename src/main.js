import '~/scss/common/reset.scss'; 
import '~/scss/common/root.scss'; 
import '~/scss/common/fonts.scss';
import '~/scss/styles.scss';
import '~/scss/content.scss';

import DefaultLayout from '~/layouts/Default.vue';
import HeaderBar from '~/components/HeaderBar.vue';
import FooterBar from '~/components/FooterBar.vue';
import ProfileImage from '~/components/ProfileImage.vue';

import './filters';

export default function(Vue, {appOptions, router, head, isClient}) {

    Vue.component('DefaultLayout', DefaultLayout);

    Vue.component('HeaderBar', HeaderBar);
    Vue.component('FooterBar', FooterBar);
    Vue.component('ProfileImage', ProfileImage);
    
}
