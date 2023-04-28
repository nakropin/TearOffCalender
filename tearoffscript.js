class TearOffPad extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    // this.attachShadow({ mode: 'open' });
  };

  connectedCallback(){
    this.render();
  };

  render(){
    /* Set up ShadowRoot */

    // const shadowRoot = this.shadowRoot;
    // this.shadowRoot.queryselector

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
    // TODO: ShadowRoot
    const refresh                 = shadow.querySelector( '.refresh' );
    const imprint                 = shadow.querySelector( '.imprint' );
    buttonPosition( btnpos );

    const fileEnding              = ".svg";
    const randomFiles             = makeRandomizedFileList();
    const delay                   = 150;
    var renderPageCallCounter     = 0;
    
    renderPage(); /* renders the first page */
    activateEventListeners();
    // setInterval(handleMouseEnter(pages.event), 5000)
    /*  Functions */

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
      if ( renderPageCallCounter != 0 ){
        animatePage();
        removeAllFloorElements();
        renderPageCallCounter = 0;

        // animatePage(new Event('mouseup'));
        // pages.dispatchEvent(new Event('mousedown'), startTransform);
        // setTimeout(function() {
        //   document.dispatchEvent(new Event('mouseup'), animatePage);
        // }, delay );
        // TODO: make work again
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
      /* check if input is correct, otherwise use preset value 0 (upperleft) */  
      let currPos = 0;     
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
        // const imprint = shadow.getElementsByClassName("imprint")[0];
        // const refresh = shadow.getElementsByClassName("refresh")[0];
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
    let timer = 0;

    // let lastDragPoint;

    function makeFloorElement( element ){
      element.classList.add('floor');
    };
    
    function getCoordinates(e){ /* get mouseCoords at start */
      let mouseX = e.clientX - centerX;
      let mouseY = e.clientY - centerY;
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
      var x = 0,
          y = 0;
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
      // TODO: get startposition from drag & animate
      removeTempEventListeners();

      if ( renderPageCallCounter < randomFiles.length ) {
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        const bezier = getCoordinates(event);
        let progress = 0;
        const random = 1;
        // const random = Math.random() * 20 - 10;
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
      // use timer here
      
      if (timer === 1){
        return curDir;
      }
      else{
        // setTimeout(timer = 1, 500);
        timer = 1;
        return mouseXStart < (e.clientX - centerX) ? "right" : "left";
      }
    };

    /* temporary event Listeners, use mouseleave & click as helper in case of (browserwise) stuck */
    function removeTempEventListeners(){
      document.removeEventListener('mouseup', animatePage)
      document.removeEventListener('mousemove', dragElement);
      document.body.removeEventListener("mouseleave", animatePage);
      document.removeEventListener("click", animatePage)
    }

    function addTempEventListeners(){
      document.addEventListener("mousemove", dragElement);
      document.addEventListener("mouseup", animatePage);
      document.body.addEventListener("mouseleave", animatePage);
      document.addEventListener("click", animatePage)
    }

    function resetHelpers(){
      mouseXStart, lastPositionY, mouseAddY, curDir, timer = 0;
    }

    function dragElement(e){
      const curPage = shadow.querySelectorAll("[class='page']")[0];
      curPage.style.zIndex = 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      curDir = setDragDirection(e);
      curPage.style.transformOrigin = 'top ' + curDir;
      
      let curDegree = calcDegFromCurMouse(curDir, mouseX, mouseY);

      curPage.style.transformOrigin = 'top ' + curDir;
      curPage.style.transform = 'rotate(' + curDegree + 'deg)';

      if ( curDegree >= 60 ) {
        document.dispatchEvent(new Event('mouseup'), animatePage());
      };

    }

    /* in this setup, difference in y-value through mousemove is measured so that
         one can move up or down and it still will tear the animation */
    function calcDegFromCurMouse(curDir, mouseX, mouseY) {
    /* add diff of (last to cur y-pos) for curDegree -> dragging up or down leads to more tear*/
      mouseAddY += Math.abs(lastPositionY - mouseY) / 3000;
      let mousePosX = ((mouseXStart - mouseX) / 12);
      let curDegree = curDir === "left" ? Math.abs(mousePosX + mouseAddY) : -Math.abs(mousePosX - mouseAddY);
      return curDegree;
    }

    function startTransform(e){
      if (renderPageCallCounter !== randomFiles.length){
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        curPage.setAttribute(  "border", "1px solid black;")
        mouseXStart = e.clientX - centerX;
        addTempEventListeners();
      }
    }

    function activateEventListeners(){
      pages.addEventListener('mousedown', startTransform);
      refresh.addEventListener('click', refreshbtn);
      imprint.addEventListener('click', imprintbtn);
    };
  };
};

customElements.define('tear-off-pad', TearOffPad);

    /* declares offset values randomly, x and y describe the coordinate system */
    // function generateRandomCoordinates (width, height, centerX, centerY){
    //   let x = Math.random() * width - centerX;
    //   let y = Math.random() * height - centerY;
    //   return({x: x, y: y});
    // };


      // in starttransform
      //console.log(vectorLength)
      //return mouseX;
      //let vectorLength = Math.sqrt(Math.abs(handleClick(e).x - mouseX) + Math.abs(handleClick(e).x - - mouseY));
      //console.log(vectorLength)

      // // // regex from html element string to get lastDegree to not push upwards again
      // let lastDegree = String(curPage.style.getPropertyValue('transform'));
      // lastDegree = lastDegree.match(/-?\d*\.?\d+/);
      // // how to preve
      // if (curDegree > lastDegree){  
      // }
      //   //-ms-transform:rotate(' + curDegree + 'deg); -webkit-transform:rotate(' + curDegree + 'deg);'


    // TODO: set 0 shadow when curPage transform === 0 

    // function tearPage( e, mouseXStart ){
    //   const curPage = shadow.querySelectorAll("[class='page']")[0];
    //   let mousePosX = dragElement(e).x;
    //   console.log(mouseXStart, mousePosX)
    //   // startpos + x movement
    // }


    /* detect from which pos hover over page */
    // function handleMouseEnter( event ) {
    //   if ( renderPageCallCounter < randomFiles.length ){
    //     const element = event.target;
    //     const boundingRect = element.getBoundingClientRect();
    //     const mouseX = event.clientX - boundingRect.left;
    //     const elementWidth = boundingRect.width;
    //     const curPage = shadow.querySelectorAll("[class='page']")[0];
    //     curPage.removeAttribute("id");
    //     const pos = ( mouseX < elementWidth / 2 ) ? curPage.id= "left" : curPage.id= "right";
    //   };
    // };    

    // function handleMouseLeave(){
    //   const curPage = shadow.querySelectorAll("[class='page']")[0];
    //   setTimeout(function() {curPage.removeAttribute('id');}, 300 );
    //   // curPage.id= "tearhint";
    // };

    // function dragElement(elmnt) {
    //   animatePage();
    //   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    //     /* otherwise, move the DIV from anywhere inside the DIV:*/
    //   elmnt.onmousedown = dragMouseDown;
    
    //   function dragMouseDown(e) {
    //     e = e || window.event;
    //     e.preventDefault();
    //     // get the mouse cursor position at startup:
    //     pos3 = e.clientX;
    //     pos4 = e.clientY;
    //     document.onmouseup = closeDragElement;
    //     // call a function whenever the cursor moves:
    //     document.onmousemove = elementDrag;
    //   }
    
    //   function elementDrag(e) {
    //     e = e || window.event;
    //     e.preventDefault();
    //     // calculate the new cursor position:
    //     pos1 = pos3 - e.clientX;
    //     pos2 = pos4 - e.clientY;
    //     pos3 = e.clientX;
    //     pos4 = e.clientY;
    //     // set the element's new position:
    //     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    //     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    //   }
    
    //   function closeDragElement() {
    //     // stop moving when mouse button is released:
    //     document.onmouseup = null;
    //     document.onmousemove = null;
    //     animatePage();
    //   }
    // }    

    // function tearAnimation( event ){
    //   while ( event ){
    //     dragElement
    //   }
      
    // }