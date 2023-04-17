class TearOffPad extends HTMLElement {
  constructor() {
    super();
    /* TODO:  Use shadow dom */
    // this.shadow = this.attachShadow( { mode: "open" } );
  };
  // TODO: getter, setter. observer?, enhance constructor?

  connectedCallback(){
    this.renderPage();
  };

  renderPage(){
    /* Set Values and render initial component state */
    const imgPath = "img/";
    const body = document.body;

        /* Get custom values from component Element */
    const componentElement        = document.getElementsByTagName( 'tear-off-pad' )[0];
    const bgColors                = componentElement.getAttribute( 'data-bgcolors' ).split(",");
    const pagesAmount             = componentElement.getAttribute( 'data-pagesamount' );
    const subPageAmount           = componentElement.getAttribute( 'data-subpageamount' );
    const btnpos                  = componentElement.getAttribute( 'data-buttonPosition' );
    const pageImgTitle            = componentElement.getAttribute( 'data-pageimgtitle' );
    const refreshBtnAriaLabel     = componentElement.getAttribute( 'data-refreshbuttonarialabel' );
    const imprintBtnAriaLabel     = componentElement.getAttribute( 'data-imprintbuttonarialabel' );

    createBasicPage();
    randomBackgroundColor();
    buttonPosition(btnpos);

    const pages                   = document.querySelector( '.pages' );
    const refresh                 = document.querySelector( '.refresh' );
    const imprint                 = document.querySelector( '.imprint' );
    const fileending              = ".svg";
    const randomfiles             = makeRandomizedFileList();
    var renderPageCallCounter     = 0;
    renderCalendarPage();

    function createBasicPage(){
      /* TearOffPad, Pages */
      const pagesTag = body.appendChild( document.createElement('div') );
      pagesTag.classList.add( "pages" );

      /* Buttons */
      const imprintBtn = body.appendChild( document.createElement( 'button' ) );
      const refreshBtn = body.appendChild( document.createElement( 'button' ) );
      refreshBtn.classList.add( 'refresh' );
      imprintBtn.classList.add( 'imprint' );
      refreshBtn.setAttribute('tabindex', '0');
      imprintBtn.setAttribute('tabindex', '0');
      refreshBtn.setAttribute('style', 'background-image: url(' + imgPath + 'refresh.svg)');
      imprintBtn.setAttribute('style', 'background-image: url(' + imgPath + 'imprint.svg)');
      refreshBtn.setAttribute('aria-label', refreshBtnAriaLabel);
      imprintBtn.setAttribute('aria-label', imprintBtnAriaLabel);
    };

    /* Generate Matrix for imgPath + Filenames, then randomize */
    function makeRandomizedFileList(){
      let filenameList = [];
      for ( let char = 97; char < (parseInt(pagesAmount) + 97); char++ ){
        let sublist = [];
        for ( let nr = 1; nr < ( parseInt(subPageAmount) + 1); nr++ ){
          let curFilename = imgPath + String.fromCharCode( char ) + "-" + ( nr )  + fileending;
          sublist.push( curFilename );
        };
        filenameList.push( sublist );
      };

      let randomizedList = [];
      randomizedList.push( imgPath + "first" + fileending );

      for ( let i = 0; i < pagesAmount; i++ ){
        let randomElement = ( filenameList[i] )[ Math.floor( Math.random() * ( filenameList[i] ).length )];
        randomizedList.push( randomElement );
      };
      randomizedList.push( imgPath + "last" + fileending );
      return randomizedList;
    };

    function renderCalendarPage() {
      const currentSrc = randomfiles[ renderPageCallCounter ];
      const newPage = document.createElement('img');
      newPage.classList.add('page');
      newPage.src = currentSrc
      pages.appendChild(newPage);
      pages.setAttribute('title', pageImgTitle);
      pages.setAttribute('tabindex', '0');
      renderPageCallCounter++;
    };

    function imprintbtn() {
      animateNext();
    };

    /* recursive */
    function animateNext() {
      const delay = 150;
      if( renderPageCallCounter != randomfiles.length ){
        document.querySelectorAll("[class='page']")[0].click();
        setTimeout(animateNext, delay);
      };
    };

    function refreshbtn(){
      if ( renderPageCallCounter != 1 ){
        renderPageCallCounter = 0;
        document.querySelectorAll("[class='page']")[0].click();
        animatePage();        
        removeAllFloorElements();
      };
    };

    function removeAllFloorElements(){
      document.querySelectorAll('.floor').forEach(e => e.remove());
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

    /* declares offset values randomly, x and y describes the coordinate system */
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

      let randomCoords = generateRandomCoordinates(width, height, centerX, centerY)
      let x = randomCoords.x
      let y = randomCoords.y
      // let bezierPoints = [{ x: centerX, y: centerY }, { x: x, y: y }, { x: centerX, y: targetY }, { x: curTargetX, y: targetY }];
      // console.log(bezierPoints);
      
      const divElements = document.querySelectorAll("[class='page']");
      if( renderPageCallCounter < randomfiles.length ){
        for (let i = 0; i < divElements.length; i++) {
          let rotationAngle = Math.atan2(x, y) * 180 / Math.PI;
          /* Vector length as multiplicator */
          let vectorLength = Math.sqrt(Math.abs(x) + Math.abs(y)) / 35;
          
          divElements[i].style.transition = 'transform cubic-bezier(0.16, 1, 0.3, 1), 0.75s ease-out';
          divElements[i].style.transform = `translate(${x}px, ${y}px) rotateY(${-rotationAngle * vectorLength}deg) rotateZ(${-rotationAngle * vectorLength}deg)`;

          renderCalendarPage();
        
          divElements[i].addEventListener("transitionend", function() {
            const xValue = 45;
            /* transVal defines in which direction page falls and in which dir it lays down */
            const transVal = ( x < 0 ) ? [ xValue, -targetX ] : [ -xValue, targetX ];
            divElements[i].style.transform = `translate(${transVal[1]}px, ${targetY}px) rotateX(${70}deg)  rotateZ(${transVal[0]*vectorLength}deg)`;
          });
          makeFloorElement(divElements[0]);
        };
      };

    };

    function makeFloorElement( element ){
      element.classList.add('floor');
    };

    pages.addEventListener('click', animatePage);
    refresh.addEventListener('click', refreshbtn);
    imprint.addEventListener('click', imprintbtn);
  };
};

customElements.define('tear-off-pad', TearOffPad);