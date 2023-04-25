public class TestNewsWatchers {
  public static void main(String[] args) {
    NewsReporter nr = new NewsReporter();
    EverythingWatcher eWatcher = new EverythingWatcher(nr);
    SelectiveWatcher busWatcher = new SelectiveWatcher(nr, "business");
    SelectiveWatcher sciWatcher = new SelectiveWatcher(nr, "science");

    nr.setLatestNews("business", "Microsoft releases new MiOS - a new operating system for iPhones");
    nr.setLatestNews("other", "Classic FM signs exclusive contract with Beethoven");
    nr.setLatestNews("science", "New evidence Newton invented gravity after an apple fell on his head");
  }
}
