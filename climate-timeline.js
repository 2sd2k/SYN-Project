const slider = document.getElementById('tempSlider');
const display = document.getElementById('tempDisplay');
const milestones = document.querySelectorAll('.milestone');

function tempToColor(t) {
    const ratio = (t - 1.1) / (4.8 - 1.1);
    if (ratio < 0.5) {
        const r = Math.round(245 + (239 - 245) * (ratio * 2));
        const g = Math.round(158 - 158 * (ratio * 2));
        const b = Math.round(11 + (68 - 11) * (ratio * 2));
        return `rgb(${r},${g},${b})`;
    } else {
        const r2 = (ratio - 0.5) * 2;
        const r = Math.round(239 - (239 - 127) * r2);
        const g = Math.round(68 * (1 - r2));
        const b = Math.round(68 - (68 - 29) * r2);
        return `rgb(${r},${g},${b})`;
    }
}

function severityLabel(pct) {
    if (pct < 20) return 'Low';
    if (pct < 40) return 'Moderate';
    if (pct < 60) return 'High';
    if (pct < 80) return 'Severe';
    return 'Critical';
}

function lerp(a, b, t) { return a + (b - a) * t; }

function updateImpacts(temp) {
    const t = (temp - 1.1) / (4.8 - 1.1);
    const color = tempToColor(temp);

    const impacts = [
        { bar: 'weatherBar', val: 'weatherVal', min: 25, max: 95 },
        { bar: 'seaBar',     val: 'seaVal',     min: 10, max: 90 },
        { bar: 'bioBar',     val: 'bioVal',     min: 20, max: 92 },
        { bar: 'foodBar',    val: 'foodVal',    min: 8,  max: 88 },
        { bar: 'econBar',    val: 'econVal',    min: 5,  max: 85 },
    ];

    impacts.forEach(imp => {
        const pct = Math.round(lerp(imp.min, imp.max, t));
        document.getElementById(imp.bar).style.width = pct + '%';
        document.getElementById(imp.bar).style.background = `linear-gradient(90deg, #f59e0b, ${color})`;
        document.getElementById(imp.val).textContent = severityLabel(pct);
    });
}

function update() {
    const temp = parseFloat(slider.value);
    const color = tempToColor(temp);

    display.textContent = `+${temp.toFixed(1)}°C`;
    display.style.color = color;

    slider.style.background = `linear-gradient(90deg, #f59e0b, ${color} ${((temp - 1.1) / (4.8 - 1.1)) * 100}%, rgba(255,255,255,0.1) ${((temp - 1.1) / (4.8 - 1.1)) * 100}%)`;

    milestones.forEach(m => {
        const threshold = parseFloat(m.dataset.threshold);
        const isActive = temp >= threshold;
        m.classList.toggle('active', isActive);

        const dot = m.querySelector('.milestone-dot');
        const content = m.querySelector('.milestone-content');

        if (isActive) {
            dot.style.background = tempToColor(threshold);
            content.style.background = 'rgba(255,255,255,0.04)';
            content.style.borderColor = tempToColor(threshold) + '44';
        } else {
            dot.style.background = '#1e293b';
            content.style.background = 'rgba(255,255,255,0.015)';
            content.style.borderColor = 'rgba(255,255,255,0.04)';
        }
    });

    updateImpacts(temp);
}

slider.addEventListener('input', update);
update();
