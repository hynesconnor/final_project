    var storyboard = $("#storyboard");
    var scene = $(".scene");
    var map, polygonLayer, pointLayer, satelliteBasemap;
    var scriptPanel = scrollama();

    function handleResize() {
      var sceneH = Math.floor(window.innerHeight * 0.75);
      scene.css("height", sceneH + "px");

      var storyboardHeight = window.innerHeight;
      var storyboardMarginTop = (window.innerHeight - storyboardHeight) / 2;

      storyboard
        .css("height", storyboardHeight + "px")
        .css("top", storyboardMarginTop + "px");

      scriptPanel.resize();
    }

    function handleSceneEnter(response) {
      var index = response.index;

      if (index === 0) {

      } else if (index === 1) {
        map.setView(new L.LatLng(44.00, -120.50), 7.5);
        map.addLayer(polygonLayer);
        map.addLayer(pointLayer);
      } else if (index === 2) {
        //Relocate to Seattle
        map.setView(new L.LatLng(44.84, -122.20), 12);
        map.addLayer(pointLayer);
      } else if (index === 3) {
        //Relocate to Portland
        map.setView(new L.LatLng(45.5428119, -122.7243662), 12);
      } else if (index === 6) {
        $("#cover").css("visibility", "hidden");
      }
    }


    function handleSceneExit(response) {
      var index = response.index;

      if (index === 0) {
        map.removeLayer(polygonLayer);
        map.removeLayer(pointLayer);
      } else if (index === 1) {
        map.removeLayer(pointLayer);
      } else if (index === 3) {
      } else if (index === 6) {
        $("#cover").css("visibility", "visible");
      }
    }

    $(document).ready(function() {
      handleResize();
      window.scrollTo(0, 0);
      window.addEventListener("resize", handleResize);

      Promise.all([
        $.getJSON("assets/data/oregon_county.geojson"),
        $.getJSON("assets/data/oregon_fire.geojson")
      ]).then(function(datasets) {

        polygonLayer = L.geoJSON(datasets[0], {
          fillColor: '#a9cce3',
          weight: 1.2,
          opacity: 1,
          color: '#2471a3 ',
          fillOpacity: 0.0
        });
        pointLayer = L.geoJSON(datasets[1], {
            onEachFeature: function (feature, layer) {
              layer.bindPopup('<h1>'+feature.properties.IncidentNa + ' Fire' +'</h1><p>Acres Burned: '+feature.properties.GISAcres+'</p>' +
               '</h1><p>Date of Fire: '+feature.properties.CreateDate+'</p>');
            },
            fillColor: '#ec7063 ',
            weight: 1.3,
            opacity: .8,
            color: '#922b21 ',
            fillOpacity: 0.7
        });

        scriptPanel
          .setup({
            step: ".scene",
            offset: 0.33,
            debug: false
          })
          .onStepEnter(handleSceneEnter)
          .onStepExit(handleSceneExit);
      });

      map = L.map('map', {
        center: [44.00, -120.50],
        zoom: 7,
        scrollWheelZoom: false,
        zoomControl: false,
        maxZoom: 10,
        minZoom: 3,
        detectRetina: true
      });

      satelliteBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
      map.addLayer(satelliteBasemap);
    });
