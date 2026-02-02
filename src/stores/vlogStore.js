import { reactive, computed, watch } from 'vue';
import { db, auth } from '../firebase/init';
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

export const store = reactive({
    videos: [],
    currentVideo: null,
    activeSeriesId: null,
    filter: 'All',
    selectedCreator: '',
    showPassport: false,
    isMapExpanded: false,
    loading: true,
    dataReady: false,
    userId: null,
    userWatched: {},
    userBookmarks: {},
    isListening: false,
    localHistoryIds: [], 
    currentQuote: "Adventure is calling...",
    quotes: [
        "The world is a book and those who do not travel read only one page.",
        "Travel is the only thing you buy that makes you richer.",
        "Adventure is worthwhile in itself.",
        "To travel is to live.",
        "Not all those who wander are lost."
    ]
});

const init = () => {
    store.currentQuote = store.quotes[Math.floor(Math.random() * store.quotes.length)];
    const savedHistory = localStorage.getItem('vlog_history');
    if (savedHistory) {
        try { store.localHistoryIds = JSON.parse(savedHistory); } catch (e) { store.localHistoryIds = []; }
    }
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            store.userId = user.uid;
            if (!store.isListening) setupDataListeners();
        } else {
            signInAnonymously(auth).catch(() => {});
        }
    });
};

const setupDataListeners = () => {
    if (store.isListening) return;
    store.isListening = true;
    onSnapshot(collection(db, 'vlogs'), (snapshot) => {
        const loaded = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; 
            loaded.push(data);
        });
        store.videos = loaded;
        store.dataReady = true;
    });
    watch(() => store.userId, (id) => {
        if (!id) return;
        onSnapshot(doc(db, 'users', id), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                store.userWatched = data.watched || {};
                store.userBookmarks = data.bookmarks || {};
            }
        });
    }, { immediate: true });
};

init();

export const getters = {
    uniqueCreators: computed(() => {
        try { return [...new Set((store.videos || []).map(v => v.creator).filter(Boolean))]; } catch(e) { return []; }
    }),
    
    visibleVideos: computed(() => {
        try {
            const watched = store.userWatched || {};
            const saved = store.userBookmarks || {};
            return (store.videos || []).map(v => ({
                ...v,
                watched: !!watched[v.youtube_id],
                isBookmarked: !!saved[v.youtube_id]
            }));
        } catch(e) { return []; }
    }),

    filteredVideos: computed(() => {
        try {
            const all = getters.visibleVideos.value;
            if (store.activeSeriesId) {
                return all.filter(v => v.series_id === store.activeSeriesId)
                          .sort((a, b) => (a.series_info?.order || 0) - (b.series_info?.order || 0));
            }
            // REQUIREMENT 1: Last 10 videos only
            if (store.filter === 'History') {
                return (store.localHistoryIds || [])
                    .slice(0, 10)
                    .map(id => all.find(v => v.youtube_id === id))
                    .filter(Boolean);
            }
            if (store.filter === 'Bookmarked') return all.filter(v => v.isBookmarked);
            if (store.filter === 'Series') return [];

            let list = [...all];
            if (store.selectedCreator) list = list.filter(v => v.creator === store.selectedCreator);
            return list.sort((a, b) => (b.date_added || 0) - (a.date_added || 0));
        } catch(e) { return []; }
    }),

    seriesList: computed(() => {
        try {
            const vlogs = store.videos || [];
            const filteredVlogs = store.selectedCreator ? vlogs.filter(v => v.creator === store.selectedCreator) : vlogs;
            const groups = {};
            filteredVlogs.forEach(v => {
                if (v.series_id) {
                    if(!groups[v.series_id]) groups[v.series_id] = { id: v.series_id, count: 0, thumbnail: v.youtube_id, order: v.series_info?.order || 999 };
                    groups[v.series_id].count++;
                    if ((v.series_info?.order || 999) < groups[v.series_id].order) {
                        groups[v.series_id].thumbnail = v.youtube_id;
                        groups[v.series_id].order = v.series_info.order;
                    }
                }
            });
            return Object.values(groups);
        } catch (e) { return []; }
    }),

    mapMarkers: computed(() => {
        try {
            const all = getters.visibleVideos.value;
            if (store.activeSeriesId) return all.filter(v => v.series_id === store.activeSeriesId);
            
            if (store.filter === 'Series') {
                const starts = {};
                const counts = {};
                const source = store.selectedCreator ? all.filter(v => v.creator === store.selectedCreator) : all;
                source.forEach(v => {
                    if (v.series_id) counts[v.series_id] = (counts[v.series_id] || 0) + 1;
                });
                source.forEach(v => {
                    if (v.series_id) {
                        const order = v.series_info?.order || 999;
                        if (!starts[v.series_id] || order < (starts[v.series_id].series_info?.order || 1000)) {
                            starts[v.series_id] = { ...v, series_count: counts[v.series_id] };
                        }
                    }
                });
                return Object.values(starts);
            }
            return getters.filteredVideos.value;
        } catch (e) { return []; }
    }),

    countryStats: computed(() => {
        try {
            const stats = {};
            store.videos.forEach(v => {
                const c = v.location?.country;
                if (c) {
                    if (!stats[c]) stats[c] = { name: c, count: 0, required: 10 };
                    if (store.userWatched[v.youtube_id]) stats[c].count++;
                }
            });
            return Object.values(stats).map(s => ({ ...s, collected: s.count >= s.required }));
        } catch (e) { return []; }
    }),

    collectedCount: computed(() => {
        try { return getters.countryStats.value.filter(c => c.collected).length; } catch (e) { return 0; }
    }),

    nextEpisode: computed(() => {
        try {
            const current = store.currentVideo;
            if (!current || !current.series_id) return null;
            return store.videos.find(v => 
                v.series_id === current.series_id && 
                v.series_info?.order === (current.series_info?.order || 0) + 1
            ) || null;
        } catch (e) { return null; }
    })
};

