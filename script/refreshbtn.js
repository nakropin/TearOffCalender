function refreshbtn(){
      if ( renderPageCallCounter != 1 ){
        renderPageCallCounter = 0;
        document.querySelectorAll('.page:not(.tear)')[0].click();
      };
    };
export default refreshbtn;