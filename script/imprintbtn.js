function imprintbtn(){
      for ( let i = 0; i < randomfiles.length; i++ ){
        document.querySelectorAll('.page:not(.tear)')[0].click();
      }
      renderPageCallCounter = randomfiles.length;
    };
    export default imprintbtn;