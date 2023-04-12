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
    const componentElement      = document.getElementsByTagName('tear-off-pad')[0];
    const bgColors              = componentElement.getAttribute( 'data-bgcolors' ).split(",");
    const pagesAmount           = componentElement.getAttribute( 'data-pagesamount' );
    const subPageAmount         = componentElement.getAttribute( 'data-subpageamount' );
    const btnpos                = componentElement.getAttribute( 'data-buttonposition' );
    const pageImgAltText        = componentElement.getAttribute( 'data-pageimgalttext' );
    const refreshBtnAltText     = componentElement.getAttribute( 'data-refreshBtnalttext' );
    const imprintBtnAltText     = componentElement.getAttribute( 'data-imprintBtnalttext' );

    createBasicPage();
    randomBackgroundColor();
    buttonposition(btnpos);

    const pages         = document.querySelector( '.pages' );
    const refresh       = document.querySelector( '.refresh' );
    const imprint       = document.querySelector( '.imprint' );
    const fileending    = ".svg";
    const randomfiles   = makeRandomizedFileList();
    var renderPageCallCounter = 0;
    renderCalendarPage();

    function createBasicPage(){
      /* TearOffPad, Pages */
      const pagesTag = body.appendChild( document.createElement('div') );
      pagesTag.classList.add( "pages" );

      /* Buttons */
      const refreshBtn = body.appendChild( document.createElement( 'button' ) );
      const imprintBtn = body.appendChild( document.createElement( 'button' ) );
      refreshBtn.setAttribute('tabindex', '0');
      imprintBtn.setAttribute('tabindex', '0');
      refreshBtn.classList.add( 'refresh' );
      imprintBtn.classList.add( 'imprint' );
      refreshBtn.setAttribute('style', 'background-image: url(' + imgPath + 'refresh.svg)');
      imprintBtn.setAttribute('style', 'background-image: url(' + imgPath + 'imprint.svg)');
      refreshBtn.setAttribute('alt', refreshBtnAltText);
      imprintBtn.setAttribute('alt', imprintBtnAltText);
    };

    /* Generate Matrix for imgPath + Filenames, then randomize */
    function makeRandomizedFileList(){
      let filenameList = [];
      for (let i = 0; i < pagesAmount; i++){
        let sublist = [];
        for (let j = 0; j < subPageAmount; j++){
          let curFilename = imgPath + String.fromCharCode( 97 + i ) + "-" + ( j + 1 )  + fileending;
          sublist.push( curFilename );
        };
        filenameList.push( sublist );
      };

    let randomizedList = [];
      randomizedList.push( imgPath + "first" + fileending );

      for ( let i = 0; i < pagesAmount; i++ ){
        let randomElement = ( filenameList[i] )[Math.floor( Math.random() * ( filenameList[i] ).length )];
        randomizedList.push( randomElement );
      };
      randomizedList.push( imgPath + "last" + fileending );
      return randomizedList;
    };

    function updateCalendar( target ) {
      if ( target && target.classList.contains('page') ) {
        target.classList.add( 'tear' );
      } else {
        return;
      }
      renderCalendarPage();
    };

    function renderCalendarPage() {
      const currentSrc = randomfiles[ renderPageCallCounter ];
      const newPage = document.createElement('div');
      newPage.style.backgroundImage = "url("+ currentSrc +")"
      newPage.classList.add('page');
      pages.appendChild(newPage);
      newPage.setAttribute('alt', pageImgAltText);
      pages.setAttribute('tabindex', '0');
      renderPageCallCounter++;
    };

    function refreshbtn(){
      if ( renderPageCallCounter != 1 ){
        renderPageCallCounter = 0;
        document.querySelectorAll("[class='page']")[0].click();
        let randomCoordinates = generateRandomCoordinates();
        animatePage(randomCoordinates.x, randomCoordinates.y);
      };
    };

    function imprintbtn(){
      if(renderPageCallCounter != randomfiles.length){
        document.querySelectorAll("[class='page']")[0].click();
        renderPageCallCounter = randomfiles.length-1;
        let randomCoordinates = generateRandomCoordinates();
        animatePage(randomCoordinates.x, randomCoordinates.y);
      }
    };

    function randomBackgroundColor() {
      let randomColor = bgColors[ Math.floor( Math.random() * bgColors.length) ];
      document.body.style.background = randomColor;
    };

    function buttonposition( input ){
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
            refresh.style[stylespos[i]] = "100" + unit;
          }
          else{
            refresh.style[stylespos[i]] = pos[currPos][i] + unit;
          };
        };
      };
    };

    //Globale Hilfsvariablen
    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let offsetX;
    let offsetY;
    const targetX = centerX/8*5;
    const targetY = centerY/4*3;

    let bezierPoints = [{ x: centerX, y: centerY }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: targetX, y: targetY }];


    /* Functionality */
    //ist nur aktiv wenn auch innerhalb der Page geklickt wird
    function handleClick() {
      //Während mousedown wird ein Listener auf den body gesetzt um Koordinaten mithilfe der Hilfsunktion zu erhalten
      body.addEventListener('mouseup', getCoordinates)
    };

    /* declares offset values from pointer location, calls animatePage offset describes the coordinate system */
    function getCoordinates(event){
      offsetX = event.clientX - centerX;
      offsetY = event.clientY - centerY;
      if(offsetX > 0){
        bezierPoints = [{ x: centerX, y: centerY }, { x: offsetX, y: offsetY }, { x: centerX, y: targetY }, { x: targetX, y: targetY }];
      }
      else {
        bezierPoints = [{ x: centerX, y: centerY }, { x: offsetX, y: offsetY }, { x: centerX, y: targetY }, { x: -targetX, y: targetY }];
      }
      console.log(bezierPoints);
      animatePage(offsetX, offsetY);
    };

    function generateRandomCoordinates (){
      let x = Math.random() * width - centerX;
      let y = Math.random() * height - centerY;
      return {x:x, y:y};
    };

    function animatePage(x, y){
      const divElements = document.querySelectorAll("[class='page']");
      if( renderPageCallCounter < randomfiles.length ){
        for (let i = 0; i < divElements.length; i++) {
          let rotationAngle = Math.atan2(x, y) * 180 / Math.PI;
          // Länge des Vektors als Multiplikator
          let vectorLength = Math.sqrt(Math.abs(x) + Math.abs(y)) / 35;
          divElements[i].style.transition = 'transform cubic-bezier(0.16, 1, 0.3, 1), 0.75s ease-in';
          divElements[i].style.transform = `translate(${x}px, ${y}px) rotateY(${-rotationAngle * vectorLength}deg) rotateZ(${-rotationAngle * vectorLength}deg)`;
          body.removeEventListener("mouseup", getCoordinates)
          updateCalendar( divElements[i] );

          divElements[i].addEventListener("transitionend", function() {

            if(x > 0){
              divElements[i].style.transform = `translate(${targetX}px, ${targetY}px) rotateX(${70}deg)  rotateZ(${-45*vectorLength}deg)`;
            }
            else  {
              divElements[i].style.transform = `translate(${-targetX}px, ${targetY}px) rotateX(${70}deg) rotateZ(${45*vectorLength}deg)`;

            }
          });
          makeFloorElement(divElements[0]);
        };
      };
    };

    function makeFloorElement( element ){
      const floorElementAltText = "A page that was torn off now laying on the floor.";
      element.setAttribute('alt', floorElementAltText);
      element.classList.remove('tear');
      element.classList.add('floor');
    };

    pages.addEventListener('mousedown', handleClick);
    refresh.addEventListener('click', refreshbtn);
    imprint.addEventListener('click', imprintbtn);

    function generateRandomCoordinates (){
      let x = Math.random() * width - centerX;
      let y = Math.random() * height - centerY;
      return {x:x, y:y};
    }
  };
};

customElements.define('tear-off-pad', TearOffPad);