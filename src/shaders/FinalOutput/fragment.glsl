varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

void main()
{
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

    
    vec2 gridUv = floor(vUv * 64.0) / 64.0;
    vec4 firstTexture = texture2D(uTexture1, vUv);

    // gl_FragColor = vec4(gridUv, 1.0, 1.0);



    gl_FragColor = firstTexture;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}