import '~/scss/reset.scss'; 
import '~/scss/root.scss'; 
import '~/scss/styles.scss';

import DefaultLayout from '~/layouts/Default.vue';
import HeaderBar from '~/components/HeaderBar.vue';
import FooterBar from '~/components/FooterBar.vue';

import './filters';

export default function(Vue, {appOptions, router, head, isClient}) {

    Vue.component('DefaultLayout', DefaultLayout);

    Vue.component('HeaderBar', HeaderBar);
    Vue.component('FooterBar', FooterBar);
    
}
