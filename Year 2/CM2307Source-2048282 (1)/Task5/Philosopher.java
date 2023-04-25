public class Philosopher implements Runnable {
    // The forks on either side of this Philosopher and his/her philosopher number
    private Fork leftFork;
    private Fork rightFork;
    private int philosopherNumber;

    public Philosopher(Fork left, Fork right, int philNumber) {
        leftFork = left;
        rightFork = right;
        philosopherNumber=philNumber;
    }
    
	private void doAction(String action) throws InterruptedException {
        System.out.println("Philosopher number " + philosopherNumber + " time: " + System.nanoTime() + ": " + action);
        Thread.sleep(((int) (Math.random() * 100)));
    }

    public void run() {
        try {
            while (true) {
                
                // thinking
                doAction("Thinking");
                synchronized (leftFork) {
                    leftFork.inUse=true;
                    doAction("Picking up left fork");
                    synchronized (rightFork) {
                        // eating
                        rightFork.inUse=true;
                        doAction("Picking up right fork"); 
                        doAction("Eating");
                        doAction("Putting down right fork");
                        rightFork.inUse=false;
                    }
                    // Back to thinking
                    doAction("Putting down left fork");
                    leftFork.inUse=false;
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return;
        }
    }
}
