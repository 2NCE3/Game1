import * as THREE from 'three';

export type CameraMode = 
  | 'BASE_INSPECT' 
  | 'CHASE_CAM' 
  | 'ORBIT_CAM' 
  | 'CINEMATIC'
  | 'RETRO_TARGET';

const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _desiredOffset = new THREE.Vector3();

export class CameraDirector {
  public mode: CameraMode = 'BASE_INSPECT';
  public shakeIntensity: number = 0;
  public baseFov: number = 48;
  public currentFov: number = 48;

  // Add camera trauma/shake
  public addShake(amount: number) {
    this.shakeIntensity = Math.min(1.5, this.shakeIntensity + amount);
  }

  // Update camera position, rotation, and FOV with damping
  public update(
    camera: THREE.PerspectiveCamera,
    rocketPos: THREE.Vector3,
    steeringAngle: number,
    isWarping: boolean,
    phase: string,
    flightProgress: number,
    originRadius: number,
    destPos: THREE.Vector3,
    delta: number
  ) {
    // 1. Dynamic FOV: Widens during Warp Boost
    const targetFov = isWarping ? this.baseFov + 10 : this.baseFov;
    this.currentFov = THREE.MathUtils.lerp(this.currentFov, targetFov, delta * 3);
    if (camera.fov !== this.currentFov) {
      camera.fov = this.currentFov;
      camera.updateProjectionMatrix();
    }

    // 2. Shake decay
    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeIntensity > 0.001) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity * 0.8;
      shakeY = (Math.random() - 0.5) * this.shakeIntensity * 0.8;
      this.shakeIntensity = Math.max(0, this.shakeIntensity - delta * 1.5);
    }

    // 3. Camera Position according to Mode
    if (this.mode === 'BASE_INSPECT') {
      _targetCamPos.set(22 + shakeX, originRadius + 16 + shakeY, 26);
      _targetLookAt.set(0, originRadius + 3, 0);
      camera.position.lerp(_targetCamPos, delta * 2.5);
      camera.lookAt(_targetLookAt);
    } else if (this.mode === 'CHASE_CAM') {
      // Damped third-person follow camera with roll banking
      if (phase === 'LIFTOFF') {
        _desiredOffset.set(0, -6, 18);
      } else {
        // Banks slightly opposite to steering for tactile flight feel
        _desiredOffset.set(-10 - steeringAngle * 4, 7, 19);
      }
      _targetCamPos.addVectors(rocketPos, _desiredOffset);
      _targetCamPos.x += shakeX;
      _targetCamPos.y += shakeY;

      camera.position.lerp(_targetCamPos, delta * 4.0);
      _targetLookAt.copy(rocketPos);
      _targetLookAt.y += 1.5;
      camera.lookAt(_targetLookAt);

      // Subtle roll banking
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -steeringAngle * 0.12, delta * 5);
    } else if (this.mode === 'CINEMATIC') {
      if (phase === 'BASE_VIEW' || phase === 'COUNTDOWN' || phase === 'LIFTOFF') {
        const h = originRadius + 22 + flightProgress * 0.8;
        const dist = 32 + flightProgress * 1.5;
        _targetCamPos.set(dist + shakeX, h + shakeY, dist);
        camera.position.lerp(_targetCamPos, delta * 2.5);
        camera.lookAt(rocketPos);
      } else if (phase === 'BREAKOUT') {
        _targetCamPos.set(60 + shakeX, 50 + shakeY, 75);
        camera.position.lerp(_targetCamPos, delta * 2.0);
        camera.lookAt(rocketPos);
      } else if (phase === 'SPACE_TRANSIT' || phase === 'RETROGRADE_BURN') {
        _desiredOffset.set(-25, 18, 30);
        _targetCamPos.addVectors(rocketPos, _desiredOffset);
        _targetCamPos.x += shakeX;
        camera.position.lerp(_targetCamPos, delta * 3.0);
        camera.lookAt(rocketPos);
      } else {
        // Arrival View
        _desiredOffset.set(35, 25, 45);
        _targetCamPos.addVectors(destPos, _desiredOffset);
        camera.position.lerp(_targetCamPos, delta * 2.0);
        camera.lookAt(destPos);
      }
    } else if (this.mode === 'RETRO_TARGET') {
      // Look forward toward destination planet from behind rocket nozzle
      _desiredOffset.set(0, 2, 10);
      _targetCamPos.addVectors(rocketPos, _desiredOffset);
      camera.position.lerp(_targetCamPos, delta * 4.0);
      camera.lookAt(destPos);
    }
  }
}

export const cameraDirector = new CameraDirector();
