    // 1. Select those elments that wil be frequent used.
    var storyboard = $("#storyboard");
    var scene = $(".scene");
    // 2. Declare the maps, thematic layers and the base maps/layers.
    var map, polygonLayer, pointLayer, satelliteBasemap;

    // 3. Initialize the geonarrative structure using scrollama
    var scriptPanel = scrollama();

    // 4. Define Generic window resize listener event
    function handleResize() {
      // update the height of each scene elements
      var sceneH = Math.floor(window.innerHeight * 0.75);
      scene.css("height", sceneH + "px");

      var storyboardHeight = window.innerHeight;
      var storyboardMarginTop = (window.innerHeight - storyboardHeight) / 2;

      storyboard
        .css("height", storyboardHeight + "px")
        .css("top", storyboardMarginTop + "px");

      // tell scrollama to update new element dimensions
      scriptPanel.resize();
    }

    // 5. The function performs when a scene enters the storyboard
    function handleSceneEnter(response) {
      var index = response.index;

      if (index === 0) {

      } else if (index === 1) {
        map.setView(new L.LatLng(44.00, -120.50), 7.5);
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

    // 6. The function performs when a scene exits the storyboard
    function handleSceneExit(response) {
      var index = response.index;

      if (index === 0) {
        map.removeLayer(polygonLayer);
        map.removeLayer(pointLayer);
      } else if (index === 1) {
        map.removeLayer(pointLayer);
      } else if (index === 3) {
        //exit to Portland

      } else if (index === 6) {
        $("#cover").css("visibility", "visible");
      }
    }

    // 7. the function performs when this html document is ready.
    $(document).ready(function() {

      // 8. Intialize the layout.
      // Force a resize on load to ensure proper dimensions are sent to scrollama
      handleResize();
      window.scrollTo(0, 0);
      // Bind the resize function to the window resize event
      window.addEventListener("resize", handleResize);

      // 9. Use a promise mechnism to asynchrously load the required geojson datasets.
      Promise.all([
        $.getJSON("assets/data/oregon_county.geojson"),
        $.getJSON("assets/data/oregon_fire.geojson")
      ]).then(function(datasets) {

        // 10. After the data are successfully loaded, the then funciton will execute in order to
        //    a) preprocess the data as map layers
        //    b) initialize the script panel
        //    c) initialize the map and layers.


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
            color: '#922b21 ',  //Outline color
            fillOpacity: 0.7
        });

        scriptPanel
          .setup({
            step: ".scene", // all the scenes.
            offset: 0.33,   // the location of the enter and exit trigger
            debug: false  // toggler on or off the debug mode.
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
        detectRetina: true // detect whether the sceen is high resolution or not.
      });


      satelliteBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
      map.addLayer(satelliteBasemap);

      

      
    });
