# tearoffcalendar
tearoffcalendar is a simple web component that contains a tear off calendar animation. despite its name tearoffcalendar does not offer any calendar data but instead gives users the possibility to select pictures to appear in the calendar in random order. reusability in this case does not mean reuseability for webdevs but for designers, for they can simply put imgs in folders and change all styling in their guis.

# generate mockdata
run svgmockdatagen.py in subdir \svgmockdatagenerator.

# use
insert all pictures that shall appear in the calendar in the "img"-folder in svg-format. adjust the makeFileList function according to your needs. right now the function is set up to handle 4 images per letter of the alphabet with following naming convention: "a-1.svg".
also place first and last image in folder "imgfirstlast" and name the img that shall appear first "first.svg" and the last img "last.svg".