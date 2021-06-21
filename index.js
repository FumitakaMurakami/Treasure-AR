let map;
function initMap() {
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude);
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: latitude, lng: longitude },
      zoom: 100,
    });
  }

  function error() {
    alert("Geo ste up error");
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
  } else {
    console.log("Locating…");
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

/* function geoSetupLongitude() {
  function success(position) {
    console.log(position);
    const longitude = position.coords.longitude;
    console.log(longitude);
  }

  function error() {
    alert("Geo ste up error");
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
  } else {
    console.log("Locating…");
    navigator.geolocation.getCurrentPosition(success, error);
  }
  return success.longitude;
} */
