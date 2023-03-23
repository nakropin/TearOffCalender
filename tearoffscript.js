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
      const calTag = body.appendChild( document.createElement('div') );
      const pagesTag = calTag.appendChild( document.createElement('div') );
      calTag.classList.add( "calendar" );
      pagesTag.classList.add( "pages" );

      /* Buttons */
      const refreshButton = body.appendChild( document.createElement( 'button' ) );
      const imprintButton = body.appendChild( document.createElement( 'button' ) );
      refreshButton.setAttribute('tabindex', '0');
      imprintButton.setAttribute('tabindex', '0');
      refreshButton.classList.add( 'refresh' );
      imprintButton.classList.add( 'imprint' );
      const imgrefreshbutton = refreshButton.appendChild( document.createElement('img') );
      imgrefreshbutton.setAttribute('src', (path + "refresh.svg"));
      imgrefreshbutton.setAttribute('width', "100px");
      imgrefreshbutton.setAttribute('height', "40px");
      imgrefreshbutton.setAttribute('alt', refreshButtonAltText);
      const imgimprintbutton = imprintButton.appendChild( document.createElement('img') );
      imgimprintbutton.setAttribute("src", (path + "imprint.svg"));  
      imgimprintbutton.setAttribute('width', "100px");
      imgimprintbutton.setAttribute('height', "40px");
      imgimprintbutton.setAttribute('alt', imprintButtonAltText);
    };

    /* Generate Matrix for Path + Filenames, then randomize */
    function makeRandomizedFileList(){
      let filenameList = [];  
      for (let i = 0; i < pagesAmount; i++){
        let sublist = [];
        for (let j = 0; j < subPageAmount; j++){
          let curFilename = path + String.fromCharCode( 97+i ) + "-" + ( j + 1 )  + fileending;
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
      const curPageWidth = "500px";
      const curPageHeight = "";
      newPage.classList.add('page');
      newPage.innerHTML = `<img class="pageimg" src="${currentSrc}" alt=` + pageImgAltText + ` `+ curPageWidth + ` ` + curPageHeight + `>`;
      pages.appendChild(newPage);
      // TODO: fix tabindex for accessibility
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
    //
  };
};

customElements.define('tear-off-pad', TearOffPad);