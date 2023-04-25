<?php include_once 'header.php'; ?>

<div class="enquiry-form-container">
<h1 style="text-align:center;"> Contact Us </h1>
<form class="enquiry-form" action="contact.php" method="post">
<div>
  <input type="text" name="name" placeholder="Enter your name" >
</div>

<div>
  <input type="email" name="email" placeholder="Enter your email address" >
</div>

<div>
  <input type="text" name="subject" placeholder="Subject">
</div>

<div>
  <textarea style="margin-top:2em; font-family:Century Gothic;" name="message" placeholder="Enter your message here" cols="30" rows="15"></textarea>
</div>

<div>
<input type="submit" class="submit-btn" style="border: 2px solid black;"  name="contact" value="Submit">
</div>
</form>
</div>

<?php include_once 'footer.php'; ?>
