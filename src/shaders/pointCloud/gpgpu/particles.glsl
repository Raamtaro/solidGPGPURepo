precision highp float;

uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;
uniform vec2 uMouse;
uniform float uVelocity;
// uniform vec3 uRepulsion;
// uniform float uBounds;

#include ../includes/simplexNoise4d.glsl

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float noise(vec2 v)
{
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
    // First corner
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
    vec2 i1;
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
    //i1.y = 1.0 - i1.x;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    // Compute final noise value at P
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

vec3 curl(float	x,	float	y,	float	z)
{

    float	eps	= 1., eps2 = 2. * eps;
    float	n1,	n2,	a,	b;

    x += uTime * .05;
    y += uTime * .05;
    z += uTime * .05;

    vec3	curl = vec3(0.);

    n1	=	noise(vec2( x,	y	+	eps ));
    n2	=	noise(vec2( x,	y	-	eps ));
    a	=	(n1	-	n2)/eps2;

    n1	=	noise(vec2( x,	z	+	eps));
    n2	=	noise(vec2( x,	z	-	eps));
    b	=	(n1	-	n2)/eps2;

    curl.x	=	a	-	b;

    n1	=	noise(vec2( y,	z	+	eps));
    n2	=	noise(vec2( y,	z	-	eps));
    a	=	(n1	-	n2)/eps2;

    n1	=	noise(vec2( x	+	eps,	z));
    n2	=	noise(vec2( x	+	eps,	z));
    b	=	(n1	-	n2)/eps2;

    curl.y	=	a	-	b;

    n1	=	noise(vec2( x	+	eps,	y));
    n2	=	noise(vec2( x	-	eps,	y));
    a	=	(n1	-	n2)/eps2;

    n1	=	noise(vec2(  y	+	eps,	z));
    n2	=	noise(vec2(  y	-	eps,	z));
    b	=	(n1	-	n2)/eps2;

    curl.z	=	a	-	b;

    return	curl;
}

void main() {

    float time = uTime * 0.2;

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);

    // // Attempt at implementing cursor interaction. This did not help me achieve the effect I wanted - heavily distorted the particles
    // float f; 

    // float dist;
    // float distSquared;

    // vec3 dir;
    // dir = uRepulsion - particle.xyz;
    // dir.z = 0.0;

    // dist = length(dir);
    // distSquared = dist * dist;

    // float repelRadius = 150.0;
    // float repelRadiusSquared = repelRadius * repelRadius;

    // vec3 repulsionDirection;

    //Decay
    particle.a += 0.01;

    
    //Dead Particle
    if(particle.a >=1.0) {
        particle.a = mod(particle.a, 1.0);
        particle.xyz = base.xyz;
    }

    //Alive Particle
    else {
        //Strength
        float distFromParticle = distance(vec3(uMouse, 0.0), particle.xyz) * 5.0;
        float strength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));
        float influence = (uFlowFieldInfluence + uVelocity*100.0 - 0.5) * (- 2.0);
        strength = smoothstep(influence, 1.0, strength);
        
        

        // //Cursor Effect
        // if (dist < repelRadius) {
        //     f = ( distSquared / repelRadiusSquared - 1.0 ) * uDeltaTime * 100.0;
        //     repulsionDirection += normalize(dir) * f;
        // }
        
        // // Flow Field Pure Simplex Noise
        // vec3 flowField = vec3(
        //     simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + 0.0, time)),
        //     simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + (1.0 + uVelocity), time)),
        //     simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency  +  2.0, time))
        // );

        // flowField += curl(flowField.x, flowField.y, flowField.z);


       // Pure Curl Noise
        vec3 flowField = curl(
            (particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + 0.0).x,
            (particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + (1.0 + uVelocity)).y,
            (particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + 2.0).z
        );

        // //Mix(es) of Curl Noise + simplex Noise
        // vec3 simplexFlowField = vec3(
        //     simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + 0.0, time)),
        //     simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + (1.0 + uVelocity), time)),
        //     simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency  +  2.0, time))
        // );
        
        // vec3 curlFlowField = curl(
        //     (particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + 0.0).x,
        //     (particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + (1.0 + uVelocity)).y,
        //     (particle.xyz * uFlowFieldFrequency + uVelocity*10.0 + 2.0).z
        // );

        // vec3 flowField = cross(simplexFlowField, curlFlowField);
        // vec3 flowField = cross(curlFlowField, simplexFlowField);


        // repulsionDirection = normalize(repulsionDirection);
        flowField = normalize(flowField);
        
        particle.xyz += flowField * uDeltaTime * strength * ((uFlowFieldStrength * uFlowFieldStrength + uVelocity * distFromParticle)/uFlowFieldStrength);
        // particle.xyz += uVelocity;
        
        
        
        particle.a += uDeltaTime * 0.3;

    }

    gl_FragColor = particle;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}