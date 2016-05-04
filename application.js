var data = [];
var resultTemplate = $('#resultTemplate').html();

function fetchCities(cityName) {
  $.ajax({
    url: 'http://autocomplete.wunderground.com/aq',
    dataType: "jsonp",
    jsonp: 'cb',
    async: false,
    data: { query: cityName }
  }).done(function(res) {
    data = res.RESULTS;
    console.log(res);
    displayResult();
  }).fail(function(res){
    console.log(res)
  });
}


function displayResult() {
  $('#search-results').removeClass('hidden'); 
  $('#display-temperature').addClass('hidden'); 

  var $searchResults = $('#search-results');
 

  $searchResults.html('');
  
  data.forEach(function(name) {
    var template = Handlebars.compile(resultTemplate);
    var html = template(name);
    $searchResults.append(html);
  });
}


function fetchTemperature($el) {
  var cityCode = $el.closest('a').data('city-link');
  console.log(cityCode)
  $.ajax({
    url: 'http://api.wunderground.com/api/c5a1cbb4793dd72f/conditions' + cityCode +'.json',
    dataType: "jsonp",

    async: false,
  }).done(function(res) {
    data = res.current_observation;
    console.log(data);
    displayTemperature(data);
  }).fail(function(res){
    console.log(res)
  });
}

function displayTemperature(data) {
  var temperature = data.temp_c;
  console.log(temperature);
  $("#display-temperature").html('');

  var html = "<h2 class='text-center'>Current Temperature</h2>" +
            "<h1 class='text-center'>" +
          temperature +
          " Celcius</h1>";
  $('#display-temperature').removeClass('hidden'); 
  $('#display-temperature').append(html); 
  $('#search-results').addClass('hidden'); 

}

$(document).ready(function() {
  $('#search-box').on('keyup', _.debounce(function(e) {
    var cityName = $(this).val();
    if(cityName.length < 3) return;

    fetchCities(cityName);
  }, 10));


  $('#search-results').on('click', function(e) {
    var $el = $(e.target);
    if( $el.data('city-link') ) {
      console.log('clicked');
      fetchTemperature($el);
    }
  });


});
