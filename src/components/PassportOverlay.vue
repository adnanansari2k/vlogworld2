<script setup>
import { computed } from 'vue';
import { getters, actions, store } from '../stores/vlogStore';

const emit = defineEmits(['close']);

const stats = computed(() => getters.countryStats.value || []);
const watchedCount = computed(() => Object.keys(store.userWatched || {}).length);
const countryCount = computed(() => getters.countryStats.value.filter(c => c.count > 0).length);
const bookmarkList = computed(() => getters.visibleVideos.value.filter(v => v.isBookmarked));

const playVideo = (v) => {
    actions.setVideo(v);
    emit('close');
};
</script>

<template>
    <div class="passport-backdrop" @click.self="emit('close')">
        <div class="passport-card" v-if="store.userId">
            <div class="card-header">
                <div class="header-main">
                    <div class="icon-circle"><i class="fa-solid fa-passport"></i></div>
                    <div class="header-text">
                        <h3>Traveler Profile</h3>
                        <p>Adventure Log ID: #{{ store.userId.substring(0,6) }}</p>
                    </div>
                </div>
                <button class="btn-close" @click="emit('close')"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="card-body">
                <!-- Stats Dashboard -->
                <div class="stats-dashboard">
                    <div class="stat-pill">
                        <div class="stat-val">{{ watchedCount }}</div>
                        <div class="stat-label">Destinations</div>
                    </div>
                    <div class="stat-pill highlight">
                        <div class="stat-val">{{ countryCount }}</div>
                        <div class="stat-label">Countries</div>
                    </div>
                </div>

                <!-- Stamps Grid -->
                <div class="section">
                    <h4 class="section-title">Visa Stamps</h4>
                    <div class="stamps-grid">
                        <div v-for="c in stats" :key="c.name" :class="['stamp', { locked: c.count === 0 }]">
                            <div class="stamp-inner">
                                <i v-if="c.count > 0" class="fa-solid fa-plane-arrival"></i>
                                <span v-else>{{ c.name.charAt(0) }}</span>
                            </div>
                            <span class="stamp-name">{{ c.name }}</span>
                        </div>
                    </div>
                </div>

                <!-- Saved List -->
                <div class="section" v-if="bookmarkList.length">
                    <h4 class="section-title">Saved Journeys</h4>
                    <div class="bookmarks-scroller">
                        <div v-for="v in bookmarkList" :key="v.id" class="bookmark-item" @click="playVideo(v)">
                            <img :src="`https://img.youtube.com/vi/${v.youtube_id}/default.jpg`" alt="">
                            <div class="b-info">
                                <span class="b-title">{{ v.title }}</span>
                                <span class="b-loc">{{ v.location?.city }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.passport-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.85); backdrop-filter: blur(8px); z-index: 9000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.passport-card { background: #ffffff; width: 100%; max-width: 420px; border-radius: 32px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.5); display: flex; flex-direction: column; max-height: 85vh; }

.card-header { background: #0f172a; color: white; padding: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
.header-main { display: flex; gap: 16px; align-items: center; }
.icon-circle { width: 48px; height: 48px; background: rgba(59,130,246,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 1.4rem; }
.header-text h3 { margin: 0; font-size: 1.1rem; font-weight: 800; }
.header-text p { margin: 2px 0 0; font-size: 0.7rem; opacity: 0.5; letter-spacing: 1px; text-transform: uppercase; }
.btn-close { background: rgba(255,255,255,0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; }

.card-body { padding: 24px; overflow-y: auto; }

.stats-dashboard { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 30px; }
.stat-pill { background: #f8fafc; padding: 20px; border-radius: 20px; text-align: center; border: 1px solid #f1f5f9; }
.stat-pill.highlight { background: #eff6ff; border-color: #dbeafe; }
.stat-val { font-size: 1.8rem; font-weight: 900; color: #0f172a; }
.stat-label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; }

.section { margin-bottom: 24px; }
.section-title { font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 1px; }

.stamps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stamp { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.stamp-inner { width: 50px; height: 50px; border-radius: 18px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 2px dashed #10b981; }
.stamp.locked .stamp-inner { background: #f1f5f9; color: #cbd5e1; border-style: solid; border-color: #e2e8f0; }
.stamp-name { font-size: 0.65rem; font-weight: 700; color: #475569; text-align: center; }

.bookmark-item { display: flex; gap: 12px; align-items: center; background: #f8fafc; padding: 10px; border-radius: 16px; margin-bottom: 8px; cursor: pointer; border: 1px solid transparent; }
.bookmark-item:hover { border-color: #3b82f6; background: white; }
.bookmark-item img { width: 60px; height: 40px; border-radius: 8px; object-fit: cover; }
.b-info { display: flex; flex-direction: column; }
.b-title { font-size: 0.8rem; font-weight: 800; color: #0f172a; line-height: 1.2; }
.b-loc { font-size: 0.7rem; color: #64748b; }
</style>

