import * as CANNON from 'cannon-es';
import * as _ from 'lodash';
import * as THREE from 'three';
import { Object3D } from 'three';
import { Side } from '../enums/side';
import { Space } from '../enums/space';
import { SimulationFrame } from '../physics/spring_simulation/simulation-frame';

export function createCapsuleBufferGeometry(radius = 1, height = 2, N = 32): THREE.BufferGeometry {
  const positions = [];
  const normals = [];
  const indices = [];

  const TWOPI = Math.PI * 2;
  const PID2 = Math.PI / 2;

  const vertex = new THREE.Vector3();
  const normal = new THREE.Vector3();

  // Generate vertices and normals
  for (let i = 0; i <= N / 2; i++) {
    const phi = -PID2 + Math.PI * i / (N / 2);

    for (let j = 0; j <= N; j++) {
      const theta = j * TWOPI / N;

      vertex.x = radius * Math.cos(phi) * Math.cos(theta);
      vertex.y = radius * Math.cos(phi) * Math.sin(theta);
      vertex.z = radius * Math.sin(phi);

      normal.set(vertex.x, vertex.y, vertex.z).normalize();

      if (i < N / 4) {
        vertex.z -= height / 2;
      } else if (i > N / 4) {
        vertex.z += height / 2;
      }

      positions.push(vertex.x, vertex.y, vertex.z);
      normals.push(normal.x, normal.y, normal.z);
    }
  }

  // Generate indices
  const vertsAround = N + 1;
  for (let i = 0; i < N / 2; i++) {
    for (let j = 0; j < N; j++) {
      const a = i * vertsAround + j;
      const b = i * vertsAround + j + 1;
      const c = (i + 1) * vertsAround + j + 1;
      const d = (i + 1) * vertsAround + j;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Build the BufferGeometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.rotateX(Math.PI / 2);

  return geometry;
}


//#endregion

//#region Math

/**
 * Constructs a 2D matrix from first vector, replacing the Y axes with the global Y axis,
 * and applies this matrix to the second vector. Saves performance when compared to full 3D matrix application.
 * Useful for character rotation, as it only happens on the Y axis.
 * @param {Vector3} a Vector to construct 2D matrix from
 * @param {Vector3} b Vector to apply basis to
 */
export function appplyVectorMatrixXZ(a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(
    (a.x * b.z + a.z * b.x),
    b.y,
    (a.z * b.z + -a.x * b.x)
  );
}

export function round(value: number, decimals = 0): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}


export function roundVector(vector: THREE.Vector3, decimals = 0): THREE.Vector3 {
  return new THREE.Vector3(
    round(vector.x, decimals),
    round(vector.y, decimals),
    round(vector.z, decimals),
  );
}

/**
 * Finds an angle between two vectors
 * @param {THREE.Vector3} v1
 * @param {THREE.Vector3} v2
 */
export function getAngleBetweenVectors(v1: THREE.Vector3, v2: THREE.Vector3, dotTreshold = 0.0005): number {
  let angle: number;
  const dot = v1.dot(v2);

  // If dot is close to 1, we'll round angle to zero
  if (dot > 1 - dotTreshold) {
    angle = 0;
  }
  else {
    // Dot too close to -1
    if (dot < -1 + dotTreshold) {
      angle = Math.PI;
    }
    else {
      // Get angle difference in radians
      angle = Math.acos(dot);
    }
  }

  return angle;
}

/**
 * Finds an angle between two vectors with a sign relative to normal vector
 */
export function getSignedAngleBetweenVectors(this: any, v1: THREE.Vector3, v2: THREE.Vector3, normal: THREE.Vector3 = new THREE.Vector3(0, 1, 0), dotTreshold = 0.0005): number {
  let angle = this.getAngleBetweenVectors(v1, v2, dotTreshold);

  // Get vector pointing up or down
  const cross = new THREE.Vector3().crossVectors(v1, v2);
  // Compare cross with normal to find out direction
  if (normal.dot(cross) < 0) {
    angle = -angle;
  }

  return angle;
}

export function haveSameSigns(n1: number, n2: number): boolean {
  return (n1 < 0) === (n2 < 0);
}

export function haveDifferentSigns(n1: number, n2: number): boolean {
  return (n1 < 0) !== (n2 < 0);
}

//#endregion

//#region Miscellaneous

export function setDefaults(options: any, defaults: any): any {
  return _.defaults({}, _.clone(options), defaults);
}

export function getGlobalProperties(prefix = ''): any[] {
  const keyValues = [];
  const global = window; // window for browser environments
  // eslint-disable-next-line @typescript-eslint/no-for-in-array
  for (const prop in global) {
    // check the prefix
    if (prop.startsWith(prefix)) {
      keyValues.push(prop /*+ "=" + global[prop]*/);
    }
  }
  return keyValues; // build the string
}

export function spring(source: number, dest: number, velocity: number, mass: number, damping: number): SimulationFrame {
  let acceleration = dest - source;
  acceleration /= mass;
  velocity += acceleration;
  velocity *= damping;

  const position = source + velocity;

  return new SimulationFrame(position, velocity);
}

export function springV(source: THREE.Vector3, dest: THREE.Vector3, velocity: THREE.Vector3, mass: number, damping: number): void {
  const acceleration = new THREE.Vector3().subVectors(dest, source);
  acceleration.divideScalar(mass);
  velocity.add(acceleration);
  velocity.multiplyScalar(damping);
  source.add(velocity);
}

export function threeVector(vec: CANNON.Vec3): THREE.Vector3 {
  return new THREE.Vector3(vec.x, vec.y, vec.z);
}

export function cannonVector(vec: THREE.Vector3): CANNON.Vec3 {
  return new CANNON.Vec3(vec.x, vec.y, vec.z);
}

export function threeQuat(quat: CANNON.Quaternion): THREE.Quaternion {
  return new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);
}

