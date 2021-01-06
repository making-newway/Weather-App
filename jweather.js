const api = {
    key : "d1885fb807819ab95a384cc338bff554",
    baseurl : "https://api.openweathermap.org/data/2.5/"
};
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}

$(".search").keypress(function(e) {
    if(e.which == 13) {
        fetch(`${api.baseurl}weather?q=${$(".search").val()}&appid=${api.key}`)
            .then(weather => {
            return weather.json();
            }).then(showWeather);
    }
})
function setPosition(pos) {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    setWeather(lat, lon);
}
function showError(error) {
    console.log(error)
}
function setWeather(lat, lon) {
    fetch(`${api.baseurl}weather?lat=${lat}&lon=${lon}&appid=${api.key}`)
        .then(weather => {
        return weather.json();
        }).then(showWeather);

}
function showWeather(weather) {
    $(".location .city").text(`${weather.name}, ${weather.sys.country}`);
    $(".current .temp").html(`${(Math.round((weather.main.temp-273)*100)/100)} <span id="ray">°C<span>`);
    $(".current .weather").text(weather.weather[0].main);
    $(".daily").text(`${Math.round((weather.main.temp_max-273)*100)/100}°C / ${Math.round((weather.main.temp_min-273)*100)/100}°C`);
    $(".current .windy img").css('transform','rotate(' + weather.wind.deg + 'deg)');
    $(".current .icon").html(`<img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.wind.deg}">`);
    $(".current .windy .val").text(`${weather.wind.speed} m/s`);
    $(".location .date").text(function(){
        const d = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let dayn = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${dayn} ${date} ${month} ${year}`;
    })

    const day = new Date();
    let n = day.getHours()+(day.getMinutes()/60)-5.5+(weather.timezone/3600);
    if (n<0) {
        n = 24+n;
    }
    let img = "";
    if(n>=0 && n<6){
        img = "late";
    }
    else if(n>=6 && n<12){
        img = "mor";
    }
    else if(n>=12 && n<18){
        img = "noon";
    }
    else if(n>=18 && n<=23){
        img = "mid";
    }
    $("body").css("background-image",`url('icons/${img}.jpg')`)
}