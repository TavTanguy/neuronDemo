import { randn_bm } from "./Random";
import { Data } from "./Data";
import { DataTargeted } from "./DataTargeted";

export class Neuron {
  public static randomWeights(nbWeights: number) {
    return new Neuron(Array.from({ length: nbWeights }, () => randn_bm()));
  }

  public constructor(public weights: number[], public bias: number = 0) {}

  public preActivation(data: Data) {
    return this.weights.map((weight, i) => weight * data.features[i]).reduce((acc, val) => acc + val) + this.bias;
  }

  public activation(z: number) {
    return 1 / (1 + Math.exp(-z));
  }

  public derivateActivation(z: number) {
    return this.activation(z) * (1 - this.activation(z));
  }

  public predict(data: Data) {
    return this.activation(this.preActivation(data));
  }

  public predictRound(data: Data) {
    return Math.round(this.predict(data));
  }

  public accuracy(datas: DataTargeted[]) {
    return datas.map((data) => (this.predictRound(data) === data.target ? (1 as number) : (0 as number))).reduce((acc, val) => acc + val) / datas.length;
  }

  public cost(datas: DataTargeted[]) {
    return datas.map((data) => (this.activation(this.preActivation(data)) - data.target) ** 2).reduce((acc, val) => acc + val) / datas.length;
  }

  public train(datas: DataTargeted[], epochs: number = 100, learningRate: number = 0.1, onEpoch?: (idEpoch: number) => void) {
    for (let i = 0; i < epochs; i++) {
      if (onEpoch) onEpoch(i);
      let weightsGradient = new Array(this.weights.length).fill(0);
      let biasGradient = 0;
      datas.forEach((data) => {
        const preActivation = this.preActivation(data);
        const prediction = this.activation(preActivation);

        const gradient = (prediction - data.target) * this.derivateActivation(preActivation);
        weightsGradient = weightsGradient.map((weight, iInput) => weight + gradient * data.features[iInput]);
        biasGradient += gradient;
      });
      this.weights = this.weights.map((weight, iInput) => weight - learningRate * weightsGradient[iInput]);
      this.bias = this.bias - learningRate * biasGradient;
    }
  }
}
