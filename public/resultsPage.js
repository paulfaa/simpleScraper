//todo
//need to serve \node_modules\bootstrap\dist\js to stop 404 error
//sorting works, add arrow to table being sorted
//fix countdown timer
//add scrape now button

var jsonData;

window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  getJson();
  //scrapeTimer();
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

function scrapeTimer() {
  //var countDownDate = new Date("Nov 29, 2020 15:37:25").getTime();
  var countDownDate = new Date("Jan 12, 2021 15:37:25").getTime();
  var x = setInterval(function () {
    var now = new Date().getTime();
    var today = new Date();
    var formattedToday = new Date(1606665221776);
    var tomorrow = new Date(today.getTime()+1000*60*60*24);
    //var tomorrow = today.setDate(today.getDate() + 1);
    var targetDate = new Date();
    if (today.getHours() < 15) {
      targetDate = today.setHours(15);
      var targetTime = targetDate.getTime();
      console.log(targetTime);
      //targetDate = new Date(today.setHours(15));
    }
    else {
      targetDate = new Date(tomorrow.setHours(15));
    }
    var distance = targetDate - now;
    console.log(distance);
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("timer").innerHTML = hours + "h "
      + minutes + "m " + seconds + "s ";
  });
}

