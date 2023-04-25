import java.io.*;
import java.util.*;

public class Die implements Game {
    public static BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
    public static RandomInterface r=new LinearCongruentialGenerator();


  //Variable(s) used in the die game methods
  public static HashSet<Integer> numbersRolled=new HashSet<Integer>();

  @Override
  public void initialiseGame() throws Exception {
      // The initialisation phase:

      // Actually there isn't anything to do here
  }

  @Override
  public void mainGame() throws Exception {
      // The main game:

      // Let the user roll the die twice
      for (int i=0; i<2; i++) {
        System.out.println("Hit <RETURN> to roll the die");
        br.readLine();
        int dieRoll=(int)(r.next() * 6) + 1;

        System.out.println("You rolled " + dieRoll);
        numbersRolled.add(Integer.valueOf(dieRoll));
      }

      // Display the numbers rolled
      System.out.println("Numbers rolled: " + numbersRolled);
  }

  @Override
  public void gameWinner() throws Exception {
      // Declare the winner:

      // User wins if at least one of the die rolls is a 1
      if (numbersRolled.contains(Integer.valueOf(1))) {
        System.out.println("You won!");
      }
      else System.out.println("You lost!");
  }

}