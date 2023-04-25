import java.io.*;
import java.util.*;

public class Main {
    public static BufferedReader br=new BufferedReader(new InputStreamReader(System.in));

    public static void main(String[] args) throws Exception {
        System.out.print("Card (c) or Die (d) game? ");
        String ans=br.readLine();
        Game game = new Die();
        if (ans.equals("c")) {
           game = new Card();
        }
    
        else if (ans.equals("d")) {
           game = new Die();
        }
        else System.out.println("Input not understood");
        
        game.initialiseGame();
        game.mainGame();
        game.gameWinner();
      }
    }