export function cannonQuat(quat: THREE.Quaternion): CANNON.Quaternion {
  return new CANNON.Quaternion(quat.x, quat.y, quat.z, quat.w);
}

export function setupMeshProperties(child: any): void {
  child.castShadow = true;
  child.receiveShadow = true;

  if (child.material.map !== null) {
    const mat = new THREE.MeshPhongMaterial();
    mat.shininess = 0;
    mat.name = child.material.name;
    mat.map = child.material.map;

    // @ts-ignore
    mat.map.anisotropy = 4;
    mat.aoMap = child.material.aoMap;
    mat.transparent = child.material.transparent;
    // @ts-ignore
    mat.skinning = child.material.skinning;
    child.material = mat;
  }
}

export function detectRelativeSide(from: Object3D, to: Object3D): Side {
  const right = getRight(from, Space.Local);
  const viewVector = to.position.clone().sub(from.position).normalize();

  return right.dot(viewVector) > 0 ? Side.Left : Side.Right;
}

export function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

export function getRight(obj: THREE.Object3D, space: Space = Space.Global): THREE.Vector3 {
  const matrix = getMatrix(obj, space);
  return new THREE.Vector3(
    matrix.elements[0],
    matrix.elements[1],
    matrix.elements[2]
  );
}

export function getUp(obj: THREE.Object3D, space: Space = Space.Global): THREE.Vector3 {
  const matrix = getMatrix(obj, space);
  return new THREE.Vector3(
    matrix.elements[4],
    matrix.elements[5],
    matrix.elements[6]
  );
}

export function getForward(obj: THREE.Object3D, space: Space = Space.Global): THREE.Vector3 {
  const matrix = getMatrix(obj, space);
  return new THREE.Vector3(
    matrix.elements[8],
    matrix.elements[9],
    matrix.elements[10]
  );
}

export function getBack(obj: THREE.Object3D, space: Space = Space.Global): THREE.Vector3 {
  const matrix = getMatrix(obj, space);
  return new THREE.Vector3(
    -matrix.elements[8],
    -matrix.elements[9],
    -matrix.elements[10]
  );
}

export function getMatrix(obj: THREE.Object3D, space: Space): THREE.Matrix4 {
  switch (space) {
    case Space.Local: return obj.matrix;
    case Space.Global: return obj.matrixWorld;
  }
}

export function countSleepyBodies(): any {
  // let awake = 0;
  // let sleepy = 0;
  // let asleep = 0;
  // this.physicsWorld.bodies.forEach((body) =>
  // {
  //     if (body.sleepState === 0) awake++;
  //     if (body.sleepState === 1) sleepy++;
  //     if (body.sleepState === 2) asleep++;
  // });
}

//#endregion