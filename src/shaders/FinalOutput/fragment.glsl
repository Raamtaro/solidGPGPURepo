varying vec2 vUv;

uniform vec2 uResolution;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

uniform vec2 uMouse;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
    uv -= disc_center;
    uv*=uResolution;
    float dist = sqrt(dot(uv, uv));
    return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}

void main()
{
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

    vec2 newUv = vUv;

    float c = circle(vUv, uMouse, 0.1, 0.2);
    
    // vec2 gridUv = floor(vUv * 512.0) / 512.0;
    vec4 firstTexture = texture2D(uTexture1, vUv);
    vec4 secondTexture = texture2D(uTexture2, vUv);

    // gl_FragColor = vec4(gridUv, 1.0, 1.0);

    // vec4 color = mix(firstTexture, secondTexture, c);

    gl_FragColor = firstTexture;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}