const socket = io();

// Your current location
const initialLat = 22.6838257;
const initialLng = 77.1381708;

// Set the map to your initial location
const map = L.map("map").setView([initialLat, initialLng], 18);

// Add a tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

// Add a marker at your initial location
const initialMarker = L.marker([initialLat, initialLng]).addTo(map);

// Store markers for other users
const markers = {};

// Function to update your location on the map
function updateLocation(latitude, longitude) {
    map.setView([latitude, longitude], 18);
    initialMarker.setLatLng([latitude, longitude]);
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
            updateLocation(latitude, longitude);
        }, (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Handle receiving location updates from other users
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Handle user disconnections
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
