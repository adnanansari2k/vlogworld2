<script setup>
import { computed } from 'vue';
import { store, actions, getters } from './stores/vlogStore';
import MapView from './components/MapView.vue';
import FeedList from './components/FeedList.vue';
import FilterBar from './components/FilterBar.vue';
import VideoPlayer from './components/VideoPlayer.vue';
import SeriesGrid from './components/SeriesGrid.vue';
import PassportOverlay from './components/PassportOverlay.vue';

const countryCount = computed(() => {
    try { return getters.collectedCount.value || 0; }
    catch (e) { return 0; }
});

const startExploring = () => {
    store.loading = false;
};
</script>

<template>
    <!-- CINEMATIC LOADER -->
    <Transition name="page-reveal">
        <div v-if="store.loading" class="entry-screen">
            <div class="entry-bg" style="background-image: url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop');"></div>
            <div class="entry-overlay"></div>
            
            <div class="entry-content">
                <div class="brand-box">
                    <i class="fa-solid fa-earth-americas brand-logo-icon spinning"></i>
                    <h1 class="brand-title">VlogWorld</h1>
                </div>
                
                <p class="hero-quote">"{{ store.currentQuote }}"</p>
                
                <div class="entry-footer">
                    <button v-if="store.dataReady" class="btn-explore" @click="startExploring">
                        Start Your Journey <i class="fa-solid fa-compass"></i>
                    </button>
                    <div v-else class="entry-loader">
                        <div class="loader-dot"></div>
                        <span>Discovering the map...</span>
                    </div>
                </div>
            </div>
        </div>
    </Transition>

    <div class="app-shell" :class="{ 'map-expanded': store.isMapExpanded }">
        
        <!-- MAP SECTION -->
        <div class="map-viewport">
            <div class="floating-nav" v-if="!store.isMapExpanded">
                <div class="glass-btn brand-pill" @click="actions.resetFilters">
                    <i class="fa-solid fa-earth-americas"></i> VlogWorld
                </div>
                <div class="glass-btn passport-pill" @click="store.showPassport = true">
                    <i class="fa-solid fa-passport"></i>
                    <span class="badge">{{ countryCount }}</span>
                </div>
            </div>
            <MapView />
        </div>

        <!-- CONTENT SECTION -->
        <div class="content-viewport" v-if="!store.isMapExpanded">
            <div v-if="store.currentVideo" class="full-view">
                <VideoPlayer />
            </div>

            <div v-else class="full-view flex-column">
                <FilterBar />
                <div class="scroll-container">
                    <SeriesGrid v-if="store.filter === 'Series' && !store.activeSeriesId" />
                    <FeedList v-else />
                </div>
            </div>
        </div>

        <!-- OVERLAYS -->
        <PassportOverlay v-if="store.showPassport" @close="store.showPassport = false" />
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Playfair+Display:ital,wght@1,700&display=swap');

:root { 
    --primary: #3b82f6; 
    --bg-main: #ffffff; 
    --bg-alt: #f8fafc;
    --border-ui: #f1f5f9;
    --txt-main: #0f172a;
    --txt-muted: #64748b;
}

body { 
    margin: 0; 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    background: var(--bg-main); 
    color: var(--txt-main);
    overflow: hidden; 
}

* { box-sizing: border-box; outline: none; }

/* CINEMATIC ENTRY */
.entry-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
}
.entry-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transform: scale(1.1);
    filter: brightness(0.65);
    animation: slowZoom 30s infinite alternate linear;
}
@keyframes slowZoom { from { transform: scale(1.1); } to { transform: scale(1); } }
.entry-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(15,23,42,0.8), transparent);
}
.entry-content { position: relative; z-index: 10; padding: 30px; max-width: 600px; }

.brand-box { margin-bottom: 40px; }
.brand-logo-icon { font-size: 4rem; color: var(--primary); margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(59,130,246,0.6)); }
.brand-title { font-size: 3.2rem; font-weight: 800; margin: 0; letter-spacing: -2px; }

.hero-quote {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-style: italic;
    line-height: 1.4;
    opacity: 0.9;
    margin: 0 0 60px;
}

.btn-explore {
    background: white;
    color: var(--txt-main);
    border: none;
    padding: 18px 48px;
    border-radius: 50px;
    font-weight: 800;
    font-size: 1.1rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.btn-explore:hover { transform: translateY(-5px) scale(1.02); background: var(--primary); color: white; }

.entry-loader { opacity: 0.6; font-size: 0.9rem; font-weight: 600; }

/* MAIN SHELL */
.app-shell { display: flex; flex-direction: column; height: 100vh; width: 100vw; transition: all 0.4s ease; }

.map-viewport { height: 40%; position: relative; border-bottom: 1px solid var(--border-ui); z-index: 10; flex-shrink: 0; }
.floating-nav { 
    position: absolute; top: 16px; left: 16px; right: 16px; 
    z-index: 1000; display: flex; justify-content: space-between; 
    pointer-events: none; 
}
.glass-btn {
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(12px);
    padding: 10px 20px;
    border-radius: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    color: var(--txt-main);
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    pointer-events: auto;
    cursor: pointer;
    font-size: 0.9rem;
    border: 1px solid rgba(255,255,255,0.5);
    transition: all 0.2s;
}
.glass-btn:active { transform: scale(0.96); }
.passport-pill { background: #fffbeb; color: #92400e; border-color: #fef3c7; }
.badge { background: #92400e; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }

.content-viewport { height: 60%; background: white; overflow: hidden; position: relative; display: flex; flex-direction: column; }
.full-view { height: 100%; display: flex; flex-direction: column; }
.flex-column { display: flex; flex-direction: column; }
.scroll-container { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }

/* MAP EXPANDED */
.map-expanded .map-viewport { height: 100%; border: none; }
.map-expanded .content-viewport { height: 0; display: none; }

@media (min-width: 768px) {
    .app-shell { flex-direction: row-reverse; }
    .map-viewport { height: 100%; width: 60%; border-bottom: none; border-left: 1px solid var(--border-ui); }
    .content-viewport { height: 100%; width: 40%; }
}

/* TRANSITIONS */
.page-reveal-leave-active { transition: opacity 0.8s ease, transform 0.8s ease; }
.page-reveal-leave-to { opacity: 0; transform: scale(1.05); }

.spinning { animation: spin 5s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>

