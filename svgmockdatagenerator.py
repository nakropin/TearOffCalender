import os, sys

# generates mockdata for the tearoffpad
def generateMockData():
    filenameList = []
    letters = 26
    letterVersions = 4

    path = "img/"
    isExist = os.path.exists(path)
    if not isExist:
        os.makedirs(path)
    for i in range(0, letters):
        for j in range(0, letterVersions):
            currFilename = chr((97+i)) + "-" + str((j+1))
            filenameList.append(currFilename)
    filenameList.append("first")
    filenameList.append("last")
    filenameList.append("refresh")
    filenameList.append("imprint")


    for i in range(0, len(filenameList)):
        if (filenameList[i] == "first") | (filenameList[i] == "last") | (filenameList[i] == "refresh") | (filenameList[i] == "imprint"):
            fontsize = "120px"
        else:
            fontsize = "250px"
        svgData = '<?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 500 500" width="50" height="50" xmlns="http://www.w3.org/2000/svg"><text style="fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: '+ fontsize +'; font-weight: 700; white-space: pre;" x="30" y="350">'+ filenameList[i] +'</text></svg>'
        curFile = str(filenameList[i]) + ".svg"
        with open(os.path.join(path, curFile), "w+") as f:
            f.write(svgData)
            f.close()

generateMockData()