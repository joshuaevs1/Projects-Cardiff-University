public class EverythingWatcher extends NewsWatcher {

  public EverythingWatcher(NewsReporter aNewsReporter) {
    theNewsReporter = aNewsReporter;
    theNewsReporter.attach(this);
  }

  public void update() {
  // Modify this so that it always prints out the update text,
  // regardless of the update category
    String c = theNewsReporter.getUpdateText();
    System.out.println("The news watcher watching for everything");
    System.out.println("has received a new alert:");
    System.out.println('"' + c + '"');
    System.out.println(" ");
  }
}
