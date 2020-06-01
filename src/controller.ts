import { Neuron } from "./Neuron";
import { DataTargeted } from "./DataTargeted";
import { Graph } from "./Graph";

export function registreController() {
  let learningRate = 0.1;
  let addEpoch = 1;
  let epochs = 0;
  let nbDatas = 100;
  let nbDatasTest = 50;
  let datas = DataTargeted.generateRandom(nbDatas);
  let datasTest = DataTargeted.generateRandom(nbDatasTest);
  let neuron = Neuron.randomWeights(2);
  let sicks = datas.filter((data) => data.target === 1);
  let healthy = datas.filter((data) => data.target === 0);
  let densityYHeatmap = 0.05;
  let graph = new Graph(sicks, healthy, neuron, densityYHeatmap / (16 / 9), densityYHeatmap);
  let waitAfterEpoch = 0;
  let epochAuto = false;
  let timeStart = -Infinity;

  function updateOutput() {
    console.log("update output");

    (document.getElementById("weight1") as HTMLInputElement).value = neuron.weights[0].toString();
    (document.getElementById("weight2") as HTMLInputElement).value = neuron.weights[1].toString();
    (document.getElementById("bias") as HTMLInputElement).value = neuron.bias.toString();
    (document.getElementById("epochs") as HTMLInputElement).value = epochs.toString();
    (document.getElementById("timer") as HTMLInputElement).value = (Date.now() - timeStart).toString();
    (document.getElementById("timeEpoch") as HTMLInputElement).value = ((Date.now() - timeStart) / epochs).toString();
    (document.getElementById("accuracyTrainingSet") as HTMLInputElement).value = neuron.accuracy(datas).toString();
    (document.getElementById("costTrainingSet") as HTMLInputElement).value = neuron.cost(datas).toString();
    (document.getElementById("accuracyTestSet") as HTMLInputElement).value = neuron.accuracy(datasTest).toString();
    (document.getElementById("costTestSet") as HTMLInputElement).value = neuron.cost(datasTest).toString();
    graph.updateHeatMap();
  }
  updateOutput();

  function autoEpoch() {
    if (!epochAuto) return;
    neuron.train(datas, addEpoch, learningRate);
    ++epochs;
    updateOutput();
    graph.listenrOnRestyle = () => {
      graph.listenrOnRestyle = undefined;
      setTimeout(() => {
        autoEpoch();
      }, waitAfterEpoch);
    };
  }

  document.getElementById("nextEpoch")!.addEventListener("click", () => {
    console.log("nextEpoch valid");
    timeStart = Date.now();
    neuron.train(datas, addEpoch, learningRate);
    ++epochs;
    updateOutput();
  });

  document.getElementById("resetDatas")!.addEventListener("click", () => {
    datas = DataTargeted.generateRandom(nbDatas);
    sicks = datas.filter((data) => data.target === 1);
    healthy = datas.filter((data) => data.target === 0);
    graph = new Graph(sicks, healthy, neuron, densityYHeatmap / (16 / 9), densityYHeatmap);
    updateOutput();
    console.log("resetDatas valid");
  });

  document.getElementById("resetDatasTest")!.addEventListener("click", () => {
    datasTest = DataTargeted.generateRandom(nbDatasTest);
    console.log("resetDatasTest valid");
  });

  document.getElementById("resetNeuron")!.addEventListener("click", () => {
    neuron = Neuron.randomWeights(2);
    graph = new Graph(sicks, healthy, neuron, densityYHeatmap / (16 / 9), densityYHeatmap);
    epochs = 0;
    updateOutput();
    console.log("resetNeuron valid");
  });

  document.getElementById("resetAll")!.addEventListener("click", () => {
    datas = DataTargeted.generateRandom(nbDatas);
    sicks = datas.filter((data) => data.target === 1);
    healthy = datas.filter((data) => data.target === 0);
    datasTest = DataTargeted.generateRandom(nbDatasTest);
    neuron = Neuron.randomWeights(2);
    graph = new Graph(sicks, healthy, neuron, densityYHeatmap / (16 / 9), densityYHeatmap);
    epochs = 0;
    updateOutput();
    console.log("resetAll valid");
  });

  document.getElementById("updateOutput")!.addEventListener("click", () => {
    updateOutput();
    console.log("updateOutput valid");
  });

  document.getElementById("startEpochAuto")!.addEventListener("click", () => {
    epochAuto = true;
    timeStart = Date.now();
    autoEpoch();
    console.log("valid startEpochAuto");
  });

  document.getElementById("stopEpochAuto")!.addEventListener("click", () => {
    epochAuto = false;
    console.log("valid stopEpochAuto");
  });

  document.getElementById("learningRateBtn")!.addEventListener("click", () => {
    learningRate = parseFloat((document.getElementById("learningRate") as HTMLInputElement).value);
    console.log("valid learningRate");
  });
  document.getElementById("addEpochBtn")!.addEventListener("click", () => {
    addEpoch = parseFloat((document.getElementById("addEpoch") as HTMLInputElement).value);
    console.log("valid addEpoch");
  });
  document.getElementById("nbDataBtn")!.addEventListener("click", () => {
    nbDatas = parseFloat((document.getElementById("nbData") as HTMLInputElement).value);
    console.log("valid nbData");
  });
  document.getElementById("nbDataTestBtn")!.addEventListener("click", () => {
    nbDatasTest = parseFloat((document.getElementById("nbDataTest") as HTMLInputElement).value);
    console.log("valid nbDataTest");
  });
  document.getElementById("densityYHeatmapBtn")!.addEventListener("click", () => {
    densityYHeatmap = parseFloat((document.getElementById("densityYHeatmap") as HTMLInputElement).value);
    sicks = datas.filter((data) => data.target === 1);
    healthy = datas.filter((data) => data.target === 0);
    graph = new Graph(sicks, healthy, neuron, densityYHeatmap / (16 / 9), densityYHeatmap);
    console.log("valid densityYHeatmap");
  });
  document.getElementById("waitAfterEpochBtn")!.addEventListener("click", () => {
    waitAfterEpoch = parseInt((document.getElementById("waitAfterEpoch") as HTMLInputElement).value, 10);
    console.log("valid waitAfterEpoch");
  });
  document.getElementById("weightsBiasBtn")!.addEventListener("click", () => {
    neuron = new Neuron(
      [parseFloat((document.getElementById("weight1") as HTMLInputElement).value), parseFloat((document.getElementById("weight2") as HTMLInputElement).value)],
      parseFloat((document.getElementById("bias") as HTMLInputElement).value)
    );
    graph = new Graph(sicks, healthy, neuron, densityYHeatmap / (16 / 9), densityYHeatmap);
    epochs = 0;
    updateOutput();
    console.log("valid weightsBias");
  });
}
