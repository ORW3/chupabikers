function principal() {
    let lastScrollY = window.scrollY;
    document
        .querySelectorAll(".leftTyre, .rightTyre, .pedals, .rightLeg, .calf")
        .forEach((el) => (el.style.animationPlayState = "paused"));

    document.querySelector(".navmark").onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.onscrollend = function () {
        document
            .querySelectorAll(".leftTyre, .rightTyre, .pedals, .rightLeg, .calf")
            .forEach((el) => (el.style.animationPlayState = "paused"));
    };

    window.onscroll = function () {
        if (lastScrollY < window.scrollY) {

            document
                .querySelectorAll(".leftTyre, .rightTyre, .pedals, .rightLeg, .calf")
                .forEach((el) => (el.style.animationPlayState = "running"));

            lastScrollY = window.scrollY;
        } else {

            document
                .querySelectorAll(".leftTyre, .rightTyre, .pedals, .rightLeg, .calf")
                .forEach((el) => (el.style.animationPlayState = "paused"));

            lastScrollY = window.scrollY;
        }
    };
}

function animacion() {
    const canvas = document.getElementById("canvas");
    const c = canvas.getContext("2d");

    const imgSize = 512;

    canvas.width = imgSize;
    canvas.height = imgSize;

    const image = c.createImageData(imgSize, imgSize);
    for (let i = 0; i < image.data.length; i += 4) {
        image.data[i] = 0; // R
        image.data[i + 1] = 0; // G
        image.data[i + 2] = 0; // B
        image.data[i + 3] = 255; // A
    }

    const mapSize = 1024;

    const distance = (x, y) => Math.sqrt(x * x + y * y);

    const heightMap1 = [];
    for (let u = 0; u < mapSize; u++) {
        for (let v = 0; v < mapSize; v++) {
            const i = u * mapSize + v;

            const cx = u - mapSize / 2;
            const cy = v - mapSize / 2;

            const d = distance(cx, cy);

            const stretch = (3 * Math.PI) / (mapSize / 2);

            const ripple = Math.sin(d * stretch);

            const normalized = (ripple + 1) / 2;

            heightMap1[i] = Math.floor(normalized * 128);
        }
    }

    const heightMap2 = [];
    for (let u = 0; u < mapSize; u++) {
        for (let v = 0; v < mapSize; v++) {
            const i = u * mapSize + v;
            const cx = u - mapSize / 2;
            const cy = v - mapSize / 2;

            const d1 = distance(0.8 * cx, 1.3 * cy) * 0.022;
            const d2 = distance(1.35 * cx, 0.45 * cy) * 0.022;

            const s = Math.sin(d1);
            const c = Math.cos(d2);

            const h = s + c;

            const normalized = (h + 2) / 4;

            heightMap2[i] = Math.floor(normalized * 127);
        }
    }

    const interpolate = (c1, c2, f) => {
        return {
            r: Math.floor(c1.r + (c2.r - c1.r) * f),
            g: Math.floor(c1.g + (c2.g - c1.g) * f),
            b: Math.floor(c1.b + (c2.b - c1.b) * f)
        };
    };

    const randomColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return { r, g, b };
    };

    const makeRandomPalette = () => {
        const c1 = randomColor();
        const c2 = randomColor();
        const c3 = randomColor();
        const c4 = randomColor();
        const c5 = randomColor();

        return makeFiveColorGradient(c1, c2, c3, c4, c5);
    };

    const makeFiveColorGradient = (c1, c2, c3, c4, c5) => {
        const g = [];

        for (let i = 0; i < 64; i++) {
            const f = i / 64;
            g[i] = interpolate(c1, c2, f);
        }

        for (let i = 64; i < 128; i++) {
            const f = (i - 64) / 64;
            g[i] = interpolate(c2, c3, f);
        }

        for (let i = 128; i < 192; i++) {
            const f = (i - 128) / 64;
            g[i] = interpolate(c3, c4, f);
        }

        for (let i = 192; i < 256; i++) {
            const f = (i - 192) / 64;
            g[i] = interpolate(c4, c5, f);
        }

        return g;
    };

    let dx1 = 0;
    let dy1 = 0;

    let dx2 = 0;
    let dy2 = 0;

    const moveHeightMaps = t => {
        dx1 = Math.floor(
            (((Math.cos(t * 0.0002 + 0.4 + Math.PI) + 1) / 2) * mapSize) / 2
        );
        dy1 = Math.floor((((Math.cos(t * 0.0003 - 0.1) + 1) / 2) * mapSize) / 2);
        dx2 = Math.floor((((Math.cos(t * -0.0002 + 1.2) + 1) / 2) * mapSize) / 2);
        dy2 = Math.floor(
            (((Math.cos(t * -0.0003 - 0.8 + Math.PI) + 1) / 2) * mapSize) / 2
        );
    };

    const palettes = [makeRandomPalette(), makeRandomPalette()];

    let palette = [];

    let prevDirection = 1;

    const updatePalette = t => {
        const timeScale = 0.0005;
        const x = t * timeScale;

        const inter = (Math.cos(x) + 1) / 2;

        const direction = -Math.sin(x) >= 0 ? 1 : -1;
        if (prevDirection != direction) {
            prevDirection = direction;
            if (direction == -1) {
                palettes[0] = makeRandomPalette();
            } else {
                palettes[1] = makeRandomPalette();
            }
        }

        for (let i = 0; i < 256; i++) {
            palette[i] = interpolate(palettes[0][i], palettes[1][i], inter);
        }
    };

    const updateImageData = () => {
        for (let u = 0; u < imgSize; u++) {
            for (let v = 0; v < imgSize; v++) {

                const i = (u + dy1) * mapSize + (v + dx1);
                const k = (u + dy2) * mapSize + (v + dx2);

                const j = u * imgSize * 4 + v * 4;

                let h = heightMap1[i] + heightMap2[k];

                let c = palette[h];

                image.data[j] = c.r;
                image.data[j + 1] = c.g;
                image.data[j + 2] = c.b;
            }
        }
    };

    const linearGradient = (c1, c2) => {
        const g = [];

        for (let i = 0; i < 256; i++) {
            const f = i / 255;
            g[i] = interpolate(c1, c2, f);
        }

        return g;
    };

    const tick = time => {
        moveHeightMaps(time);
        updatePalette(time);
        updateImageData();

        c.putImageData(image, 0, 0);

        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

function animacionIn() {
    const canvas = document.getElementById("canvas");
    const c = canvas.getContext("2d");
    const imgSize = 512;
    const mapSize = 1024;
    canvas.width = imgSize;
    canvas.height = imgSize;

    const image = c.createImageData(imgSize, imgSize);
    image.data.fill(0);
    for (let i = 3; i < image.data.length; i += 4) image.data[i] = 255;

    const distance = (x, y) => Math.sqrt(x * x + y * y);

    const generateHeightMap = (callback) => {
        const heightMap = new Array(mapSize * mapSize);
        for (let u = 0; u < mapSize; u++) {
            for (let v = 0; v < mapSize; v++) {
                const i = u * mapSize + v;
                heightMap[i] = callback(u, v);
            }
        }
        return heightMap;
    };

    const heightMap1 = generateHeightMap((u, v) => {
        const cx = u - mapSize / 2, cy = v - mapSize / 2;
        const d = distance(cx, cy);
        const stretch = (3 * Math.PI) / (mapSize / 2);
        const ripple = Math.sin(d * stretch);
        return Math.floor(((ripple + 1) / 2) * 128);
    });

    const heightMap2 = generateHeightMap((u, v) => {
        const cx = u - mapSize / 2, cy = v - mapSize / 2;
        const d1 = distance(0.8 * cx, 1.3 * cy) * 0.022;
        const d2 = distance(1.35 * cx, 0.45 * cy) * 0.022;
        const h = Math.sin(d1) + Math.cos(d2);
        return Math.floor(((h + 2) / 4) * 127);
    });

    const interpolate = (c1, c2, f) => ({
        r: Math.floor(c1.r + (c2.r - c1.r) * f),
        g: Math.floor(c1.g + (c2.g - c1.g) * f),
        b: Math.floor(c1.b + (c2.b - c1.b) * f)
    });

    const randomColor = () => ({
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
    });

    const makeFiveColorGradient = (colors) => {
        const gradient = [];
        for (let i = 0; i < 256; i++) {
            const index = Math.floor(i / 64);
            const f = (i % 64) / 64;
            gradient[i] = interpolate(colors[index], colors[index + 1], f);
        }
        return gradient;
    };

    let dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0;

    const moveHeightMaps = (t) => {
        dx1 = Math.floor((((Math.cos(t * 0.0002 + 0.4 + Math.PI) + 1) / 2) * mapSize) / 2);
        dy1 = Math.floor((((Math.cos(t * 0.0003 - 0.1) + 1) / 2) * mapSize) / 2);
        dx2 = Math.floor((((Math.cos(t * -0.0002 + 1.2) + 1) / 2) * mapSize) / 2);
        dy2 = Math.floor((((Math.cos(t * -0.0003 - 0.8 + Math.PI) + 1) / 2) * mapSize) / 2);
    };

    const palettes = [makeFiveColorGradient([randomColor(), randomColor(), randomColor(), randomColor(), randomColor()]), makeFiveColorGradient([randomColor(), randomColor(), randomColor(), randomColor(), randomColor()])];
    let palette = [], prevDirection = 1;

    const updatePalette = (t) => {
        const x = t * 0.0005;
        const inter = (Math.cos(x) + 1) / 2;
        const direction = -Math.sin(x) >= 0 ? 1 : -1;
        if (prevDirection != direction) {
            prevDirection = direction;
            palettes[direction === -1 ? 0 : 1] = makeFiveColorGradient([randomColor(), randomColor(), randomColor(), randomColor(), randomColor()]);
        }
        for (let i = 0; i < 256; i++) {
            palette[i] = interpolate(palettes[0][i], palettes[1][i], inter);
        }
    };

    const updateImageData = () => {
        for (let u = 0; u < imgSize; u++) {
            for (let v = 0; v < imgSize; v++) {
                const i = (u + dy1) * mapSize + (v + dx1);
                const k = (u + dy2) * mapSize + (v + dx2);
                const j = u * imgSize * 4 + v * 4;
                const h = heightMap1[i] + heightMap2[k];
                const c = palette[h];
                image.data[j] = c.r;
                image.data[j + 1] = c.g;
                image.data[j + 2] = c.b;
            }
        }
    };

    const tick = (time) => {
        moveHeightMaps(time);
        updatePalette(time);
        updateImageData();
        c.putImageData(image, 0, 0);

        const shadowSize = 50;
        const gradient = c.createRadialGradient(imgSize / 2, imgSize / 2, imgSize / 2 - shadowSize, imgSize / 2, imgSize / 2, imgSize / 2);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(14, 16, 18, 1)');
        c.fillStyle = gradient;
        c.fillRect(0, 0, imgSize, imgSize);

        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

function carrusel() {
    const slider = document.querySelector('.carrusel');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', e => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', _ => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', _ => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const SCROLL_SPEED = 3;
        const walk = (x - startX) * SCROLL_SPEED;
        slider.scrollLeft = scrollLeft - walk;
    });
}

function mover() {
    const slider = document.querySelector('.carrusel');
    const primerDesafio = slider.querySelector('.tarjeta:not(.ng-container)');

    if (primerDesafio) {
        primerDesafio.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
    }
}

function subirImagen() {
    var myWidget = cloudinary.createUploadWidget({
        cloudName: 'dogupuezd',
        uploadPreset: 'illurito'
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            console.log('Done! Here is the image info: ', result.info);
        }
    }
    )

    document.getElementById("upload_widget").addEventListener("click", function () {
        myWidget.open();
    }, false);
}
