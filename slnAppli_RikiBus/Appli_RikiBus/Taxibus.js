$('document').ready(function () {
    // initialization de la map
    var map = L.map('map').setView([48.4506343914947, -68.5289754901558], 12);

    //Chargement de la carte de base
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Ajout d'un marker avec popup
    var marker = L.marker([48.4532573993011, -68.5227191989171]).addTo(map);
    marker.bindPopup("Je fait des tests");

    //Ajout d'un popup Onclick sur la map 
    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("Tu as cliqués sur la map à " + e.latlng.toString())

            .openOn(map);
    }
    map.on('click', onMapClick);

    var geojsonLayer = new L.GeoJSON();
    geojsonLayer.addTo(map);

    function filtreZone(regex, data) {
        var array = [];
        for (i = 2; i < data.length; ++i) {
            var str = "";
            str = data[i].properties.Type_arret;
            if (regex.test(str)) {
                array[array.length] = data[i];
            }
        }
        return array;
    }

    //Lecture GeoJson
    $.getJSON("Arrets.json", function (data) {
        var array = data.features;



       geojsonLayer.addData(filtreZone(/rouge/,array));
    });

//   array = json.features;


//    var gne = 1; 

//    var arrayVert = array.slice(2,array.length-1).map(function (point) {
//        if (point.properties.Type_arret.includes('Zone verte'))
//            return point;

//    });

//    geojsonLayer.addData(arrayVert).addTo(map); 

});

