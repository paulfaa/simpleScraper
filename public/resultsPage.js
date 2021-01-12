//todo
//need to serve \node_modules\bootstrap\dist\js to stop 404 error
//sorting works, add arrow to table being sorted
//fix countdown timer
//add scrape now button

var jsonData;

window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  getJson();
  w3timer();
});

function getJson() {
  var $table = $('#table');
  var myData = $.getJSON("carList.json").done(function (jsonData) {
    updateValues(jsonData);
    $('#table').bootstrapTable({data: jsonData});
  });
  //updateValues(jsonData);
  //$('#table').bootstrapTable({data: jsonData});
  //$(table).bootstrapTable({ data: myData });
}

/* function importJSON() {
  var data = fetch("./carList.json")
    .then(response => response.json())
    .then(data => console.log(data));
  return data;
} */

function priceFormatter(value, row, index) {
  return "¥" + row.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function urlFormatter(value, row, index) {
  var linkText = row.model;
  var link = row.url[0]; //this should be changed from array to string
  return "<a href='"+link+"'>"+linkText+"</a>";
}

/* function createTable() {
  var jsonFile = importJSON();
  var table = $('#table');
  $('#table').bootstrapTable({ data: jsonFile });
} */

function updateValues(myObj) {
  var countKey = Object.keys(myObj).length;
  document.getElementById("totalCars").innerHTML = countKey;

  function updateDates(){
    var dates = []
  for (var i in myObj) {
    dates.push(myObj[i].dateAdded);
  }
  var dates = dates.map(function(x) { return new Date(x); })
  var lastUpdate = new Date(Math.max.apply(null,dates));
  document.getElementById("lastUpdate").innerHTML = lastUpdate.toISOString().slice(0,10);;
  }
  
  function updatePrices(){
    var prices = []
    for (var i in myObj) {
      prices.push(myObj[i].price);
    }
    //console.log(prices);
    var maxPrice = Math.max.apply(null, prices);
    var minPrice = Math.min.apply(null, prices);

    document.getElementById("maxPrice").innerHTML = maxPrice;
    document.getElementById("minPrice").innerHTML = minPrice;

    var avg2 = prices.reduce((p, c, _, a) => p + c / a.length, 0);
    console.log(avg2)
    document.getElementById("avgPrice").innerHTML = avg2;
  }

  updateDates();
  updatePrices();
}

function scrapeTimer(){
  var countDownDate;

  function calculateTargetDate(){
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 1000*60*60*24);
    if (today.getHours() < 15) {
      countDownDate = new Date(today.setHours(15)).getTime();
    }
    else if (today.getHours() > 15){
      countDownDate = new Date(tomorrow.setHours(15)).getTime();
      console.log("should only log once")
    }
    return countDownDate;
  }
  calculateTargetDate();
  //should do var countDownDate = function...

  var x = setInterval(function() {
    console.log(countDownDate);
    var now = new Date().getTime();

    var distance = countDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
    document.getElementById("timer").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";
    console.log(hours, minutes, seconds);
  }, 1000)
}

function oldscrapeTimer() {
  var countDownDate = new Date("Jan 13, 2021 12rs:37:25").getTime();
  var x = setInterval(function () {
    var targetTime;

    var now = new Date().getTime();
    var today = new Date();
    var formattedToday = new Date(1606665221776);
    var tomorrow = new Date(today.getTime()+1000*60*60*24);
    //var tomorrow = today.setDate(today.getDate() + 1);
    var targetDate = new Date();
    console.log("current time is: " + today.getHours());
    if (today.getHours() < 15) {
      console.log("current time is less than 3pm");
      targetDate = today.setHours(15);
      console.log("targetdate:" + targetDate);
      //targetDate = new Date(today.setHours(15));
      targetTime = targetDate.getTime();
      console.log(targetTime);
      
    }
    else {
      console.log("current time is less than 3pm");
      targetDate = new Date(tomorrow.setHours(15));
      targetTime = targetDate.getTime();

    }
    console.log("target time is: " + targetDate);
    //var distance = targetDate - now;  //should 
    var distance = targetDate - now;
    console.log("distance is: " + distance);
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    console.log(hpurs, minutes, seconds);
    document.getElementById("timer").innerHTML = hours + "h "
      + minutes + "m " + seconds + "s ";
  });
}

