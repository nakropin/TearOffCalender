# tearoffpad
tearoffpad is a simple web component that contains a tearoffpad animation. tearoffpad gives users the possibility to select sets of pictures in svg format. one picture per selected set will be randomly chosen to appear on tearoffpad in given order. tearoffpad provides an easy interface with custom attributes in the component html element. tearoffpad is written in plain js and does not use any frameworks.

# generate mockdata
run svgmockdatagenerator.py. overwrites all other svgs with filename "a-1" to "z-4" and "first", "last", "refresh", "imprint" (ending ".svg") in folder img/.

# use
* click / click and drag current tearoffpad-element to make it fall down and the next element appear.
  * when only click on the page it will be torn off left or right depending on mouse position. 
* refresh button lets user return to the original state of the tearoffpad. randomfilelist will not be generated anew, thus main use of the refresh button is to see the same pictures again from start.
* imprint button tears off every paper and takes user to imprint page.
* any click will on buttons / page will set a delay for the next possible click, in case of imprint button its set until the animation is finished

# implement
* implement component like shown below in your html file as child node of body element. insert html tag with attributes and tearoffscript.js as script like shown below. Set the attributes according to your needs. if no attributes are set, standard values are provided.
* example code body:
    
      <tear-off-pad 
        data-bgcolors               = '#9532a8,#6ef0e3,#e0d255'
        data-subpageamount          = '4'
        data-pagesamount            = '26'
        data-buttonposition         = 'upperLeft'
        data-pageimgtitle           = 'Click to tear off current page.'
        data-refreshbuttonarialabel = 'Refresh tear-off pad and go to first page.'
        data-imprintbuttonarialabel = 'Tear off all pages and go to imprint.'
        data-alttextfrontpage       = 'Front page with information about the company.'
        data-alttextimages          = 'An image.'
        data-alttextimprint         = 'Imprint page.'
      >
      </tear-off-pad>
      <script src="./tearoffscript.js"></script>

* set head like in example with css, metaname, normalize [https://necolas.github.io/normalize.css/] and image preload.
* example code head:

      <head>
        <link rel='preload' fetchpriority='high' as='image' href='/img/first.svg' type='image/svg+xml'>
        <meta name='description' content='Tear-off pad animation.'>
        <meta name='viewport' content='width=device-width initial-scale=1.0'charset='UTF-8'>
        <title>Tear-off Pad</title>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css'/>
        <link rel='stylesheet' href='./style.css'>
      </head>

* minify resources [https://developers.google.com/speed/docs/insights/MinifyResources?hl=en]

* host libraries (normalize) yourself

* to make your page screenreader-accessible use accessibility tags in the svg (e.g. title, desc, aria-labeledby="title", aria-describedby="desc", for text: role="presentation" aria-hidden="true") [https://www.amberddesign.com/make-svg-file-accessible/], like the data from the mockdatagenerator.

* **Attributes**
  * **bgcolors**: background colors, randomly picked except if u only provide single color. there must be only comma as separator within the quotes, no whitespace.
  * **subpageamount**: number of variations from which should be randomly picked. preset is 4.
  * **pagesamount**: number of pages that shall be shown on the tearoffpad animation. preset is 26. it can be set lower, but for higher count component code should be enhanced.
  * **buttonposition**: chosse from ["upperLeft", "upperRight", "lowerLeft", "lowerRight"]
  * Fill out the other Attributes according to your needs (mostly WCAG, Screenreaders).

* insert all pictures that shall appear in the calendar in "img" subfolder in svg-format according to naming convention: "[a-z]-[1-4].svg", "first.svg", "last.svg", "refresh.svg" and "imprint.svg".

ADVANCED:
* adjust the makeFileList function according to your needs. right now the function is set up to handle 4 images per letter of the alphabet with following naming convention: "[a-z]-[1-4].svg", e.g. "a-1.svg".