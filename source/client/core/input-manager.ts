import type { IInputReceiver } from "../interfaces/input-receiver";
import type { IUpdatable } from "../interfaces/updatable";


export class InputManager implements IUpdatable {
  public updateOrder = 3;

  public domElement: any;
  public pointerLock: any;
  public isLocked: boolean;
  public inputReceiver!: IInputReceiver;

  public boundOnMouseDown: (evt: any) => void;
  public boundOnMouseMove: (evt: any) => void;
  public boundOnMouseUp: (evt: any) => void;
  public boundOnMouseWheelMove: (evt: any) => void;
  public boundOnPointerlockChange: (evt: any) => void;
  public boundOnPointerlockError: (evt: any) => void;
  public boundOnKeyDown: (evt: any) => void;
  public boundOnKeyUp: (evt: any) => void;

  constructor() {
    this.domElement = g_core.getGraphics().getRenderer().renderer.domElement || document.body;
    this.isLocked = false;;

    // Bindings for later event use
    // Mouse
    this.boundOnMouseDown = (evt) => this.onMouseDown(evt);
    this.boundOnMouseMove = (evt) => this.onMouseMove(evt);
    this.boundOnMouseUp = (evt) => this.onMouseUp(evt);
    this.boundOnMouseWheelMove = (evt) => this.onMouseWheelMove(evt);

    // Pointer lock
    this.boundOnPointerlockChange = () => this.onPointerlockChange();
    this.boundOnPointerlockError = () => this.onPointerlockError();

    // Keys
    this.boundOnKeyDown = (evt) => this.onKeyDown(evt);
    this.boundOnKeyUp = (evt) => this.onKeyUp(evt);

    // Init event listeners
    // Mouse
    this.domElement.addEventListener('mousedown', this.boundOnMouseDown, false);
    document.addEventListener('wheel', this.boundOnMouseWheelMove, false);
    document.addEventListener('pointerlockchange', this.boundOnPointerlockChange, false);
    document.addEventListener('pointerlockerror', this.boundOnPointerlockError, false);

    // Keys
    document.addEventListener('keydown', this.boundOnKeyDown, false);
    document.addEventListener('keyup', this.boundOnKeyUp, false);

    // world.registerUpdatable(this);
  }

  public update(_timestep: number, unscaledTimeStep: number): void {
    // if (this.inputReceiver === undefined && this.world !== undefined && this.world.cameraOperator !== undefined) {
    //   this.setInputReceiver(this.world.cameraOperator);
    // }

    this.inputReceiver?.inputReceiverUpdate(unscaledTimeStep);
  }

  public setInputReceiver(receiver: IInputReceiver): void {
    this.inputReceiver = receiver;
    this.inputReceiver.inputReceiverInit();
  }

  public setPointerLock(enabled: boolean): void {
    this.pointerLock = enabled;
  }

  public onPointerlockChange(): void {
    if (document.pointerLockElement === this.domElement) {
      this.domElement.addEventListener('mousemove', this.boundOnMouseMove, false);
      this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false);
      this.isLocked = true;
    }
    else {
      this.domElement.removeEventListener('mousemove', this.boundOnMouseMove, false);
      this.domElement.removeEventListener('mouseup', this.boundOnMouseUp, false);
      this.isLocked = false;
    }
  }

  public onPointerlockError(): void {
    console.error('PointerLockControls: Unable to use Pointer Lock API');
  }

  public onMouseDown(event: MouseEvent): void {
    if (this.pointerLock) {
      this.domElement.requestPointerLock();
    }
    else {
      this.domElement.addEventListener('mousemove', this.boundOnMouseMove, false);
      this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false);
    }

    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseButton(event, 'mouse' + event.button, true);
    }
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseMove(event, event.movementX, event.movementY);
    }
  }

  public onMouseUp(event: MouseEvent): void {
    if (!this.pointerLock) {
      this.domElement.removeEventListener('mousemove', this.boundOnMouseMove, false);
      this.domElement.removeEventListener('mouseup', this.boundOnMouseUp, false);
    }

    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseButton(event, 'mouse' + event.button, false);
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleKeyboardEvent(event, event.code, true);
    }
  }

  public onKeyUp(event: KeyboardEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleKeyboardEvent(event, event.code, false);
    }
  }

  public onMouseWheelMove(event: WheelEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseWheel(event, event.deltaY);
    }
  }
}