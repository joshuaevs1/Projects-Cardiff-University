

from sre_constants import IN_UNI_IGNORE
import Task_1_5


def evaluate_knn(training_data, k, sim_id, data_to_classify):
    precision = float(0)
    recall = float(0)
    f_measure = float(0)
    accuracy = float(0)
    # Have fun with the computations!
    result = Task_1_5.kNN(training_data, k, sim_id, data_to_classify)
    TP = {}
    FP = {}
    FN = {}
    Class = list()
    count = 0
    #calculating TP, FP AND FN
    for data in result:
        count = count + 1
        if data[0] != 'Path':
            #TP
            #Increase TP by 1
            if data[1] not in Class:
                Class.append(data[1])
            if data[1] == data[2]:
                if data[1] in TP.values():
                    #If already made
                    TP[data[1]] = TP[data[1]] + 1
                else:
                    #Not made
                    TP[data[1]] = 1
            
            if data[1] != data[2]:
                if data[2] in FP.values():
                    FP[data[2]] = FP[data[2]] + 1
                else: 
                    FP[data[2]] = 1

                if data[1] in FN.values():
                    FN[data[1]] = FN[data[1]] + 1
                else:
                    FN[data[1]] = 1
    
    #Calculate P, R, F in Macro-Average
    p = {}
    r = {}
    f = {}
    fp = 0
    fn = 0 
    for i in Class:
        if i in FP:
            fp = FP[i]
        if i in FN:
            fn = FN[i]
        p[i] = TP[i]/ (TP[i] + fp)
        r[i] = TP[i]/ (TP[i] + fn)
        f[i] = (2 * p[i] * r[i]) / (p[i] + r [i])
    c = len(Class)
    precision = sum(p.values())/ float(c)
    recall = sum(r.values()) / float(c)
    f_measure = sum(f.values()) / float(c)
    #Calculate Accuracy 
    accuracy = sum(TP.values()) / (sum(TP.values()) + sum(FP.values()) + sum(FN.values()))
    # once ready, we return the values
    return precision, recall, f_measure, accuracy


def main():
    opts = Task_1_5.parse_arguments()
    if not opts:
        exit(1)
    print(f'Reading data from {opts["training_data"]} and {opts["data_to_classify"]}')
    training_data = Task_1_5.read_csv_file(opts['training_data'])
    data_to_classify = Task_1_5.read_csv_file(opts['data_to_classify'])
    print('Evaluating kNN')
    result = evaluate_knn(training_data, opts['k'], opts['sim_id'], data_to_classify)
    print('Result: precision {}; recall {}; f-measure {}; accuracy {}'.format(*result))


if __name__ == '__main__':
    main()