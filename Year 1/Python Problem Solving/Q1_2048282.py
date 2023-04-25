import random
import matplotlib.pyplot as plt
random.seed(57)
import csv

def game(ra, rb):
    pA = ra / (ra + rb)
    A = 0
    B = 0
    while True:
        Da = A - B
        if A >= 11 and Da >= 2:
            return A, B
        if B >= 11 and Da <= -2:
            return A, B
        else:
            r = random.random()
            if r < pA:
                A = A + 1
            if r > pA:
                B = B + 1
#print('a)')
#print(game(70, 30))

#b
def winProbability(ra, rb, n):
    aGames = 0
    bGames= 0
    for i in range(n):
        score = game(ra, rb)
        #print(score)
        if score[0] > score[1]:
            aGames = aGames + 1
        else:
            bGames = bGames + 1
    ratio = aGames / n
    return ratio

#print('b')
#print(winProbability(60, 40, 10000))

#c
def playerAbilities():
    d = {}
    with open('playerabilities.csv', newline= '') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            d[int(row[0])] = int(row[1])
        Abilities = d.items()
        AbilityList = list(Abilities)

    return  AbilityList

#print('c')
#playerprint(playerAbilities())

#d
def plot(d):
    probability = [(i[0]/sum(i)) for i in d]
    player = [str(i) for i in d]
    plt.plot(player, probability, color= 'r')
    plt.ylabel('The probability of Player A winning')
    plt.xlabel('The ratings of players A and B')
    plt.title('Probabilities of Players A winning ')
    plt.show()
#plot(playerAbilities())

#e

def match(ra, rb, n):
    #Score of games
    A = 0
    B = 0
    #Simulate the games until first player reaches n amount of games
    while (A != n) and (B != n):
        games = game(ra, rb)
        #Score[0] is PARS and Score[1] is english scoring
        if games[0] > games[1]:
            A = A + 1
        else:
            B = B + 1
    return A, B
#print(match(60, 40, 21))

#Where ra and rb are players A and B ability rating, n is the number of games in order to win
#And N is the number of simulations
def simulateMatches(ra, rb, n, N):
    Amatches = 0
    for i in range(N):
        score = match(ra, rb, n)
        if score[0] > score[1]:
            Amatches = Amatches + 1
    print(Amatches)
    return Amatches/N


#print(simulateMatches(60, 40, 21, 10000))
