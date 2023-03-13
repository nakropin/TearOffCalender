const pages = document.querySelector('.pages');

// generate matrix for the path + filenames. then randomize
function makeFileList(){
  let filenameList = [];  
  for (let i = 0; i < 26; i++){
    let sublist = []
    for (let j = 0; j < 4; j++){
      let currFilename = "img/" + String.fromCharCode((97+i)) + "-" + (j+1)  + ".svg"
      sublist.push(currFilename)
    };
    filenameList.push(sublist)
  };
  let randomizedList = []
  for (let i = 0; i < 26; i++){
    let randomElement = (filenameList[i])[Math.floor(Math.random() * (filenameList[i]).length)];
    randomizedList.push(randomElement)
  };
  return randomizedList;
};

function handleClick(e) {
  // TODO: if last page do nothing
  updateCalendar(e.target);
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
   currentSrc = "imgfirstlast/last.svg";
  } else if(renderPageCallCounter > filenames.length){
   currentSrc = "imgfirstlast/first.svg";
  } else {
   currentSrc = filenames[renderPageCallCounter-1];
  }
  currentSrc = "img/loose_leaf_paper.svg"

  const newPage = document.createElement('div');
  newPage.classList.add('page');
  newPage.innerHTML = `
    <img src="${currentSrc}"></img>
  `;
    
  pages.appendChild(newPage);
  renderPageCallCounter++;
}
//<img src='Folder/`+$(filenames[renderPageCallCounter-1])+`></img>

const filenames = makeFileList();
var renderPageCallCounter = 0;
renderPage();

pages.addEventListener('click', handleClick);