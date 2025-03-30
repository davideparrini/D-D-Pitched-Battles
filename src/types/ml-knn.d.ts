// src/types/ml-knn.d.ts
declare module 'ml-knn' {
  export default class KNN {
    constructor(trainingSet: number[][], predictions: string[]);
    predict(dataset: number[][]): string[];
  }
}
