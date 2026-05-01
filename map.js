const res = await fetch('pins.json');
const vampireLocations = await res.json();
const res2 = await fetch('vampireBios.json');
const vampireBios = await res2.json();
let currentBio = null;
let currentImageNum = 1;

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/bright',
    center: [25.367222, 45.515], //
    zoom: 6,
    fadeDuration: 0
});

map.on('load', async () => {
    map.addSource('vampireLocations', {
        'type': 'geojson',
        'data': vampireLocations,
        'cluster': true,
        'clusterMaxZoom': 14,
        'clusterRadius': 50
    });

    // Cluster points
    map.addLayer({
        'id': 'clustered-labels',
        'type': 'symbol',
        'source': 'vampireLocations',
        'filter': ['has', 'point_count'],
        'layout': {
            'text-field': ['concat', ['to-string', ['get', 'point_count']], ' Vampires'],
            'text-font': ['Noto Sans Bold'],  // ← bold font
            'text-size': 20,
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto'
        },
        'paint': {
            'text-color': '#ff0000',
            'text-halo-color': '#000000',
            'text-halo-width': 3
        }
    });


    // Single point
    map.addLayer({
        'id': 'poi-labels',
        'type': 'symbol',
        'source': 'vampireLocations',
        'filter': ['!', ['has', 'point_count']],
        'layout': {
            'text-field': ['get', 'description'],
            'text-font': ['Noto Sans Bold'],  // ← bold font
            'text-size': 20,
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto'
        },
        'paint': {
            'text-color': '#ff0000',
            'text-halo-color': '#000000',
            'text-halo-width': 3
        }
    });


});

window.openNav = function() {
    document.getElementById("bioSideBar").style.width = "40%";
}

window.closeNav = function() {
    document.getElementById("bioSideBar").style.width = "0";
}

function populateBio(name, altName, region, notes, summary, year, physicalDescription, powers, origin, weaknesses, feedingMethod, culturalContext, images, sources, seeAlso) {
    document.getElementById("name").textContent = name + altName;
    document.getElementById("region").textContent = region;
    document.getElementById("year").textContent = year;

    document.getElementById("images").src = "images/" + name.replaceAll(" ", "") + "1.png";
    document.getElementById("physicalDescription").textContent = physicalDescription;

    document.getElementById("feedingMethod").textContent = feedingMethod;

    document.getElementById("powers").innerHTML = powers.map(p => `<li>${p}</li>`).join("");
    document.getElementById("weaknesses").innerHTML = weaknesses.map(w => `<li>${w}</li>`).join("");

    document.getElementById("culturalContext").textContent = culturalContext;
    document.getElementById("origin").textContent = origin;

    document.getElementById("notes").textContent = notes;
    document.getElementById("sources").textContent = sources;
    document.getElementById("seeAlso").textContent = seeAlso;
}

// Click Event
map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['poi-labels'] });
    if (features.length > 0) {
        openNav();
        currentBio = features[0].properties.description;
        currentImageNum = 1;
        let name = vampireBios[currentBio].name;
        let altName = vampireBios[currentBio].altName;
        let region = vampireBios[currentBio].region;
        let notes = vampireBios[currentBio].notes;
        let summary = vampireBios[currentBio].summary;
        let year = vampireBios[currentBio].year;
        let physicalDescription = vampireBios[currentBio].physicalDescription;
        let powers = vampireBios[currentBio].powers;
        let origin = vampireBios[currentBio].origin;
        let weaknesses = vampireBios[currentBio].weaknesses;
        let feedingMethod = vampireBios[currentBio].feedingMethod;
        let culturalContext = vampireBios[currentBio].culturalContext;
        let images = vampireBios[currentBio].images;
        let sources = vampireBios[currentBio].sources;
        let seeAlso = vampireBios[currentBio].seeAlso;
        populateBio(name, altName, region, notes, summary, year, physicalDescription, powers, origin, weaknesses, feedingMethod, culturalContext, images, sources, seeAlso);
    }
});

window.prevImage = function (){
    if (currentImageNum == 1){
        console.log("Already on first image");
    } else{
        const creatureName = vampireBios[currentBio].name.replaceAll(" ", "");
        document.getElementById("images").src = "images/" + creatureName + (currentImageNum - 1) + ".png";
        currentImageNum = currentImageNum - 1;
    }
}
window.nextImage = function (){
    const numImages = vampireBios[currentBio].images;
    if (currentImageNum == numImages){
        console.log("Already on final image");
    } else{
        const creatureName = vampireBios[currentBio].name.replaceAll(" ", "");
        document.getElementById("images").src = "images/" + creatureName + (currentImageNum + 1) + ".png";
        currentImageNum = currentImageNum + 1;
    }
}