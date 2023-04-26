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
    // implementSwiper();
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

    /* declares offset values randomly, x and y describe the coordinate system */
    function generateRandomCoordinates (width, height, centerX, centerY){
      let x = Math.random() * width - centerX;
      let y = Math.random() * height - centerY;
      return({x: x, y: y});
    };

    function animatePage(){    
      if( renderPageCallCounter < randomFiles.length ){
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
          
          const curPage = shadow.querySelectorAll("[class='page']")[0];

          renderPage();
          makeFloorElement( curPage );

          let chooseAnimation = 1;

          if (chooseAnimation === 1){

          let rotationAngle = Math.atan2(x, y) * 180 / Math.PI;
          /* Vector length as multiplicator */
          let vectorLength = Math.sqrt(Math.abs(x) + Math.abs(y)) / 35;
            curPage.removeAttribute("id")
            // curPage.style.transformOrigin = "top";

            curPage.style.transition = 'transform cubic-bezier(0.16, 1, 0.3, 1), 0.75s ease-out';
            curPage.style.transform = `translate(${x}px, ${y}px) rotateY(${-rotationAngle * vectorLength}deg) rotateZ(${-rotationAngle * vectorLength}deg)`;

            curPage.addEventListener("transitionend", function() {
              const xValue = 45;
              /* transVal defines in which direction page falls and in which dir it lays down */
              const transVal = ( x < 0 ) ? [ xValue, -targetX ] : [ -xValue, targetX ];
              curPage.style.transform = `translate(${transVal[1]}px, ${targetY}px) rotateX(${70}deg)  rotateZ(${transVal[0]*vectorLength}deg)`;
            });
          } else if ( chooseAnimation === 2) {
              const keyframes = [
                { transform: 'translate3d(0vw, 0vh, 0px)' },
                { transform: 'translate3d(6vw, 30vh, 100px) rotateX(50deg) rotateZ(-20deg)' },
                { transform: 'translate3d(-6vw, 40vh, 75px) rotateX(-50deg) rotateZ(20deg)' },
                { transform: 'translate3d(6vw, 60vh, 100px) rotateX(70deg) rotateZ(-40deg)' }
              ];

              const options = {
                duration: 3000,
                iterations: Infinity
              };
              const animation = new KeyframeEffect(curPage, keyframes, options);
              curPage.animate(animation);
          }
      };
    };

    function makeFloorElement( element ){
      element.classList.add('floor');
    };

    /* detect from which pos hover over page */
    function handleMouseEnter( event ) {
      if ( renderPageCallCounter < randomFiles.length ){
        const element = event.target;
        const boundingRect = element.getBoundingClientRect();
        const mouseX = event.clientX - boundingRect.left;
        const elementWidth = boundingRect.width;
        const curPage = shadow.querySelectorAll("[class='page']")[0];
        curPage.removeAttribute("id");
        const pos = ( mouseX < elementWidth / 2 ) ? curPage.id= "left" : curPage.id= "right";
      };
    };    

    function handleMouseLeave(){
      const curPage = shadow.querySelectorAll("[class='page']")[0];
      setTimeout(function() {curPage.removeAttribute('id');}, 300 );
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
      pages.addEventListener('mouseout', handleMouseLeave);
      // pages.addEventListener('touch', );

      refresh.addEventListener('click', refreshbtn);
      imprint.addEventListener('click', imprintbtn);
    };

    function implementSwiper(){
      const shadroot = document.querySelector('#my-shadow-root').shadow;
      const sliderEl = document.createElement('div');

      shadroot.appendChild(sliderEl)

      sliderEl.classList.add('swipe')
      sliderEl.setAttribute("id", 'slider')

      const sliderWrapper = document.createElement('div');
      sliderEl.classList.add('swipe-wrap');
      sliderEl.appendChild(sliderWrapper)

    }

    // var element = document.getElementById('slider');
    // window.slider = new Swipe(element, {
    //   startSlide: 0,
    //   auto: 3000,
    //   draggable: false,
    //   autoRestart: false,
    //   continuous: true,
    //   disableScroll: true,
    //   stopPropagation: true,
    //   callback: function(index, element) {},
    //   transitionEnd: function(index, element) {}
    // });

  };
};

customElements.define('tear-off-pad', TearOffPad);