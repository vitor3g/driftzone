export class KeyBinding {
  public eventCodes: string[];
  public isPressed = false;
  public justPressed = false;
  public justReleased = false;

  constructor(...code: string[]) {
    this.eventCodes = code;
  }
}