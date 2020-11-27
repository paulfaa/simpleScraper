/** 
var $table = $('#table');
var myData = $.getJSON("carList.json")
$('#table').Datatable('load', myData);
$(function makeTable() {
    $('#table').bootstrapTable({
        data: mydata
    });
});
document.onload.makeTable()
*/
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    var jsonData = JSON.parse(myObj);
    console.log(jsonData);
  }
}
