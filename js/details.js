let selections = {
    hat: false,
    expression: false,
    clothing: false
};

function changeHat(hat) {
    document.getElementById('head').style.backgroundImage = `url(${hat})`;
    selections.hat = true;
    checkSelections();
}

function changeFacialExpression(expression) {
    document.getElementById('facialExpression').style.backgroundImage = `url(${expression})`;
    selections.expression = true;
    checkSelections();
}

function changeClothing(clothing) {
    document.getElementById('clothing').style.backgroundImage = `url(${clothing})`;
    selections.clothing = true;
    checkSelections();
}

function checkSelections() {
    document.getElementById('confirmButton').disabled = !(selections.hat && selections.expression && selections.clothing);
}

function saveCharacterDesign() {
    const character = {
        hat: document.getElementById('head').style.backgroundImage,
        expression: document.getElementById('facialExpression').style.backgroundImage,
        clothing: document.getElementById('clothing').style.backgroundImage
    };

    fetch('https://scarecrow-field-e6y6g3pps-kellys-projects-9ea9f4ea.vercel.app/saveCharacter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(character)
    }).then(response => {
        if (response.ok) {
            window.location.href = 'index.html';
        }
    });
}

document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        const parentRow = this.closest('.row');
        parentRow.querySelectorAll('.option').forEach(other => {
            other.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});
