# tearoffpad
tearoffpad is a simple web component that contains a tearoffpad animation. tearoffpad gives users the possibility to select sets of pictures in svg format. one picture per selected set will be randomly chosen to appear on tearoffpad in given order. tearoffpad provides an easy interface with custom attributes in the component html element. tearoffpad is written in plain js and does not use any frameworks.

# generate mockdata
run svgmockdatagenerator.py. overwrites all other svgs with filename "a-1" to "z-4" and "first", "last", "refresh", "imprint" (ending ".svg") in folder img/.

# use
## Desktop
* drag current tearoffpad-element to make it fall down and the next element appear.
* at all times drag speed defines the drag and the tear animation. tear animation is calculated with lastMousePoint and random.
  * if user moves mouse out of element bounds in start direction without reaching the maxTearDegree before, current Page will not tear but swing and hang in certain position.
  * if user moves back over element
* refresh button lets user return to the original state of the tearoffpad. randomfilelist will not be generated anew, thus main use of the refresh button is to see the same pictures again from start.
* imprint button tears off every paper and takes user to imprint page.
## Mobile
* Swipe left/right/up/down to tear a page off
  * dynamically generated swipe animation, page gets dragged out of bounds with decreasing opacity.
* buttons like Desktop but imprint without fancy animation

# implement
* insert all pictures that shall appear in the calendar in "img" subfolder in svg-format according to naming convention: "[a-z]-[1-4].svg", "first.svg", "last.svg", "refresh.svg" and "imprint.svg". Set subpageamount and pagesamount according to yout needs. (26 maxlimitation for pagesamount -> Custom Attributes)
* host properly because if only html file is opened it can not change CSSStylesheet b/c CORS. Therefore mobileanimations will not work and dragging on desktop will not work properly. DOM Manipulation is necessary for dynamic animations.
* implement component like shown below in your html file as child node of body element. insert html tag with attributes and tearoffscript.js as script like shown below. Set the attributes according to your needs. if no attributes are set, standard values are provided.
* example code body:
    
      <tear-off-pad 
        data-bgcolors               = '#9532a8,#6ef0e3,#e0d255'
        data-subpageamount          = '4'
        data-pagesamount            = '26'
        data-buttonposition         = 'upperRight'
        data-imprintanimationdelay  = '20'
        data-pageimgtitle           = 'Hover to drag and tear off current page.'
        data-refreshbuttonarialabel = 'Refresh tear-off pad and go to first page.'
        data-imprintbuttonarialabel = 'Tear off all pages and go to imprint.'
        data-alttextfrontpage       = 'Front page with information about the company.'
        data-alttextimages          = 'Alttext for images'
        data-alttextimprint         = 'Imprint page.'
      >
      </tear-off-pad>
      <script src="https://hammerjs.github.io/dist/hammer.js"></script>
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

* host libraries (normalize, hammer) yourself for load speed
* minify resources [https://developers.google.com/speed/docs/insights/MinifyResources?hl=en]
* to make your page screenreader-accessible you can use accessibility tags in the svg (e.g. title, desc, aria-labeledby="title", aria-describedby="desc", for text: role="presentation" aria-hidden="true") [https://www.amberddesign.com/make-svg-file-accessible/], like the data from the mockdatagenerator.

* **Custom Attributes**
  * **data-bgcolors**: background colors, randomly picked except if u only provide single color. there must be only comma as separator within the quotes, no whitespace.
  * **data-subpageamount**: number of variations from which should be randomly picked. preset is 4.; mandatory
  * **data-pagesamount**: number of pages that shall be shown on the tearoffpad animation. preset is 26 [a-z]. it can be set lower, but for more letters code must be changed (ASCII-chars).
  * **data-buttonposition**: choose from ["upperLeft", "upperRight", "lowerLeft", "lowerRight"]
  * **data-imprintanimationdelay**: Set in ms, e.g. "30". changes the imprintanimationdelay for Desktop; optional
  * Fill out the other Attributes according to your needs (mostly WCAG).