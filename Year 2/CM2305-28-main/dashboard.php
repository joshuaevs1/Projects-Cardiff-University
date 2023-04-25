
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />

    <link rel="stylesheet" href="static/style.css">
     <link rel="stylesheet" href="static/bootstrap.min.css">
    <?php include 'navbar.php'; ?>

    <title> Group Project </title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v2.5.1/mapbox-gl.js"></script>  <!-- change to npm maybe -->
    <link
      href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.5.1/mapbox-gl.css" rel='stylesheet'/>
    <script src="mapConfig.js" defer></script>
  </head>

  <body style="background-color: #1a1a1a;">
    <article>
      <div class="mappingbox">
        <div class="innerbox">
          <div id="map"></div>
        </div>
      </div>

<div class="container1">
      <div class="grid_container">
        <div class="stat">
          <div class="stat_name"> Total Posts </div>
        </div>

        <div class="stat">
          <div class="stat_name"> Post Share % </div>
        </div>

        <div class="stat">
          <div class="stat_name"> Overall Sentiment </div>
        </div>
      </div>
    </div>

    <div class="container2">
      <div class="db_output">
      <div class="titles">  DB Stats </div>
      </div>

      <div class="chart">
        <div class="titles"> Insert Chart </div>
      </div>

    </div>

</article>
</body>
</html>
