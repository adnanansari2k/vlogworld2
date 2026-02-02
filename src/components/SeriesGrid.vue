<script setup>
import { computed } from 'vue';
import { getters, actions } from '../stores/vlogStore';

const list = computed(() => {
    try {
        return getters.seriesList.value || [];
    } catch (e) {
        return [];
    }
});

const formatTitle = (id) => {
    if (!id) return "Unknown Trip";
    return id.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};
</script>

<template>
    <div class="journeys-container">
        <h3 class="section-title">Your Journeys</h3>
        
        <div v-if="list && list.length > 0" class="journey-grid">
            <div v-for="s in list" :key="s.id" class="journey-card" @click="actions.enterSeries(s.id)">
                <div class="stack-box">
                    <div class="stack-layer back"></div>
                    <div class="stack-layer mid"></div>
                    <div class="main-image">
                        <img :src="`https://img.youtube.com/vi/${s.thumbnail}/mqdefault.jpg`" alt="">
                        <div class="ep-tag">{{ s.count }} Episodes</div>
                    </div>
                </div>
                <div class="journey-meta">
                    <div class="j-name">{{ formatTitle(s.id) }}</div>
                    <div class="j-link">View route detail <i class="fa-solid fa-arrow-right"></i></div>
                </div>
            </div>
        </div>

        <div v-else class="empty-journeys">
            <div class="empty-icon"><i class="fa-solid fa-folder-open"></i></div>
            <p>Gathering your journeys...</p>
        </div>
    </div>
</template>

<style scoped>
.journeys-container { padding: 20px; }
.section-title { font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 1px; }
.journey-grid { display: grid; grid-template-columns: 1fr; gap: 30px; }
.journey-card { cursor: pointer; transition: transform 0.2s; }
.stack-box { position: relative; padding-top: 12px; }
.main-image { position: relative; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; z-index: 3; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid white; }
.main-image img { width: 100%; height: 100%; object-fit: cover; }
.stack-layer { position: absolute; left: 5%; width: 90%; height: 100%; border-radius: 16px; border: 1px solid #e2e8f0; }
.back { top: 0; z-index: 1; background: #f8fafc; opacity: 0.5; }
.mid { top: 6px; z-index: 2; background: #f1f5f9; width: 95%; left: 2.5%; }
.ep-tag { position: absolute; bottom: 12px; right: 12px; background: rgba(15,23,42,0.8); color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; }
.journey-meta { padding: 12px 4px; }
.j-name { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.j-link { font-size: 0.8rem; font-weight: 700; color: #3b82f6; display: flex; align-items: center; gap: 6px; }
.empty-journeys { text-align: center; padding: 80px 20px; color: #cbd5e1; }
.empty-icon { font-size: 3.5rem; margin-bottom: 15px; opacity: 0.5; }
@media (min-width: 600px) { .journey-grid { grid-template-columns: 1fr 1fr; } }
</style>

