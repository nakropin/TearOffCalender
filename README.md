# tearoffpad
tearoffpad is a simple web component that contains a tear off calendar animation. tearoffpad gives users the possibility to select pictures to appear in the calendar in random order. reusability in this case does not mean reuseability for webdevs but for designers, for they can simply provide svgs and easily implement the component into existing structure.

# generate mockdata
run svgmockdatagenerator.py. overwrites all other svgs with filename "a-1" to "z-4" and "first", "last", "refresh", "imprint".

# use
* example code:
    
      <tear-off-pad 
        data-bgcolors = "['#9532a8', '#6ef0e3', '#e0d255']"
        data-subpageamount = "4"
        data-pagesamount = "26"
      >
      </tear-off-pad>

* implement component like shown above. Set the attributes according to your needs. if no attributes are set, standard values are provided.

* **Attributes**
  * **bgcolors**: background colors, randomly picked except if u only provide single color.
  * **subpageamount**: number of variations from which should be randomly picked. preset is 4.
  * **pagesamount**: number of pages that shall be shown on the tearoffpad animation. preset is 26. it can be set lower, but for higher count component code should be enhanced.

* insert all pictures that shall appear in the calendar in "img" subfolder in svg-format.

ADVANCED:
* adjust the makeFileList function according to your needs. right now the function is set up to handle 4 images per letter of the alphabet with following naming convention: "[a-z]-[1-4].svg", e.g. "a-1.svg".
also place first and last image in folder "imgfirstlast" and name the img that shall appear first "first.svg" and the last img "last.svg".
