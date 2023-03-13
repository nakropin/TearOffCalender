const pages = document.querySelector('.pages');
const pagesAmount = 26;
const subPageAmount = 4;

// generate matrix for the path + filenames, then randomize
function makeFileList(){
  let filenameList = [];  
  for (let i = 0; i < pagesAmount; i++){
    let sublist = [];
    for (let j = 0; j < subPageAmount; j++){
      let currFilename = "SVG/" + String.fromCharCode((97+i)) + " (" + (j+1)  + ").svg"
      sublist.push(currFilename);
    }
    filenameList.push(sublist)
  }


  let randomizedList = []
  for (let i = 0; i < pagesAmount; i++){
    let randomElement = (filenameList[i])[Math.floor(Math.random() * (filenameList[i]).length)];
    randomizedList.push(randomElement)
  }
  console.log(randomizedList);
  return randomizedList;
}

function handleClick(e) {
  // Plus 2 wegen Start und Endseite.
  // Evtl Matrix ausbauen, sodass Anfangs- und Endelement der Liste die Start- und Endbilder sind?
  if(renderPageCallCounter < pagesAmount + 2){
    updateCalendar(e.target);
  }
}

function updateCalendar(target) {
  if (target && target.classList.contains('page')) {
    target.classList.add('tear');
    setTimeout(() => {
      pages.removeChild(target);
    }, 800);
  } else {
    return;
  }
  renderPage();
}

function renderPage() {
  let currentSrc; 
  // pick curr svg
  if (renderPageCallCounter === 0){
   currentSrc = "SVG/start.svg";
  } else if(renderPageCallCounter > filenames.length){
   currentSrc = "SVG/end.svg";
  } else {
   currentSrc = filenames[renderPageCallCounter-1];
  }

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