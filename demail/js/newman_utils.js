/**
 * returns true if the element is visible or false otherwise
 * @param element-id
 * @returns true if the element (referenced by id) is visible
 */
function isElementVisible(element_id) {
  var element = document.getElementById( element_id );
  if (element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }
  return false;
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * apply offset value to a coordinate value
 * @param geo-value
 * @returns geo-value with offset added
 */
function applyGeoOffset( geo_value ) {
  var new_geo_value;
  if (geo_value) {
    //var offset = (Math.random() -.5) / 750; // ~ 50-meter
    var offset = (Math.random() -.5) / 1500; // ~ 100-meter
    //var offset = (Math.random() -.5) / 3000; // ~ 200-meter
    //var offset = (Math.random() -.5) / 6000; // ~ 400-meter
    new_geo_value = parseFloat(geo_value) + offset;
  }
  return new_geo_value;
}

/**
 * return a deep-copy of the argument
 * @param file-extension
 * @returns file-type category of 'image', 'pdf', 'powerpoint', 'word', 'excel', or 'other'
 */
function getDocTypeByExt( extension ) {
  var contains = (function(ext, file_ext_list) {
    return _.any(file_ext_list, function(file_ext) {
      return ext.localeCompare(file_ext) === 0;
    });
  });

  if (extension) {
    //img
    if (contains(extension, ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'png'])) {
      return "image";
    }

    //pdf
    if (contains(extension, ['pdf'])) {
      return "pdf";
    }

    //ppt
    if (contains(extension, ['ppt', 'pptx'])) {
      return "powerpoint";
    }

    //word
    if (contains(extension, ['doc', 'docx'])) {
      return "word";
    }

    //excel
    if (contains(extension, ['xls', 'xlx', 'xlsx'])) {
      return "excel";
    }

    return "other";
  }
  return "other";
}

/**
 * check for whitespace
 * @param text
 * @returns true if the argument contains any whitespace, false otherwise
 */
function containsWhitespace(text) {
  if(text) {
    var regex = /\s/g;
    return regex.test(text);
  }
  return false;
}

/**
 * remove all empty space from text
 * @param text
 * @returns text string without any empty space
 */
function removeAllWhitespace(text) {
  if(text) {
    text = text.replace(/\s/g, "").trim();
  }
  return text;
}

/**
 * sort predicate based on property in descending order
 */
function descendingPredicatByProperty(property){
  return function (a, b) {

    if (a[property] > b[property]) {
      return -1;
    }

    if (a[property] < b[property]) {
      return 1;
    }

    return 0;
  }
}

/**
 * sort predicate based on property in ascending order
 */
function ascendingPredicatByProperty(property){
  return function (a, b) {

    if (a[property] > b[property]) {
      return 1;
    }

    if (a[property] < b[property]) {
      return -1;
    }

    return 0;
  }
}

/**
 * sort predicate based on index in descending order
 */
function descendingPredicatByIndex(index){
  return function(a, b) {

    if( a[index] > b[index]){
      return -1;
    }

    if( a[index] < b[index] ){
      return 1;
    }

    return 0;
  }
}

/**
 * sort predicate based on index in ascending order
 */
function ascendingPredicatByIndex(index){
  return function(a, b) {

    if( a[index] > b[index]){
      return -1;
    }

    if( a[index] < b[index] ){
      return 1;
    }

    return 0;
  }
}

/**
 * sort predicate based on value in descending order
 */
function descendingPredicatByValue(){
  return function(a, b) {
    return b - a;
  }
}

/**
 * sort predicate based on value in ascending order
 */
function ascendingPredicatByValue(){
  return function(a, b) {
    return a - b;
  }
}

/**
 *
 * @param from, floor int value
 * @param to, ceiling int value
 * @returns {number}
 */
function generateRandomInt( from, to ) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

/**
 * return a deep-copy of the argument
 * @param source to be cloned
 * @returns deep-copy
 */
function clone( source ) {
  if (source) {
    var copy;
    if (jQuery.isArray(source)) {
      copy = jQuery.extend(true, [], source);
    }
    else {
      copy = jQuery.extend(true, {}, source);
    }
    return copy;
  }
  return source;
}

/**
 * return a parameter-value from a valid url
 * @param a valid url
 * @param a parameter key
 * @returns parameter value
 */
function getURLParameter( url, parameter_key ) {
  //console.log('getURLParameter(' + url + ', ' + parameter_key + ')');
  var parameter_value;
  if (url && parameter_key) {
    var url_parameter_list = url.split('&');
    for (var i = 0; i < url_parameter_list.length; i++) {
      var parameter_name_list = url_parameter_list[i].split('=');
      var key = parameter_name_list[0];
      var value = parameter_name_list[1];
      //console.log('\tkey: ' + key + ' value: ' + value );
      if (key.endsWith( parameter_key )) {
        parameter_value = value;
      }
    }
  }
  return parameter_value;
}

/**
 * return a path-value from a valid url
 * @param a valid url
 * @param a path index
 * @returns path value
 */
function getURLPathByIndex( url, index ) {
  if (url && index >= 0) {
    var url_path = getURLPathName(url);
    if (url_path) {
      url_path = trimURLPath( url_path );

      var path_list = url_path.split('/');
      return path_list[index];
    }
  }
}

function trimURLPath( url_path ) {
  if (url_path.startsWith('/')) {
    url_path = url_path.substring(1);
  }

  if (url_path.endsWith('/')) {
    url_path = url_path.substring(0, url_path.length - 1);
  }

  return url_path;
}

function getURLParser( url ) {
  var anchor = document.createElement("a");
  anchor.href = url;
  return anchor;
}

function getURLPathName( url ) {
  var link = getURLParser( url );
  return link.pathname;
}

function getURLHost( url ) {
  var link = getURLObject( url );
  return link.host;
}

function newDateTimeInstance(datetime_as_string) {
  var _datetime;
  if (datetime_as_string) {
    //console.log('newDateTimeInstance(' + datetime_as_string + ')');
    var _datetime_string_array = datetime_as_string.split('-');
    _datetime= new Date(_datetime_string_array[0], (parseInt(_datetime_string_array[1]) - 1), _datetime_string_array[2], 0, 0, 0, 0);
  }
  else {
    _datetime= new Date();
  }
  //console.log('\tdatetime-object ' + _datetime.toISOString() + '');
  return _datetime;
}

function tokenize( text ) {
  var tokens = [];
  if (text) {
    var separators = [';', ','];
    var token_array = text.split(new RegExp(separators.join('|'), 'g'));
    _.each(token_array, function(element) {
      if (element) {
        tokens.push(element.trim())
      }
    });
  }
  return tokens;
}

function extractEmailAddress( text ) {
  var address = '';
  if (text && text.indexOf('@') >= 0) {
    if (text.indexOf('<') >= 0) {
      var matches = text.match(/\<(.*?)\>/);
      if (matches) {
        if (validateEmailAddress(matches[1])) {
          address = matches[1];
        }
        else {
          console.log('email matched invalid ' + matches[1] );
        }
      }
    }
    else if (text.indexOf('(') >= 0) {
      var matches = text.match(/\((.*?)\)/);
      if (matches) {
        if (validateEmailAddress(matches[1])) {
          address = matches[1];
        }
        else {
          console.log('email matched invalid ' + matches[1] );
        }
      }
    }
    else {
      address = text;
    }
  }
  return address;
}


