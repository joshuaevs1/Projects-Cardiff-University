<?php include_once 'header.php';
if (!(isset($_SESSION['username']))) {
    header('Location: login.php');
}
?>

<div style="background-image: url('static/images/frontpage_map.png');">
  <div class="mask d-flex align-items-center h-100 gradient-custom-3" style="padding-top: 2%; padding-bottom: 5%;">
    <div class="container h-100" style="max-height:60%;">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="card" style="border-radius: 15px;">
            <div class="card-body p-5">
              <h2 class="text-uppercase text-center mb-5" style="color: black; opacity: 0.8;">User Settings</h2>

              <form action="user-settings.php" method="POST">
				
				<div class="form-outline mb-4">
                  <td align="right">Email &nbsp</td>
                </div>

                <div class="form-outline mb-4">
                  <input type="text" id="email" name="new_email" placeholder="">
                </div>

				<br>

				<div class="form-outline mb-4">
                  <td align="right">Password &nbsp</td>
                </div>

                <div class="form-outline mb-4">
                  <input type="radio" name="password" checked="checked">Do not change.
                </div>
			
				<div class="form-outline mb-4">
                  <input type="radio" name="password">Set new password
                </div>

				<div class="form-outline mb-4">
                  <input type="password" name="new_password" id="new_password">
                </div>

				<br>

				Confirm new password

				<div class="form-outline mb-4">
                  <input type="password" name="confirm_password" id="confirm_password">
                </div>
				
				<br>
				
				<input class="usersetting_btn" type="submit" name="usersettings" value="Confirm"
				
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<?php include_once 'footer.php'; ?>