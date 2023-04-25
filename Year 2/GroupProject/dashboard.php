<?php include_once 'header.php'; ?>
<?php
if (!(isset($_SESSION['username']))) {
    header('Location: login.php');
}
   // Count how many text fields are in the json file
   $json = file_get_contents('./api/pulled_data_load.geojson');
   $json_data = json_decode($json, true);
   $totalPosts = count($json_data['features']);

   // Get the sentiment of Coca-cola and calculate how many positive and negative posts there are
    $sentiment_cola = [];
    $sentiment_cola['positive'] = 0;
    $sentiment_cola['negative'] = 0;
    $sentiment_cola['neutral'] = 0;
    $sentiment_cola['total'] = 0;

    $sentiment_fanta = [];
    $sentiment_fanta['positive'] = 0;
    $sentiment_fanta['negative'] = 0;
    $sentiment_fanta['neutral'] = 0;
    $sentiment_fanta['total'] = 0;

    foreach ($json_data['features'] as $post) {
        if ('Coca-Cola' == $post['properties']['product']) {
            ++$sentiment_cola['total'];
            if ('positive' == $post['properties']['sentiment']) {
                ++$sentiment_cola['positive'];
            } elseif ('negative' == $post['properties']['sentiment']) {
                ++$sentiment_cola['negative'];
            } else {
                ++$sentiment_cola['neutral'];
            }
        } elseif ('Fanta' == $post['properties']['product']) {
            ++$sentiment_fanta['total'];
            if ('positive' == $post['properties']['sentiment']) {
                ++$sentiment_fanta['positive'];
            } elseif ('negative' == $post['properties']['sentiment']) {
                ++$sentiment_fanta['negative'];
            } else {
                ++$sentiment_fanta['neutral'];
            }
        }
    }
    // Get the tv_show from properties and count how many times each tv show is mentioned
    $tv_show_names = [];
    $tv_show_count = [];

    for ($i = 0; $i < $totalPosts; ++$i) {
        $tv_show_name = $json_data['features'][$i]['properties']['tv_show'];
        if (!(in_array($tv_show_name, $tv_show_names))) {
            $tv_show_names[] = $tv_show_name;
            $tv_show_count[] = 1;
        } else {
            ++$tv_show_count[array_search($tv_show_name, $tv_show_names)];
        }
    }

    // Get the product from properties and count how many times each product is mentioned
    $product_names = [];
    $product_count = [];

    for ($i = 0; $i < $totalPosts; ++$i) {
        $product_name = $json_data['features'][$i]['properties']['product'];
        if (!(in_array($product_name, $product_names))) {
            $product_names[] = $product_name;
            $product_count[] = 1;
        } else {
            ++$product_count[array_search($product_name, $product_names)];
        }
    }

    // Get the likes and retweets from properties and count how many times each like and retweet is mentioned for each product
    $likes_cola = [];
    $likes_cola['likes'] = 0;
    $reweets_cola['retweets'] = 0;

    $likes_fanta = [];
    $likes_fanta['likes'] = 0;
    $reweets_fanta['retweets'] = 0;

    for ($i = 0; $i < $totalPosts; ++$i) {
        if ('Coca-Cola' == $json_data['features'][$i]['properties']['product']) {
            $likes_cola['likes'] += $json_data['features'][$i]['properties']['likes'];
            $reweets_cola['retweets'] += $json_data['features'][$i]['properties']['retweets'];
        } elseif ('Fanta' == $json_data['features'][$i]['properties']['product']) {
            $likes_fanta['likes'] += $json_data['features'][$i]['properties']['likes'];
            $reweets_fanta['retweets'] += $json_data['features'][$i]['properties']['retweets'];
        }
    }

    // Get top interest from properties and display the top interest
    $interest_names = [];
    $interest_count = [];

    for ($i = 0; $i < $totalPosts; ++$i) {
        $interest_name = @$json_data['features'][$i]['properties']['interests'];
        if (!(in_array($interest_name, $interest_names))) {
            $interest_names[] = $interest_name;
            $interest_count[] = 1;
        } else {
            ++$interest_count[array_search($interest_name, $interest_names)];
        }
    }

    // Total posts by product
    $total_posts_cola = 0;
    $total_posts_fanta = 0;

    for ($i = 0; $i < $totalPosts; ++$i) {
        if ('Coca-Cola' == $json_data['features'][$i]['properties']['product']) {
            ++$total_posts_cola;
        } elseif ('Fanta' == $json_data['features'][$i]['properties']['product']) {
            ++$total_posts_fanta;
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />

    <link rel="stylesheet" href="static/style.css">
     <link rel="stylesheet" href="static/bootstrap.min.css">
    <title> Group Project </title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js'></script>
    <script type="text/javascript">
        var fantaP = '<?php echo $sentiment_fanta['positive']; ?>';
        var fantaN = '<?php echo $sentiment_fanta['negative']; ?>';
        var colaP = '<?php echo $sentiment_cola['positive']; ?>';
        var colaN = '<?php echo $sentiment_cola['negative']; ?>';
    </script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css' rel='stylesheet' />
    <script src="mapConfig.js" defer></script>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
    crossorigin="anonymous">
    <link rel="stylesheet" href="static/style.css">

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
          <div class="num"> <?php echo $totalPosts; ?> </div>
        </div>

        <div class="stat">
          <div class="stat_name"> Most trending TV show </div>
          <div class="num1">  <?php echo $tv_show_name; ?> </div>
        </div>

        <div class="stat">
          <div class="stat_name"> Interests </div>
          <div class="num1"> <?php echo $interest_name; ?> </div>
        </div>
      </div>
    </div>

    <div class="container2">
      <div class="db_output">
      <div class="titles">  Overall Sentiment </div>
      <table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col"> </th>
      <th scope="col">Fanta</th>
      <th scope="col">Coca-Cola</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Positive</th>
      <td><?php echo $sentiment_fanta['positive']; ?></td>
      <td><?php echo $sentiment_cola['positive']; ?></td>
    </tr>
    <tr>
      <th scope="row">Negative</th>
      <td><?php echo $sentiment_fanta['negative']; ?></td>
      <td><?php echo $sentiment_cola['negative']; ?></td>
    </tr>
    <tr>
      <th scope="row">Total</th>
      <td><?php echo $sentiment_fanta['total']; ?></td>
      <td><?php echo $sentiment_cola['total']; ?></td>
    </tr>
  </tbody>
</table>
      </div>

      <div class="chart">
        <div class="titles"> Overall Sentiment as Chart </div>
        <div class="chart-wrapper">
          <canvas id="postChart"></canvas>
        </div>
      </div>

    </div>

    <div class="container2">
    <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col"> </th>
      <th scope="col">Fanta</th>
      <th scope="col">Coca-Cola</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Likes</th>
      <td><?php echo $likes_fanta['likes']; ?></td>
      <td><?php echo $likes_cola['likes']; ?></td>
    </tr>
    <tr>
      <th scope="row">Retweets</th>
      <td><?php echo $reweets_fanta['retweets']; ?></td>
      <td><?php echo $reweets_cola['retweets']; ?></td>
    </tr>
  </tbody>
</table>
    </div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
<script src="pieChart.js"></script>
</article>
</body>
</html>
