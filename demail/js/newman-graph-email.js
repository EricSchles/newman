/**
 * Created by jlee on 1/4/16.
 */

/**
 * email-graph related container
 */
var newman_graph_email = (function () {

  var graph_ui_id = '#graph_email';

  var _top_count, _top_count_max = 2500;

  var _all_source_node = {};
  var _all_source_node_selected = {};
  var _all_target_node = {};
  var _all_target_node_selected = {};


  /**
   * request and display the top attachment-file-type-related charts
   * @param count
   */
  function displayUIGraphEmail( count ) {



      _top_count = count;
      if (!_top_count || _top_count < 0 || _top_count > _top_count_max) {
        _top_count = _top_count_max;
      }



  }

  /**
   * update from service the top email-entities-related charts
   * @param response
   */
  function updateUIGraphEmail( response ) {

    if (response) {
      initUI();




    }
  }

  function initUI() {

    if (graph_ui_id) {
      $(graph_ui_id).empty();
    }


  }

  function revalidateUIGraphEmail() {


  }

  function getTopCount() {
    _top_count;
  }

  function appendAllSourceNodeSelected(url_path) {

    if (url_path) {
      if (url_path.endsWith('/')) {
        url_path = url_path.substring(0, url_path.length - 1);
      }

      var node_set_as_string = '';
      var keys = _.keys(_all_source_node_selected);
      if (keys) {
        _.each(keys, function(key) {
          node_set_as_string += key + ' ';
        });
      }

      if(node_set_as_string) {
        node_set_as_string = encodeURIComponent( node_set_as_string.trim().replace(' ', ',') );
        var key = 'sender'
        if (url_path.indexOf('?') > 0) {
          url_path += '&' + key + '=' + node_set_as_string;
        }
        else {
          url_path += '?' + key + '=' + node_set_as_string;
        }
      }


    }

    return url_path;
  }

  function appendAllTargetNodeSelected(url_path) {

    if (url_path) {
      if (url_path.endsWith('/')) {
        url_path = url_path.substring(0, url_path.length - 1);
      }

      var node_set_as_string = '';
      var keys = _.keys(_all_target_node_selected);
      if (keys) {
        _.each(keys, function(key) {
          node_set_as_string += key + ' ';
        });
      }

      if(node_set_as_string) {
        node_set_as_string = encodeURIComponent( node_set_as_string.trim().replace(' ', ',') );
        var key = 'recipient'
        if (url_path.indexOf('?') > 0) {
          url_path += '&' + key + '=' + node_set_as_string;
        }
        else {
          url_path += '?' + key + '=' + node_set_as_string;
        }
      }


    }

    return url_path;
  }

  function _addSourceNodeSelected(key, value) {
    if (key && value) {
      //key = encodeURIComponent(key);

      var object = {"key": key, "value": value}

      _all_source_node_selected[key] = object;
    }
  }

  function _removeSourceNodeSelected(key) {
    if (key) {
      delete _all_source_node_selected[key];
    }
  }

  function _addTargetNodeSelected(key, value) {
    if (key && value) {
      //key = encodeURIComponent(key);

      var object = {"key": key, "value": value}

      _all_target_node_selected[key] = object;
    }
  }

  function _removeTargetNodeSelected(key) {
    if (key) {
      delete _all_target_node_selected[key];
    }
  }

  function _removeNode(key) {
    if (key) {
      delete _all_source_node[key];
      delete _all_source_node_selected[key];
      delete _all_target_node[key];
      delete _all_target_node_selected[key];
    }
  }

  function setNodeSelected(key, role, value, is_selected, refresh_ui) {
    if (role) {
      if (key && role && value) {

        if (role == 'source') {
          if (is_selected) {
            _addSourceNodeSelected(key, value);
          }
          else {
            _removeSourceNodeSelected(key)
          }
        }

        if (role == 'target') {
          if (is_selected) {
            _addTargetNodeSelected(key, value);
          }
          else {
            _removeTargetNodeSelected(key)
          }
        }

        console.log('all-selected-source-node :\n' + JSON.stringify(_all_source_node_selected, null, 2));
        console.log('all-selected-target-node :\n' + JSON.stringify(_all_target_node_selected, null, 2));

        if (refresh_ui) {
          //trigger refresh

        }
      }
    }
  }

  function sizeOfAllSourceNodeSelected() {
    var size = _.size( _all_source_node_selected );
    return size;
  }

  function getAllSourceNodeSelected() {
    var keys = _.keys( _all_source_node_selected );
    return keys;
  }

  function getAllSourceNodeSelectedAsString() {
    var node_set_as_string = '';
    var keys = getAllSourceNodeSelected();
    if (keys) {
      _.each(keys, function(key) {
        node_set_as_string += key + ' ';
      });
    }

    node_set_as_string = node_set_as_string.trim().replace(' ', ',');

    return node_set_as_string;
  }

  function sizeOfAllTargetNodeSelected() {
    var size = _.size( _all_target_node_selected );
    return size;
  }

  function getAllTargetNodeSelected() {
    var keys = _.keys( _all_target_node_selected );
    return keys;
  }

  function getAllTargetNodeSelectedAsString() {
    var node_set_as_string = '';
    var keys = getAllTargetNodeSelected();
    if (keys) {
      _.each(keys, function(key) {
        node_set_as_string += key + ' ';
      });
    }

    node_set_as_string = node_set_as_string.trim().replace(' ', ',');

    return node_set_as_string;
  }

  function clearAllSourceNodeSelected() {
    _all_source_node_selected = {};
  }

  function clearAllTargetNodeSelected() {
    _all_target_node_selected = {};
  }

  function clearAllNodeSelected() {
    clearAllSourceNodeSelected();
    clearAllTargetNodeSelected();

    $('#query_prev_email').addClass( 'clickable-disabled' );
    $('#query_next_email').addClass( 'clickable-disabled' );
  }

  function onGraphClicked(key, value) {
    console.log( 'onGraphClicked( ' + key + ', ' + value + ' )' );



  }


  return {
    'initUI' : initUI,
    'displayUIGraphEmail' : displayUIGraphEmail,
    'updateUIGraphEmail' : updateUIGraphEmail,
    'revalidateUIGraphEmail' : revalidateUIGraphEmail,
    'getTopCount' : getTopCount,
    'setGraphSelected' : setNodeSelected,
    'onGraphClicked' : onGraphClicked,
    'clearAllSourceNodeSelected' : clearAllSourceNodeSelected,
    'clearAllTargetNodeSelected' : clearAllTargetNodeSelected,
    'clearAllNodeSelected' : clearAllNodeSelected,
    'sizeOfAllSourceNodeSelected' : sizeOfAllSourceNodeSelected,
    'getAllSourceNodeSelected' : getAllSourceNodeSelected,
    'getAllSourceNodeSelectedAsString' : getAllSourceNodeSelectedAsString,
    'appendAllSourceNodeSelected' : appendAllSourceNodeSelected,
    'sizeOfAllTargetNodeSelected' : sizeOfAllTargetNodeSelected,
    'getAllTargetNodeSelected' : getAllTargetNodeSelected,
    'getAllTargetNodeSelectedAsString' : getAllTargetNodeSelectedAsString,
    'appendAllTargetNodeSelected' : appendAllTargetNodeSelected
  }

}());



