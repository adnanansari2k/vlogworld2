import { createApp } from 'vue'
import App from './App.vue'

// 1. Import the global styles we created
import './assets/main.css' 

// 2. Import Leaflet CSS (Required for the map to look right)
// Make sure you ran: npm install leaflet
import 'leaflet/dist/leaflet.css'


createApp(App).mount('#app')
