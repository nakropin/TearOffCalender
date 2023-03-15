// fix Constructor
class TearOffPad extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
  };
  get bgColors() {
    return this.getAttribute('data-bgcolors');
  };
  connectedCallback(){
    const bgColors = this.getAttribute('data-bgcolors');
    this.renderPage();
    // console.log(this.getAttribute('data-subpageamount'));
    // console.log(this.getAttribute('data-pagesamount'));
    // console.log(this.getAttribute('data-buttonposition'));
  }
  
  renderPage(){

    // TODO: create shadow dom

    const path = "img/";
    const body = document.body;
    /* Set Background Colors (hex) */
    const bgColors = ['#9532a8', '#6ef0e3', '#e0d255'];
    
    createBasicPage();
    buttonposition("upperleft");

    const pages = document.querySelector('.pages');
    const refresh = document.querySelector('.refresh');
    const imprint = document.querySelector('.imprint');
    const pagesAmount = 26;
    const subPageAmount = 4;
    const fileending = ".svg";
    const randomfiles = makeRandomizedFileList();
    var renderPageCallCounter = 0;
    
    randomBackgroundColor();
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
      let currentSrc = randomfiles[renderPageCallCounter];
      const newPage = document.createElement('div');
      newPage.classList.add('page');
      // TODO: alt Tag richtig setzen
      newPage.innerHTML = `<img src="${currentSrc}" alt="pages">`;
      // <img src='Folder/`+$(filenames[renderPageCallCounter-1])+`></img>
      pages.appendChild(newPage);
      renderPageCallCounter++;
    };

    function refreshbtn(){
      renderPageCallCounter = 0;
      document.querySelectorAll('.page:not(.tear)')[0].click();
    };

    function imprintbtn(){
      for (let i = 0; i < randomfiles.length; i++){
        document.querySelectorAll('.page:not(.tear)')[0].click();
      }
      renderPageCallCounter = randomfiles.length;
      // TODO: show imprint: ffw through all animations until last side
    };

    function randomBackgroundColor() {
      let randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
      document.body.style.background = randomColor;
    };

    function buttonposition(input){ // + input = data-buttonposition
      let checkInput = ["upperLeft", "upperRight", "lowerLeft", "lowerRight"];
      let currPos = 0;
      for (let i = 0; i < checkInput.length; i++){
        if (input === checkInput[i]){
          currPos = i
        };
      };
      let pos = {
        upperleft: ["10","0","10","0"],
        upperright: ["10","0","0","10"],
        lowerleft: ["0","10","10","0"],
        lowerright: ["0","10","0","10"],
      };
      let stylespos = [ "top", "bottom", "left", "right" ]
      let keys = Object.keys(pos);
      let unit = "px";
      currPos = keys[currPos];

      // TODO: for right change values
      for (let i = 0; i < pos[currPos].length; i++){
        if (pos[currPos][i] != "0"){
          document.getElementsByClassName("refresh")[0].style[stylespos[i]] = pos[keys[0]][i] + unit;
          if( i === 2 | i === 3 ){
            document.getElementsByClassName("imprint")[0].style[stylespos[i]] = "125" + unit;
          }
          else{
            document.getElementsByClassName("imprint")[0].style[stylespos[i]] = pos[keys[0]][i] + unit;
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

  /* Custom Attributes */
  // TODO: not in use yet, needs to be implemented correctly with constructor

  };

};

customElements.define('tear-off-pad', TearOffPad);