/**
 * service response container email-documents-search-by-address-set
 * @type {{requestService, getResponse}}
 */
var newman_service_email_by_address_set = (function () {

  //var _service_url = 'search/search/email';
  var _service_url = 'search/search_email_by_address_set';
  var _response;

  function getServiceURLBase() {
    return _service_url;
  }

  function getServiceURL(order, current_datetime) {
    var start_datetime_override = undefined;
    var end_datetime_override = undefined;

    if (!order) {
      order = 'next';
    }

    if (order == 'prev') {
      end_datetime_override = current_datetime;
    }
    else if (order == 'next') {
      start_datetime_override = current_datetime;
    }

    var service_url = newman_data_source.appendDataSource(_service_url);
    service_url = newman_datetime_range.appendDatetimeRange(service_url, start_datetime_override, end_datetime_override);
    service_url = newman_graph_email.appendAllSourceNodeSelected(service_url);
    service_url = newman_graph_email.appendAllTargetNodeSelected(service_url);

    if (service_url.indexOf('?') > 0) {
      service_url += '&order=' + order;
    }
    else {
      service_url += '?order=' + order;
    }

    // add to history
    var address_set_as_string = newman_graph_email.getAllSourceNodeSelectedAsString() + ' ' + newman_graph_email.getAllTargetNodeSelectedAsString();
    address_set_as_string = address_set_as_string.trim().replace(' ', ',');
    if (address_set_as_string.length > 30) {
      address_set_as_string = address_set_as_string.substring(0, 30);
    }
    address_set_as_string = decodeURIComponent(address_set_as_string);
    updateHistory(service_url, 'email', address_set_as_string);

    return service_url;
  }

  function requestService(order, datetime_selected) {

    console.log('newman_service_email_by_address_set.requestService()');
    var service_url = getServiceURL(order, datetime_selected);
    $.get( service_url ).then(function (response) {
      setResponse( response );
      updateUISocialGraph( response );
    });
  }

  function setResponse( response ) {
    if (response) {

      _response = response;
      //console.log('\tfiltered_response: ' + JSON.stringify(_response, null, 2));
    }
  }

  function getResponse() {
    return _response;
  }

  function updateHistory(url_path, field, label) {

    var id = decodeURIComponent(url_path).replace(/\s/g, '_').replace(/\\/g, '_').replace(/\//g, '_').replace(',', '_');

    history_nav.push(id,
      label,
      '',
      url_path,
      field);

    history_nav.refreshUI();
  }

  function updateUISocialGraph(search_response) {

    //validate search-response
    var filtered_response = validateResponseSearch( search_response );

    email_analytics_content.open();
    bottom_panel.unhide();

    // initialize to blank
    updateUIInboundCount();
    updateUIOutboundCount();

    $('#document_count').text(filtered_response.rows.length);

    // clear existing content if any
    clear_content_view_email();

    // populate data-table
    populateDataTable( filtered_response.rows )

    if (bottom_panel.isOpen()){
      //resize bottom_panel
      bottom_panel.close();

    }

    // render graph display
    drawGraph( filtered_response.graph );

  }


  return {
    'getServiceURLBase' : getServiceURLBase,
    'getServiceURL' : getServiceURL,
    'requestService' : requestService,
    'getResponse' : getResponse,
    'setResponse' : setResponse
  }

}());