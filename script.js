// fix Constructor
class TearOffPad extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
  };

  // TODO: getter, setter. observer?

  connectedCallback(){
    this.renderPage();
  }
  
  renderPage(){

    // TODO: create shadow dom? (internetexplorer has no shadow dom support)
    // accessing attributes probably would not work then

    const path = "img/";
    const body = document.body;
    const bgColors = $('tear-off-pad')[0].getAttribute('data-bgcolors').split(",");
    const pagesAmount = $('tear-off-pad')[0].getAttribute('data-pagesamount');
    const subPageAmount = $('tear-off-pad')[0].getAttribute('data-subpageamount');
    const btnpos = $('tear-off-pad')[0].getAttribute('data-buttonposition');

    createBasicPage();
    randomBackgroundColor();

    buttonposition(btnpos);

    const pages = document.querySelector('.pages');
    const refresh = document.querySelector('.refresh');
    const imprint = document.querySelector('.imprint');

    const fileending = ".svg";
    const randomfiles = makeRandomizedFileList();
    var renderPageCallCounter = 0;
    
    renderCalendarPage();

    function createBasicPage(){
      /* TearOffPad, Pages */
      const calTag = body.appendChild(document.createElement('div'));
      const pagesTag = calTag.appendChild(document.createElement('div'));
      calTag.classList.add("calendar");
      pagesTag.classList.add("pages");

      /* Buttons */
      const refreshButton = body.appendChild(document.createElement('button'));
      const imprintButton = body.appendChild(document.createElement('button'));
      refreshButton.classList.add('refresh');
      imprintButton.classList.add('imprint');
      refreshButton.appendChild(document.createElement('img')).src = path + "refresh.svg";
      imprintButton.appendChild(document.createElement('img')).src = path + "imprint.svg";  
    };

    /* Generate Matrix for Path + Filenames, then randomize */
    function makeRandomizedFileList(){
      let filenameList = [];  
      for (let i = 0; i < pagesAmount; i++){
        let sublist = [];
        for (let j = 0; j < subPageAmount; j++){
          let curFilename = path + String.fromCharCode((97+i)) + "-" + (j+1)  + fileending;
          sublist.push(curFilename);
        };
        filenameList.push(sublist);
      };

    let randomizedList = [];
      randomizedList.push(path + "first" + fileending);
      for (let i = 0; i < pagesAmount; i++){
        let randomElement = (filenameList[i])[Math.floor(Math.random() * (filenameList[i]).length)];
        randomizedList.push(randomElement);
      };
      randomizedList.push(path + "last" + fileending);
      return randomizedList;
    };

    /* Functionality */

    function handleClick(e) {
        if(renderPageCallCounter < randomfiles.length){
          updateCalendar(e.target);
        };
    };

    function updateCalendar(target) {
      if (target && target.classList.contains('page')) {
        target.classList.add('tear');
        setTimeout(() => {
          // TODO: transform instead of remove? also rename or make up new naming convention
          pages.removeChild(target);
        }, 800);
      } else {
        return;
      }
      renderCalendarPage();
    };

    function renderCalendarPage() {
      const currentSrc = randomfiles[renderPageCallCounter];
      const newPage = document.createElement('div');
      newPage.classList.add('page');
      // TODO: alt Tag richtig setzen
      newPage.innerHTML = `<img src="${currentSrc}" alt="pages">`;
      // <img src='Folder/`+$(filenames[renderPageCallCounter-1])+`></img>
      pages.appendChild(newPage);
      renderPageCallCounter++;
    };

    function refreshbtn(){
      if (renderPageCallCounter != 1){
        renderPageCallCounter = 0;
        document.querySelectorAll('.page:not(.tear)')[0].click();
      };
    };

    function imprintbtn(){
      for (let i = 0; i < randomfiles.length; i++){
        document.querySelectorAll('.page:not(.tear)')[0].click();
      }
      renderPageCallCounter = randomfiles.length;
    };

    function randomBackgroundColor() {
      let randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
      document.body.style.background = randomColor;
    };

    function buttonposition(input){
      const checkInput = ["upperLeft", "upperRight", "lowerLeft", "lowerRight"];
      let currPos = 0; /* preset value 0, used if no/incorrect input*/
      for (let i = 0; i < checkInput.length; i++){
        if (input === checkInput[i]){
          currPos = i
        };
      };
      const pos = {
        upperLeft: ["10","0","10","0"],
        upperRight: ["10","0","0","10"],
        lowerLeft: ["0","10","10","0"],
        lowerRight: ["0","10","0","10"],
      };
      const unit = "px";
      const stylespos = [ "top", "bottom", "left", "right" ];
      const keys = Object.keys(pos);
      currPos = keys[currPos];

      for (let i = 0; i < pos[currPos].length; i++){
        const imprint = document.getElementsByClassName("imprint")[0];
        const refresh = document.getElementsByClassName("refresh")[0];
        if (pos[currPos][i] != "0"){
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