const form = document.querySelector("form");
const input = document.querySelector("form input");
const msgSpan = form.querySelector(".msg");

const list = document.querySelector(".container .cities");


localStorage.setItem("apiKey", "+lSD63jYEwbnNUNAL2XqDucMfucgfr5GdgE8bB34NYZRciAJCk090SNmeKakXIls")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeatherDataFromApi();
    form.reset();
    
});

const getWeatherDataFromApi = async () => {
    const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    console.log(apiKey);
    const cityName = input.value;
    const units = "metric";
    const lang = "en";

    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;

    try {
        // const response = await fetch(url).then(response=>response.json());

        const response = await axios(url);
        console.log(response);

        //obj. destructuring
        const { main, name, sys, weather } = response.data;

        const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

        const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
        console.log(response);

        const cityNameSpans = list.querySelectorAll("span");
        
        if (cityNameSpans.length > 0) {
            const filteredArray = [...cityNameSpans].filter(span => span.innerText == name);
            if (filteredArray.length > 0) {
                msgSpan.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
                setTimeout(() => { msgSpan.innerText = "" }, 5000);
                return;
            }
        }
        const createdLi = document.createElement("li");
        createdLi.classList.add("city");
        createdLi.innerHTML =
            ` <h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
          </h2>
          <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
          <figure>
                <img class="city-icon" src="${iconUrlAWS}">
                <figcaption>${weather[0].description}</figcaption>
          </figure>`;
        //append vs. prepend
        list.prepend(createdLi);

        
       
        //Bubbling => child to parent
        createdLi.addEventListener("click", (e)=>{
            // alert("li element clicked");
            window.location.href = `https://openweathermap.org/find?q=${name}`;
        });

       

    }
    catch (error) {
        //error logging
        //postErrorLog("weather.js", "getWeatherDataFromApi", date, error);
        msgSpan.innerText = "City not found!";
        setTimeout(() => { msgSpan.innerText = "" }, 5000);
    }

}