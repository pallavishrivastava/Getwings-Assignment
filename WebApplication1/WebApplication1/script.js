var mydata;
var currentLat;
var currentLng;
function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) {
                    mydata = JSON.parse(xhr.responseText);
                    listDisplay(mydata);
                    console.log(mydata);
                }
                else {
                    if (error)
                        error(xhr);
                }
            };

        }
    }
    xhr.open("GET", path, true);
    xhr.send();
}

loadJSON('http://54.175.194.45:8028/posts', function () { }, function () { });

function listDisplay(data) {
    var mainDiv = document.createElement("div");
    var divData = document.createElement("div");
    var divMap = document.createElement("div");

    mainDiv.id = "wrapper";
    divData.id = "data";
    divMap.id = "map";
    for (var i = 0; i < data.length; i++) {    
        var div = document.createElement("div");
        
        var img = document.createElement("img");
        img.src = data[i].picture;
        img.alt = data[i].name.first;

        var nameLabel = document.createElement('label');
        nameLabel.className = "name";
        var anchor = document.createElement('a');
        anchor.href = "javascript:void(0)";

        nameLabel.innerHTML = " " + data[i].name.first + " " + data[i].name.last;



        var innerDiv = document.createElement('div');
        innerDiv.classList = "collapse details";

        nameLabel.onclick = function ($event) {
            var parent = $event.target.parentElement;        
            var divCollapse = parent.getElementsByClassName('details')[0];        
            var list = divCollapse.classList;
            if (list.contains('collapse')) {
                var det = document.getElementsByClassName('details');
                for(var j=0;j<det.length;j++){
                    if (!det[j].classList.contains('collapse')) {
                        det[j].classList.add('collapse');
                    }
                }
            };
        
            divCollapse.classList.toggle("collapse");
            var latId ='lat' + $event.target.textContent.split(' ')[1];
            var element = document.getElementById(latId);
            var lat = element.getElementsByClassName('value')[0].textContent;
            var lng = element.getElementsByClassName('value')[1].textContent;

            initialize(lat, lng);
        }

        Object.keys(data[i]).forEach(function(key,index) {
            // key: the name of the object key
            // index: the ordinal position of the key within the object
            if (key != "picture" && key != "name" && key !="user_location") {
                var label = document.createElement('div');
                label.innerHTML = "<span class='title'>"+key + "</span>:" +"<span class='value'>"+ data[i][key]+"</span>";
                innerDiv.appendChild(label);
            }
            if (key == "user_location") {
                var label = document.createElement('div');
                var lat = "<span class='title'> latitude </span>:" + "<span class='value'>" + data[i][key].latitude + "</span>";
                label.innerHTML = lat + "<span class='title'> longitude </span>:" + "<span class='value'>" + data[i][key].longitude + "</span>";
                label.id = "lat" + data[i].name.first;
                innerDiv.appendChild(label);
            }
        });
           
        div.appendChild(img);
        div.appendChild(nameLabel);
        div.appendChild(innerDiv);
        divData.appendChild(div);
    };

    mainDiv.appendChild(divData);
    var distanceLabel = document.createElement('div');
    distanceLabel.className = "name";
    distanceLabel.id = 'lblDistance';
    mainDiv.appendChild(distanceLabel);
    mainDiv.appendChild(divMap);
    document.body.appendChild(mainDiv);

    getLocation();
}


function initialize(lat,lng) {
    var mapProp = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapProp);
    var marker = new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        map: map,
        title: lat + ',' + lng
    });
    if (lat != currentLat && lng != currentLng) {
        var latLngA = new google.maps.LatLng(currentLat, currentLng);
        var latLngB = new google.maps.LatLng(lat, lng);
        var distance = parseInt(google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB));
        document.getElementById("lblDistance").textContent = "Distance From Current Location: " + (distance / 1000) + "Kms.";

        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        var request = {
            origin: latLngA,
            destination: latLngB,
            travelMode: google.maps.TravelMode.TRANSIT
        };
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    currentLat = position.coords.latitude;
    currentLng = position.coords.longitude;
    initialize(currentLat, currentLng);
}

function displayRoute() {

    var start = new google.maps.LatLng(28.694004, 77.110291);
    var end = new google.maps.LatLng(28.72082, 77.107241);

    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}


