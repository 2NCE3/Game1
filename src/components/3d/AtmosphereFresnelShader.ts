import * as THREE from 'three';

// ACESFilmic-compatible Fresnel Atmosphere Glow Shader
export function createAtmosphereMaterial(glowColor: string, coef: number = 0.6, power: number = 3.5) {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(glowColor) },
      coef: { value: coef },
      power: { value: power },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float coef;
      uniform float power;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 viewDir = normalize(-vPosition);
        float baseVal = max(0.0, coef - dot(vNormal, viewDir));
        float intensity = pow(baseVal, power);
        intensity = clamp(intensity, 0.0, 1.0);

        // ACESFilmic friendly color output with soft alpha falloff
        gl_FragColor = vec4(color * 1.5, intensity * 0.85);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}
