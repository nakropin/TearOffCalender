class TearOffPad extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  };

  connectedCallback(){
    this.render();
  };

  render(){
    /* get DeviceType */
    let moveEventType;
    let startEventType;
    let endEventType;
    detectDeviceType();
    const deviceType = detectDeviceType().deviceType;

    /* shadow dom + style */
    const shadow = this.shadow;
    const template = document.createElement('link');
    template.setAttribute('rel', "stylesheet");
    template.setAttribute('href', './shadowstyle.css');
    template.setAttribute('type', 'text/css');
    shadow.appendChild(template);

    /* Set Values and render initial component state */
    const imgPath = "img/";

    /* Get custom values from component Element */
    const componentElement        = document.getElementsByTagName( 'tear-off-pad' )[0];
    const bgColors                = componentElement.getAttribute( 'data-bgcolors' ).split(",");
    const pagesAmount             = componentElement.getAttribute( 'data-pagesamount' );
    const subPageAmount           = componentElement.getAttribute( 'data-subpageamount' );
    const btnpos                  = componentElement.getAttribute( 'data-buttonPosition' );
    const pageImgTitle            = componentElement.getAttribute( 'data-pageimgtitle' );
    const refreshBtnAriaLabel     = componentElement.getAttribute( 'data-refreshbuttonarialabel' );
    const imprintBtnAriaLabel     = componentElement.getAttribute( 'data-imprintbuttonarialabel' );
    const altTextFrontPage        = componentElement.getAttribute( 'data-alttextfrontpage' );
    const altTextImages           = componentElement.getAttribute( 'data-alttextimages' );
    const altTextImprint          = componentElement.getAttribute( 'data-alttextimprint' );
    // const tearOnLeave             = componentElement.getAttribute( 'data-tearonleave' );
    // const clickToTear             = componentElement.getAttribute( 'data-clicktotear' );
    /* should be let */
    const delay                   = parseInt(componentElement.getAttribute( 'data-imprintanimationdelay' ));
    let curBgColor;

    createBasicPage();
    randomBackgroundColor();

    /* Get selectors etc */
    const pages                   = shadow.querySelector( '.pages' );
    const refresh                 = shadow.querySelector( '.refresh' );
    const imprint                 = shadow.querySelector( '.imprint' );
    buttonPosition( btnpos );

    const fileEnding              = ".svg";
    let randomFiles               = makeRandomizedFileList();
    var renderPageCallCounter     = 0;
    
    renderPage(); /* renders the first page */
    setEventListeners();

    /* Load Page and Images */
    function detectDeviceType(){
      const deviceType = /Kindle|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? 'Mobile'
        : 'Desktop';
      deviceType === 'Mobile'
        ? ( startEventType = "touchstart", moveEventType = "touchmove", endEventType = "touchend" )
        : ( startEventType = "mouseover",  moveEventType = "pointermove", endEventType = "pointerup" );
        // TODO: change mobile eventTypes to: pointerdown, pointermove, pointerup and get rid of detectfunction
      return { 
        deviceType: deviceType,
        startEventType: startEventType,
        moveEventType: moveEventType,
        endEventType: endEventType
      };
    };

    function createBasicPage(){      /* TearOffPad: make Pages & Buttons */
      const pagesTag = shadow.appendChild( document.createElement('div') );
      pagesTag.classList.add( "pages" );   
      const buttons = [  [ 'imprint', imprintBtnAriaLabel, imgPath ],
                         [ 'refresh', refreshBtnAriaLabel, imgPath ] ];
      buttons.forEach(e => makeButton( e[0], e[1], e[2] ))
    };

    function makeButton(btnName, ariaLabel, imgPath){
      let newButton = shadow.appendChild( document.createElement( 'button' ) );
      newButton.classList.add( btnName );
      newButton.setAttribute('title', ariaLabel);
      newButton.setAttribute('tabindex', '0');
      newButton.setAttribute('style', 'background-image: url(' + imgPath + btnName + '.svg)');
      newButton.setAttribute('aria-label', ariaLabel);
    };

    /* Generate Matrix for imgPath + Filenames, then randomize */
    function makeRandomizedFileList(){
      let filenameList = [];
      for ( let char = 97; char < ( parseInt(pagesAmount) + 97); char++ ){
        let sublist = [];
        for ( let nr = 1; nr < ( parseInt(subPageAmount) + 1); nr++ ){
          let curFilename = imgPath + String.fromCharCode( char ) + "-" + ( nr )  + fileEnding;
          sublist.push( curFilename );
        };
        filenameList.push( sublist );
      };
      let randomizedList = [];
      randomizedList.push( imgPath + "first" + fileEnding );
      for ( let i = 0; i < pagesAmount; i++ ){
        let randomElement = filenameList[i][ Math.floor( Math.random() * filenameList[i].length )];
        randomizedList.push( randomElement );
      };
      randomizedList.push( imgPath + "last" + fileEnding );
      return randomizedList;
    };

    function setAltText(){
      const initialAltTexts = [ altTextFrontPage, altTextImages, altTextImprint ];
      let useAltTags = []
      initialAltTexts.forEach(e => useAltTags.push(e))
      const result = renderPageCallCounter === 0 
        ? useAltTags[0] 
        : renderPageCallCounter != randomFiles.length-1 
          ? useAltTags[1] 
          : useAltTags[2];
      return result
    };

    function randomBackgroundColor() {
      let curAllowedColors = [];
      for(let i = 0; i < bgColors.length;i++){
        if (bgColors[i] !== curBgColor){
          curAllowedColors.push(bgColors[i])
          console.log("Push")
        }
      }
      let randomColor = curAllowedColors[ Math.floor( Math.random() * curAllowedColors.length) ];
      curBgColor = randomColor;
      document.body.style.background = randomColor;
      console.log(curBgColor)
    };

    function buttonPosition( position ){
      const checkInput = [ "upperLeft", "upperRight", "lowerLeft", "lowerRight" ];
      let currPos = 0; /* check if input is correct, otherwise use preset value 0 (upperleft) */  
      for ( let i = 0; i < checkInput.length; i++){
        if ( position === checkInput[i] ){
          currPos = i
        };
      };
      const pos = {
        upperLeft:  [ "10", null, "10", null ],
        upperRight: [ "10", null, null, "10" ],
        lowerLeft:  [ null, "10", "10", null ],
        lowerRight: [ null, "10", null, "10" ],
      };
      const unit = "px";
      const stylespos = [ "top", "bottom", "left", "right" ];
      const keys = Object.keys(pos);
      currPos = keys[currPos];

      for (let i = 0; i < pos[currPos].length; i++){
        if (pos[currPos][i] != null){
          imprint.style[stylespos[i]] = pos[currPos][i] + unit;
          let newVal = ( i === 0 | i === 1 ) ? "70" : pos[currPos][i]
          refresh.style[stylespos[i]] = newVal + unit;
        };
      };
    };

    /* Functions */
    function renderPage() {
      const currentSrc = randomFiles[ renderPageCallCounter ];
      if (renderPageCallCounter + 1 < randomFiles.length ){
        let nextSrc = randomFiles[ renderPageCallCounter + 1 ];
        pages.style.backgroundImage = ('url('+ nextSrc + ')');
      }
      const newPage = document.createElement('img');
      newPage.classList.add('page');
      newPage.src = currentSrc;
      newPage.setAttribute('alt', setAltText());
      pages.appendChild(newPage);
      pages.setAttribute('title', pageImgTitle);
      pages.setAttribute('tabindex', '0');
      renderPageCallCounter++;
    };

    /* Button Functions */

    function refreshbtn(){
      randomBackgroundColor();
      makeNewRandomizedFileList();
      if ( notFirstPage() ){
        renderPageCallCounter = 0;
        animatePage();
        removeAllFloorElements();
      };
    };

    function imprintbtn() {
      animationDelayIterator( animatePage );
      turnOffEventListenersWhileEventAction();
    };

    /* recursively call animation */
    function animationDelayIterator( animation ) {
      let curDelay = isNaN(delay)
        ? 1000
        : delay;
      if( notLastPage() ){
        animation();
        setTimeout( () => {animationDelayIterator(animation)}, curDelay );
      };
    };

    function turnOffEventListenersWhileEventAction(){
      const clickableElements = [ pages, refresh, imprint ];
      clickableElements.forEach(e => e.setAttribute('disabled', 'disabled'));
      const currentDelay = delay * ( ( randomFiles.length - renderPageCallCounter ) + 3 );
      setTimeout(function() {
        clickableElements.forEach(e => e.removeAttribute('disabled'));
      }, currentDelay );
    };

    function removeAllFloorElements(){
      shadow.querySelectorAll('.floor').forEach(e => e.remove());
    };

    function makeNewRandomizedFileList (){
      randomFiles = makeRandomizedFileList()
    }

    /* Desktop Animations */

    /* helpers */
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const targetX = centerX / 8 * 1.5; // changed from 5
    const targetY = centerY / 8 * 7.5; // changed from 7
    let bezierPoints = [{ x: centerX, y: centerY }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: targetX, y: targetY }];

    let maxTearDegree = randomizer( 30, 50 );
    let mouseXStart;
    let curDir;
    let lastDragPosition = 0;
    let lastMouseX = null;
    let keyFrameIsSet = 0;
    let stuckDegree = 20;
    let hitOnce = 0;

    function makeFloorElement( element ){
      element.classList.add('floor');
    };
    
    function getRandomCoordinate() {
      let x = Math.floor(Math.random()* 1000);
      let y = Math.floor(Math.random()* 100);
      if ( Math.random() <= 0.5){ x = -x; y = -y; };
      return {x: x, y: y}
    };

    function getBezierCoordinates(e){ /* get mouseCoords at start */
      let mouseX, mouseY;
      let bezierRandomizer = 115;
      if (e === undefined){
        let randomCoord = getRandomCoordinate();
        mouseX = randomCoord.x;
        mouseY = randomCoord.y;
      }
      else {
        mouseX = e.clientX - centerX;
        mouseY = e.clientY - centerY;
      }
      if( mouseX > 0 ){
        bezierPoints = [{ x: centerX, y: centerY }, { x: mouseX + centerX, y: mouseY}, { x: 0, y: targetY}, { x: targetX+randomizer(-bezierRandomizer,bezierRandomizer) , y: targetY }];
      }
      else {
        bezierPoints = [{ x: centerX, y: centerY }, { x: mouseX, y: mouseY }, { x: 0, y: targetY}, { x: -(targetX+randomizer(-bezierRandomizer,bezierRandomizer)) , y: targetY }];
      }
      return bezierPoints;
    }

    function getCoordinates(e){ /* get mouseCoords at start */
      let mouseX, mouseY;
      if (e === undefined){
        let randomCoord = getRandomCoordinate();
        mouseX = randomCoord.x;
        mouseY = randomCoord.y;
      }
      else {
        mouseX = e.clientX - centerX;
        mouseY = e.clientY - centerY;
      }
      return {x:mouseX, y:mouseY};
    };

    /* calc position along beziercurve */
    function getBezierPosition(points, progress) {
      var x = 0;
      var y = 0;
      var n = points.length - 1;
      for (var i = 0; i <= n; i++) {
        var coefficient = binomialCoefficient(n, i) * Math.pow(1 - progress, n - i) * Math.pow(progress, i);
        x += points[i].x * coefficient;
        y += points[i].y * coefficient;
      }
      /* watch mousecoords */
      x += (- bezierPoints[0].x) * (1 - progress);
      y += (- bezierPoints[0].y) * (1 - progress);
      return { x: x, y: y };
    };

    function binomialCoefficient(n, k) {
      var coefficient = 1;
      for (var i = 1; i <= k; i++) {
        coefficient *= (n - i + 1) / i;
      };
      return coefficient;
    };

    function animatePage(  ) {
      removeTempEventListeners();
      if ( notLastPage() ) {
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        setZIndex(curPage, 1);

        setTransitionDuration(curPage, "0.01s");
        curPage.setAttribute( "border", "1px solid black;" )      
        const bezier = getBezierCoordinates(event);
        let progress = 0;
        let curDegree = calcDegFromCurMouse(getCoordinates((event)).x);

        if(isNaN(curDegree)){curDegree = Math.random()*5} /* catches first page animation */
        curPage.style.transition = 'transform-origin 1s ease';
        curPage.style.transformOrigin = 'center';

        const animateOnce = () => {
          let position = getBezierPosition( bezier, progress );
          let rotationAngle = Math.atan2( position.x, position.y ) * progress;
          curDegree += rotationAngle;
          let rotateXFactor = 77
          curPage.style.transform = 'translate(' + position.x + 'px, ' + position.y + 'px) rotateX('+ rotateXFactor*progress +'deg) rotateZ('+ curDegree + 'deg)';
          if (progress < 1) {
            progress += 0.016;
            requestAnimationFrame(animateOnce);
          } else {
            progress = 0;
            setZIndex(curPage, -1);
          };
        };
        animateOnce();
        renderPage();
        resetHelpers();
        makeFloorElement(curPage);
      };
    };

    function setTransitionDuration( element, value ){
      element.style.transitionDuration = value;
    };

    function setZIndex( element, value ){
      element.style.zIndex = value;
    };

    function setDragDirection(e){
      let touchEventX = deviceType === "Mobile"
        ? e.touches[0].clientX
        : e.clientX;
      const rect = pages.getBoundingClientRect();
      const leftDist = touchEventX - rect.left;
      const rightDist = rect.right - touchEventX;
      return leftDist < rightDist ? 'right' : 'left';
    };
    
    function resetHelpers(){
      hitOnce = keyFrameIsSet = mouseXStart = lastDragPosition = 0;
      lastMouseX = curDir = null;
      maxTearDegree = randomizer(30,60);
    };

    function dragElement(e){ // maxTearDegree, curDir, lastMouseX, 
      const curPage = shadow.querySelectorAll("[class='page']")[0];
      let mouseX = e.clientX - centerX;
      // let animationFactor = 15; /* AnimationFactor sets how often DOM-transform is called, performance */
      let curDegree;
      let curStuck = getCurrentStuckDegree( curDir );

      let middlePlusRandom = (pages.offsetLeft + pages.offsetWidth / 2 )
      middlePlusRandom += curDir === "right"
        ? +randomizer(110,140)
        : -randomizer(100,140);

      if( hitOnce === 1 &&
          ( ( curDir === "right" && e.clientX > middlePlusRandom) ||
            ( curDir === "left"  && e.clientX < middlePlusRandom)    ) )
      {
          /* Interrupt Animation*/
          setTransitionDuration(curPage, "0.145s");
          curPage.style.transform = 'rotate('+ curStuck+'deg)';
          curPage.style.animation = 'none';
          let stylesheet = shadow.querySelector("link[rel='stylesheet']");
          deleteKeyFrameByName(stylesheet.sheet, "swing");
          hitOnce = 0;
          keyFrameIsSet = 0;
          /* rotate, animate */
          setTransitionDuration(curPage, "0.2s")
          requestAnimationFrame(() => {
            curPage.style.transform = 'rotate(' + curStuck + 'deg)';
          });
          animatePage();
      }
      else if( lastMouseX === null ){
        lastMouseX = mouseX;
      }
      else if ( hitOnce === 0 && 
        ( ( curDir === "right" && e.clientX > pages.offsetLeft ) ||
          ( curDir === "left" && e.clientX < pages.offsetLeft + pages.offsetWidth ) )
      ){
        lastMouseX = mouseX;
        curDegree = calcDegFromCurMouse( mouseX );
        setTransitionDuration(curPage, "0.045s")
        requestAnimationFrame(() => {
          curPage.style.transform = 'rotate(' + curDegree + 'deg)';
        });
        lastDragPosition = Math.abs(curDegree);
        if ( Math.abs(curDegree) >= maxTearDegree ) {
          animatePage();
        };
      }
      else if (
        (curDir === "right" && e.clientX < pages.offsetLeft) ||
        (curDir === "left" && e.clientX > pages.offsetLeft + pages.offsetWidth)
      ){
        setTransitionDuration(curPage, "0s")

        if (keyFrameIsSet === 0) {
          makeCurSwingAnimation(curPage, curStuck, lastDragPosition);
          keyFrameIsSet = 1;
        }
        /* Set Border, calc corresponding mouseX from lastDragPosition */
        lastDragPosition = curStuck;
        lastMouseX = calcMouseFromDegree( lastDragPosition );
        hitOnce = 1;
      };
    };

    function makeCurSwingAnimation(element, stuckDegree, lastDragPosition){
      let swingFactor = 1.5;
      let stuckDegreeOne;
      let stuckDegreeTwo;
      if (Math.abs(lastDragPosition) - Math.abs(stuckDegree)){
        stuckDegreeOne = stuckDegree+swingFactor;
        stuckDegreeTwo = stuckDegree-swingFactor;
      }
      else {
        stuckDegreeOne = stuckDegree-swingFactor;
        stuckDegreeTwo = stuckDegree+swingFactor;
      }
      let animationName = "swing";
      let animationTime = "0.7s";
      let keyframes = `@keyframes `+ animationName +`{
       20% { transform: rotate(${stuckDegreeOne}deg);}
       40% { transform: rotate(${stuckDegreeTwo}deg);}
       60% { transform: rotate(${stuckDegreeOne}deg);}
       80% { transform: rotate(${stuckDegreeTwo}deg);}
      100% { transform: rotate(${stuckDegree}deg);}
      }`;
      let stylesheet = shadow.querySelector("link[rel='stylesheet']");
      stylesheet.sheet.insertRule(keyframes)
      requestAnimationFrame(() => {
        element.style.animation = animationName + " " + animationTime + " " + "ease-out";
      });
      element.addEventListener('animationend', () => {
        element.style.transform = 'rotate('+ stuckDegree+'deg)';
        element.style.animation = 'none';
        deleteKeyFrameByName(stylesheet.sheet, "swing");
      });
    };

    function deleteKeyFrameByName(styleSheet, animationName){
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        let rule = styleSheet.cssRules[i];
        if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === animationName) {
          styleSheet.deleteRule(i);
          break;
        };
      };
    };

    function getCurrentStuckDegree( curDir ){
      let curStuck = curDir === "right"
        ? -stuckDegree
        : stuckDegree;
      return curStuck 
    }

    function randomizer ( min, max ){
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function calcMouseFromDegree( degree ){
      let result = ( mouseXStart - ( 10 * degree ) )
      return result
    };

    function calcDegFromCurMouse( mouseX ) {
      let unsignedDegree = ( mouseXStart - mouseX ) / 10;
      let curDegree = curDir === "left"
        ? Math.abs( unsignedDegree ) 
        : -Math.abs( unsignedDegree );
      return curDegree;
    };

    function startTransform(e){
      if (notLastPage()){
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        curPage.setAttribute( "border", "1px solid black;" );
        mouseXStart = e.clientX - centerX;
        curDir = setDragDirection(e);
        curPage.style.transformOrigin = 'top ' + curDir;
        setTempEventListeners();
      };
    };

    function notLastPage(){
      return renderPageCallCounter !== randomFiles.length;
    };

    function notFirstPage(){
      return renderPageCallCounter !== 1;
    };

    function changePointer( option ) {
      option === "hand"
        ? document.body.style.cursor = 'pointer'
        : document.body.style.cursor = 'auto';
    };    

    /* Animation + Buttons Mobile */
    let swipeAnimationsSetter = 0;

    function mobileDrag( e ){
      let name = String("fadeout-" + e)
      let stylesheet = shadow.querySelector("link[rel='stylesheet']");
      if ( notLastPage()) {
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        setZIndex(curPage, 1);
        curPage.setAttribute( "border", "1px solid black;" )     
        makeMobileFadeOutAnimations( String(e) );
        let animationTime = "0.5s";
        requestAnimationFrame(() => {
          curPage.style.animation = "fadeout-" + String(e) + " " + animationTime + " " + "linear";
        });
        curPage.addEventListener( 'animationend', () => { 
          curPage.style.animation = 'none';
          curPage.remove()
          deleteKeyFrameByName(stylesheet.sheet, name);
        } );
        renderPage();
        makeFloorElement(curPage)
      };
    };

    function makeMobileFadeOutAnimations( e ){
      let transLateDegreePercent = 150
      if (swipeAnimationsSetter === 0){
          let curRandom = randomizer(-110,110);
          let curTransLateDegreePercent;
          let animationName = "fadeout-" + e;
          let axis;
          let otherAxis;
          if (e === "swipeup" || e === "swipedown"){
            axis = "Y";
            otherAxis = "X";
          } else {
            axis = "X";
            otherAxis = "Y";
          }
          if( e === "swipeleft" ||
              e === "swipeup" ){ 
            curTransLateDegreePercent = -transLateDegreePercent 
          }
          else if ( e === "swiperight" ||
                    e === "swipedown") {
            curTransLateDegreePercent = transLateDegreePercent
          }

          let keyframes = `@keyframes `+ animationName +`{
            from {
              transform: translate`+ axis +`(0%) translate`+ otherAxis +`(0%);
            }
            to {
              transform: translate`+ axis +`(`+ curTransLateDegreePercent +`%) translate`+ otherAxis +`(`+ curRandom +`%);
            }
          }`;
          let stylesheet = shadow.querySelector("link[rel='stylesheet']");
          stylesheet.sheet.insertRule(keyframes)
      };
    };

    function mobileImprint(){
      if ( notLastPage() ){
        renderPageCallCounter = randomFiles.length-1;
        mobileDrag("swipeup");
      }
    };

    function mobileRefresh(e){
      randomBackgroundColor();
      makeNewRandomizedFileList()
      if (notFirstPage()){
        renderPageCallCounter = 0;
        mobileDrag("swipeup");
        removeAllFloorElements();
      };
    }

    /* EventListeners */

    function removeTempEventListeners(){
      document.removeEventListener(moveEventType, dragElement);
      changePointer(0);
      pages.addEventListener(startEventType, startTransform);
    };

    function setTempEventListeners(){
      pages.removeEventListener(startEventType, startTransform);
      document.addEventListener(moveEventType, dragElement);
      changePointer("hand");
    };

    function setEventListeners(){
      if ( deviceType === 'Mobile' ){
        var hammerTime = new Hammer(pages);
        hammerTime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        hammerTime.on("swipeleft swiperight swipeup swipedown", function(ev) {
          mobileDrag(ev.type);
        });
        refresh.addEventListener('click', mobileRefresh);
        imprint.addEventListener('click', mobileImprint);
      }
      else if ( deviceType === 'Desktop' ){
        pages.addEventListener(startEventType, startTransform);
        refresh.addEventListener('click', refreshbtn);
        imprint.addEventListener('click', imprintbtn);
        /* deactivate rightclick */
        document.addEventListener('contextmenu', event => event.preventDefault());
      };
    };

  };
};

customElements.define('tear-off-pad', TearOffPad);