/* Set Background Colors (hex) */
const bgColors = ['#9532a8', '#6ef0e3', '#e0d255'];

const pages = document.querySelector('.pages');
const refresh = document.querySelector('.button.refresh');
const imprint = document.querySelector('.button.imprint');
const pagesAmount = 26;
const subPageAmount = 4;
const path = "img/"
const fileending = ".svg"
const randomfiles = makeRandomizedFileList();
var renderPageCallCounter = 0;

randomBackgroundColor();
renderPage();

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
  randomizedList.push(path + "first" + fileending)
  for (let i = 0; i < pagesAmount; i++){
    let randomElement = (filenameList[i])[Math.floor(Math.random() * (filenameList[i]).length)];
    randomizedList.push(randomElement)
  };
  randomizedList.push(path + "last" + fileending)
  return randomizedList;
};

// randomfiles = randomizedList length is 26 + 2 (first, last)
function handleClick(e) {
  if(renderPageCallCounter < randomfiles.length){
    updateCalendar(e.target);
  };
};

function updateCalendar(target) {
  if (target && target.classList.contains('page')) {
    target.classList.add('tear');
    setTimeout(() => {
      pages.removeChild(target);
    }, 800);
  } else {
    return;
  };
  renderPage();
};

function renderPage() {
  let currentSrc = randomfiles[renderPageCallCounter];
  const newPage = document.createElement('div');
  newPage.classList.add('page');
  // TODO: alt Tag richtig setzen
  newPage.innerHTML = `<img src="${currentSrc}" alt="">`;
  // <img src='Folder/`+$(filenames[renderPageCallCounter-1])+`></img>
  pages.appendChild(newPage);
  renderPageCallCounter++;
}

function refreshbtn(){
  window.location.reload();
}
function imprintbtn(){
  // TODO: show imprint: ffw through all animations until last side
}

function randomBackgroundColor() {
  let randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
  document.body.style.background = randomColor;
}

pages.addEventListener('click', handleClick);
refresh.addEventListener('click', refreshbtn);
imprint.addEventListener('click', imprintbtn);