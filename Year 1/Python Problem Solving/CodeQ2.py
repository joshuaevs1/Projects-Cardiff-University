import random

def PARS(ra, rb):
    pA = ra / (ra + rb)
    A = 0
    B = 0
    rallies = 0
    while True:
        Da = A - B
        if A >= 11 and Da >= 2:
             return rallies
        if B >= 11 and Da <= -2:
            return rallies
        else:
            r = random.random()
            if r < pA:
                A = A + 1
                rallies = rallies + 1
            if r > pA:
                B = B + 1
                rallies = rallies + 1


def english_scoring(ra, rb):
    #Initialise
    pA = ra / (ra + rb)
    A = 0
    B = 0
    Server ='a'
    threshold = 9
    rallies = 0

    while True:
        #Is the score 8-8 if so:-

        if A == 8 and B == 8:
            if random.random() > 0.5:
                threshold = 10
            else:
                threshold = 9
    #Is the game over?
        if A == threshold:
            return rallies
        if B == threshold:
            return rallies
        #
        else:
            r = random.random()
            rallies = rallies + 1
            #B wins rally
            if pA <= r:
                if Server == 'b':
                    B = B + 1
                if Server == 'a':
                    Server = 'b'
            #A wins rally
            if pA >= r:
                if Server == 'a':
                    A = A + 1
                if Server == 'b':
                    Server = 'a'



def average_ralliesPARS(ra, rb, n):
    ralliesENG = []
    ralliesPARS = []
    for i in range(n):
        ralliesPARS.append(PARS(ra, rb))
        ralliesENG.append(english_scoring(ra, rb))
    avgENG = sum(ralliesENG)/ n
    avgPARS = sum(ralliesPARS)/ n
    return avgENG, avgPARS
print(average_ralliesPARS(90, 10, 10000))
print(average_ralliesPARS(80, 20, 10000))
print(average_ralliesPARS(70, 30, 10000))
print(average_ralliesPARS(60, 40, 10000))
print(average_ralliesPARS(50, 50, 10000))
