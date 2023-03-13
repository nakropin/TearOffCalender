const pages = document.querySelector('.pages');
const pagesAmount = 26;
const subPageAmount = 4;

/* Generate Matrix for Path + Filenames, then randomize */
function makeFileList(){
  let filenameList = [];  
  for (let i = 0; i < pagesAmount; i++){
    let sublist = [];
    for (let j = 0; j < subPageAmount; j++){
      let currFilename = "img/" + String.fromCharCode((97+i)) + "-" + (j+1)  + ".svg";
      sublist.push(currFilename);
    };
    filenameList.push(sublist);
  };

  let randomizedList = [];
  randomizedList.push("img/first.svg")
  for (let i = 0; i < pagesAmount; i++){
    let randomElement = (filenameList[i])[Math.floor(Math.random() * (filenameList[i]).length)];
    randomizedList.push(randomElement)
  };
  randomizedList.push("img/last.svg")
  return randomizedList;
};

// randomizedList length is 26 + 2 (first, last)
function handleClick(e) {
  if(renderPageCallCounter < filenames.length){
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
  let currentSrc = filenames[renderPageCallCounter];
  const newPage = document.createElement('div');
  newPage.classList.add('page');
  // TODO: alt Tag richtig setzen
  newPage.innerHTML = `<img src="${currentSrc}" alt="pages">`;
  pages.appendChild(newPage);
  renderPageCallCounter++;
}
//<img src='Folder/`+$(filenames[renderPageCallCounter-1])+`></img>

const filenames = makeFileList();
var renderPageCallCounter = 0;
renderPage();

pages.addEventListener('click', handleClick);