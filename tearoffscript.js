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
    const clickSetter             = componentElement.getAttribute( 'data-clicksetter' );
    // TODO: clickSetter

    let tearDegree = 60;
    /* tearDegree and dragelementfactor need to be adjusted in combination */
    // let tearDegree;
    // let dragElementFactor;
    // let dragSettings = 1; 
    // tearDragFactor(dragSettings);

    createBasicPage();
    randomBackgroundColor();

    /* Get selectors etc */
    const pages                   = shadow.querySelector( '.pages' );
    const refresh                 = shadow.querySelector( '.refresh' );
    const imprint                 = shadow.querySelector( '.imprint' );
    buttonPosition( btnpos );

    const fileEnding              = ".svg";
    const randomFiles             = makeRandomizedFileList();
    const delay                   = 0;
    var renderPageCallCounter     = 0;
    
    renderPage(); /* renders the first page */
    setEventListeners();

    /* Functions */

    function detectDeviceType(){
      const deviceType = /Kindle|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? 'Mobile'
        : 'Desktop';
      deviceType === 'Mobile'
        ? ( startEventType = "touchstart", moveEventType = "touchmove", endEventType = "touchend" )
        : ( startEventType = "pointerdown",  moveEventType = "pointermove", endEventType = "pointerup" );
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
    
    function setAltText(){
      const initialAltTexts = [ altTextFrontPage, altTextImages, altTextImprint ];
      let useAltTags = []
      initialAltTexts.forEach(e => e === null ? useAltTags.push("An image which has not been described yet."): useAltTags.push(e))
      const result = renderPageCallCounter === 0 ? useAltTags[0] : renderPageCallCounter != randomFiles.length-1 ? useAltTags[1] : useAltTags[2];
      return result
    };

    function imprintbtn() {
      // TODO: putin fake dragElement for touch/mouse
      // pointerdown -> pointermove -> pointerup
      // only if Desktop?
      animationDelayIterator();
      turnOffEventListenersWhileEventAction();
    };

    /* recursively call animation */
    function animationDelayIterator() {
      if( renderPageCallCounter != randomFiles.length ){
        animatePage();
        setTimeout(animationDelayIterator, delay);
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

    function refreshbtn(){
      if ( renderPageCallCounter != 1 ){
        renderPageCallCounter = 0;
        animatePage();
        removeAllFloorElements();
      };
    };

    function removeAllFloorElements(){
      shadow.querySelectorAll('.floor').forEach(e => e.remove());
    };

    function randomBackgroundColor() {
      let randomColor = bgColors[ Math.floor( Math.random() * bgColors.length) ];
      document.body.style.background = randomColor;
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

    /* helpers */
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const targetX = centerX / 8 * 5;
    const targetY = centerY / 4 * 3;
    let bezierPoints = [{ x: centerX, y: centerY }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: targetX, y: targetY }];
    
    let mouseXStart;
    let lastPositionY = 0;
    let mouseAddY = 0;
    let curDir;
    let dragDirectionSetter;
    let lastDragPosition = 0;

    function makeFloorElement( element ){
      element.classList.add('floor');
    };
    
    function getRandomCoordinate() {
      let x = Math.floor(Math.random()* 1000);
      let y = Math.floor(Math.random()* 100);
      if ( Math.random() <= 0.5){ x = -x; y = -y; };
      return {x: x, y: y}
    };

    function getCoordinates(e){ /* get mouseCoords at start */
      let mouseX, mouseY;
      if (e === undefined){
        let randomCoord = getRandomCoordinate();
        mouseX = randomCoord.x;
        mouseY = randomCoord.y;
      }
      else {
        if (deviceType=== 'Mobile') {
          mouseX = e.changedTouches[0].clientX - centerX;
          mouseY = e.changedTouches[0].clientY - centerY;
        }
        else if (deviceType=== 'Desktop') {
          mouseX = e.clientX - centerX;
          mouseY = e.clientY - centerY;
        }
      }
      if( mouseX > 0 ){
        bezierPoints = [{ x: centerX, y: centerY }, { x: mouseX + centerX, y: mouseY}, { x: 0, y: targetY}, { x: targetX + Math.random() * 100 - 50, y: targetY }];
      }
      else {
          bezierPoints = [{ x: centerX, y: centerY }, { x: mouseX, y: mouseY }, { x: 0, y: targetY}, { x: -targetX + Math.random() * 100 - 50, y: targetY }];
      }
      return bezierPoints;
    }

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
    }

    function binomialCoefficient(n, k) {
      var coefficient = 1;
      for (var i = 1; i <= k; i++) {
        coefficient *= (n - i + 1) / i;
      }
      return coefficient;
    }

    function animatePage() {
      console.log(lastDragPosition)
      // TODO: lastDragPosition: get startposition from drag & animate for prettier animation?
      removeTempEventListeners();
      if ( renderPageCallCounter < randomFiles.length ) {
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        curPage.setAttribute( "border", "1px solid black;" )      
        const bezier = getCoordinates(event);
        let progress = 0;
        const random = 1; // const random = Math.random() * 20 - 10;
        const animateOnce = () => {
          let position = getBezierPosition(bezier, progress);
          let rotationAngle = Math.atan2(position.x, position.y) * 180 / Math.PI + random;
          curPage.style.transform = 'translate(' + position.x + 'px, ' + position.y + 'px) rotateX(' + rotationAngle * progress * 1.1 + 'deg) rotateZ(' + -rotationAngle * progress * 0.8 + 'deg)';
          if (progress < 1) {
            progress += 0.01;
            requestAnimationFrame(animateOnce);
          } else {
            progress = 0;
          }
        };
        animateOnce();
        renderPage();
        resetHelpers();
        makeFloorElement(curPage);
        zStyleSwitch(curPage, 1);
      };
    };

    function zStyleSwitch( element, zIndex ){
      element.style.zIndex = zIndex;
    }

    function setDragDirection(e){
      /* "natural haptic" = mouse left side -> right: top right, l->l: t l, r->l: t l, r->: t r; */
      // TODO: if drag has been done on one side till X deg then dont change dir (switch to the other side)      
      if (dragDirectionSetter === 1){
        return curDir;
      }
      else{
        dragDirectionSetter = 1;
        
        if (deviceType=== 'Mobile') {
          return mouseXStart < (e.changedTouches[0].clientX - centerX) ? "right" : "left";
        }
        else if (deviceType=== 'Desktop') {
          return mouseXStart < (e.clientX - centerX) ? "right" : "left";
        }
      };
    };

    function resetHelpers(){
      mouseXStart = lastPositionY = mouseAddY = dragDirectionSetter = lastDragPosition = 0;
      curDir = null;
    };

    function dragElement(e){
      const curPage = shadow.querySelectorAll("[class='page']")[0];
      let mouseX, mouseY;
      if (deviceType=== 'Mobile') {
        mouseX = e.changedTouches[0].clientX - centerX;
        mouseY = e.changedTouches[0].clientY - centerY;
      }
      else if (deviceType=== 'Desktop') {
        mouseX = e.clientX - centerX;
        mouseY = e.clientY - centerY;
      }
      
      curDir = setDragDirection(e);
      curPage.style.transformOrigin = 'top ' + curDir;
      let curDegree = calcDegFromCurMouse(curDir, mouseX, mouseY);
      console.log("curdegree: " + Math.abs(curDegree), " lastdrag: " + lastDragPosition, Math.abs(curDegree) >= lastDragPosition )
      if (Math.abs(curDegree) >= lastDragPosition | curDegree === undefined | curDegree === 0){
        curPage.style.transform = 'rotate(' + curDegree + 'deg)';
        lastDragPosition = Math.abs(curDegree);
      };
      if ( Math.abs(curDegree) >= tearDegree ) {
        animatePage();
      };
    };

    /* y-movement in any direction causes drag */
    function calcDegFromCurMouse(curDir, mouseX, mouseY) {
      mouseAddY += Math.abs( lastPositionY - mouseY ) / 500;
      let mousePosX = ( mouseXStart - mouseX ) / 12;
      // let curDegree = curDir === "left" ? Math.abs(((mousePosX + (mouseY/ 12)) ) / dragElementFactor) : -Math.abs((mousePosX - (mouseAddY/ 12)) / dragElementFactor);
      let curDegree = curDir === "left"
        ? Math.abs(mousePosX + mouseAddY) 
        : -Math.abs(mousePosX - mouseAddY);
      return curDegree;
    };

    function startTransform(e){
      if (renderPageCallCounter !== randomFiles.length){
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        curPage.setAttribute( "border", "1px solid black;" );
        deviceType === 'Mobile' 
          ? mouseXStart = e.changedTouches[0].clientX - centerX
          : mouseXStart = e.clientX - centerX;
        addTempEventListeners();
      };
    };

    function changePointer( option ) {
      option === "hand"
        ? document.body.style.cursor = 'pointer'
        : document.body.style.cursor = 'auto';
    };    

    /* temporary event Listeners */
    function removeTempEventListeners(){
      document.removeEventListener(moveEventType, dragElement);
      changePointer(0);
    };

    function addTempEventListeners(){
      document.addEventListener(moveEventType, dragElement);
      changePointer("hand");
    };

    function setEventListeners(){
      pages.addEventListener(startEventType, startTransform);
      refresh.addEventListener('click', refreshbtn);
      imprint.addEventListener('click', imprintbtn);
    };
  };
};

customElements.define('tear-off-pad', TearOffPad);


    // function responsiveEventHandler (e){
    //   let x
    //   let y;
    //   if ( deviceType === 'Mobile' ){
    //     x = e.changedTouches[0].clientX
    //     y = e.changedTouches[0].clientY
    //   }
    //   else {
    //     x = e.clientX
    //     y = e.clientY
    //   }
    // return { x: x, y: y}
    // }


        // function tearDragFactor( dragSettings ){
    //   tearDegree = (dragSettings * 60);
    //   dragElementFactor = (dragSettings * 2.3 );
    //   console.log(tearDegree, dragElementFactor)
    //   //return {tearDegree: tearDegree, dragElementFactor: dragElementFactor};
    // };
