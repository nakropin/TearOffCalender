# tearoffpad
tearoffpad is a simple web component that contains a tearoffpad animation. tearoffpad gives users the possibility to select sets of pictures in svg format. one picture per selected set will be randomly chosen to appear on tearoffpad in given order. tearoffpad aims to be used by people who are not developers. focus of resusability 

reusability in this case does not mean reuseability for webdevs but for designers, for they can simply provide svgs and easily implement the component into existing structure.

# generate mockdata
run svgmockdatagenerator.py. overwrites all other svgs with filename "a-1" to "z-4" and "first", "last", "refresh", "imprint" (ending ".svg") in folder img/.

# use
* implement component like shown below in your html file as child node of body element. insert html tag with attributes and tearoffscript.js as script like shown below. Set the attributes according to your needs. if no attributes are set, standard values are provided.
* example code body:
    
      <tear-off-pad 
        data-bgcolors = "#9532a8,#6ef0e3,#e0d255"
        data-subpageamount = "4"
        data-pagesamount = "26"
        data-buttonposition = "upperLeft"
      >
      </tear-off-pad>
      <script src="./tearoffscript.js"></script>

* set head like in example with css, metaname, jquery [https://jquery.com/], normalize [https://necolas.github.io/normalize.css/] and image preload.
* example code head:

      <head>
      <link rel="preload" fetchpriority="high" as="image" href="/img/refresh.svg" type="image/svg+xml">
      <meta name="description" content="Tear-off pad animation.">
      <meta name="viewport" content="width=device-width initial-scale=1"charset="UTF-8">
      <title>Tear-off Pad</title>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css"/>
      <link rel="stylesheet" href="./style.css">
      </head>

* minify resources [https://developers.google.com/speed/docs/insights/MinifyResources?hl=en]

* host libraries (jquery, normalize) yourself

* to make your page screenreader-accessible use accessibility tags in the svg (e.g. title, desc, aria-labeledby="title", aria-describedby="desc", for text: role="presentation" aria-hidden="true") [https://www.amberddesign.com/make-svg-file-accessible/], like the data from the mockdatagenerator.

* **Attributes**
  * **bgcolors**: background colors, randomly picked except if u only provide single color. there must be only comma as separator within the quotes, no whitespace.
  * **subpageamount**: number of variations from which should be randomly picked. preset is 4.
  * **pagesamount**: number of pages that shall be shown on the tearoffpad animation. preset is 26. it can be set lower, but for higher count component code should be enhanced.
  * **buttonposition**: chosse from ["upperLeft", "upperRight", "lowerLeft", "lowerRight"]

* insert all pictures that shall appear in the calendar in "img" subfolder in svg-format.

ADVANCED:
* adjust the makeFileList function according to your needs. right now the function is set up to handle 4 images per letter of the alphabet with following naming convention: "[a-z]-[1-4].svg", e.g. "a-1.svg".
also place first and last image in folder "imgfirstlast" and name the img that shall appear first "first.svg" and the last img "last.svg".
