uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture;
uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uShadowColor;
uniform vec2 uMouse;


attribute vec2 aParticlesUv;
attribute float aSize;

varying vec3 vColor;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#define M_PI 3.1415926535897932384626433832795;


void main()
{

    vec4 particle = texture(uParticlesTexture, aParticlesUv);
    // Final position
    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    //Model Normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;


    
    gl_Position = projectedPosition;



    // Point size
    float sizeIn = smoothstep(0.0, 0.1, particle.a);
    float sizeOut = smoothstep(0.7, 1.0, particle.a);
    float size = min(sizeIn, sizeOut);

    gl_PointSize = uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varyings

    // float strength = floor(aParticlesUv.x * 10.0) / 10.0 * floor(aParticlesUv.y * 10.0) / 10.0;
    float strength = distance(aParticlesUv, vec2(0.5));
    // float angle = atan(aParticlesUv.x - 0.5, aParticlesUv.y - 0.5)/65.0;
    // angle /= (M_PI * 20.0);
    // float strength = mod(angle * 20.0, 1.0);
    vUv = uv;
    vColor = vec3(0.0);
    // vColor = mix(uShadowColor, uColor, strength);
    vColor = mix(mix(uColor, particle.xyz, strength), uShadowColor, strength);
    // vColor = mix(uShadowColor, uLightColor, strength);
    // vColor = mix(vColor, uColor, strength);
    // vColor = uColor;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;


    //HalfTone Calculation






}