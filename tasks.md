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
  - [X] startposition does not get reseteed
    - [X] somewhere no reset of degree, gotta fix
  - [X] imprint lacks shadows
  - [X] right up, left down == move. count higher from 
    - [X] save plusY + lastY, always add last-y+(positive(curY)) on top of plusY 
  - [X] if dir has been set for X, dont change direction
  - [X] dir: dont move over start-pos
  - [X] redo: 
    - [X] deactivate buttons when clicked
    - [x] imprint, refresh button function
    - [X] delay for animation?
  - [ ] if 'mouseup' but too few degrees (<25): transform back to start pos / leave hanging?
  - [x] render nextSrc in background
  - [ ] make transformation slower/delayed
  - [ ] only transform if curDegree is higher than nextDegree?
  - [ ] left/right switch: right now it mostly depends on which side of the page one starts, but should be in which direction one drags. but how to measure this when drag animation needs to start right away too?
    - [ ] getDirection first after certain movement in one direction
    - [ ] define square/circle, only when it moves out of this curDir is set. should be tiny, cause it casues animation delay 
  - [ ] load next sheet when dragged
    - [ ] 1. when element is dragged, the next page should be rendered.
    - [ ] 2. when page is animated, the already rednered following page should be set to curElement. 
  - [ ] make click only to tear off optional with setter in component settings
  - [ ] should resize elements without reload
  - [ ] set delay time for imprint function from component
  - [ ] set resolutions for mobile / Desktop
  - [ ] alternative animate function for mobile (fadeout -> right?)
  - [ ] add imprint drag animation
  - [ ] top/bottom border

finish:
  - [ ] get rid off all global vars
  - [ ] test on all devices, browserstack, lighthouse etc
  - [ ] button z index
  - [ ] firefox compatibility: problem with 
  - [ ] dunno: load images all at once at least for imprint to reduce number iof serverrequests?

new:
  - [ ] make animation go to fixposition (rotate35) when dragging mouse out of page
  - [ ] und wenns wieder reingeht dann fall ab (randomizer degree) 

newest:
  - [x] last page takes a while to load on imprint ( mobile)
    - [x] problem still on for desktop 
  - [x] mobile can sidescroll/upside down when scrolling while transition to right
  - [ ] swing-problems
  - [ ] z-index pages/curPage behind 
  - [x] blue element highlighting chrome android

optimization
  - [ ] optimize page layout so that it

css-task
  - [ ] aspect ratio desktop
  - [ ] different aspect ratio (90% width) für mobile
    - [ ] (tablets)

todo:
  - [ ] decrease call values bei dem rotation degree