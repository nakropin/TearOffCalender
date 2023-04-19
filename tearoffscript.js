class TearOffPad extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  };

  connectedCallback(){
    this.renderPage();
  };

  renderPage(){
    /* Set up ShadowRoot */
    const template = document.createElement('link');
    template.setAttribute('rel', "stylesheet");
    template.setAttribute('href', './style.css');
    template.setAttribute('type', 'text/css');
    
    const shadowRoot = this.shadowRoot;
    shadowRoot.appendChild(template);

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
    buttonPosition( btnpos );

    /* Get selectors etc */
    const pages                   = shadowRoot.querySelector( '.pages' );
    const refresh                 = document.body.querySelector( '.refresh' );
    const imprint                 = document.body.querySelector( '.imprint' );
    const fileEnding              = ".svg";
    const randomFiles             = makeRandomizedFileList();
    const delay                   = 150;
    var renderPageCallCounter     = 0;
    
    renderPage(); /* renders the first page */
    activateEventListeners();

    /*  Functions */

    function createBasicPage(){
      /* TearOffPad, Pages */
      const pagesTag = shadowRoot.appendChild( document.createElement('div') );
      pagesTag.classList.add( "pages" );   
      const buttons = [  [ 'imprint', imprintBtnAriaLabel, imgPath ],
                         [ 'refresh', refreshBtnAriaLabel, imgPath ] ];
      buttons.forEach(e => makeButton( e[0], e[1], e[2] ))
    };

    function makeButton(btnName, ariaLabel, imgPath){
      let newButton = document.body.appendChild( document.createElement( 'button' ) );
      newButton.classList.add( btnName );
      newButton.setAttribute('tabindex', '0');
      newButton.setAttribute('style', 'background-image: url(' + imgPath + btnName + '.svg)');
      newButton.setAttribute('aria-label', ariaLabel);
    };

    /* Generate Matrix for imgPath + Filenames, then randomize */
    function makeRandomizedFileList(){
      let filenameList = [];
      for ( let char = 97; char < (parseInt(pagesAmount) + 97); char++ ){
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
      let altText = setAltText();
      newPage.setAttribute('alt', altText);
      // newPage.setAttribute('id', 'tearhint');
      pages.appendChild(newPage);
      pages.setAttribute('title', pageImgTitle);
      pages.setAttribute('tabindex', '0');
      renderPageCallCounter++;
    };
    
    function setAltText(){
      let initialAltTexts = [ altTextFrontPage, altTextImages, altTextImprint ];
      let useAltTags = []
      initialAltTexts.forEach(e => e === null ? useAltTags.push("An image, not further described."): useAltTags.push(e))
      let result = renderPageCallCounter === 0 ? useAltTags[0] : renderPageCallCounter != randomFiles.length-1 ? useAltTags[1] : useAltTags[2];
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
      };
    };

    function refreshbtn(){
      if ( renderPageCallCounter != 1 ){
        animatePage();
        renderPageCallCounter = 0;
        animatePage();        
        removeAllFloorElements();
      };
    };

    function removeAllFloorElements(){
      shadowRoot.querySelectorAll('.floor').forEach(e => e.remove());
    };

    function randomBackgroundColor() {
      let randomColor = bgColors[ Math.floor( Math.random() * bgColors.length) ];
      document.body.style.background = randomColor;
    };

    function buttonPosition( input ){
      const checkInput = [ "upperLeft", "upperRight", "lowerLeft", "lowerRight" ];
      let currPos = 0; /* preset value 0, used if no/incorrect input*/
      for ( let i = 0; i < checkInput.length; i++){
        if ( input === checkInput[i] ){
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
        const imprint = document.getElementsByClassName("imprint")[0];
        const refresh = document.getElementsByClassName("refresh")[0];
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

    /* declares offset values randomly, x and y describe the coordinate system */
    function generateRandomCoordinates (width, height, centerX, centerY){
      let x = Math.random() * width - centerX;
      let y = Math.random() * height - centerY;
      return({x: x, y: y});
    };

    function animatePage(){    
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const targetX = centerX / 8 * 5;
      const targetY = centerY / 4 * 3;

      let randomCoords = generateRandomCoordinates(width, height, centerX, centerY);
      let x = randomCoords.x;
      let y = randomCoords.y;
      // let bezierPoints = [{ x: centerX, y: centerY }, { x: x, y: y }, { x: centerX, y: targetY }, { x: curTargetX, y: targetY }];
      // console.log(bezierPoints);
      
      const divElements = shadowRoot.querySelectorAll("[class='page']");
      if( renderPageCallCounter < randomFiles.length ){
        for (let i = 0; i < divElements.length; i++) {
          let rotationAngle = Math.atan2(x, y) * 180 / Math.PI;
          /* Vector length as multiplicator */
          let vectorLength = Math.sqrt(Math.abs(x) + Math.abs(y)) / 35;
          divElements[i].removeAttribute("id")
          divElements[i].style.transition = 'transform cubic-bezier(0.16, 1, 0.3, 1), 0.75s ease-out';
          divElements[i].style.transform = `translate(${x}px, ${y}px) rotateY(${-rotationAngle * vectorLength}deg) rotateZ(${-rotationAngle * vectorLength}deg)`;

          renderPage();
        
          divElements[i].addEventListener("transitionend", function() {
            const xValue = 45;
            /* transVal defines in which direction page falls and in which dir it lays down */
            const transVal = ( x < 0 ) ? [ xValue, -targetX ] : [ -xValue, targetX ];
            divElements[i].style.transform = `translate(${transVal[1]}px, ${targetY}px) rotateX(${70}deg)  rotateZ(${transVal[0]*vectorLength}deg)`;
          });
          makeFloorElement( divElements[0] );
        };
      };
    };

    function makeFloorElement( element ){
      element.classList.add('floor');
    };

    /* detect from which pos hover over page */
    function handleMouseEnter( event ) {
      const element = event.target;
      const boundingRect = element.getBoundingClientRect();
      const mouseX = event.clientX - boundingRect.left;
      const elementWidth = boundingRect.width;
      const curPage = shadowRoot.querySelectorAll("[class='page']")[0];
      const pos = ( mouseX < elementWidth / 2 ) ? curPage.id= "left" : curPage.id= "right";
    };    

    function handleMouseLeave(){
      // const curPage = shadowRoot.querySelectorAll("[class='page']")[0];
      // curPage.id= "tearhint";
    };

    function turnOffEventListenersWhileEventAction(){
      const clickableElements = [ pages, refresh, imprint ];
      clickableElements.forEach(e => e.setAttribute('disabled', 'disabled'));
      const currentDelay = delay * ( ( randomFiles.length - renderPageCallCounter ) + 3 );
      setTimeout(function() {
        clickableElements.forEach(e => e.removeAttribute('disabled'));
      }, currentDelay );
    };

    function activateEventListeners(){
      pages.addEventListener('click', animatePage);
      pages.addEventListener('mouseenter', handleMouseEnter);
      pages.addEventListener('mouseleave', handleMouseLeave);
      refresh.addEventListener('click', refreshbtn);
      imprint.addEventListener('click', imprintbtn);
    };
  };
};

customElements.define('tear-off-pad', TearOffPad);