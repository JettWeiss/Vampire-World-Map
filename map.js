const res = await fetch('pins.json');
const vampireLocations = await res.json();
const res2 = await fetch('vampireBios.json');
const vampireBios = await res2.json();

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/bright',
    center: [25.367222, 45.515],
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

//    let stake = await map.loadImage('images/StakePin.png');
//    map.addImage('stake', stake.data);

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

function populateBio(name, region, notes, summary, year, physicalDescription, powers, origin, weaknesses, feedingMethod, culturalContext, images, sources, seeAlso) {
    document.getElementById("name").textContent = name;
    document.getElementById("region").textContent = region;
    document.getElementById("notes").textContent = notes;
    document.getElementById("year").textContent = year;
    document.getElementById("physicalDescription").textContent = physicalDescription;
    document.getElementById("powers").textContent = powers;
    document.getElementById("weaknesses").textContent = weaknesses;
    document.getElementById("feedingMethod").textContent = feedingMethod;
    document.getElementById("culturalContext").textContent = culturalContext;
    document.getElementById("origin").textContent = origin;
    document.getElementById("sources").textContent = sources;
    document.getElementById("seeAlso").textContent = seeAlso;
    document.getElementById("images").src = "images/" + name.replaceAll(" ", "") + ".png";
    const path = "images/" + name.replaceAll(" ", "") + ".png";
    console.log(path);
}

// Click Event
map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['poi-labels'] });
    if (features.length > 0) {
        openNav();
        const bio = features[0].properties.description;
        console.log(vampireBios[bio]);
        let name = vampireBios[bio].name;
        let region = vampireBios[bio].region;
        let notes = vampireBios[bio].notes;
        let summary = vampireBios[bio].summary;
        let year = vampireBios[bio].year;
        let physicalDescription = vampireBios[bio].physicalDescription;
        let powers = vampireBios[bio].powers;
        let origin = vampireBios[bio].origin;
        let weaknesses = vampireBios[bio].weaknesses;
        let feedingMethod = vampireBios[bio].feedingMethod;
        let culturalContext = vampireBios[bio].culturalContext;
        let images = vampireBios[bio].images;
        let sources = vampireBios[bio].sources;
        let seeAlso = vampireBios[bio].seeAlso;
        populateBio(name, region, notes, summary, year, physicalDescription, powers, origin, weaknesses, feedingMethod, culturalContext, images, sources, seeAlso);
    }
});