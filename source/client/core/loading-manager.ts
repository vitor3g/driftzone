import { Logger } from "@/common/logger";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { LoadingTrackerEntry } from "./loading-tracker-entry";

export class LoadingManager {
  public firstLoad = true;
  private logger: Logger;
  public onFinishedCallback!: () => void;

  private gltfLoader: GLTFLoader;
  private loadingTracker: LoadingTrackerEntry[] = [];

  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.logger = new Logger("driftzone::loading-manager")
  }

  public loadGLTF(path: string, onLoadingFinished: (gltf: any) => void): void {
    const trackerEntry = this.addLoadingEntry(path);

    this.gltfLoader.load(path,
      (gltf) => {
        onLoadingFinished(gltf);
        this.doneLoading(trackerEntry);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          trackerEntry.progress = xhr.loaded / xhr.total;
        }
      },
      (error) => {
        console.error(error);
      });
  }

  public addLoadingEntry(path: string): LoadingTrackerEntry {
    const entry = new LoadingTrackerEntry(path);
    this.loadingTracker.push(entry);

    return entry;
  }

  public doneLoading(trackerEntry: LoadingTrackerEntry): void {
    trackerEntry.finished = true;
    trackerEntry.progress = 1;

    if (this.isLoadingDone()) {
      if (this.onFinishedCallback !== undefined) {
        this.onFinishedCallback();
      }
      else {
        this.logger.log('loading')
      }

      this.logger.log('loading has finished')
    }
  }

  public getLoadingPercentage(): number {
    let total = 0;
    let finished = 0;

    for (const item of this.loadingTracker) {
      total++;
      finished += item.progress;
    }

    return (finished / total) * 100;
  }

  private isLoadingDone(): boolean {
    for (const entry of this.loadingTracker) {
      if (!entry.finished) return false;
    }
    return true;
  }
}