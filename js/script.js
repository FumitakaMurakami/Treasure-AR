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
  if (lat1 === lat2 || lng1 === lng2) return 0;

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
}

function showMessage(message) {
  const status = document.querySelector("#status");
  status.textContent = message;
}

/**
 * 現在位置の取得と周辺への宝の配置
 */
function geoSetup() {
  // Geolocation guard
  if (!navigator.geolocation) {
    showMessage("Geolocation is not supported by your browser");
  }

  const positions = document.querySelector("#positions");
  const treasure = document.querySelector("#a-treasure");

  const success = (position) => {
    const { latitude, longitude } = position.coords;

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

    showMessage("");
  };

  showMessage("Locating…");
  navigator.geolocation.getCurrentPosition(success, () =>
    showMessage("Unable to retrieve your location")
  );
}

function getDistance(position, treasure) {
  const { latitude: modellatitude, longitude: modellongitude } =
    treasure.getAttribute("gps-entity-place");
  console.log(modellatitude, modellongitude);
  const { latitude, longitude } = position.coords;

  const pointDistance = Math.round(
    distance(modellatitude, modellongitude, latitude, longitude) * 1000
  );
  return pointDistance;
}

function buildButtonWhenFindTresure(isClear) {
  const getbutton = document.querySelector("#getbutton");
  if (isClear) {
    getbutton.innerHTML = "";
    return;
  }
  /* const getbutton = document.createElement("button"); */
  getbutton.id = "button1";
  getbutton.setAttribute("class", "buttons");
  getbutton.setAttribute("type", "button");
  getbutton.addEventListener("click", treasureFound);
  getbutton.textContent = "宝を入手する";
}

/**
 * distanceType : "found" | "near" | "far"
 */
function buildPositionDisplay(distanceType, pointDistance) {
  const positions = document.querySelector("#positions");

  const message =
    distanceType === "found"
      ? "宝を発見しました！"
      : distanceType === "near"
      ? "宝に近づいています！"
      : "";
  positions.innerHTML = `<div>
      モデルまでの距離
      ${pointDistance} m
      <br>${message}
    </div>`;
}

/**
 * 宝探しゲーム本編
 */
function geoFindMe() {
  if (!navigator.geolocation) {
    showMessage("Geolocation is not supported by your browser");
  }

  const treasure = document.querySelector("#a-treasure");

  const success = (position) => {
    // 宝箱との距離を取得
    const pointDistance = getDistance(position, treasure);

    if (pointDistance <= 20) {
      treasure.setAttribute("opacity", `1`);
      treasure.setAttribute("color", `red`);

      // 宝箱を獲得するボタンの作成
      buildButtonWhenFindTresure();

      // 宝物との位置の表示
      buildPositionDisplay("found", pointDistance);
    } else if (pointDistance <= 50) {
      treasure.setAttribute("opacity", `1`);
      treasure.setAttribute("color", `black`);

      // ボタンをクリア
      buildButtonWhenFindTresure(true);

      // 宝物との位置の表示
      buildPositionDisplay("near", pointDistance);
    } else {
      treasure.setAttribute("opacity", `0`);

      // ボタンをクリア
      buildButtonWhenFindTresure(true);

      // 宝物との位置の表示
      buildPositionDisplay("far", pointDistance);
    }
  };

  showMessage("Locating…");

  // ポジションを監視し続ける
  navigator.geolocation.watchPosition(success, () => {
    showMessage("Unable to retrieve your location");
  });
}

window.addEventListener("load", (event) => {
  geoSetup();
  geoFindMe();
});
