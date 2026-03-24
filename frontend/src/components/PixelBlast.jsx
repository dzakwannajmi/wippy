import { Effect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const createTouchTexture = () => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  const trail = [];
  let last = null;
  const maxAge = 64;
  let radius = 0.1 * size;
  const speed = 1 / maxAge;
  const clear = () => { ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height); };
  const drawPoint = p => {
    const pos = { x: p.x * size, y: (1 - p.y) * size };
    let intensity = 1;
    const easeOutSine = t => Math.sin((t * Math.PI) / 2);
    const easeOutQuad = t => -t * (t - 2);
    if (p.age < maxAge * 0.3) intensity = easeOutSine(p.age / (maxAge * 0.3));
    else intensity = easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0;
    intensity *= p.force;
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset; ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath(); ctx.fillStyle = 'rgba(255,0,0,1)';
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  const addTouch = norm => {
    let force = 0, vx = 0, vy = 0;
    if (last) {
      const dx = norm.x - last.x, dy = norm.y - last.y;
      if (dx === 0 && dy === 0) return;
      const d = Math.sqrt(dx * dx + dy * dy);
      vx = dx / (d || 1); vy = dy / (d || 1);
      force = Math.min((dx * dx + dy * dy) * 10000, 1);
    }
    last = { x: norm.x, y: norm.y };
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
  };
  const update = () => {
    clear();
    for (let i = trail.length - 1; i >= 0; i--) {
      const point = trail[i];
      const f = point.force * speed * (1 - point.age / maxAge);
      point.x += point.vx * f; point.y += point.vy * f; point.age++;
      if (point.age > maxAge) trail.splice(i, 1);
    }
    for (let i = 0; i < trail.length; i++) drawPoint(trail[i]);
    texture.needsUpdate = true;
  };
  return { canvas, texture, addTouch, update, size, set radiusScale(v) { radius = 0.1 * size * v; } };
};

const createLiquidEffect = (texture, opts) => {
  const fragment = `
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;
    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;
      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);
      uv += vec2(vx, vy) * uStrength * intensity * wave;
    }
  `;
  return new Effect('LiquidEffect', fragment, {
    uniforms: new Map([
      ['uTexture', new THREE.Uniform(texture)],
      ['uStrength', new THREE.Uniform(opts?.strength ?? 0.025)],
      ['uTime', new THREE.Uniform(0)],
      ['uFreq', new THREE.Uniform(opts?.freq ?? 4.5)]
    ])
  });
};

