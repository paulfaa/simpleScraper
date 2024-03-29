//todo
//need to serve \node_modules\bootstrap\dist\js to stop 404 error
//sorting works, add arrow to table being sorted
//add scrape now button
//dropdown with panel for conversion
//make css look nicer
var jsonData;
var oldJsonData;

window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  getJson();
  scrapeTimer();
});

function getJson() {
  oldJsonData = $.getJSON("oldCarList.json");
  jsonData = $.getJSON("carList.json").done(function (jsonData) {  //should pull this from S3 server instead of local system
    updateValues(jsonData);
    $('#table').bootstrapTable({ data: jsonData });
    setTimeout(() => {
      changeFormatter()
    }, 0);
  });
}

function tablePriceFormatter(value, row, index) {
  //for bootstrap table
  return '¥ ' + numeral(row.price).format('¥,');
}

function priceFormatter(price) {
  return '¥ ' + numeral(price).format('¥,');
}

function urlFormatter(value, row, index) {
  //for bootstrap table
  var linkText = row.model;
  var link = row.url[0]; //this should be changed from array to string
  return "<a href='" + link + "'>" + linkText + "</a>";
}

function changeFormatter() {
  console.log("running formatter")
  var elements = document.getElementsByClassName("change");
  for (var i = 0; i < elements.length; i++) {
    var change = elements[i].innerHTML;
    console.log(change);
    if (parseFloat(change) > 0) {
      elements[i].innerHTML = "▴ " + change + "%";
      elements[i].classList.add("text-success");
      //also need to remove any other text classes here
    }
    if (parseFloat(change) < 0) {
      elements[i].innerHTML = "▾ " + change + "%";
      elements[i].classList.add("text-danger");
    }
  }
}

function updateValues(myObj) {
  var countKey = Object.keys(myObj).length;
  document.getElementById("totalCars").innerHTML = countKey;
  var years = []
  for (var i in myObj) {
    years.push(myObj[i].year);
  }
  var a = Math.round(years.reduce((p, c, _, a) => p + c / a.length, 0));
  document.getElementById("averageYear").innerHTML = a;

  function updateDates() {
    var dates = []
    for (var i in myObj) {
      dates.push(myObj[i].dateAdded);
    }
    var dates = dates.map(function (x) { return new Date(x); })
    var lastUpdate = new Date(Math.max.apply(null, dates));
    document.getElementById("lastUpdate").innerHTML = lastUpdate.toISOString().slice(0, 10);;
  }

  function updatePrices() {
    var prices = []
    var oldPrices = []

    for (var i in myObj) {
      prices.push(myObj[i].price);
    }

    var maxPrice = Math.max.apply(null, prices);
    var minPrice = Math.min.apply(null, prices);
    document.getElementById("maxPrice").innerHTML = priceFormatter(maxPrice);
    document.getElementById("minPrice").innerHTML = priceFormatter(minPrice);

    var avg = prices.reduce((p, c, _, a) => p + c / a.length, 0);
    document.getElementById("avgPrice").innerHTML = priceFormatter(avg);

    oldPrices = $.getJSON( "oldCarList.json", function( data ) {
      var items = [];
      for (var i in data) {
        items.push(data[i].price);
      }

      function getPercentageChange(newValue, oldValue){
        var diff = newValue - oldValue;
        diff = ((diff / oldValue) * 100).toFixed(2);
        return diff;
      }

      var oldMax = Math.max.apply(null, items);
      document.getElementById("maxChange").innerHTML = getPercentageChange(maxPrice, oldMax);
      var oldMin = Math.min.apply(null, items);
      document.getElementById("minChange").innerHTML = getPercentageChange(minPrice, oldMin);

      var oldAvg = items.reduce((p, c, _, a) => p + c / a.length, 0);
      document.getElementById("avgChange").innerHTML = getPercentageChange(avg, oldMin);
    });
  }
  updateDates();
  updatePrices();
}

function scrapeTimer() {
  var countDownDate;

  function calculateTargetDate() {
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 1000 * 60 * 60 * 24);
    if (today.getHours() < 15) {
      countDownDate = new Date(today.setHours(15, 0, 0)).getTime();
    }
    else if (today.getHours() > 15) {
      countDownDate = new Date(tomorrow.setHours(15, 0, 0)).getTime();
    }
    return countDownDate;
  }
  calculateTargetDate();
  //should do var countDownDate = function...

  var x = setInterval(function () {
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

$("#amountInput").on('keyup', function () {
  var n = parseInt($(this).val().replace(/\D/g, ''), 10);
  $(this).val(n.toLocaleString());
});

function formatNumberInput() {
  var amountInput = document.getElementById("amountInput").value;
  document.getElementById("amountInput").value = numeral(amountInput).format('$0,0.00');
}

function clearInput(){
  document.getElementById("amountInput").value = null;
  document.getElementById("conversionRate").innerHTML = null;
  document.getElementById("conversionOutput").innerHTML = null;
}

function convertJpyToEur() {
  var rate;
  $.getJSON("https://api.exchangerate.host/convert?from=JPY&to=EUR", function (data) {
    rate = data.info.rate;
    var amountToConvert = document.getElementById("amountInput").value;
    if (amountToConvert == 0) {
      $("#conversionRate").show();
      console.log("Cannot convert null value");
      document.getElementById("conversionRate").innerHTML = "Enter an amount to convert.";
      $("#conversionRate").fadeOut(2000);
    } else {
      var total = (rate * amountToConvert).toFixed(2);
      console.log(total);
      $("#conversionRate").show();
      document.getElementById("conversionRate").innerHTML = "(1 JPY = " + rate.toFixed(6) + " EUR)";
      document.getElementById("conversionOutput").innerHTML = "€" + numeral(total).format('0,0.00');
    }
  })
}