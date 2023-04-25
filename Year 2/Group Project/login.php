<?php include_once 'header.php'; ?>


<div style="background-image: url('static/images/frontpage_map.png');">
  <div class="mask d-flex align-items-center h-100 gradient-custom-3" style="padding-top: 2%; padding-bottom: 5%;">
    <div class="container h-100" style="max-height:60%;">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="card" style="border-radius: 15px;">
            <div class="card-body p-5">
              <h2 class="text-uppercase text-center mb-5" style="color: black; opacity: 0.8;">Log In</h2>

              <form action="login.php" method="POST" id="login_form">

                <div class="form-outline mb-4">
                  <input type="text" name="username" placeholder="Username" id="username" class="form-control form-control-lg" />
                </div>

                <br>

                <div class="form-outline mb-4">
                  <input type="password" name="password" placeholder="Password" id="password" class="form-control form-control-lg" />
                </div>

                <br>

                <div class="d-flex justify-content-center">
                  <input type="submit" name="login" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body" value="Login" />
                </div>

                <p class="text-center text-muted mt-5 mb-0" style="font-size:18px;">Don't have an account? <a href="register.php" class="fw-bold text-body"><u>Create one here</u></a></p>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<?php include_once 'footer.php'; ?>
