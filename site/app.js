/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '17ed4cb1efb23737783a76e84a98c0dd&units=imperial'; // return in Fahrenheit

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// mandatory var
const userInfo = document.getElementById('userInfo');

// listen closely
const generateBtn = document.getElementById('generate');
generateBtn.addEventListener('click', performAction);

// now here's the action
function performAction(e) {
    e.preventDefault();

    //get user scribblings
    const zipCode = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;

    // only with a valid zipcode
    if (zipCode !== '') {
        generateBtn.classList.remove('invalid');
        getWeatherData(baseUrl, zipCode, apiKey)
            .then(function(data) {
                // add to POST
                postData('/add', { temp: data.main.temp.toFixed(2), date: newDate, content: content });
            }).then(function() {
                // update screen
                updateInterface()
            }).catch(function(error) {
                console.log(error);
                alert('The zip code is invalid. Try 93040');
            });
        userInfo.reset();
    } else {
        generateBtn.classList.add('invalid');
    }
}

// get that API data
const getWeatherData = async(baseUrl, zipCode, apiKey) => {
    const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

// POST data
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content
        })
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};

// Helper to update the html
const updateInterface = async() => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        // update those values
        if (allData.date !== undefined && allData.temp !== undefined && allData.content !== undefined) {
            document.getElementById('date').innerHTML = allData.date;
            document.getElementById('temp').innerHTML = allData.temp + ' degree F'; // this could be dependent on the 'units' parameter
            document.getElementById('content').innerHTML = allData.content;
        }
    } catch (error) {
        console.log('error', error);
    }
};