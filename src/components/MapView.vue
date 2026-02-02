<script setup>
import L from 'leaflet';
import { onMounted, watch } from 'vue';
import { store, getters, actions } from '../stores/vlogStore.js';

let map = null;
let markers = [];
let routeLayers = [];

const initMap = () => {
    map = L.map('map', { zoomControl: false, attributionControl: false }).setView([20, 0], 2);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    
    // REQUIREMENT 4: Revert to Voyager Tiles (Detailed, City Names, Eye-Friendly)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    watch(() => store.isMapExpanded, () => {
        setTimeout(() => { if(map) map.invalidateSize(true); }, 400);
    });
};

const getJitteredPos = (lat, lng, order) => {
    if (!order) return [lat, lng];
    const angle = 0.8 * order;
    const radius = 0.006; 
    return [lat + (radius * Math.cos(angle)), lng + (radius * Math.sin(angle))];
};

const updateMap = () => {
    if(!map) return;
    
    markers.forEach(m => map.removeLayer(m));
    routeLayers.forEach(l => map.removeLayer(l));
    markers = []; routeLayers = [];

    const list = getters.mapMarkers.value || [];
    const isSeriesOverview = store.filter === 'Series' && !store.activeSeriesId;
    const isSeriesDetail = !!store.activeSeriesId;
    const isVideoSelected = !!store.currentVideo;

    list.forEach((v) => {
        const isSelected = store.currentVideo && store.currentVideo.id === v.id;
        const [jLat, jLng] = getJitteredPos(v.location.lat, v.location.lng, v.series_info?.order || 0);
        const color = isSelected ? '#ef4444' : (v.watched ? '#f59e0b' : '#3b82f6');
        
        let html = '';
        let size = [24, 24];
        let anchor = [12, 12];

        if (isSeriesOverview) {
            size = [36, 36];
            anchor = [18, 18];
            html = `<div class="journey-folder-marker">
                        <div class="reel-hole top"></div>
                        <i class="fa-solid fa-film"></i>
                        <div class="reel-hole bottom"></div>
                        <div class="folder-badge">${v.series_count || 0}</div>
                    </div>`;
        } else if (v.series_id) {
            size = [22, 22];
            anchor = [11, 11];
            html = `<div class="modern-num-marker" style="background:${color}">${v.series_info?.order || ''}</div>`;
        } else {
            size = [30, 40];
            anchor = [15, 40];
            html = `<div class="individual-marker" style="color:${color}">
                        <i class="fa-solid fa-location-dot"></i>
                        <div class="inner-play"><i class="fa-solid fa-play"></i></div>
                    </div>`;
        }

        const icon = L.divIcon({ className: 'custom-icon', html, iconSize: size, iconAnchor: anchor });
        const m = L.marker([jLat, jLng], { icon }).addTo(map).on('click', () => {
            if (isSeriesOverview) actions.enterSeries(v.series_id);
            else actions.setVideo(v);
        });
        markers.push(m);
    });

    const activeSeriesId = store.currentVideo?.series_id || store.activeSeriesId;
    if (activeSeriesId) {
        const group = store.videos.filter(v => v.series_id === activeSeriesId).sort((a, b) => (a.series_info?.order || 0) - (b.series_info?.order || 0));
        group.forEach((v, idx) => {
            const isSelected = store.currentVideo?.id === v.id;
            const [curLat, curLng] = getJitteredPos(v.location.lat, v.location.lng, v.series_info?.order || 0);
            if (idx > 0) {
                const prev = group[idx-1];
                const [pLat, pLng] = getJitteredPos(prev.location.lat, prev.location.lng, prev.series_info?.order || 0);
                let pts = [[pLat, pLng]];
                if (v.route_start?.coordinates) pts.push([v.route_start.coordinates[0], v.route_start.coordinates[1]]);
                pts.push([curLat, curLng]);
                const l = L.polyline(pts, { 
                    color: '#3b82f6', weight: isSelected ? 4 : 2, 
                    opacity: isSelected ? 1 : 0.35, dashArray: isSelected ? '10, 15' : '2, 6', 
                    className: isSelected ? 'flowing-dash' : '' 
                }).addTo(map);
                routeLayers.push(l);
            }
        });
    }

    // REQUIREMENT 2 & 3: ZOOM LOGIC
    if (markers.length > 0) {
        if (isVideoSelected) {
            // REQUIREMENT 3: If a video is selected (Random or Clicked), zoom exactly into it
            const v = store.currentVideo;
            const [jLat, jLng] = getJitteredPos(v.location.lat, v.location.lng, v.series_info?.order || 0);
            map.setView([jLat, jLng], 13, { animate: true });
        } else if (isSeriesDetail) {
            // If just browsing a Journey folder, show the whole path
            const bounds = L.featureGroup(markers).getBounds();
            if (bounds.isValid()) map.fitBounds(bounds, { padding: [60, 60], animate: true });
        }
    }
};

onMounted(() => { initMap(); updateMap(); });
watch(() => getters.mapMarkers.value, updateMap);
watch(() => store.currentVideo, updateMap);
</script>

<template>
    <div class="map-view-wrapper">
        <div id="map"></div>
        <div class="floating-controls">
            <button class="map-btn" @click="actions.toggleMapFullscreen">
                <i :class="store.isMapExpanded ? 'fa-solid fa-compress' : 'fa-solid fa-expand'"></i>
            </button>
            <button class="map-btn dice-btn" @click="actions.getRandomVideo">
                <i class="fa-solid fa-dice"></i>
            </button>
        </div>
    </div>
</template>

<style>
.flowing-dash { stroke-dasharray: 10, 15; animation: dash-flow 1.5s linear infinite; }
@keyframes dash-flow { from { stroke-dashoffset: 25; } to { stroke-dashoffset: 0; } }

.journey-folder-marker { background: #0f172a; color: white; width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.4); position: relative; }
.folder-badge { position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; font-size: 10px; font-weight: 900; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 10; }
.reel-hole { position: absolute; width: 4px; height: 4px; background: white; border-radius: 50%; left: 50%; transform: translateX(-50%); }
.reel-hole.top { top: 3px; } .reel-hole.bottom { bottom: 3px; }
.individual-marker { position: relative; font-size: 40px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3)); display: flex; justify-content: center; }
.inner-play { position: absolute; top: 8px; font-size: 10px; color: white; z-index: 5; }
.modern-num-marker { border-radius: 50%; color: white; font-weight: 800; font-size: 10px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2); width: 22px; height: 22px; }
</style>

<style scoped>
.map-view-wrapper { width: 100%; height: 100%; position: relative; }
#map { width: 100%; height: 100%; background: #f1f5f9; }
.floating-controls { position: absolute; bottom: 20px; left: 16px; z-index: 2000; display: flex; flex-direction: column; gap: 10px; }
.map-btn { width: 40px; height: 40px; border-radius: 10px; border: none; background: white; color: #1e293b; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-size: 1rem; }
.dice-btn { color: #2563eb; }
</style>