const SHAPE_MAP = { square: 0, circle: 1, triangle: 2, diamond: 3 };
const VERTEX_SRC = `void main() { gl_Position = vec4(position, 1.0); }`;
const FRAGMENT_SRC = `
precision highp float;
uniform vec3 uColor; uniform vec2 uResolution; uniform float uTime;
uniform float uPixelSize; uniform float uScale; uniform float uDensity;
uniform float uPixelJitter; uniform int uEnableRipples;
uniform float uRippleSpeed; uniform float uRippleThickness;
uniform float uRippleIntensity; uniform float uEdgeFade;
uniform int uShapeType;
const int MAX_CLICKS = 10;
uniform vec2 uClickPos[MAX_CLICKS]; uniform float uClickTimes[MAX_CLICKS];
out vec4 fragColor;
float Bayer2(vec2 a) { a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
#define Bayer8(a) ( (Bayer2(.25*(a))*0.25 + Bayer2(.5*(a)))*0.25 + Bayer2(a) )
float hash11(float n){ return fract(sin(n)*43758.5453); }
float vnoise(vec3 p){
  vec3 ip = floor(p); vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0,0,0), vec3(1,57,113)));
  float n100 = hash11(dot(ip + vec3(1,0,0), vec3(1,57,113)));
  float n010 = hash11(dot(ip + vec3(0,1,0), vec3(1,57,113)));
  float n110 = hash11(dot(ip + vec3(1,1,0), vec3(1,57,113)));
  float n001 = hash11(dot(ip + vec3(0,0,1), vec3(1,57,113)));
  float n101 = hash11(dot(ip + vec3(1,0,1), vec3(1,57,113)));
  float n011 = hash11(dot(ip + vec3(0,1,1), vec3(1,57,113)));
  float n111 = hash11(dot(ip + vec3(1,1,1), vec3(1,57,113)));
  vec3 w = fp*fp*fp*(fp*(fp*6.-15.)+10.);
  return mix(mix(mix(n000,n100,w.x),mix(n010,n110,w.x),w.y),mix(mix(n001,n101,w.x),mix(n011,n111,w.x),w.y),w.z)*2.-1.;
}
float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t); float amp = 1., freq = 1., sum = 1.;
  for (int i = 0; i < 5; ++i){ sum += amp * vnoise(p * freq); freq *= 1.25; amp *= 1.0; }
  return sum * 0.5 + 0.5;
}
void main(){
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  vec2 pixelUV = fract(fragCoord / uPixelSize);
  vec2 uv = (floor(fragCoord / (8.*uPixelSize)) * (8.*uPixelSize)) / uResolution * vec2(uResolution.x/uResolution.y, 1.0);
  float feed = fbm2(uv, uTime * 0.05) * 0.5 - 0.65 + (uDensity - 0.5) * 0.3;
  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      if (uClickPos[i].x < 0.0) continue;
      vec2 cuv = ((uClickPos[i] - uResolution*.5 - 4.*uPixelSize)/uResolution) * vec2(uResolution.x/uResolution.y, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0), r = distance(uv, cuv);
      feed = max(feed, exp(-pow((r - uRippleSpeed*t)/uRippleThickness, 2.0)) * exp(-t) * exp(-10.*r) * uRippleIntensity);
    }
  }
  float bw = step(0.5, feed + Bayer8(fragCoord/uPixelSize) - 0.5);
  float M = bw * (1.0 + (fract(sin(dot(floor(fragCoord/uPixelSize), vec2(127.1,311.7)))*43758.5453) - 0.5) * uPixelJitter);
  if (uEdgeFade > 0.0) {
    vec2 n = gl_FragCoord.xy / uResolution;
    M *= smoothstep(0.0, uEdgeFade, min(min(n.x, n.y), min(1.-n.x, 1.-n.y)));
  }
  fragColor = vec4(mix(uColor*12.92, 1.055*pow(uColor, vec3(1./2.4))-0.055, step(0.0031308, uColor)), M);
}
`;

const PixelBlast = ({
  variant = 'square', pixelSize = 3, color = '#50C878', className, style,
  patternScale = 2, patternDensity = 1, liquid = false, liquidStrength = 0.1,
  liquidRadius = 1, pixelSizeJitter = 0, enableRipples = true, rippleIntensityScale = 1,
  rippleThickness = 0.1, rippleSpeed = 0.3, liquidWobbleSpeed = 4.5, speed = 0.5,
  transparent = true, edgeFade = 0.5, noiseAmount = 0
}) => {
  const containerRef = useRef(null);
  const threeRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(renderer.domElement.width, renderer.domElement.height) },
      uTime: { value: 0 }, uColor: { value: new THREE.Color(color) },
      uClickPos: { value: Array.from({ length: 10 }, () => new THREE.Vector2(-1, -1)) },
      uClickTimes: { value: new Float32Array(10) },
      uShapeType: { value: SHAPE_MAP[variant] || 0 },
      uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
      uScale: { value: patternScale }, uDensity: { value: patternDensity },
      uPixelJitter: { value: pixelSizeJitter }, uEnableRipples: { value: enableRipples ? 1 : 0 },
      uRippleSpeed: { value: rippleSpeed }, uRippleThickness: { value: rippleThickness },
      uRippleIntensity: { value: rippleIntensityScale }, uEdgeFade: { value: edgeFade }
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC, fragmentShader: FRAGMENT_SRC, uniforms,
      transparent: true, glslVersion: THREE.GLSL3
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime() * speed;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [color, pixelSize, speed, variant]);

  return <div ref={containerRef} className={`w-full h-full absolute inset-0 ${className || ''}`} style={style} />;
};

export default PixelBlast;