import { Data } from "./Data";
import { randn_bm } from "./Random";

export class DataTargeted extends Data {
  public static generateRandom(nbPerRow: number) {
    const sick = Array.from({ length: nbPerRow }, () => new DataTargeted([randn_bm() - 1.5, randn_bm() - 1.5], 1));
    const healthy = Array.from({ length: nbPerRow }, () => new DataTargeted([randn_bm() + 1.5, randn_bm() + 1.5], 0));
    return [...sick, ...healthy];
  }

  public constructor(features: number[], public target: number) {
    super(features);
  }
}
