const WHEEL_RADIUS = 400;
const TEXT_FONT_SIZE = 50;

// Create new wheel object specifying the parameters at creation time.
let theWheel = new Winwheel({
    'numSegments': 15,     // Specify number of segments.
    'outerRadius': WHEEL_RADIUS,   // Set outer radius so wheel fits inside the background.
    'textFontSize': TEXT_FONT_SIZE,    // Set font size as desired.
    'segments':        // Define segments including colour and text.
        [
            { fillStyle: '#eae56f', text: 'Akhil', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#89f26e', text: 'Andy', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#c100be', text: 'David', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#7de6ef', text: 'Davy', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#eae56f', text: 'Jia', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#dc89f3', text: 'Jiebo', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#96af30', text: 'Jonathan', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#e7706f', text: 'Juan', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#7de6ef', text: 'Katie', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#e7706f', text: 'Leo', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#89f26e', text: 'Marcos', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#a128d8', text: 'Minh', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#d1b738', text: 'Nick', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#785ec4', text: 'Shirley', id: Math.floor(Math.random() * Date.now()) },
            { fillStyle: '#96af30', text: 'Tyler', id: Math.floor(Math.random() * Date.now()) },
        ],
    'animation':           // Specify the animation to use.
    {
        'type': 'spinToStop',
        'duration': 15,
        'spins': 8,
        'callbackFinished': alertPrize,
    }
});

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters
// note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
// -------------------------------------------------------
function alertPrize(indicatedSegment) {
    // Do basic alert of the segment text.
    // You would probably want to do something more interesting with this information.
    alert("The winner is: " + indicatedSegment.text);
    resetWheel();
}

// =======================================================================================================================
// Code below for the power controls etc which is entirely optional. You can spin the wheel simply by
// calling theWheel.startAnimation();
// =======================================================================================================================
let wheelPower = 2;
let wheelSpinning = false;

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {

        // Begin the spin animation by calling startAnimation on the wheel object.
        theWheel.startAnimation();

        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
    }
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.
    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}


// -------------------------------------------------------
// Name functionality.
// -------------------------------------------------------

let nameList = theWheel.segments.filter(segment => segment != null);

// -------------------------------------------------------
// Function for render the list of names.
// -------------------------------------------------------
function renderNames(todo) {
    localStorage.setItem('nameList', JSON.stringify(nameList));

    const list = document.querySelector('.js-name-list');
    const item = document.querySelector(`[data-key='${todo.id}']`);

    if (todo.deleted) {
        item.remove();
        if (nameList.length === 0) list.innerHTML = '';
        return
    }

    const isChecked = todo.checked ? 'done' : '';
    const node = document.createElement("li");
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);
    node.innerHTML = `
    <span>${todo.text}</span>
    <input class="delete-todo js-delete-todo" type="image" src="https://img.icons8.com/fluency/48/fa314a/delete-sign.png"/>
    `

    if (item) {
        list.replaceChild(node, item);
    } else {
        list.append(node);
    }
}

// -------------------------------------------------------
// Function for re-render the wheel after changes.
// -------------------------------------------------------
function renderWheel() {
    theWheel = new Winwheel({
        'numSegments': nameList.length,     // Specify number of segments.
        'outerRadius': WHEEL_RADIUS,   // Set outer radius so wheel fits inside the background.
        'textFontSize': TEXT_FONT_SIZE,    // Set font size as desired.
        'segments': nameList,
        'animation':           // Specify the animation to use.
        {
            'type': 'spinToStop',
            'duration': 15,
            'spins': 8,
            'callbackFinished': alertPrize,
        }
    });
}

// -------------------------------------------------------
// Function to add a name.
// -------------------------------------------------------
function addName(text) {
    const name = {
        text,
        id: Date.now(),
    };

    nameList.push(name);
    renderWheel();
    renderNames(name);
}

// -------------------------------------------------------
// Function to delete a name.
// -------------------------------------------------------
function deleteName(key) {
    const index = nameList.findIndex(item => item.id === Number(key));
    const name = {
        deleted: true,
        ...nameList[index]
    };
    nameList = nameList.filter(item => item.id !== Number(key));
    renderNames(name);
    renderWheel();
}

// -------------------------------------------------------
// Event listener for submiting a name from the input.
// -------------------------------------------------------
const form = document.querySelector('.js-form');
form.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('.js-name-input');

    const text = input.value.trim();
    if (text !== '') {
        addName(text);
        input.value = '';
        input.focus();
    }
});

// -------------------------------------------------------
// Event listener for deleting a name from the list.
// -------------------------------------------------------
const list = document.querySelector('.js-name-list');
list.addEventListener('click', event => {
    console.log(event.target.classList);
    if (event.target.classList.contains('js-delete-todo')) {
        const itemKey = event.target.parentElement.dataset.key;
        deleteName(itemKey);
    }
});

// -------------------------------------------------------
// Event listener for the page to load.
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('nameList', JSON.stringify(nameList));
    const ref = localStorage.getItem('nameList');
    if (ref) {
        nameList = JSON.parse(ref);
        nameList.forEach(t => {
            renderNames(t);
        });
    }
});

// -------------------------------------------------------
// Event listener for opening and closing the collapsible list.
// -------------------------------------------------------
var coll = document.getElementsByClassName("collapsible-button");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}