
//Aqui debe agregar el token de acceso al los servicios
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9yZmVybm8iLCJhIjoiY2tkOWg4OXdvMHZ4ZTJ4bHYzcWE4cHNhbyJ9.p325OZHt3dWgfdPBsvts-w';


var map = new mapboxgl.Map({
    container: 'map',
    //style:Aqui se define el style (escala de grises, etc),
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-99.155441, 19.289599],
    zoom:16,
    pitch: 45,
    bearing: -17.6,
    antialias: true
});

// addControl: Aqui se agregan los conntroles de Navegacion / FullScren / Posicion
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

// Si se desea se define el orgen
var origin = [-99.128448,19.483221];
var destination = [-99.158653, 19.291375];

// A simple line from origin to destination.
var route = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [origin, destination]
            }
        }
    ]
}

map.on('load', function() {
    // Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
    labelLayerId = layers[i].id;
    break;
    }
    }

    //Mapeo incluyendo volumenes
    map.addLayer(
        {
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
            }
        },
        labelLayerId
    );


    map.loadImage(
        'pinHospitals.png',
        function(error, image) {
        if (error) throw error;
        map.addImage('imagenpin', image);

            map.addLayer({
                'id': 'CDMX',
                'type': 'symbol',
                'source': {
                    'type': 'geojson',
                    'data': 'Data/capacidad-hospitalaria.geojson',
                },

                'layout': {
                    'icon-image':"imagenpin",
                    'icon-size': 0.05,
                    // get the icon name from the source's "icon" property
                    // concatenate the name to get an icon from the style's sprite sheet
                    //'icon-image': ['concat', ['get', 'icon'], '-15'],
                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top'
                }
            });
        }
    );


// al hacer click, se muestra la data asociada al pinHospital
map.on('click', 'CDMX', function(e) {

    var coordinates = e.features[0].geometry.coordinates.slice();
    var institucion = e.features[0].properties.institucion;
    var nombre_hospital = e.features[0].properties.nombre_hospital;
    var fecha = e.features[0].properties.fecha;
    var estatus_capacidad_hospitalaria = e.features[0].properties.estatus_capacidad_hospitalaria;


    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup({ offset: 50 })
    .setLngLat(coordinates)
    .setHTML("INSTITUCION: "+ institucion + "<br>"
    + "Nombre_del_Hospital:" + nombre_hospital + "<br>"
    + "Fecha:" + fecha + "<br>"
    + "Status Capacidad Hospitalaria: " + estatus_capacidad_hospitalaria + "<br>"
    ).addTo(map);

    });


});
