import * as Plotly from "plotly.js";
import { DataTargeted } from "./DataTargeted";
import { Neuron } from "./Neuron";
import { Data } from "./Data";

export class Graph {
  public listenrOnRestyle?: () => void;

  public constructor(sicks: DataTargeted[], healthy: DataTargeted[], private neuron: Neuron, public scaleHeatMapX: number = 0.028125, public scaleHeatMapY: number = 0.05) {
    if (!window) return;
    const sicksCoor: { x: number[]; y: number[] } = { x: [], y: [] };
    sicks.forEach((el) => {
      sicksCoor.x.push(el.features[0]);
      sicksCoor.y.push(el.features[1]);
    });
    const healthyCoor: { x: number[]; y: number[] } = { x: [], y: [] };
    healthy.forEach((el) => {
      healthyCoor.x.push(el.features[0]);
      healthyCoor.y.push(el.features[1]);
    });
    const heatMapZ = this.getZHeatMap();
    const test = Plotly.newPlot(
      "graph",
      [
        {
          // sick
          name: "invalid",
          type: "scatter",
          mode: "markers",
          marker: {
            line: {
              width: 1,
              color: "#FFF",
            },
            color: "#b30c1d",
          },
          x: sicksCoor.x,
          y: sicksCoor.y,
        },
        {
          // healty
          name: "valid",
          type: "scatter",
          mode: "markers",
          marker: {
            line: {
              width: 1,
              color: "#FFF",
            },
            color: "#060cad",
          },
          x: healthyCoor.x,
          y: healthyCoor.y,
        },
        {
          //hoverinfo: "none",
          showscale: false,
          name: "proba invalid",
          x: [-6, -6 + scaleHeatMapX],
          y: [-5, -5 + scaleHeatMapY],
          z: heatMapZ,
          type: "heatmap",
        },
      ],
      {
        paper_bgcolor: "#121212",
        plot_bgcolor: "#121212",
        title: "Neuron training for Deep-learning classification",
        xaxis: {
          title: "w1",
        },
        yaxis: {
          title: "w2",
        },
        legend: {
          x: 1,
          y: 0.5,
        },
      }
    );
    test.then((test2) => {
      test2.on("plotly_restyle", () => {
        if (this.listenrOnRestyle) this.listenrOnRestyle();
      });
    });
  }

  private getZHeatMap(): Array<number[]> {
    /*return new Array((5 * 2) / this.scaleHeatMap)
      .fill(null)
      .map((r, iRow) => new Array((6 * 2) / this.scaleHeatMap).fill(null).map((c, iColumn) => this.neuron.predict(new Data([iColumn * this.scaleHeatMap, iRow * this.scaleHeatMap]))))
      .concat([[1, 0]]);*/
    const minX = -6;
    const minY = -5;
    return Array.from({ length: (+minY * -2) / this.scaleHeatMapY }, (c, valueY) => {
      return Array.from({ length: (+minX * -2) / this.scaleHeatMapX }, (r, valueX) => {
        return this.neuron.predict(new Data([minX + valueX * this.scaleHeatMapX, minY + valueY * this.scaleHeatMapY]));
      });
    }).concat([[0, 1]]);
  }

  public updateHeatMap() {
    Plotly.restyle(
      "graph",
      {
        z: [this.getZHeatMap()],
      },
      2
    );
  }
}
