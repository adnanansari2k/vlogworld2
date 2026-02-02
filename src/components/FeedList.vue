<script setup>
import { computed } from 'vue';
import { getters, actions, store } from '../stores/vlogStore';

// Defensive list fetching
const videoList = computed(() => {
    return getters.filteredVideos.value || [];
});
</script>

<template>
    <div class="feed-container">
        <!-- Using a key tied to the filter ensures Vue doesn't reuse nodes incorrectly -->
        <div v-if="videoList.length > 0" class="video-grid" :key="store.filter + (store.activeSeriesId || '')">
            <div 
                v-for="video in videoList" 
                :key="video.id" 
                class="video-card" 
                @click="actions.setVideo(video)"
            >
                <div class="thumb-wrap">
                    <img :src="`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`" alt="Thumbnail" loading="lazy">
                    <div class="duration" v-if="video.duration_min">{{ video.duration_min }}m</div>
                    <div v-if="video.watched" class="watched-badge"><i class="fa-solid fa-check"></i></div>
                </div>
                <div class="card-body">
                    <div class="title">{{ video.title }}</div>
                    <div class="loc" v-if="video.location">
                        <i class="fa-solid fa-location-dot"></i> {{ video.location.city }}
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="!store.loading" class="empty-state">
            <i class="fa-solid fa- ghost"></i>
            <p v-if="store.filter === 'History'">You haven't watched any videos yet.</p>
            <p v-else-if="store.filter === 'Bookmarked'">Your saved videos will appear here.</p>
            <p v-else>No videos found matching your filters.</p>
            <button @click="actions.resetFilters" class="btn-reset">Back to Explore</button>
        </div>
    </div>
</template>

<style scoped>
.feed-container { padding: 12px; }
.video-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
.video-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); cursor: pointer; transition: transform 0.2s; }
.video-card:active { transform: scale(0.98); }

.thumb-wrap { position: relative; aspect-ratio: 16/9; background: #f1f5f9; }
.thumb-wrap img { width: 100%; height: 100%; object-fit: cover; }
.duration { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; }
.watched-badge { position: absolute; top: 8px; right: 8px; background: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }

.card-body { padding: 12px; }
.title { font-weight: 700; font-size: 0.95rem; line-height: 1.4; color: #1e293b; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.loc { font-size: 0.8rem; color: #64748b; font-weight: 500; }

.empty-state { text-align: center; padding: 60px 20px; color: #94a3b8; }
.empty-state i { font-size: 3rem; margin-bottom: 15px; opacity: 0.3; }
.btn-reset { margin-top: 20px; background: #2563eb; color: white; border: none; padding: 10px 24px; border-radius: 20px; font-weight: 700; cursor: pointer; }

@media (min-width: 640px) {
    .video-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>

