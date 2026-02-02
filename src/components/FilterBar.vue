<script setup>
import { computed } from 'vue';
import { store, actions, getters } from '../stores/vlogStore';

const creators = computed(() => getters.uniqueCreators.value || []);

const setFilter = (f) => {
    store.activeSeriesId = null;
    store.filter = f;
};
</script>

<template>
    <div class="nav-bar-wrapper">
        <div class="scroll-tabs">
            <button :class="['nav-pill', { active: store.filter === 'All' && !store.activeSeriesId }]" @click="setFilter('All')">Explore</button>
            
            <!-- CREATOR DROPDOWN -->
            <div class="dropdown-pill-container" v-if="creators.length > 0">
                <select v-model="store.selectedCreator" class="nav-pill-select" :class="{ active: store.selectedCreator !== '' }">
                    <option value="">All Creators</option>
                    <option v-for="name in creators" :key="name" :value="name">{{ name }}</option>
                </select>
                <i class="fa-solid fa-chevron-down select-arrow"></i>
            </div>

            <button :class="['nav-pill', { active: store.filter === 'Series' || store.activeSeriesId }]" @click="setFilter('Series')">Journeys</button>
            <button :class="['nav-pill', { active: store.filter === 'Bookmarked' }]" @click="setFilter('Bookmarked')">Wishlist</button>
            <button :class="['nav-pill', { active: store.filter === 'History' }]" @click="setFilter('History')">Recents</button>
        </div>
    </div>
</template>

<style scoped>
.nav-bar-wrapper { padding: 12px 16px; background: white; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 100; }
.scroll-tabs { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; align-items: center; }
.scroll-tabs::-webkit-scrollbar { display: none; }

.nav-pill { 
    padding: 8px 18px; border-radius: 20px; border: 1.5px solid #f1f5f9; 
    background: #f8fafc; color: #64748b; font-size: 0.85rem; font-weight: 800; 
    cursor: pointer; white-space: nowrap; transition: all 0.2s; 
}
.nav-pill.active { background: #0f172a; color: white; border-color: #0f172a; }

/* DROPDOWN PILL STYLING */
.dropdown-pill-container { position: relative; display: flex; align-items: center; }
.nav-pill-select {
    appearance: none;
    padding: 8px 30px 8px 18px;
    border-radius: 20px;
    border: 1.5px solid #f1f5f9;
    background: #f8fafc;
    color: #64748b;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    outline: none;
    width: auto;
}
.nav-pill-select.active { background: #3b82f6; color: white; border-color: #3b82f6; }
.select-arrow { position: absolute; right: 12px; font-size: 0.7rem; pointer-events: none; opacity: 0.6; }
.nav-pill-select.active + .select-arrow { color: white; opacity: 1; }
</style>

