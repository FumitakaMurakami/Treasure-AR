function run(id) {
  console.log("#" + id);
  const mid = "#" + id;
  var entity = document.querySelector(mid);

  var test = {
    posX: 0,
    posY: 0,
  };

  anime({
    targets: test,
    posY: 2,
    posX: 0,
    elasticity: 10000,
    update: function () {
      entity.setAttribute("position", {
        x: 0,
        y: test.posY,
        z: -4,
      });
    },
    duration: 800,
    direction: "alternate",
    loop: 1,
  });
}
function treasureFound() {
  /* run("button1"); */
  alert("宝を入手しました！");
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function distance(lat1, lng1, lat2, lng2) {
  if (lat1 != lat2 && lng1 != lng2) {
    const R = Math.PI / 180;
    lat1 *= R;
    lng1 *= R;
    lat2 *= R;
    lng2 *= R;
    return (
      6371 *
      Math.acos(
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
          Math.sin(lat1) * Math.sin(lat2)
      )
    );
  } else {
    return 0;
  }
}
function geoSetup() {
  const status = document.querySelector("#status");
  const positions = document.querySelector("#positions");
  const treasure = document.querySelector("#treasure");
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    randomlatitude = getRandomArbitrary(0.0005, 0.001);
    randomlongitude = getRandomArbitrary(0.0005, 0.001);

    let treasurelatitude = latitude + randomlongitude;
    let treasurelongitude = longitude + randomlongitude;
    treasure.setAttribute(
      "gps-entity-place",
      `latitude:${latitude}; longitude:${longitude};`
    );
    /* treasure.setAttribute(
      "gps-entity-place",
      `latitude:${treasurelatitude}; longitude:${treasurelongitude};`
    ); */

    status.textContent = "";
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
function geoFindMe() {
  const status = document.querySelector("#status");
  const positions = document.querySelector("#positions");
  const treasure = document.querySelector("#treasure");
  const b1 = document.querySelector("#button1");
  console.log(b1);
  function success(position) {
    let modellatitude = treasure.getAttribute("gps-entity-place").latitude;
    let modellongitude = treasure.getAttribute("gps-entity-place").longitude;
    console.log(modellatitude, modellongitude);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const pointDistance = Math.round(
      distance(modellatitude, modellongitude, latitude, longitude) * 1000
    );
    if (pointDistance <= 50) {
      if (pointDistance <= 20) {
        treasure.setAttribute("opacity", `1`);
        treasure.setAttribute("color", `red`);
        console.log(b1);
        b1.classList.remove("buttons");
        b1.classList.toggle("after-buttons");
        const Blo = (positions.innerHTML =
          "<div>モデルまでの距離" +
          pointDistance +
          "m" +
          "<br>宝に近づいています！</div>");
      } else {
        treasure.setAttribute("opacity", `1`);
        treasure.setAttribute("color", `black`);
        b1.classList.remove("after-buttons");
        b1.classList.toggle("buttons");
        /* const Blo = (positions.innerHTML =
          "<div>モデルまでの距離" +
          pointDistance +
          "m" +
          "<br>宝を発見しました！</div>"); */
      }
    } else {
      treasure.setAttribute("opacity", `0`);
      /* b1.classList.remove("after-buttons");
      b1.classList.toggle("buttons"); */
      const Blo = (positions.innerHTML =
        "<div>モデルまでの距離" + pointDistance + "m" + "</div>");
    }
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.watchPosition(success, error);
  }
}
window.addEventListener("load", (event) => {
  geoSetup();
  geoFindMe();
});
