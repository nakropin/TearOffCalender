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

    function createBasicPage(){
      /* TearOffPad, Pages */
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
      animationDelayIterator();
      turnOffEventListenersWhileEventAction();
    };

    /* recursively call animation */
    function animationDelayIterator() {
      if( renderPageCallCounter != randomFiles.length ){
        animatePage();
        setTimeout(animationDelayIterator, delay);
        // TODO: implement random coordinates or left-right switch for animation to work correctly
      };
    };

    function refreshbtn(){
      if ( renderPageCallCounter != 0 ){
        //animatePage();
        renderPageCallCounter = 0;
        //animatePage();
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
      let currPos = 0; /* preset value 0, used if no/incorrect input*/      
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
          if( i === 0 | i === 1 ){
            refresh.style[stylespos[i]] = "70" + unit;
          }
          else{
            refresh.style[stylespos[i]] = pos[currPos][i] + unit;
          };
        };
      };
    };


    /////////////////////////////////////////////////////////////

    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const targetX = centerX / 8 * 5;
    const targetY = centerY / 4 * 3;
    let bezierPoints = [{ x: centerX, y: centerY }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: targetX, y: targetY }];

    function getMouseCoordinates(e){
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      return {x: mouseX, y: mouseY};
    }

    /* declares offset values randomly, x and y describe the coordinate system */
    // function generateRandomCoordinates (width, height, centerX, centerY){
    //   let x = Math.random() * width - centerX;
    //   let y = Math.random() * height - centerY;
    //   return({x: x, y: y});
    // };

    function animatePage() {
      console.log("hello");
      if (renderPageCallCounter < randomFiles.length) {
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        const bezier = getCoordinates(event);
        let progress = 0;
        const random = 1;
        // const random = Math.random() * 20 - 10;

        const animateOnce = () => {
          let position = getBezierPosition(bezier, progress);
          let rotationAngle = Math.atan2(position.x, position.y) * 180 / Math.PI + random;
          curPage.style.transform = 'translate(' + position.x + 'px, ' + position.y + 'px) rotateX('+ rotationAngle*progress*1.1+'deg) rotateZ('+ -rotationAngle*progress*0.8+'deg)';

          if (progress < 1) {
            progress += 0.01;
            requestAnimationFrame(animateOnce);
          } else {
            document.removeEventListener('mouseup', animatePage)
            progress = 0;
          }
        };
        animateOnce();
        renderPage();
        makeFloorElement(curPage);
      };
    };

    // Mauskoordinaten beim Start berücksichtigen
    function getCoordinates(e){
      let mouseX = getMouseCoordinates(e).x;
      let mouseY = getMouseCoordinates(e).y;
      if(mouseX > 0){
        bezierPoints = [{ x: centerX, y: centerY }, { x: mouseX + centerX, y: mouseY}, { x: 0, y: targetY}, { x: targetX+Math.random() * 100 - 50, y: targetY }];
     }
     else {
        bezierPoints = [{ x: centerX, y: centerY }, { x: mouseX, y: mouseY }, { x: 0, y: targetY}, { x: -targetX+Math.random() * 100 - 50, y: targetY }];
     }
      //console.log(bezierPoints);
      return bezierPoints;
    }

    // Funktion, um die Position entlang der Bezier-Kurve zu berechnen
    function getBezierPosition(points, progress) {

      var x = 0,
          y = 0;
      var n = points.length - 1;
      for (var i = 0; i <= n; i++) {
        var coefficient = binomialCoefficient(n, i) * Math.pow(1 - progress, n - i) * Math.pow(progress, i);
        x += points[i].x * coefficient;
        y += points[i].y * coefficient;
      }
      // Mauskoordinaten berücksichtigen
      x += (- bezierPoints[0].x) * (1 - progress);
      y += (- bezierPoints[0].y) * (1 - progress);
      return { x: x, y: y };
    }

// Hilfsfunktion, um den Binomialkoeffizienten zu berechnen
    function binomialCoefficient(n, k) {
      var coefficient = 1;
      for (var i = 1; i <= k; i++) {
        coefficient *= (n - i + 1) / i;
      }
      return coefficient;
    }

    function makeFloorElement( element ){
      element.classList.add('floor');
    };

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

    // function turnOffEventListenersWhileEventAction(){
    //   const clickableElements = [ pages, refresh, imprint ];
    //   clickableElements.forEach(e => e.setAttribute('disabled', 'disabled'));
    //   const currentDelay = delay * ( ( randomFiles.length - renderPageCallCounter ) + 3 );
    //   setTimeout(function() {
    //     clickableElements.forEach(e => e.removeAttribute('disabled'));
    //   }, currentDelay );
    // };

    function handleClick(e){
      let mouseX = getMouseCoordinates(e).x;
      let mouseY = getMouseCoordinates(e).y;
      document.addEventListener('mouseup', animatePage)
      
      //console.log(vectorLength)

      //return mouseX;
      //let vectorLength = Math.sqrt(Math.abs(handleClick(e).x - mouseX) + Math.abs(handleClick(e).x - - mouseY));
      //console.log(vectorLength)
    }

    function activateEventListeners(){
     
      pages.addEventListener('mousedown', handleClick);  
      // document.addEventListener('click', animatePage);
      document.addEventListener('click', getCoordinates);
      document.addEventListener('mousemove', getMouseCoordinates);

      // pages.addEventListener('mouseenter', handleMouseEnter);
      // pages.addEventListener('mouseout', handleMouseLeave);
      // pages.addEventListener('touch', );

      refresh.addEventListener('click', refreshbtn);
      imprint.addEventListener('click', imprintbtn);
    };

  };
};

customElements.define('tear-off-pad', TearOffPad);