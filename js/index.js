document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('grassCanvas');
    const container = document.querySelector('.container');
    const imageWrapper = document.querySelector('.imageWrapper');

    canvas.width = 4000;
    canvas.height = 4000;
    const g = canvas.getContext('2d');

    function drawGrass() {
        for (let i = 0; i < 1000000; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let height = Math.random() * 20 + 10;
            let width = 2;
            let grey = Math.floor(Math.random() * 155 + 100);
            g.beginPath();
            g.moveTo(x, y);
            g.lineTo(x + width, y - height);
            g.lineTo(x - width, y - height);
            g.fillStyle = `rgb(${grey}, ${grey}, ${grey})`;
            g.fill();
        }
    }

    drawGrass();

    fetch('https://character-design-31j8tlpa3-kellys-projects-9ea9f4ea.vercel.app/getCharacters')
        .then(response => response.json())
        .then(savedCharacters => {
            if (savedCharacters.length > 0) {
                savedCharacters.forEach(character => {
                    displayCharacterNoAnimation(character);
                });
            }
        });

    let isDragging = false;
    let hasMoved = false;
    let startX, startY;
    let characterPlaced = false; // Flag to track if the character has been placed

    imageWrapper.addEventListener('mousedown', function(event) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            hasMoved = true;
            let newX = event.clientX;
            let newY = event.clientY;
            let newLeft = imageWrapper.offsetLeft + (newX - startX);
            let newTop = imageWrapper.offsetTop + (newY - startY);
            adjustWrapperPosition(newLeft, newTop);
            startX = newX;
            startY = newY;
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (!hasMoved && !characterPlaced) {
            placeScarecrow(event);
        }
        isDragging = false;
        hasMoved = false;
    });

    function adjustWrapperPosition(newLeft, newTop) {
        if (newLeft > 0) newLeft = 0;
        if (newTop > 0) newTop = 0;
        if (newLeft < container.offsetWidth - imageWrapper.offsetWidth) newLeft = container.offsetWidth - imageWrapper.offsetWidth;
        if (newTop < container.offsetHeight - imageWrapper.offsetHeight) newTop = container.offsetHeight - imageWrapper.offsetHeight;
        imageWrapper.style.left = newLeft + 'px';
        imageWrapper.style.top = newTop + 'px';
    }

    function placeScarecrow(event) {
        fetch('https://character-design-31j8tlpa3-kellys-projects-9ea9f4ea.vercel.app/getCharacter')
            .then(response => response.json())
            .then(confirmedCharacter => {
                if (confirmedCharacter) {
                    const { offsetX, offsetY } = event;
                    const characterData = { ...confirmedCharacter, x: offsetX - 125, y: offsetY - 187.5 };
                    displayCharacter(characterData);

                    fetch('https://character-design-31j8tlpa3-kellys-projects-9ea9f4ea.vercel.app/saveCharacters', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(characterData)
                    });

                    characterPlaced = true; // Set the flag to indicate the character has been placed
                }
            });
    }

    function displayCharacterNoAnimation({ hat, clothing, expression, x, y }) {
        const characterContainer = document.createElement('div');
        characterContainer.className = 'character';
        characterContainer.style.left = `${x}px`;
        characterContainer.style.top = `${y}px`;

        const head = document.createElement('div');
        head.className = 'head';
        head.style.backgroundImage = `url(${hat})`;

        const clothingDiv = document.createElement('div');
        clothingDiv.className = 'clothing';
        clothingDiv.style.backgroundImage = `url(${clothing})`;

        const facialExpression = document.createElement('div');
        facialExpression.className = 'facialExpression';
        facialExpression.style.backgroundImage = `url(${expression})`;

        characterContainer.appendChild(clothingDiv);
        characterContainer.appendChild(facialExpression);
        characterContainer.appendChild(head);

        document.getElementById('draggableCanvas').appendChild(characterContainer);
    }

    function displayCharacter({ hat, clothing, expression, x, y }) {
        const characterContainer = document.createElement('div');
        characterContainer.className = 'character';
        characterContainer.style.left = `${x}px`;
        characterContainer.style.top = `${y}px`;

        const head = document.createElement('div');
        head.className = 'head';
        head.style.backgroundImage = `url(${hat})`;

        const clothingDiv = document.createElement('div');
        clothingDiv.className = 'clothing';
        clothingDiv.style.backgroundImage = `url(${clothing})`;

        const facialExpression = document.createElement('div');
        facialExpression.className = 'facialExpression';
        facialExpression.style.backgroundImage = `url(${expression})`;

        characterContainer.appendChild(clothingDiv);
        characterContainer.appendChild(facialExpression);
        characterContainer.appendChild(head);

        document.getElementById('draggableCanvas').appendChild(characterContainer);

        anime({
            targets: characterContainer,
            translateY: [
                { value: -30, duration: 500, easing: 'easeOutQuad' },
                { value: 0, duration: 800, easing: 'easeOutBounce' }
            ],
            scale: [
                { value: 1.05, duration: 500, easing: 'easeOutQuad' },
                { value: 1, duration: 500, easing: 'easeOutQuad' }
            ],
            delay: 0
        });
    }
});

window.addEventListener('resize', function() {
    adjustWrapperPosition();
});
