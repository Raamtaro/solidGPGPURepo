import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'

//Shaders
import gpgpuParticlesShader from './shaders/pointCloud/gpgpu/particles.glsl'
import particlesVertexShader from './shaders/pointCloud/particles/vertex.glsl'
import particlesFragmentShader from './shaders/pointCloud/particles/fragment.glsl'

