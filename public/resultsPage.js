window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  getJson();
  //monoFunction();
});

function getJson() {
  var $table = $('#table');
  var myData = $.getJSON("carList.json").done(function (jsonData) {
    updateValues(jsonData);
    $('#table').bootstrapTable({data: jsonData});
  });
  

  console.log(myData);
  //updateValues(jsonData);
  //$('#table').bootstrapTable({data: jsonData});
  //$(table).bootstrapTable({ data: myData });
}

function importJSON() {
  var data = fetch("./carList.json")
    .then(response => response.json())
    .then(data => console.log(data));
  return data;
}

function createTable() {
  var jsonFile = importJSON();
  var table = $('#table');
  $('#table').bootstrapTable({ data: jsonFile });
}

function monoFunction() {
  var obj, dbParam, xmlhttp, myObj, x, txt = "";
  dbParam = JSON.stringify(obj);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myObj = JSON.parse(this.responseText);
      console.log(myObj);

      //extra code
      var table = $('#table');
      $('#table').bootstrapTable({ data: myObj });
      //need to enable sorting on table
    }
  };
  //cant access outside of function
  console.log(myObj);

  //var jsonStuff = xmlhttp.open("GET", "carList.json", true);
  xmlhttp.open(this.method, this.url, true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("x=" + dbParam);
  //jsonStuff returns null

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      var jsonData = JSON.parse(myObj);
      console.log(jsonData);
    }
  }
}

function updateValues(myObj) {
  var countKey = Object.keys(myObj).length;
  document.getElementById("totalCars").innerHTML = countKey;

  var prices = []
  for (var i in myObj) {
    prices.push(myObj[i].price);
  }
  console.log(prices);
  var maxPrice = Math.max.apply(null, prices);
  var minPrice = Math.min.apply(null, prices);
  console.log(maxPrice);
  console.log(minPrice);

  document.getElementById("maxPrice").innerHTML = maxPrice;
  document.getElementById("minPrice").innerHTML = minPrice;

  var avg2 = prices.reduce((p, c, _, a) => p + c / a.length, 0);
  console.log(avg2)
  document.getElementById("avgPrice").innerHTML = avg2;
}

function scrapeTimer() {
  var countDownDate = new Date("Nov 29, 2020 15:37:25").getTime();
  var x = setInterval(function () {
    var now = new Date().getTime();
    var today = new Date();
    var formattedToday = new Date(1606665221776);
    var tomorrow = today.setDate(today.getDate() + 1);
    var targetDate;
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

