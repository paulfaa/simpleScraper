//todo
//need to serve \node_modules\bootstrap\dist\js to stop 404 error
//sorting works, add arrow to table being sorted
//add scrape now button

var jsonData;

window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  getJson();
  scrapeTimer();
  changeFormatter();
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

function changeFormatter(){
  var elements = document.getElementsByClassName("change");
  for(var i=0; i<elements.length; i++) {
    var value = elements[i].textContent;
    if (value > 0) {
      elements[i].innerHTML = "▴ " + value + "%";
      elements[i].classList.add("text-success");
    }
    if (value < 0) {
      elements[i].innerHTML = "▾ " + value + "%";
      elements[i].classList.add("text-danger");
    }
}
  
  
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

    var maxPrice = Math.max.apply(null, prices);
    var minPrice = Math.min.apply(null, prices);

    document.getElementById("maxPrice").innerHTML = maxPrice;
    document.getElementById("minPrice").innerHTML = minPrice;

    var avg = prices.reduce((p, c, _, a) => p + c / a.length, 0);
    document.getElementById("avgPrice").innerHTML = avg;
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
      countDownDate = new Date(today.setHours(15,0,0)).getTime();
    }
    else if (today.getHours() > 15){
      countDownDate = new Date(tomorrow.setHours(15,0,0)).getTime();
    }
    return countDownDate;
  }
  calculateTargetDate();
  //should do var countDownDate = function...

  var x = setInterval(function() {
    //console.log(countDownDate);
    var now = new Date().getTime();

    var distance = countDownDate - now;
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
    document.getElementById("timer").innerHTML = hours + "h "
    + minutes + "m " + seconds + "s ";
    //console.log(hours, minutes, seconds);
  }, 1000)
}