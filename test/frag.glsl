precision mediump float;
// uniform vec4 u_color;
// uniform float u_time;
varying vec2 vPos;

uniform vec2 leftWrist;
uniform vec2 rightWrist;
uniform vec2 u_resolution;


//   void main () {
//     vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution.xy)  / min(u_resolution.x, u_resolution.y);

//     vec2 leftWristPos = (leftWrist.xy * 2.0 - u_resolution.xy)  / min(u_resolution.x, u_resolution.y);
//     vec2 rightWristPos = (rightWrist.xy * 2.0 - u_resolution.xy)  / min(u_resolution.x, u_resolution.y);

//     float lx_dist = smoothstep(0.0, 0.01, abs(st.x - leftWristPos.x));
//     float ly_dist = smoothstep(0.0, 0.01, abs(st.y - leftWristPos.y));

//     float rx_dist = smoothstep(0.0, 0.01, abs(st.x - rightWristPos.x));
//     float ry_dist = smoothstep(0.0, 0.01, abs(st.y - rightWristPos.y));

//      float combinedDist = max(lx_dist, rx_dist);
//      float combinedDisty = max(ly_dist, ry_dist);

  
//     gl_FragColor = vec4(combinedDist, ly_dist, 0.0, 1.0);

// }

// void main() {
//     vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

//     vec2 leftWristPos = (leftWrist.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
//     vec2 rightWristPos = (rightWrist.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

//     // Set the distance threshold for drawing lines
//     float distanceThreshold = 0.1;

//     // Calculate distances for left hand
//     float leftDistX = abs(st.x - leftWristPos.x);
//     float leftDistY = abs(st.y - leftWristPos.y);

//     // Draw lines for left hand if within the distance threshold
//     float leftDrawX = step(leftDistX, distanceThreshold) * smoothstep(0.0, 0.01, leftDistY);
//     float leftDrawY = step(leftDistY, distanceThreshold) * smoothstep(0.0, 0.01, leftDistX);

//     // Calculate distances for right hand
//     float rightDistX = abs(st.x - rightWristPos.x);
//     float rightDistY = abs(st.y - rightWristPos.y);

//     // Draw lines for right hand if within the distance threshold
//     float rightDrawX = step(rightDistX, distanceThreshold) * smoothstep(0.0, 0.01, rightDistY);
//     float rightDrawY = step(rightDistY, distanceThreshold) * smoothstep(0.0, 0.01, rightDistX);

//     // Combine the lines for both hands
//     vec3 color = vec3(leftDrawX, leftDrawY, 0.0) + vec3(0.0, rightDrawX, rightDrawY);

//     gl_FragColor = vec4(color, 1.0);
// }

  
void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    vec2 leftWristPos = (leftWrist.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 rightWristPos = (rightWrist.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // Set the distance threshold for drawing lines
    float distanceThreshold = 0.1;

    // Calculate distances for left hand
    float leftDistX = abs(st.x - leftWristPos.x);
    float leftDistY = abs(st.y - leftWristPos.y);

    // Draw lines for left hand if within the distance threshold
    float leftDrawX = step(leftDistX, distanceThreshold) * smoothstep(0.0, 0.01, leftDistY);
    float leftDrawY = step(leftDistY, distanceThreshold) * smoothstep(0.0, 0.01, leftDistX);

    // Invert the Y values for left hand
    leftDrawY = 1.0 - leftDrawY;

    // Calculate distances for right hand
    float rightDistX = abs(st.x - rightWristPos.x);
    float rightDistY = abs(st.y - rightWristPos.y);

    // Draw lines for right hand if within the distance threshold
    float rightDrawX = step(rightDistX, distanceThreshold) * smoothstep(0.0, 0.01, rightDistY);
    float rightDrawY = step(rightDistY, distanceThreshold) * smoothstep(0.0, 0.01, rightDistX);

    // Invert the Y values for right hand
    rightDrawY = 1.0 - rightDrawY;

    // Combine the lines for both hands
    vec3 color = vec3(leftDrawX, leftDrawY, 0.0) + vec3(0.0, rightDrawX, rightDrawY);

    gl_FragColor = vec4(color, 1.0);
  }