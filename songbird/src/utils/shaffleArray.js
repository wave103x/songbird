function shuffleArr(arr) {
    let curr = arr.length, randomInd;
    while (curr != 0) {
        randomInd = Math.trunc(Math.random() * curr);
        curr--;
        [arr[curr], arr[randomInd]] = [arr[randomInd], arr[curr]];
    }
    return arr;
}

export default shuffleArr;