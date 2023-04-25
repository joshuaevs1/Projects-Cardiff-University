<?php include_once 'header.php'; ?>
<?php if ((isset($_SESSION['username']))) {
    header('Location: dashboard.php');
}
?>

<div style="background-image: url('static/images/frontpage_map.png');">
  <div class="mask d-flex align-items-center h-100 gradient-custom-3" style="padding-top: 2%; padding-bottom: 5%;">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="card" style="border-radius: 15px;">
            <div class="card-body p-5">
              <h2 class="text-uppercase text-center mb-5" style="color: black; opacity: 0.8;">Create an account</h2>

              <form action="register.php" method="POST" id="register_form">

                <div class="form-outline mb-4">
                  <input type="text" name="username" placeholder="Username" id="username" class="form-control form-control-lg" />
                </div>

                <div class="form-outline mb-4">
                  <input type="email" name="email" placeholder="Email" id="email" class="form-control form-control-lg" />
                </div>

                <div class="form-outline mb-4">
                  <input type="password" name="password" placeholder="Password" id="password" class="form-control form-control-lg" />
                </div>

                <div class="form-outline mb-4">
                  <input type="password" name="confirm_password" placeholder="Confirm Password" id="confirm_password" class="form-control form-control-lg" />
                </div>

                <div class="d-flex justify-content-center">
                  <input type="submit" name="register" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body" value="Register" />
                </div>

                <p class="text-center text-muted mt-5 mb-0" style="font-size:18px;">Already have an account? <a href="login.php" class="fw-bold text-body"><u>Login here</u></a></p>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<?php include_once 'footer.php'; ?>
