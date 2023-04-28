# tasks
- [ ] animations
  - [ ] implement animation in component
  - [ ] animation module to let every sheet fall differently ~~min 6 x fall and lay on the floor, 3l/3r~~
  - [x] (tear off all animation for button)
  - [ ] should turn back when not full hover
- [x] interactivity
- [x] buttons with svg
  - [x] refresh-button
  - [x] tear off all button
- [x] compatibility
  - [x] chrome, ff, edge, safari
  - [x] mobile android, ios
- [ ] accessibility
  - [x] make tabable
  - [ ] screenreader-test
- [x] random color background
- [x] make it component
- [ ] buttonposition problem: lowerleft/lowerright
- [ ] lighthouse:
  - [x] eliminate render blocking resources (make essential CSS inline) [https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery]
  - [ ] widht + heihgt image all elements
  - [ ] LCP
- [x] ~~make first image optional~~
- [x] ~~make jquery local (dsgvo)~~
- [x] remove jquery for performance
- [x] prevent scrolldown
- [ ] set css to absolute with margins
- [ ] landscape for mobile does not work
- [ ] prevent Dark mode does not work on few browsers
- [ ] Code-Minification
- [ ] make floor elements adapt changed screen resolution
- [ ] optimal example https://www.youtube.com/watch?v=7VFPos9clPo
- [ ] modular animation settings: animationspeed, degree, abfallwinkel, tear blatt anreissen visuell etc. 

- [ ] make it mobile
  - [ ] swipe (opacity fadeout)
  - [ ] if mobile --> 90% use screen width for img

- [ ] component structure
  - [ ] optimise functions
  - [ ] change element structure @css

- [ ] optimise shadow dom / background color

- [ ] animation
  - [ ] optimise flying paper animation and implement keyframes in js

- [ ] transformation animation randomisieren
  - [ ] 3 verschiedene Fallanimationen pro Seite

- [ ] stapel einbauen: css nach stacksize dynamisch setzen


- [ ] bugs to fix: 
  - [ ] right up, left down == move. count higher from 
    - [ ] save plusY + lastY, always add last-y+(positive(curY)) on top of plusY 
  - [ ] if dir has been set for X, dont change direction
  - [ ] dir: dont move over start-pos
  - [ ] if 'mouseup' but too few degrees (<25): transform back to start pos / leave hanging?
  - [ ] render nextSrc in background
  - [ ] make transformation slower/delayed
  - [ ] only transform if curDegree is higher than nextDegree 