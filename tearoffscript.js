class TearOffPad extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    };

    connectedCallback() {
        this.render();
    };

    render() {
        /* get DeviceType */
        let moveEventType;
        let startEventType;
        let endEventType;
        detectDeviceType();
        const deviceType = detectDeviceType().deviceType;

        /* shadow dom + style */
        const shadow = this.shadow;
        const template = document.createElement('link');
        template.setAttribute('rel', "stylesheet");
        template.setAttribute('href', './shadowstyle.css');
        template.setAttribute('type', 'text/css');
        shadow.appendChild(template);

        /* Set Values and render initial component state */
        const imgPath = "img/";

        /* Get custom values from component Element */
        const componentElement = document.getElementsByTagName('tear-off-pad')[0];
        const bgColors = componentElement.getAttribute('data-bgcolors').split(",");
        const pagesAmount = componentElement.getAttribute('data-pagesamount');
        const subPageAmount = componentElement.getAttribute('data-subpageamount');
        const btnpos = componentElement.getAttribute('data-buttonPosition');
        const pageImgTitle = componentElement.getAttribute('data-pageimgtitle');
        const refreshBtnAriaLabel = componentElement.getAttribute('data-refreshbuttonarialabel');
        const imprintBtnAriaLabel = componentElement.getAttribute('data-imprintbuttonarialabel');
        const altTextFrontPage = componentElement.getAttribute('data-alttextfrontpage');
        const altTextImages = componentElement.getAttribute('data-alttextimages');
        const altTextImprint = componentElement.getAttribute('data-alttextimprint');
        const tearOnLeave = componentElement.getAttribute('data-tearonleave');
        const clickToTear = componentElement.getAttribute('data-clicktotear');
        /* should be let */
        const delay = parseInt(componentElement.getAttribute('data-imprintanimationdelay'));

        createBasicPage();
        randomBackgroundColor();

        /* Get selectors etc */
        const pages = shadow.querySelector('.pages');
        const refresh = shadow.querySelector('.refresh');
        const imprint = shadow.querySelector('.imprint');
        buttonPosition(btnpos);

        const fileEnding = ".svg";
        const randomFiles = makeRandomizedFileList();
        let renderPageCallCounter = 0;

        renderPage(); /* renders the first page */
        setEventListeners();

        /* Load Page and Images */
        function detectDeviceType() {
            const deviceType = /Kindle|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                ? 'Mobile'
                : 'Desktop';
            deviceType === 'Mobile'
                ? (startEventType = "touchstart", moveEventType = "touchmove", endEventType = "touchend")
                : (startEventType = "mouseover", moveEventType = "pointermove", endEventType = "pointerup");
            // TODO: change mobile eventTypes to: pointerdown, pointermove, pointerup and get rid of detectfunction
            return {
                deviceType: deviceType,
                startEventType: startEventType,
                moveEventType: moveEventType,
                endEventType: endEventType
            };
        }

        function createBasicPage() {      /* TearOffPad: make Pages & Buttons */
            const pagesTag = shadow.appendChild(document.createElement('div'));
            pagesTag.classList.add("pages");
            const buttons = [['imprint', imprintBtnAriaLabel, imgPath],
                ['refresh', refreshBtnAriaLabel, imgPath]];
            buttons.forEach(e => makeButton(e[0], e[1], e[2]))
        }

        function makeButton(btnName, ariaLabel, imgPath) {
            let newButton = shadow.appendChild(document.createElement('button'));
            newButton.classList.add(btnName);
            newButton.setAttribute('title', ariaLabel);
            newButton.setAttribute('tabindex', '0');
            newButton.setAttribute('style', 'background-image: url(' + imgPath + btnName + '.svg)');
            newButton.setAttribute('aria-label', ariaLabel);
        }

        /* Generate Matrix for imgPath + Filenames, then randomize */
        function makeRandomizedFileList() {
            let filenameList = [];
            for (let char = 97; char < (parseInt(pagesAmount) + 97); char++) {
                let sublist = [];
                for (let nr = 1; nr < (parseInt(subPageAmount) + 1); nr++) {
                    let curFilename = imgPath + String.fromCharCode(char) + "-" + (nr) + fileEnding;
                    sublist.push(curFilename);
                }
                filenameList.push(sublist);
            }
            let randomizedList = [];
            randomizedList.push(imgPath + "first" + fileEnding);
            for (let i = 0; i < pagesAmount; i++) {
                let randomElement = filenameList[i][Math.floor(Math.random() * filenameList[i].length)];
                randomizedList.push(randomElement);
            }
            randomizedList.push(imgPath + "last" + fileEnding);
            return randomizedList;
        }

        function setAltText() {
            const initialAltTexts = [altTextFrontPage, altTextImages, altTextImprint];
            let useAltTags = []
            initialAltTexts.forEach(e => e === null ? useAltTags.push("An image which has not been described yet.") : useAltTags.push(e))
            return renderPageCallCounter === 0 ? useAltTags[0] : renderPageCallCounter != randomFiles.length - 1 ? useAltTags[1] : useAltTags[2];
        }

        function randomBackgroundColor() {
            document.body.style.background = bgColors[Math.floor(Math.random() * bgColors.length)];
        }

        function buttonPosition(position) {
            const checkInput = ["upperLeft", "upperRight", "lowerLeft", "lowerRight"];
            let currPos = 0; /* check if input is correct, otherwise use preset value 0 (upperleft) */
            for (let i = 0; i < checkInput.length; i++) {
                if (position === checkInput[i]) {
                    currPos = i
                }
            }
            const pos = {
                upperLeft: ["10", null, "10", null],
                upperRight: ["10", null, null, "10"],
                lowerLeft: [null, "10", "10", null],
                lowerRight: [null, "10", null, "10"],
            };
            const unit = "px";
            const stylespos = ["top", "bottom", "left", "right"];
            const keys = Object.keys(pos);
            currPos = keys[currPos];

            for (let i = 0; i < pos[currPos].length; i++) {
                if (pos[currPos][i] != null) {
                    imprint.style[stylespos[i]] = pos[currPos][i] + unit;
                    let newVal = (i === 0 | i === 1) ? "70" : pos[currPos][i]
                    refresh.style[stylespos[i]] = newVal + unit;
                }
            }
        }

        /* Functions */
        function renderPage() {
            const currentSrc = randomFiles[renderPageCallCounter];
            if (renderPageCallCounter + 1 < randomFiles.length) {
                let nextSrc = randomFiles[renderPageCallCounter + 1];
                pages.style.backgroundImage = ('url(' + nextSrc + ')');
            }
            const newPage = document.createElement('img');
            newPage.classList.add('page');
            newPage.src = currentSrc;
            newPage.setAttribute('alt', setAltText());
            pages.appendChild(newPage);
            pages.setAttribute('title', pageImgTitle);
            pages.setAttribute('tabindex', '0');
            renderPageCallCounter++;
        }

        /* Button Functions */

        function refreshbtn() {
            if (renderPageCallCounter != 1) {
                renderPageCallCounter = 0;
                animatePage();
                removeAllFloorElements();
            }
        }

        function imprintbtn() {
            animationDelayIterator(animatePage);
            turnOffEventListenersWhileEventAction();
        }

        // function getDelay(){
        //   return
        // }

        /* recursively call animation */
        function animationDelayIterator(animation) {
            let curDelay = isNaN(delay)
                ? 1000
                : delay;
            if (notLastPage()) {
                animation();
                setTimeout(() => {
                    animationDelayIterator(animation)
                }, curDelay);
            }
        }

        function turnOffEventListenersWhileEventAction() {
            const clickableElements = [pages, refresh, imprint];
            clickableElements.forEach(e => e.setAttribute('disabled', 'disabled'));
            const currentDelay = delay * ((randomFiles.length - renderPageCallCounter) + 3);
            setTimeout(function () {
                clickableElements.forEach(e => e.removeAttribute('disabled'));
            }, currentDelay);
        }

        function removeAllFloorElements() {
            shadow.querySelectorAll('.floor').forEach(e => e.remove());
        }

        /* Desktop Animations */

        /* helpers */
        const width = window.innerWidth;
        const height = window.innerHeight;
        const centerX = width / 2;
        const centerY = height / 2;
        const targetX = centerX / 8 * 1.5; // changed from 5
        const targetY = centerY / 8 * 6; // changed from 7
        let bezierPoints = [{x: centerX, y: centerY}, {x: 0, y: 0}, {x: 0, y: 0}, {x: targetX, y: targetY}];

        let maxTearDegree = randomizer(30, 50);
        let mouseXStart;
        let curDir;
        let lastDragPosition = 0;
        let lastMouseX = null;
        let keyFrameHasBeenSet = 0;
        // TODO: let stuckdegree is the problem, must be const and from there initialized through different var
        let stuckDegree = 20;
        let oneHit = 0;

        function makeFloorElement(element) {
            element.classList.add('floor');
        }

        function getRandomCoordinate() {
            let x = Math.floor(Math.random() * 1000);
            let y = Math.floor(Math.random() * 100);
            if (Math.random() <= 0.5) {
                x = -x;
                y = -y;
            }
            return {x: x, y: y}
        }

        function getBezierCoordinates(e) { /* get mouseCoords at start */
            let mouseX, mouseY;
            let bezierRandomizer = 115;
            if (e === undefined) {
                let randomCoord = getRandomCoordinate();
                mouseX = randomCoord.x;
                mouseY = randomCoord.y;
            } else {
                mouseX = e.clientX - centerX;
                mouseY = e.clientY - centerY;
            }
            if (mouseX > 0) {
                bezierPoints = [{x: centerX, y: centerY}, {x: mouseX + centerX, y: mouseY}, {
                    x: 0,
                    y: targetY
                }, {x: targetX + randomizer(-bezierRandomizer, bezierRandomizer), y: targetY}];
            } else {
                bezierPoints = [{x: centerX, y: centerY}, {x: mouseX, y: mouseY}, {
                    x: 0,
                    y: targetY
                }, {x: -(targetX + randomizer(-bezierRandomizer, bezierRandomizer)), y: targetY}];
            }
            return bezierPoints;
        }

        function getCoordinates(e) { /* get mouseCoords at start */
            let mouseX, mouseY;
            if (e === undefined) {
                let randomCoord = getRandomCoordinate();
                mouseX = randomCoord.x;
                mouseY = randomCoord.y;
            } else {
                mouseX = e.clientX - centerX;
                mouseY = e.clientY - centerY;
            }
            return {x: mouseX, y: mouseY};
        }

        /* calc position along beziercurve */
        function getBezierPosition(points, progress) {
            let x = 0;
            let y = 0;
            const n = points.length - 1;
            for (let i = 0; i <= n; i++) {
                const coefficient = binomialCoefficient(n, i) * Math.pow(1 - progress, n - i) * Math.pow(progress, i);
                x += points[i].x * coefficient;
                y += points[i].y * coefficient;
            }
            /* watch mousecoords */
            x += (-bezierPoints[0].x) * (1 - progress);
            y += (-bezierPoints[0].y) * (1 - progress);
            return {x: x, y: y};
        }

        function binomialCoefficient(n, k) {
            let coefficient = 1;
            for (let i = 1; i <= k; i++) {
                coefficient *= (n - i + 1) / i;
            }
            return coefficient;
        }

        function animatePage() {
            removeTempEventListeners();
            if (notLastPage()) {
                const curPage = shadow.querySelectorAll("[class='page']")[0];
                setZIndex(curPage, 1);
                setTransitionDuration(curPage, "0.01s");
                curPage.setAttribute("border", "1px solid black;")
                const bezier = getBezierCoordinates(event);
                let progress = 0;
                let curDegree = calcDegFromCurMouse(getCoordinates((event)).x);

                if (isNaN(curDegree)) {
                    curDegree = Math.random() * 5
                } /* catches first page animation */
                curPage.style.transition = 'transform-origin 1s ease';
                curPage.style.transformOrigin = 'center';

                const animateOnce = () => {
                    let position = getBezierPosition(bezier, progress);
                    let rotationAngle = Math.atan2(position.x, position.y) * progress;
                    curDegree += rotationAngle;
                    let rotateXFactor = 77
                    curPage.style.transform = 'translate(' + position.x + 'px, ' + position.y + 'px) rotateX(' + rotateXFactor * progress + 'deg) rotateZ(' + curDegree + 'deg)';
                    if (progress < 1) {
                        progress += 0.016;
                        requestAnimationFrame(animateOnce);
                    } else {
                        progress = 0;
                        setZIndex(curPage, -1);
                    }
                };
                animateOnce();
                renderPage();
                resetHelpers();
                makeFloorElement(curPage);
            }
        }

        function setTransitionDuration(element, value) {
            element.style.transitionDuration = value;
        }

        function setZIndex(element, value) {
            element.style.zIndex = value;
        }

        function setDragDirection(e) {
            let touchEventX = deviceType === "Mobile"
                ? e.touches[0].clientX
                : e.clientX;
            const rect = pages.getBoundingClientRect();
            const leftDist = touchEventX - rect.left;
            const rightDist = rect.right - touchEventX;
            return leftDist < rightDist ? 'right' : 'left';
        }

        function resetHelpers() {
            keyFrameHasBeenSet = mouseXStart = lastDragPosition = 0;
            lastMouseX = curDir = null;
            maxTearDegree = randomizer(30, 60);
        }

        function dragElement(e) { // maxTearDegree, curDir, lastMouseX,
            const curPage = shadow.querySelectorAll("[class='page']")[0];
            let mouseX = e.clientX - centerX;
            let animationFactor = 15; /* AnimationFactor sets how often DOM-transform is called */
            let curDegree;

            let middlePlusRandom = (pages.offsetLeft + pages.offsetWidth / 2)
            middlePlusRandom += curDir === "right"
                ? +randomizer(110, 140)
                : -randomizer(100, 140)

            if (oneHit === 1 &&
                ((curDir === "right" && e.clientX > middlePlusRandom) ||
                    (curDir === "left" && e.clientX < middlePlusRandom))
            ) {
                oneHit = 0;
                setTransitionDuration(curPage, "0.02s")
                requestAnimationFrame(() => {
                    curPage.style.transform = 'rotate(' + curDegree + 'deg)';
                });
                //setTransitionDuration(curPage, "0s")
                animatePage();
            }
            if (lastMouseX === null) {
                lastMouseX = mouseX;
            }
                /* TODO: fix interrupt */
                // else if ( keyFrameHasBeenSet === 1 && (
                //   (curDir === "right" && e.clientX > pages.getBoundingClientRect().left ) ||
                //   (curDir === "left"  && e.clientX < pages.getBoundingClientRect().right )   )
                // ){
                //   console.log("1",e.clientX, pages.getBoundingClientRect().right, pages.getBoundingClientRect().left)
                //   stuckDegree = curDir === "right"
                //     ? -stuckDegree
                //     : stuckDegree;
                //   setTransitionDuration(curPage, "0.045s")
                //   curPage.style.transform = 'rotate('+ stuckDegree+'deg)';
                //   curPage.style.animation = 'none';
                //   let stylesheet = shadow.querySelector("link[rel='stylesheet']");
                //   deleteKeyFrameByName(stylesheet.sheet, "swing")
                //   keyFrameHasBeenSet = 0;
            // }
            else if (oneHit === 0 &&
                // (curDir === "right" && mouseX > lastMouseX + animationFactor ) ||
                // (curDir === "left" && mouseX < lastMouseX - animationFactor )
                ((curDir === "right" && e.clientX > pages.getBoundingClientRect().left) ||
                    (curDir === "left" && e.clientX < pages.getBoundingClientRect().right))
            ) {
                console.log("2")
                lastMouseX = mouseX;
                curDegree = calcDegFromCurMouse(mouseX);
                setTransitionDuration(curPage, "0.045s")
                requestAnimationFrame(() => {
                    curPage.style.transform = 'rotate(' + curDegree + 'deg)';
                });
                lastDragPosition = Math.abs(curDegree);
                //setTransitionDuration(curPage, "0s")
                if (Math.abs(curDegree) >= maxTearDegree) {
                    animatePage();
                }
                //keyFrameHasBeenSet = 0
            } else if (
                (curDir === "right" && e.clientX < pages.getBoundingClientRect().left) ||
                (curDir === "left" && e.clientX > pages.getBoundingClientRect().right)) {
                let curStuck = getCurrentStuckDegree(curDir);
                console.log(curStuck)
                requestAnimationFrame(() => {
                    setTransitionDuration(curPage, "0.3s")
                    curPage.style.transform = 'rotate(' + curStuck + 'deg)';
                });
                //setTransitionDuration(curPage, "0s")

                oneHit = 1;
            }
            // else if (
            //   (curDir === "right" && e.clientX < pages.getBoundingClientRect().left) ||
            //   (curDir === "left" && e.clientX > pages.getBoundingClientRect().right)
            // ){
            //   console.log("3")
            //   setTransitionDuration(curPage, "0s")
            //   stuckDegree = curDir === "right"
            //     ? -stuckDegree
            //     : stuckDegree;
            //   if (keyFrameHasBeenSet === 0) {
            //     makeCurSwingAnimation(curPage, stuckDegree, lastDragPosition);
            //   }
            //   keyFrameHasBeenSet = 1;
            //   /* Set Border, calc corresponding mouseX from lastDragPosition */
            //   lastDragPosition = stuckDegree;
            //   lastMouseX = calcMouseFromDegree( lastDragPosition );
            // };
        }

        // function makeCurSwingAnimation(element, stuckDegree, lastDragPosition){
        //   let swingFactor = 1.5;
        //   let stuckDegreeOne;
        //   let stuckDegreeTwo;
        //   // console.log("curDir "+curDir,"lastDragPosition "+lastDragPosition, "stuckDegree " + stuckDegree)
        //   // TODO: check: should drag coming from right left first and vice versa
        //   if (Math.abs(lastDragPosition) - Math.abs(stuckDegree)){
        //     stuckDegreeOne = stuckDegree+swingFactor;
        //     stuckDegreeTwo = stuckDegree-swingFactor;
        //   }
        //   else {
        //     stuckDegreeOne = stuckDegree-swingFactor;
        //     stuckDegreeTwo = stuckDegree+swingFactor;
        //   }
        //   let animationName = "swing";
        //   let animationTime = "1s";
        //   let keyframes = `@keyframes `+ animationName +`{
        //    20% { transform: rotate(${stuckDegreeOne}deg);}
        //    40% { transform: rotate(${stuckDegreeTwo}deg);}
        //    60% { transform: rotate(${stuckDegreeOne}deg);}
        //    80% { transform: rotate(${stuckDegreeTwo}deg);}
        //   100% { transform: rotate(${stuckDegree}deg);}
        //   }`;
        //   let stylesheet = shadow.querySelector("link[rel='stylesheet']");
        //   stylesheet.sheet.insertRule(keyframes)
        //   requestAnimationFrame(() => {
        //     element.style.animation = animationName + " " + animationTime + " " + "linear";
        //   });
        //   element.addEventListener('animationend', () => {
        //     element.style.transform = 'rotate('+ stuckDegree+'deg)';
        //     element.style.animation = 'none';
        //     deleteKeyFrameByName(stylesheet.sheet, "swing");
        //   });
        // };

        function deleteKeyFrameByName(styleSheet, animationName) {
            for (let i = 0; i < styleSheet.cssRules.length; i++) {
                let rule = styleSheet.cssRules[i];
                if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === animationName) {
                    styleSheet.deleteRule(i);
                    break;
                }
            }
        }

        function getCurrentStuckDegree(curDir) {
            return curDir === "right"
                ? -stuckDegree
                : stuckDegree;
        }

        function randomizer(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function calcMouseFromDegree(degree) {
            let result = (mouseXStart - (10 * degree))
            console.log(result)
            return result
        }

        function calcDegFromCurMouse(mouseX) {
            let unsignedDegree = (mouseXStart - mouseX) / 10;
            return curDir === "left"
                ? Math.abs(unsignedDegree)
                : -Math.abs(unsignedDegree);
        }

        function startTransform(e) {
            if (notLastPage()) {
                const curPage = shadow.querySelectorAll("[class='page']")[0];
                curPage.setAttribute("border", "1px solid black;");
                mouseXStart = e.clientX - centerX;
                curDir = setDragDirection(e);
                curPage.style.transformOrigin = 'top ' + curDir;
                setTempEventListeners();
            }
        }

        function notLastPage() {
            return renderPageCallCounter !== randomFiles.length;
        }

        function changePointer(option) {
            option === "hand"
                ? document.body.style.cursor = 'pointer'
                : document.body.style.cursor = 'auto';
        }

        /* Animation + Buttons Mobile */
        let mobileAnimations = 0;

        function mobileDrag(e) {
            if (notLastPage()) {
                const curPage = shadow.querySelectorAll("[class='page']")[0];
                let mobileDir = typeof e.touches === "undefined"
                    ? "left"
                    : setDragDirection(e);
                setZIndex(curPage, 1);
                curPage.setAttribute("border", "1px solid black;")
                makeMobileFadeOutAnimations(e);
                let animationTime = "0.5s";
                requestAnimationFrame(() => {
                    curPage.style.animation = "fadeout-" + mobileDir + " " + animationTime + " " + "linear";
                });
                curPage.addEventListener('animationend', () => {
                    curPage.remove()
                });
                renderPage();
                makeFloorElement(curPage)
            }
        }

        function makeMobileFadeOutAnimations(e) {
            // let yTranslation = e.touches[0].clientY
            // let xTranslation = e.touches[0].clientX

            let transLateDegreePercent = 150
            let directions = ["left", "right"]
            if (mobileAnimations === 0) {
                for (let i = 0; i < directions.length; i++) {
                    let animationName = "fadeout-" + directions[i];
                    if (directions[i] === "right") {
                        transLateDegreePercent = -transLateDegreePercent
                    }
                    // TODO: translateY(`+ transLateDegreePercent +`%);
                    let keyframes = `@keyframes ` + animationName + `{
            from {
              transform: translateX(0%);
              opacity: 1;
            }
            to {
              transform: translateX(` + transLateDegreePercent + `%);
              opacity: 0;
            }
          }`;
                    let stylesheet = shadow.querySelector("link[rel='stylesheet']");
                    stylesheet.sheet.insertRule(keyframes)
                }
                mobileAnimations = 1;
            }
        }

        function mobileImprint(e) {
            if (notLastPage()) {
                renderPageCallCounter = randomFiles.length - 1
                mobileDrag(e)
            }
        }

        function mobileRefresh(e) {
            if (renderPageCallCounter != 1) {
                renderPageCallCounter = 0;
                mobileDrag(e);
                removeAllFloorElements();
            }
        }

        /* EventListeners */

        function removeTempEventListeners() {
            document.removeEventListener(moveEventType, dragElement);
            document.body.removeEventListener("mouseleave", animatePage);
            document.removeEventListener(endEventType, animatePage);
            changePointer(0);
            pages.addEventListener(startEventType, startTransform);
        }

        function setTempEventListeners() {
            pages.removeEventListener(startEventType, startTransform);
            document.addEventListener(moveEventType, dragElement);
            setAdditionalEventListeners();
            changePointer("hand");
        }

        function setAdditionalEventListeners() {
            if (tearOnLeave === "on") {
                document.body.addEventListener("mouseleave", animatePage)
            }
            if (clickToTear === "on") {
                document.addEventListener(endEventType, animatePage)
            }
        }

        function setEventListeners() {
            if (deviceType === 'Mobile') {
                //document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });
                pages.addEventListener(startEventType, mobileDrag);
                refresh.addEventListener('click', mobileRefresh);
                imprint.addEventListener('click', mobileImprint);
            } else if (deviceType === 'Desktop') {
                pages.addEventListener(startEventType, startTransform);
                refresh.addEventListener('click', refreshbtn);
                imprint.addEventListener('click', imprintbtn);
                /* deactivate rightclick */
                document.addEventListener('contextmenu', event => event.preventDefault());
            }
        }
    }
}

customElements.define('tear-off-pad', TearOffPad);