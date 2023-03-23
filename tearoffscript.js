class TearOffPad extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow( { mode: "open" } );
  };
  // TODO: getter, setter. observer?, enhance constructor?

  connectedCallback(){
    this.renderPage();
  };
  
  renderPage(){
    // TODO: create shadow dom? (no shadowdom for IE) | access attributes need to be changed then too
    
    /* Set Values and render initial component state */
    const path = "img/";
    const body = document.body;
    // TODO: check for best practice - getAttribute
    const bgColors              = $( 'tear-off-pad' )[0].getAttribute( 'data-bgcolors' ).split(",");
    const pagesAmount           = $( 'tear-off-pad' )[0].getAttribute( 'data-pagesamount' );
    const subPageAmount         = $( 'tear-off-pad' )[0].getAttribute( 'data-subpageamount' );
    const btnpos                = $( 'tear-off-pad' )[0].getAttribute( 'data-buttonposition' );
    const pageImgAltText        = $( 'tear-off-pad' )[0].getAttribute( 'data-pageimgalttext' );
    const refreshButtonAltText  = $( 'tear-off-pad' )[0].getAttribute( 'data-refreshbuttonalttext' );
    const imprintButtonAltText  = $( 'tear-off-pad' )[0].getAttribute( 'data-imprintbuttonalttext' );

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
      const refreshButton = body.appendChild( document.createElement( 'button' ) );
      const imprintButton = body.appendChild( document.createElement( 'button' ) );
      refreshButton.setAttribute('tabindex', '0');
      imprintButton.setAttribute('tabindex', '0');
      refreshButton.classList.add( 'refresh' );
      imprintButton.classList.add( 'imprint' );
      refreshButton.setAttribute('style', 'background-image: url(' + path + 'refresh.svg)');
      imprintButton.setAttribute('style', 'background-image: url(' + path + 'imprint.svg)');
      refreshButton.setAttribute('alt', refreshButtonAltText);
      imprintButton.setAttribute('alt', imprintButtonAltText);
    };

    /* Generate Matrix for Path + Filenames, then randomize */
    function makeRandomizedFileList(){
      let filenameList = [];  
      for (let i = 0; i < pagesAmount; i++){
        let sublist = [];
        for (let j = 0; j < subPageAmount; j++){
          let curFilename = path + String.fromCharCode( 97 + i ) + "-" + ( j + 1 )  + fileending;
          sublist.push( curFilename );
        };
        filenameList.push( sublist );
      };

    let randomizedList = [];
      randomizedList.push(path + "first" + fileending);
      for ( let i = 0; i < pagesAmount; i++ ){
        let randomElement = ( filenameList[i] )[Math.floor( Math.random() * ( filenameList[i] ).length )];
        randomizedList.push( randomElement );
      };
      randomizedList.push( path + "last" + fileending );
      return randomizedList;
    };

    /* Functionality */
    function handleClick( e ) {
        if( renderPageCallCounter < randomfiles.length ){
          updateCalendar( e.target );
        };
    };

    function updateCalendar( target ) {
      if ( target && target.classList.contains('page') ) {
        target.classList.add( 'tear' );
        setTimeout(() => {
          // TODO: transform instead of remove? also rename or make up new naming convention
          pages.removeChild( target );
        }, 800);
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
        document.querySelectorAll('.page:not(.tear)')[0].click();
      };
    };

    function imprintbtn(){
      for ( let i = 0; i < randomfiles.length; i++ ){
        document.querySelectorAll('.page:not(.tear)')[0].click();
      }
      renderPageCallCounter = randomfiles.length;
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

    pages.addEventListener('click', handleClick);
    refresh.addEventListener('click', refreshbtn);
    imprint.addEventListener('click', imprintbtn);

    //TODO: Funktion implementieren womit Koordinaten des Kalenders + Mauskoordinaten abgefangen werden
    //Diese bilden durch die Subtraktion in den jeweiligen Achsen einen Bewegunsvektor
    //Über translateX(x) und translateY(y) wird page verschoben
    //Über Rotate(X) und Rotate(Y) in Radians rotiert. Hierbei muss die Arctan-Formel(y/x) angewandt werden
//Element mit einer ID auswählen
//const meinDiv = document.getElementById("container");

//Globale Hilfsvariablen
let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;
let offsetX;
let offsetY;
let animate = false;


// Elemente mit der Klasse auswählen
const elemente = document.getElementsByClassName('page');
// Auf jedes Element zugreifen und bearbeiten
for (let i = 0; i < elemente.length; i++) {
    const meinDiv = elemente[i];

    // Mausunten
    meinDiv.addEventListener("mousedown", function (event) {
        animate = true;
    });

    // Mausoben
    document.addEventListener('mouseup', function (event) {
        if (animate) {
            offsetX = event.clientX - centerX;
            offsetY = event.clientY - centerY;

            let rotationAngle = Math.atan2(offsetX, offsetY) * 180 / Math.PI;
            // Länge des Vektors als Multiplikator
            let vectorLength = Math.sqrt(Math.abs(offsetX) + Math.abs(offsetY)) / 35;

            meinDiv.style.transform = `translate(${offsetX}px, ${offsetY}px) rotateY(${rotationAngle * vectorLength}deg) rotateZ(${rotationAngle * vectorLength}deg)`;
            meinDiv.style.opacity = 0;
            animate = false;
        }
    });
}




  };
};

customElements.define('tear-off-pad', TearOffPad);