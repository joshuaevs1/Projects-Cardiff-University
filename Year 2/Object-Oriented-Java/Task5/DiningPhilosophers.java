public class DiningPhilosophers {

    public static void main(String[] args) throws Exception {
        
        final int problemSize=5;
        Fork leftFork;
        Fork rightFork;
        
        Philosopher[] philosophers = new Philosopher[problemSize];
        Fork[] forks = new Fork[problemSize];

        for (int i = 0; i < problemSize; i++) {
            forks[i] = new Fork();
        }

        for (int i = 0; i < problemSize; i++) {
            leftFork = forks[i];
            rightFork = forks[(i + 1) % problemSize];

            if (i == 1){
                philosophers[i] = new Philosopher(rightFork, leftFork, i+1);
            } else {
                philosophers[i] = new Philosopher(leftFork, rightFork, i+1);
            }
            Thread t = new Thread(philosophers[i]);
            t.start();
        }
    }
}