export const actions = {
    setVideo(v) { 
        if (!v) return;
        store.currentVideo = v; 
        store.isMapExpanded = false; 
        const updatedHistory = [v.youtube_id, ...store.localHistoryIds.filter(id => id !== v.youtube_id)].slice(0, 15);
        store.localHistoryIds = updatedHistory;
        localStorage.setItem('vlog_history', JSON.stringify(updatedHistory));
    },
    closeVideo() { store.currentVideo = null; },
    toggleMapFullscreen() { 
        store.isMapExpanded = !store.isMapExpanded; 
        setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
    },
    getRandomVideo() {
        const all = store.videos || [];
        if (all.length > 0) actions.setVideo(all[Math.floor(Math.random() * all.length)]);
    },
    enterSeries(id) { store.activeSeriesId = id; store.filter = 'Series'; store.currentVideo = null; },
    async markAsWatched(v) {
        if (!store.userId || !v?.youtube_id) return;
        store.userWatched[v.youtube_id] = Date.now();
        await setDoc(doc(db, 'users', store.userId), { watched: store.userWatched }, { merge: true });
    },
    async toggleBookmark(v) {
        if (!store.userId || !v?.youtube_id) return;
        if (store.userBookmarks[v.youtube_id]) delete store.userBookmarks[v.youtube_id];
        else store.userBookmarks[v.youtube_id] = true;
        await setDoc(doc(db, 'users', store.userId), { bookmarks: store.userBookmarks }, { merge: true });
    },
    async deleteVideo(id) { await deleteDoc(doc(db, 'vlogs', id)); store.currentVideo = null; },
    async updateVideo(id, data) { await updateDoc(doc(db, 'vlogs', id), data); },
    resetFilters() {
        store.filter = 'All'; store.activeSeriesId = null;
        store.selectedCreator = ''; store.currentVideo = null;
    }
};