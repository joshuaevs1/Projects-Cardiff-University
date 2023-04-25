import argparse
import csv
import os
import numpy as np
from sewar.full_ref import mse, rmse, ergas
from PIL import Image
from image_tools.sizes import resize_and_crop


def kNN(training_data, k, sim_id, data_to_classify):
    processed = [data_to_classify[0] + [student_id]]
    # Have fun!
    for image in data_to_classify:
        distances = list()
        if image[0] != "Path":
            #Get first image 
            img = Image.open("../Portfolio 2/"+image[0])
            img = img.resize((100,100))
            img = np.asarray(img)
            for trainImages in training_data:
                if trainImages[0] != "Path":
                    #Get training image
                    img2 = Image.open("../Portfolio 2/"+trainImages[0])
                    img2 = img2.resize((100,100))
                    img2 = np.asarray(img2)
                    
                    #Part 1 Calculcating the Distance and adding it to list
                    if sim_id == 1:
                        dist = mse(img, img2)
                    if sim_id == 2:
                        dist = rmse(img, img2)
                    if sim_id ==3:
                        dist = ergas(img, img2)
                    #Task 6
                    if sim_id == 4:
                        #MSE
                        error = np.sum((img.astype("float") - img2.astype("float")) ** 2)
                        dist = error/ float(img.shape[0] * img2.shape[1])
                    if sim_id == 5:
                        #RMSE
                        error = np.sum((img.astype("float") - img2.astype("float")) ** 2)
                        error = error/ float(img.shape[0] * img2.shape[1])
                        dist = np.sqrt(error)

                    distances.append((image[1], dist))




            #Finding nearest neighbours
            distances.sort(key=lambda tup: tup[1])
            neighbours = list()     
            for i in range(k):
                neighbours.append(distances[i][0])
            
            #Part 3, Making Predictions 
            prediction = max(set(neighbours), key=neighbours.count)
            processed.append([image[0], image[1], prediction])
    return processed



def main():
    opts = parse_arguments()
    if not opts:
        exit(1)
    print(f'Reading data from {opts["training_data"]} and {opts["data_to_classify"]}')
    training_data = read_csv_file(opts['training_data'])
    data_to_classify = read_csv_file(opts['data_to_classify'])
    unseen = opts['mode']
    print('Running kNN')
    result = kNN(training_data, opts['k'], opts['sim_id'], data_to_classify)
    if unseen:
        path = os.path.dirname(os.path.realpath(opts['data_to_classify']))
        out = f'{path}/{student_id}_classified_data.csv'
        print(f'Writing data to {out}')
        write_csv_file(out, result)


# Straightforward function to read the data contained in the file "filename"
def read_csv_file(filename):
    lines = []
    with open(filename, newline='') as infile:
        reader = csv.reader(infile)
        for line in reader:
            lines.append(line)
    return lines


# Straightforward function to write the data contained in "lines" to a file "filename"
def write_csv_file(filename, lines):
    with open(filename, 'w', newline='') as outfile:
        writer = csv.writer(outfile)
        writer.writerows(lines)



#
def parse_arguments():
    parser = argparse.ArgumentParser(description='Processes files ')
    parser.add_argument('-k', type=int)
    parser.add_argument('-f', type=int)
    parser.add_argument('-s', '--sim_id', nargs='?', type=int)
    parser.add_argument('-u', '--unseen', action='store_true')
    parser.add_argument('training_data')
    parser.add_argument('data_to_classify')
    params = parser.parse_args()

    if params.sim_id < 0 or params.sim_id > 5:
        print('Argument sim_id must be a number from 1 to 5')
        return None

    opt = {'k': params.k,
           'f': params.f,
           'sim_id': params.sim_id,
           'training_data': params.training_data,
           'data_to_classify': params.data_to_classify,
           'mode': params.unseen
           }
    return opt


if __name__ == '__main__':
    main()
