<script setup>
import { store, getters } from '../stores/vlogStore';

const getStampStyle = (count) => {
    if (count >= 5) return 'gold';
    return count % 2 === 0 ? 'blue' : 'red';
};
</script>

<template>
    <div class="modal-overlay" @click.self="store.showPassport = false">
        <div class="logbook">
            <div class="logbook-header">
                <div class="logbook-title">TRAVEL LOGBOOK</div>
                <i class="fa-solid fa-xmark" style="cursor:pointer;" @click="store.showPassport = false"></i>
            </div>
            
            <div class="logbook-stats">
                <div class="stat-item">
                    <div class="stat-val">{{ getters.collectedCount.value }}</div>
                    <div class="stat-lbl">Countries</div>
                </div>
                <div class="stat-item">
                    <div class="stat-val">{{ getters.totalWatched.value }}</div>
                    <div class="stat-lbl">Journeys</div>
                </div>
            </div>

            <div class="logbook-content">
                <div class="section-label">Stamp Collection</div>
                <div class="stamp-grid">
                    <div v-for="c in getters.countryStats.value.filter(x => x.count > 0)" :key="c.name" class="stamp" :class="getStampStyle(c.count)">
                        {{ c.name.substring(0, 9) }}
                        <div v-if="c.count > 1" class="visit-count">x{{ c.count }}</div>
                    </div>
                </div>
                
                <div v-if="getters.collectedCount.value === 0" style="text-align:center; padding:20px; color:#9ca3af; font-style:italic;">
                    Start watching to collect stamps.
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2000; backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
.logbook { background: #fffbeb; width: 400px; max-width: 90%; max-height: 85vh; border-radius: 16px; border: 4px solid #1e293b; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
.logbook-header { background: #1e293b; padding: 16px; color: white; display: flex; justify-content: space-between; align-items: center; }
.logbook-title { font-family: 'Courier Prime', monospace; font-weight: 700; letter-spacing: 1px; color: #fcd34d; }
.logbook-stats { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px dashed #d1d5db; background: #fffbeb; }
.stat-item { padding: 20px; text-align: center; }
.stat-val { font-size: 1.8rem; font-weight: 800; color: #78350f; line-height: 1; }
.stat-lbl { font-size: 0.7rem; text-transform: uppercase; color: #92400e; font-weight: 700; letter-spacing: 1px; margin-top: 5px; }
.logbook-content { padding: 20px; overflow-y: auto; flex: 1; }
.section-label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; margin: 20px 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
.stamp-grid { display: flex; flex-wrap: wrap; gap: 15px; }
.stamp { width: 70px; height: 70px; border-radius: 50%; border: 3px solid; display: flex; align-items: center; justify-content: center; text-align: center; font-family: 'Courier Prime', monospace; font-weight: 700; font-size: 0.65rem; line-height: 1.1; opacity: 0.8; transform: rotate(-10deg); position: relative; }
.stamp.gold { color: #b45309; border-color: #b45309; border-style: double; border-width: 4px; background: rgba(180, 83, 9, 0.05); transform: rotate(5deg); opacity: 1; }
.stamp.blue { color: #1e40af; border-color: #1e40af; }
.stamp.red { color: #991b1b; border-color: #991b1b; transform: rotate(10deg); }
.visit-count { position: absolute; bottom: -5px; right: -5px; background: #1e293b; color: #fcd34d; font-size: 0.6rem; padding: 2px 5px; border-radius: 10px; font-family: sans-serif; border: 1px solid white;}
</style>

