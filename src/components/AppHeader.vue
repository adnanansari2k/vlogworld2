<script setup>
import { store, getters, actions } from '../stores/vlogStore';
</script>

<template>
    <header class="header">
        <div class="logo" @click="actions.resetFilters">
            <i class="fa-solid fa-earth-americas" style="color:var(--accent);"></i> VlogWorld
        </div>
        <button class="passport-btn" @click="store.showPassport = true">
            <i class="fa-solid fa-passport"></i> {{ getters.collectedCount }}
        </button>
    </header>
</template>

<style scoped>
.header {
    grid-column: 1 / -1;
    grid-row: 1;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    /* Reduced padding to fit smaller height */
    padding: 0 20px;
    z-index: 50;
}
.logo { font-weight: 800; font-size: 1.1rem; cursor: pointer; display: flex; gap: 8px; align-items: center; }
.passport-btn {
    background: #fffbeb; border: 1px solid #fcd34d; color: #92400e;
    /* Tighter padding for compact look */
    padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem;
    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s;
}
.passport-btn:hover { background: #fef3c7; }
</style>


