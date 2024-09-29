uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uShadowColor;

uniform float uLightRepetitions;
uniform vec3 uLightColor;
uniform vec2 uMouse;


varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

#include ../../halftoneMesh/includes/ambientLight.glsl;
#include ../../halftoneMesh/includes/directionalLight.glsl;
#include ../../halftoneMesh/includes/halftone.glsl;

void main()
{
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if(distanceToCenter > 0.5)
        discard;

  
    
    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}