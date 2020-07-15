import Vue from 'vue';
import dayjs from 'dayjs';

import updateLocale from 'dayjs/plugin/updateLocale';
dayjs.extend(updateLocale);

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

dayjs.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'just now',
        m: '1 min ago',
        mm: '%d mins ago',
        h: '1 hour ago',
        hh: '%d hours ago',
        d: '1 day ago',
        dd: '%d days ago',
        M: '1 month ago', 
        MM: '%d months ago',
        y: '1 year ago',
        yy: '%d years ago',
    },
});

Vue.filter('dateFromNow', function(value) {
    if (value) {
        return dayjs(String(value)).fromNow(true);
    }
});

Vue.filter('tags', function(value) {
    if (value) {
        return value.join(' ');
    }
});
