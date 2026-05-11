import { authApi } from './auth.api';
import { feedApi } from './feed.api';
import { profileApi } from './profile.api';
import { mapApi } from './map.api';
import { lostFoundApi } from './lostFound.api';
import { clubsApi } from './clubs.api';
import { hashtagsApi } from './hashtags.api';
import { placementApi } from './placement.api';
import { calendarApi } from './calendar.api';
import { notificationsApi } from './notifications.api';
import { dbAdminApi } from './dbAdmin.api';

export const api = {
    auth: authApi,
    feed: feedApi,
    profile: profileApi,
    map: mapApi,
    lostFound: lostFoundApi,
    clubs: clubsApi,
    hashtags: hashtagsApi,
    placement: placementApi,
    calendar: calendarApi,
    notifications: notificationsApi,
    purgeDummyData: dbAdminApi.purgeDummyData
};
