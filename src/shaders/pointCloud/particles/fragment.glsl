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
    
    // vec3 viewDirection = normalize(vPosition - cameraPosition);
    // vec3 normal = normalize(vNormal);
    // vec3 color = uColor;

    // //Lights
    // vec3 light = vec3(0.0);

    // //Ambient
    // light += ambientLight(
    //     vec3(1.0), //Light Color,
    //     1.0 //Light intensity
    // );

    // //Directional 
    // light += directionalLight(
    //     vec3(1.0, 1.0, 1.0), //Light Color
    //     1.0, //Light intensity
    //     normal, //Normal
    //     vec3(1.0, 1.0, 0.0), //Light Position
    //     viewDirection, //View Direction
    //     1.0 //Specular Power
    // );

    // color *= light;

    // color = halftone(
    //     color,
    //     uShadowRepetitions,
    //     vec3(0.0, -1.0, 0.0),
    //     -0.8,
    //     1.5, 
    //     uShadowColor,
    //     normal
    // );

    // color = halftone(
    //     color,
    //     uLightRepetitions,
    //     vec3(1.0, 1.0, 0.0),
    //     0.5,
    //     1.5,
    //     uLightColor,
    //     normal
    // );
    
    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}