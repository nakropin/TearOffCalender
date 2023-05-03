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

    createBasicPage();
    randomBackgroundColor();

    /* Get selectors etc */
    const pages                   = shadow.querySelector( '.pages' );
    const refresh                 = shadow.querySelector( '.refresh' );
    const imprint                 = shadow.querySelector( '.imprint' );
    buttonPosition( btnpos );

    const fileEnding              = ".svg";
    const randomFiles             = makeRandomizedFileList();
    const delay                   = 150;
    var renderPageCallCounter     = 0;
    
    renderPage(); /* renders the first page */
    activateEventListeners();

    /* Functions */

    function detectDeviceType(){
      const deviceType = /Kindle|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? 'Mobile'
        : 'Desktop';
      deviceType === 'Mobile'
        ? ( startEventType = "touchstart", moveEventType = "touchmove", endEventType = "touchend" )
        : ( startEventType = "mousedown",  moveEventType = "mousemove", endEventType = "mouseup" );
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
      const newPage = document.createElement('img');
      newPage.classList.add('page');
      newPage.src = currentSrc;
      newPage.setAttribute('alt', setAltText());
      // newPage.setAttribute('id', 'tearhint');
      // pages.style.backgroundImage('url("img/a-1.svg")');
      pages.appendChild(newPage);
      pages.setAttribute('title', pageImgTitle);
      pages.setAttribute('tabindex', '0');

      // TODO: pages set background img renderPageCallCounter+1
      // const nextSrc = randomFiles[ renderPageCallCounter + 1 ];
      // pages.setAttribute('src',  nextSrc );
      
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
      animationDelayIterator();
      turnOffEventListenersWhileEventAction();
      // TODO: make work again
    };

    /* recursively call animation */
    function animationDelayIterator() {
      if( renderPageCallCounter != randomFiles.length ){
        animatePage();
        setTimeout(animationDelayIterator, delay);
        // TODO: implement random coordinates or left-right switch for animation to work correctly
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
    let timer;
    let lastDragPosition;
    const dragElementFactor = 5;


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
          mouseX = e.touches[0].clientX - centerX;
          mouseY = e.touches[0].clientY - centerY;
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
            document.removeEventListener('mouseup', animatePage);
            progress = 0;
          }
        };
        animateOnce();
        renderPage();
        resetHelpers();
        makeFloorElement(curPage);
        zStyleSwitch(curPage);
      };
    };

    function zStyleSwitch( element ){
      element.style.zIndex = 1;
    }

    function setDragDirection(e){
      /* "natural haptic" = mouse left side -> right: top right, l->l: t l, r->l: t l, r->: t r; */
      // TODO: if drag has been done on one side till X deg then dont change dir (switch to the other side)      
      if (timer === 1){
        return curDir;
      }
      else{
        // setTimeout(timer = 1, 500);
        timer = 1;
        if (deviceType=== 'Mobile') {
          return mouseXStart < (e.touches[0] - centerX) ? "right" : "left";
        }
        else if (deviceType=== 'Desktop') {
          return mouseXStart < (e.clientX - centerX) ? "right" : "left";
        }
      };
    };

    function resetHelpers(){
      mouseXStart = lastPositionY = mouseAddY = timer = lastDragPosition = 0;
      curDir = null;
    };

    function dragElement(e){
      const curPage = shadow.querySelectorAll("[class='page']")[0];
      curPage.style.zIndex = 2;
      let mouseX;
      let mouseY;
      if (deviceType=== 'Mobile') {
        mouseX = e.touches[0].clientX - centerX;
        mouseY = e.touches[0].clientY - centerY;
      }
      else if (deviceType=== 'Desktop') {
        mouseX = e.clientX - centerX;
        mouseY = e.clientY - centerY;
      }
      
      curDir = setDragDirection(e);
      curPage.style.transformOrigin = 'top ' + curDir;
      
      let curDegree = calcDegFromCurMouse(curDir, mouseX, mouseY);
      //let curDegree = curDir === "left" ? Math.abs(((mouseXStart - mouseX) + (mouseY)) / 12) / dragElementFactor : -Math.abs(((mouseXStart - mouseX)) / 12) / dragElementFactor;

      curPage.style.transformOrigin = 'top ' + curDir;
      curPage.style.transform = 'rotate(' + curDegree + 'deg)';
      lastDragPosition = curDegree;

      if ( curDegree >= 60 ) {
        document.dispatchEvent(new Event('mouseup'), animatePage());
      };
    };

    /* in this setup, difference in y-value through mousemove is measured so that
       one can move up and down afterwards or vice versa and it still will tear the animation */
    function calcDegFromCurMouse(curDir, mouseX, mouseY) {
      // TODO: change mouseAddY so that it only grows bigger
      mouseAddY += Math.abs(lastPositionY - mouseY) / 3000;
      let mousePosX = ((mouseXStart - mouseX) / 12);
      let curDegree = curDir === "left" ? Math.abs(mousePosX + mouseAddY) : -Math.abs(mousePosX - mouseAddY);
      return curDegree;
    };

    function startTransform(e){
      if (renderPageCallCounter !== randomFiles.length){
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        curPage.setAttribute( "border", "1px solid black;" )
        if (deviceType=== 'Mobile') {
          mouseXStart = e.touches[0].clientX - centerX;
        }
        else if (deviceType=== 'Desktop') {
          mouseXStart = e.clientX - centerX;
        }

        console.log(mouseXStart)
        addTempEventListeners();
      };
    };

    /* temporary event Listeners, use mouseleave & click as helper in case of stuck. can be optimized */
    function removeTempEventListeners(){
      document.removeEventListener(moveEventType, dragElement);
      document.removeEventListener(endEventType, animatePage);
      document.body.removeEventListener("mouseleave", animatePage);
      document.removeEventListener("click", animatePage);
    };

    function addTempEventListeners(){
      document.addEventListener(moveEventType, dragElement);
      document.addEventListener(endEventType, animatePage);
      document.body.addEventListener("mouseleave", animatePage);
      document.addEventListener("click", animatePage);
    };

    function activateEventListeners( ){
      pages.addEventListener(startEventType, startTransform);
      refresh.addEventListener('click', refreshbtn);
      imprint.addEventListener('click', imprintbtn);
    };
  };
};
};
customElements.define('tear-off-pad', TearOffPad);