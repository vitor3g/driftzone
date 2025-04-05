export class LoadingTrackerEntry {
  public path: string;
  public progress = 0;
  public finished = false;

  constructor(path: string) {
    this.path = path;
  }
}