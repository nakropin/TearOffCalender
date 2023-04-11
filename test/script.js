// Variablen definieren
let width = window.innerWidth;
let height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;

const targetX = centerX/8*5;
const targetY = centerY/4*3;
let bezierPoints = [{ x: centerX, y: centerY }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: targetX, y: targetY }];
let progress = 0;

// Mauskoordinaten beim Start berücksichtigen
var mouseX;
var mouseY;
document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX - centerX;
    mouseY = event.clientY - centerY;
    if(mouseX > 0){
        bezierPoints = [{ x: centerX, y: centerY }, { x: mouseX, y: mouseY }, { x: centerX, y: targetY }, { x: targetX, y: targetY }];
        console.log(mouseX, mouseY);
    }
    else {
        bezierPoints = [{ x: centerX, y: centerY }, { x: mouseX, y: mouseY }, { x: centerX, y: targetY }, { x: -targetX, y: targetY }];
    }
});

// Animation starten
function animate() {
    // Div-Objekt entlang der Bezier-Kurve bewegen
    var position = getBezierPosition(bezierPoints, progress);
    bezierObject.style.transform = 'translate(' + position.x + 'px, ' + position.y + 'px)';

    // Animation beenden, wenn das Ende der Bezier-Kurve erreicht ist
    if (progress < 1) {
        progress += 0.01;
        setTimeout(animate, 10);
    }
}

// Funktion, um die Position entlang der Bezier-Kurve zu berechnen
function getBezierPosition(points, progress) {
    var x = 0,
        y = 0;
    var n = points.length - 1;
    for (var i = 0; i <= n; i++) {
        var coefficient = binomialCoefficient(n, i) * Math.pow(1 - progress, n - i) * Math.pow(progress, i);
        x += points[i].x * coefficient;
        y += points[i].y * coefficient;
    }
    // Mauskoordinaten berücksichtigen
    x += (mouseX - bezierPoints[0].x) * (1 - progress);
    y += (mouseY - bezierPoints[0].y) * (1 - progress);
    return { x: x, y: y };
}

// Hilfsfunktion, um den Binomialkoeffizienten zu berechnen
function binomialCoefficient(n, k) {
    var coefficient = 1;
    for (var i = 1; i <= k; i++) {
        coefficient *= (n - i + 1) / i;
    }
    return coefficient;
}

// Animation starten, wenn die Seite vollständig geladen ist
window.addEventListener('click', function() {
    animate();

});