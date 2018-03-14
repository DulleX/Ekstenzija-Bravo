var adresa;
var map;
var geocoder;

function url_domain(data) {
    var a = document.createElement('a');
    a.href = data;
    return a.hostname;
}

function UserAction() {
    var putanja = 'http://freegeoip.net/json/';
    if (adresa.startsWith("http") || adresa.startsWith("https"))
        putanja = putanja + url_domain(adresa);

    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', putanja, true);
    req.onload = function() {
        var jsonResponse = JSON.parse(req.responseText);
        var zemlja = document.getElementById("zemlja");
        var ip = document.getElementById("ip");
        var grad = document.getElementById("grad");
        var vremenskaZona = document.getElementById("vremenskaZona");
        zemlja.innerHTML = jsonResponse.country_name;
        ip.innerHTML = jsonResponse.ip;
        grad.innerHTML = jsonResponse.city;
        vremenskaZona.innerHTML = jsonResponse.time_zone;

        var latitude = jsonResponse.latitude;
        var longitude = jsonResponse.longitude;
        Lokacija = new google.maps.LatLng(latitude, longitude);
        if (latitude !== 0 && longitude !== 0)
            ShowMap(latitude, longitude, Lokacija);
        else
            document.getElementById('errorPoruka').innerHTML = 'Nema informacija o preciznoj lokaciji!';
    };
    req.send(null);
}

document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabUrl((url) => {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(arrayOfTabs) {
            var activeTab = arrayOfTabs[0];
            var activeTabId = activeTab.id;
            adresa = activeTab.url;
            UserAction();
        });
    });
});

function addMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function ShowMap(latitude, longitude, Lokacija) {

    var latlng = new google.maps.LatLng(latitude, longitude);
    var myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    addMarker(Lokacija);
}

function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, (tabs) => {
        var tab = tabs[0];
        var url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });
}