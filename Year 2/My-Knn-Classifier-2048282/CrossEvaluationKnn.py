
import os
import Task_1_5
import Task_2



def cross_evaluate_knn(training_data, k, sim_id, f):
    #
    rc = [[f'Round_{i}', f'Class_{i}'] for i in range(1, f + 1)]
    processed = [training_data[0] + [y for tp in rc for y in tp]]
    # Have fun!
    # Once folds are ready and you have the respective measures, please calculate the averages:
    avg_precision = float(0)
    avg_recall = float(0)
    avg_f_measure = float(0)
    avg_accuracy = float(0)
    # Have fun with the computations!
    # There are multiple ways to count average measures during cross-validation. For the purpose of this portfolio,
    # it's fine to just compute the values for each round and average them out in the usual way.

    #Divide data into folds
    data = []
    fold = list()
    folds = round((len(training_data) - 1 / f))
    count = 0
    folds = folds / f
    folds = round(folds)
    for img in training_data:
        if 'Path' == img[0]:
            continue
        fold.append(img)
        count = count +1
        if count == folds:
            data.append(fold)
            fold = []
            count = 0
    
    #kNN classifer with implementation of cross-validation 
    training = []
    results = []
    #kNN
    c = list()
    c = 1

    #Evaluation measure
    p = []
    r = []
    fa = []
    a = []
    for i in range(f):
        for fold in data:
            try:
                if fold != data[i]:
                    for value in fold:
                        training.append(value)
            except IndexError:
                pass
        #Initiate round of kNN and evaluating results
        try :
            results = Task_1_5.kNN(training, k, sim_id, data[i])
            pre, re, fm, ac = Task_2.evaluate_knn(training, k, sim_id, data[i])
            p.append(pre)
            r.append(re)
            fa.append(fm)
            a.append(ac)
        except IndexError:
                pass
        #Adding data into csv file 
        for value in results:
            if value[2] == '2048282':
                continue
            jc = [[f'Training Data', f' '] for i in range(1, f + 1)]
            row = [y for tp in jc for y in tp]
            row.pop(i+c)
            row.insert(i+c, value[2])
            row.pop((i+c)-1)
            row.insert((i+c)-1, 'Testing Data')
            processed.append([value[0], value[1]] + row)       
        c = c + 1
    # Evaluation Measures 
    def Average(lst):
        return sum(lst) / len(lst)
    avg_precision = Average(p)
    avg_accuracy = Average(a)
    avg_f_measure = Average(fa)
    avg_recall = Average(r)

    # The measures are now added to the end:
    h = ['avg_precision', 'avg_recall','avg_f_measure', 'avg_accuracy']
    v = [avg_precision, avg_recall,avg_f_measure,avg_accuracy]
    r = [[h[i], v[i]] for i in range(len(h))]

    return processed + r


def main():
    opts = Task_1_5.parse_arguments()
    if not opts:
        exit(1)
    print(f'Reading data from {opts["training_data"]}')
    training_data = Task_1_5.read_csv_file(opts['training_data'])
    print('Evaluating kNN')
    result = cross_evaluate_knn(training_data, opts['k'], opts['sim_id'], opts['f'])
    path = os.path.dirname(os.path.realpath(opts['training_data']))
    out = f'{path}/{Task_1_5.student_id}_cross_validation.csv'
    print(f'Writing data to {out}')
    Task_1_5.write_csv_file(out, result)


if __name__ == '__main__':
    main()