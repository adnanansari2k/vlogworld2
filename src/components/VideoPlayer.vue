<script setup>
import { ref, reactive, computed } from 'vue';
import { store, actions, getters } from '../stores/vlogStore';

const showEditModal = ref(false);
const editForm = reactive({ title: '', city: '', country: '', order: 0, lat: 0, lng: 0 });

const ADMIN_PASS = "admin123";
const verifyAction = (cb) => {
    const p = prompt("Admin Password:");
    if (p === ADMIN_PASS) cb();
    else alert("Invalid password");
};

const openEdit = () => {
    verifyAction(() => {
        const v = store.currentVideo;
        editForm.title = v.title;
        editForm.city = v.location?.city || '';
        editForm.country = v.location?.country || '';
        editForm.lat = v.location?.lat || 0;
        editForm.lng = v.location?.lng || 0;
        editForm.order = v.series_info?.order || 0;
        showEditModal.value = true;
    });
};

const nextEp = computed(() => getters.nextEpisode.value);
</script>

<template>
    <div class="player-modern" v-if="store.currentVideo">
        <div class="player-header-slim">
            <button class="btn-back-slim" @click="actions.closeVideo"><i class="fa-solid fa-chevron-left"></i> Back</button>
            <div class="admin-tools-slim">
                <button class="tool-icon" @click="openEdit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="tool-icon del" @click="() => verifyAction(() => actions.deleteVideo(store.currentVideo.id))"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>

        <div class="player-body">
            <div class="video-hero">
                <iframe :src="`https://www.youtube.com/embed/${store.currentVideo.youtube_id}?autoplay=1&rel=0`" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>

            <div class="details-card">
                <div class="header-main">
                    <h2 class="v-title">{{ store.currentVideo.title }}</h2>
                    <div class="v-meta-line">
                        <span class="v-creator">by {{ store.currentVideo.creator }}</span>
                        <span class="v-dot">•</span>
                        <span class="v-loc-text">{{ store.currentVideo.location?.city }}</span>
                    </div>
                </div>

                <div v-if="nextEp" class="next-up-teaser" @click="actions.setVideo(nextEp)">
                    <div class="teaser-content"><span class="teaser-label">UP NEXT</span><div class="teaser-title">{{ nextEp.title }}</div></div>
                    <div class="teaser-btn"><i class="fa-solid fa-forward"></i></div>
                </div>

                <div class="action-grid">
                    <button class="action-pill" :class="{ active: store.currentVideo.watched }" @click="actions.markAsWatched(store.currentVideo)">
                        <i class="fa-solid fa-check-circle"></i> <span>{{ store.currentVideo.watched ? 'Visited' : 'Mark Visited' }}</span>
                    </button>
                    <button class="action-pill" :class="{ active: store.currentVideo.isBookmarked }" @click="actions.toggleBookmark(store.currentVideo)">
                        <i class="fa-solid fa-bookmark"></i> <span>{{ store.currentVideo.isBookmarked ? 'Saved' : 'Save Trip' }}</span>
                    </button>
                </div>

                <p class="v-description">{{ store.currentVideo.description }}</p>

                <div v-if="store.currentVideo.facts?.length" class="v-insights">
                    <div class="insights-head">TRIP NOTES</div>
                    <ul class="insights-list"><li v-for="f in store.currentVideo.facts" :key="f">{{ f }}</li></ul>
                </div>
                <div class="v-spacer"></div>
            </div>
        </div>

        <div v-if="showEditModal" class="modal-overlay">
            <div class="edit-card">
                <h3>Update Step</h3>
                <input v-model="editForm.title" placeholder="Title">
                <div class="grid-row"><input v-model="editForm.city" placeholder="City"><input v-model="editForm.country" placeholder="Country"></div>
                <div class="grid-row"><input v-model="editForm.lat" placeholder="Lat"><input v-model="editForm.lng" placeholder="Lng"></div>
                <input v-model="editForm.order" type="number" placeholder="Order">
                <div class="edit-actions"><button @click="showEditModal = false">Cancel</button><button @click="() => actions.updateVideo(store.currentVideo.id, editForm)">Save</button></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-modern { height: 100%; display: flex; flex-direction: column; background: white; }
.player-header-slim { padding: 8px 16px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: white; z-index: 20; }
.btn-back-slim { background: none; border: none; color: #3b82f6; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.85rem; }
.admin-tools-slim { display: flex; gap: 8px; }
.tool-icon { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1rem; padding: 4px; }
.tool-icon.del { color: #fecaca; }
.player-body { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.video-hero { width: 100%; aspect-ratio: 16/9; background: #000; }
.video-hero iframe { width: 100%; height: 100%; }
.details-card { padding: 18px 20px; }
.v-title { font-size: 1.25rem; font-weight: 800; margin: 0; line-height: 1.2; color: #0f172a; }
.v-meta-line { font-size: 0.8rem; font-weight: 600; color: #64748b; margin-top: 4px; display: flex; align-items: center; gap: 8px; }
.v-creator { color: #3b82f6; }
.next-up-teaser { display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: white; padding: 12px 16px; border-radius: 12px; margin: 18px 0; cursor: pointer; }
.teaser-label { font-size: 0.6rem; font-weight: 800; opacity: 0.6; display: block; }
.teaser-title { font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.teaser-btn { font-size: 1rem; color: #3b82f6; }
.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
.action-pill { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; border-radius: 10px; border: 1.5px solid #f1f5f9; background: #f8fafc; cursor: pointer; font-size: 0.8rem; font-weight: 800; color: #64748b; }
.action-pill.active:first-child { background: #dcfce7; border-color: #10b981; color: #166534; }
.action-pill.active:last-child { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
.v-description { font-size: 0.9rem; color: #475569; line-height: 1.5; margin-bottom: 24px; }
.v-insights { background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #f1f5f9; }
.insights-head { font-size: 0.65rem; font-weight: 800; color: #94a3b8; margin-bottom: 10px; letter-spacing: 1px; }
.insights-list { padding-left: 18px; margin: 0; color: #475569; font-size: 0.85rem; }
.v-spacer { height: 60px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.edit-card { background: white; padding: 24px; border-radius: 24px; width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 12px; }
.edit-card input { width: 100%; padding: 12px; border-radius: 10px; border: 1.5px solid #f1f5f9; font-size: 0.9rem; }
.grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.edit-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
</style>

