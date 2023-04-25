<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="index.php">Market Finder</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav">
      <a class="nav-item nav-link active" href="index.php">Home <span class="sr-only">(current)</span></a>
      <a class="nav-item nav-link" href="about.php">About</a>
      <a class="nav-item nav-link" href="contact.php">Contact Us</a>
      <?php
        if (!(isset($_SESSION['username']))) {
            echo '<a class="nav-item nav-link right-align" href="login.php">Login</a>';
        } else {
            echo '<a class="nav-item nav-link right-align2" width="20" class="right-align" href="logout.php">Log out</a>';
            echo '<a class="nav-item nav-link" href="user-settings.php"><img src="../static/images/user_setting.png" alt="userSetting" width="20" class="right-align">';
        }
      ?>
      </a>
    </div>
  </div>
</nav>
