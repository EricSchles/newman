/**
 * Created by jlee on 9/25/15.
 */

/**
 * email-datatable related container
 */
var newman_datatable_email = (function () {

  var debug_enabled = false;
  var _current_email_doc_id = null;
  var _current_email_doc_datetime = null;

  var current_export = null;
  var data_column_key_index = 7;
  var data_column_export_index = 6;

  var _starred_html = '<i class="fa fa-star" style="font-size: smaller; color: #4888f3"></i>';
  var _non_starred_html = '';

  var _email_doc_id_starred_map = {};

  function isEmailDocumentStarred( doc_id ) {
    return _email_doc_id_starred_map[ doc_id ];
  }

  var data_table_ui;
  var data_table_rows;
  var data_row_is_read_map = {};

  function isEmailDocumentRead( doc_id ) {
    return data_row_is_read_map[ doc_id ];
  }


  function getStarredHTML() {
    return _starred_html;
  }

  function getNonStarredHTML() {
    return _non_starred_html;
  }

  function clearCurrentEmailDocument() {
    $("#email-body").empty();
    _current_email_doc_id = undefined;
    _current_email_doc_datetime = undefined;
  }

  function setCurrentEmailDocument(email_id, email_datetime) {
    console.log("setCurrentEmailDocument(" + email_id + ', ' + email_datetime + ")");
    _current_email_doc_id = email_id;
    _current_email_doc_datetime = email_datetime;
  }

  function getCurrentEmailDocument() {
    return _current_email_doc_id, _current_email_doc_datetime;
  }

  function recipientCount(to, cc, bcc) {
    return _.reduce(_.map([to, cc, bcc], splitItemCount), function (a, b) {
      return a + b;
    }, 0);
  }

  function splitAttachCount(str) {
    if (str.trim().length == 0) return 0
    return str.split(';').length;
  }

  function splitItemCount(str) {
    if (str.trim().length == 0) return 0
    return str.split(';').length;
  }


  function updateDataTableCell(row_index, column_index, value) {
    if (value) {
      var table = $('#result_table').DataTable();
      if (table) {
        console.log('updateDataTableCell[' + row_index + ', ' + column_index + '] value \'' + value + '\'');
        table.cell(row_index, column_index)
          .data(value);
      }

      //table.rows().invalidate().draw();
    }
  }

  function updateDataTableColumn(column_index, value_map) {
    if (value_map) {
      var table = $('#result_table').DataTable();
      if (table) {
        table
          .column(column_index)
          .data()
          .each(function (value, row_index) {

            if (column_index == data_column_export_index) {
              var key = table.cell(row_index, data_column_key_index).data();
              var target = value_map[key];
              if (target === true) {
                //console.log('updateDataTableColumn[' + row_index + ', ' + column_index + '] value \'' + value + '\' key \'' + key + '\' target \'' + target + '\'');
                table.cell(row_index, column_index).data(getStarredHTML());
              }
              else {
                table.cell(row_index, column_index).data(getNonStarredHTML());
              }
            }

          });

        //console.log('value_map: ' + JSON.stringify(value_map, null, 2));
      }
    }
  }

  function highlightDataTableRow(document_id) {
    console.log( 'highlightDataTableRow(' + document_id + ')' );
    if (document_id) {
      var table = $('#result_table').DataTable();
      if (table) {
        //var row_count_total = table.data().length;
        var row_count_per_page = table.page.len();
        var page_info = table.page.info();
        var current_page_index = page_info.page; // 0-indexed
        //console.log('\trow_count_total : ' + row_count_total + '; current_page_index : ' + current_page_index );

        table.rows()
          .every(function (index, tableLoop, rowLoop) {
            var row_data = this.data();
            var key = row_data[data_column_key_index];
            var jquery_row = $(this.node());
            //console.log( 'row_data: ' + JSON.stringify(row_data, null, 2) );

            if (key == document_id) {

              if (jquery_row.hasClass('datatable_highlight')) {
                //already highlighted
              }
              else {
                jquery_row.addClass('datatable_highlight');

                //must be on the relevant page
                var new_row_index = this.index();
                var row_position = this.table().rows()[0].indexOf( new_row_index );
                var new_page_index = Math.floor(row_position / row_count_per_page);
                console.log('\tnew_page_index at ' + new_page_index + '; [' + row_position + '/' + row_count_per_page + ']');

                //if (row_position >= page_info.start && row_position < page_info.end) {
                if (new_page_index == current_page_index) {
                  //already on the correct page
                }
                else {

                  table.page( new_page_index ).draw( false );
                }
              }
            }
            else {
              jquery_row.removeClass('datatable_highlight');
            }

          });

      }// end if (table)
    }
  }

  function _markDataTableRowAsRead(value_map) {
    if (value_map) {
      var table = $('#result_table').DataTable();
      if (table) {
        table
          .rows()
          .every(function (row_index, tableLoop, rowLoop) {
            var row_data = this.data();
            var jquery_row = $(this.node());
            //console.log( 'row_data: ' + JSON.stringify(row_data, null, 2) );

            var key = row_data[data_column_key_index];
            var value = value_map[key];

            if (value === true) {
              if (debug_enabled) {
                console.log('matched row: ' + key + ', ' + value);
              }

              jquery_row.addClass('data-table-row-read');
            }
            else {
              jquery_row.removeClass('data-table-row-read')
            }

          });

      }
    }
  }

  function setEmailDocumentRead(is_marked, id_list_selected) {

    if (id_list_selected) {
      if (debug_enabled) {
        console.log('setEmailDocumentRead(' + is_marked + ')');
        console.log('id_list_selected:' + JSON.stringify(id_list_selected, null, 2));
      }

      if (is_marked === true) {
        _.each(id_list_selected, function (value) {
          data_row_is_read_map[value] = true;
        });
      }
      else if (is_marked === false) {
        _.each(id_list_selected, function (value) {
          delete data_row_is_read_map[value];
        });
      }

      if (debug_enabled) {
        console.log('data_row_is_read_map: ' + JSON.stringify(data_row_is_read_map, null, 2));
      }
      _markDataTableRowAsRead(data_row_is_read_map);
    }
  }

  function getAllDataTableColumn(column_index) {
    var value_array = [];
    var table = $('#result_table').DataTable();
    if (table) {
      table
        .column(column_index)
        .data()
        .each(function (value, row_index) {

          value_array.push(value);

        });

      //console.log('value_array: ' + JSON.stringify(value_array, null, 2));
    }

    return value_array;
  }

  function populateDataTable(data_rows) {
    console.log('populateDataTable( ' + data_rows.length + ' )');
    //console.log( '\tdata_rows :\n' + JSON.stringify(data_rows, null, 2));
    initEvents();

    data_row_is_read_map = {};

    //mark starred(exportable) rows
    var starred_doc_list = newman_email_starred.getStarredDocumentList();
    if (starred_doc_list) {
      _.each(starred_doc_list, function(doc_id) {
        _email_doc_id_starred_map[ doc_id ] = true;
      });
    }

    data_table_rows = _.map(data_rows, function (row) {

      var recipient_count = recipientCount(row.to, row.cc, row.bcc);
      var attach_count = parseInt(row.attach);
      if (attach_count == 0) {
        attach_count = ''
      }

      var exportable_icon = _non_starred_html;
      var is_exportable = _email_doc_id_starred_map[ row.num ];
      if (is_exportable === true) {
        exportable_icon = _starred_html;
      }

      //var date_text = row.datetime.substring(0, 10);
      var date_text = row.datetime;
      return [date_text, row.from, recipient_count, row.bodysize, attach_count, row.subject, exportable_icon, row.num];

    });

    //console.log( '\tdata_table_rows: ' + JSON.stringify( data_table_rows, null, 2) );


    if (data_table_ui) {
      //data_table_ui.clear().draw();
      data_table_ui.destroy();
    }

    if (data_table_rows) {
      data_table_ui = $('#result_table').DataTable({
        destroy: true,
        "lengthMenu": [[22, 44, 88, -1], [22, 44, 88, "All"]],
        "autoWidth": true,
        /*fixedHeader: {
         header: true,
         footer: true
         },*/
        //rowId: 'ID',
        data: data_table_rows,
        columns: [
          {title: "Date", "width": "16%"},
          {title: "From", "width": "20%"},
          {
            title: "<i class=\"fa fa-inbox\" rel=\"tooltip\" data-placement=\"bottom\" title=\"Recipient(s)\"></i>",
            "width": "5%"
          },
          {title: "Size", "width": "6%"},
          {
            title: "<i class=\"fa fa-paperclip\" rel=\"tooltip\" data-placement=\"bottom\" title=\"Attachment(s)\"></i>",
            "width": "5%"
          },
          {title: "Subject", "width": "34%"},
          {
            title: "<i class=\"fa fa-star-o\" rel=\"tooltip\" data-placement=\"bottom\" title=\"Exportable(s)\"></i>",
            "width": "4%"
          },
          {title: "ID", "visible": false}
        ],
        //"order": [[ 0, "desc" ]] //by default, use the order of documents returned
        //bug in dataTables lib
        /*
         "columnDefs": [
         {
         "targets": data_row_key_index,
         "visible": false,
         "searchable": false
         }
         ]
         */
      });

      /*
       var column = data_table_ui.column( data_column_key_index );
       column.visible( false );
       */

      // initialize data-table event binding
      $('#result_table tbody').off().on('click', 'tr', function () {

        var column_index = parseInt($(this).index());
        var row_index = parseInt($(this).parent().index());
        console.log('result_table [' + row_index + ',' + column_index + '] selected');

        var row_selected = data_table_ui.row(this).data();
        console.log('data_table_row ID \'' + row_selected[data_column_key_index] + '\' selected');
        //console.log( 'data_table_row: ' + JSON.stringify(row_selected, null, 2));
        var row_data_key = row_selected[data_column_key_index];

        showEmailDocumentView(row_data_key);
        highlightDataTableRow(row_data_key);

        //var visible_cell_text_1 = $("td:eq(0)", this).text();
        //var visible_cell_text_4 = $("td:eq(3)", this).text();
      });

      /*
       $('#result_table tbody').delegate( 'tr', 'click', function () {

       var row_selected = data_table_ui.row( this ).data();
       console.log( 'data_table_row ID \'' + row_selected[0] + '\' selected' );
       //console.log( 'data_table_row: ' + JSON.stringify(row_selected, null, 2));

       //var visible_cell_text_1 = $("td:eq(0)", this).text();
       //var visible_cell_text_4 = $("td:eq(3)", this).text();
       } );
       */

    }

  }

  function showEmailDocumentView(email_id) {
    console.log('showEmailDocumentView( ' + email_id + ' )');
    newman_graph_email.clearAllNodeSelected();

    // make email-document-content-view visible and open
    bottom_panel.open();

/*
    //$('#tab-list li:eq(2) a').tab('show')
    $(document).scrollTop(0);
    $("#email-body").empty();
    $("#email-body").append($('<span>').text('Loading... ')).append(waiting_bar);

    //update exportable toggle button
    var is_exportable = _email_doc_id_starred_map[email_id];
    var export_toggle_button = $("#toggle_mark_for_export");
    if (is_exportable === true) {
      //already marked as starred, mark as un-starred
      if (export_toggle_button) {
        export_toggle_button.empty();
        export_toggle_button.removeClass('datatable_row_unmarked').addClass('datatable_row_marked');
        export_toggle_button.append('<span><i class=\"fa fa-star fa-lg\"></i></span>');
      }
    }
    else {
      if (export_toggle_button) {
        export_toggle_button.empty();
        export_toggle_button.removeClass('datatable_row_marked').addClass('datatable_row_unmarked');
        export_toggle_button.append('<span><i class=\"fa fa-star-o fa-lg\"></i></span>');
      }
    }

    //update read-unread toggle button
    var is_read = data_row_is_read_map[email_id];
    var read_toggle_button = $("#toggle_mark_as_read");
    if (is_read) {
      //already marked as read, mark as unread
      if (read_toggle_button) {
        read_toggle_button.empty();
        read_toggle_button.append('<span><i class=\"fa fa-check-square-o fa-lg\"></i> Unread</span>');
      }
    }
    else {
      if (read_toggle_button) {
        read_toggle_button.empty();
        read_toggle_button.append('<span><i class=\"fa fa-square-o fa-lg\"></i> Read</span>');
      }
    }

    //set translation button
    $('#translate_contents_email').addClass( 'clickable-disabled' );

    //set conversation button
    $('#query_conversation_email').addClass( 'clickable-disabled' );
*/


    var email_url = 'email/email/' + encodeURIComponent(email_id);
    email_url = newman_data_source.appendDataSource(email_url);

    // append query-string
    email_url = newman_search_filter.appendURLQuery(email_url);


    $.get(email_url).then(
      function (response) {
        setCurrentEmailDocument(email_id);

        // set target email-document-id
        newman_email_document_view.setDocumentID(email_id);

        // initialize email-document-view UI events
        newman_email_document_view.initUI( _email_doc_id_starred_map[email_id], data_row_is_read_map[email_id] );

        // parse email-document-service response
        newman_email_document_view.setDocumentRequestResponse( response );

      });
  }


  function setEmailDocumentStarred(is_marked, email_doc_id_list) {
    if (debug_enabled) {
      console.log('setEmailDocumentStarred(' + is_marked + ', email_doc_id_list[' + email_doc_id_list.length + '])');
    }

    if (email_doc_id_list && email_doc_id_list.length > 0) {
      //console.log('is_marked ' + is_marked + ' id_set: ' + JSON.stringify(email_doc_id_list, null, 2));

      _.each(email_doc_id_list, function (doc_id) {
        if (is_marked === true) {
          _email_doc_id_starred_map[doc_id] = true;
        }
        else if (is_marked === false) {
          _email_doc_id_starred_map[doc_id] = false;
        }
      });

      if (debug_enabled) {
        console.log('_email_doc_id_starred_map: ' + JSON.stringify(_email_doc_id_starred_map, null, 2));
      }

      updateDataTableColumn(data_column_export_index, _email_doc_id_starred_map);
    }

  }


  function setStarredEmailDocumentList(starred_doc_list) {

    if (starred_doc_list && starred_doc_list.length > 0) {
      console.log('setStarredEmailDocumentList(starred_doc_list[' + starred_doc_list.length + '])');

      _.each(starred_doc_list, function (doc_id) {
        _email_doc_id_starred_map[doc_id] = true;
      });

      //console.log('value_map: ' + JSON.stringify(value_map, null, 2));
      updateDataTableColumn(data_column_export_index, _email_doc_id_starred_map);
    }
  }


  /*
   function add_view_to_export(){

   var email_id_array = getAllDataTableColumn( data_column_key_index );

   $.ajax({
   url: 'email/exportmany',
   type: "POST",
   data: JSON.stringify({'emails': email_id_array, 'exportable': true}),
   contentType:"application/json; charset=utf-8",
   dataType:"json"
   })
   .done(function(response){
   setEmailDocumentStarred( true );

   //console.log('email/exportmany response: ' + JSON.stringify( response, null, 2));
   })
   .fail(function(response){
   alert('fail');
   console.log("fail");
   });
   }

   function remove_view_from_export(){

   var email_id_array = getAllDataTableColumn( data_column_key_index );

   $.ajax({
   url: 'email/exportmany',
   type: "POST",
   data: JSON.stringify({'emails': email_id_array, 'exportable': false}),
   contentType:"application/json; charset=utf-8",
   dataType:"json"
   })
   .done(function(response){
   setEmailDocumentStarred( false );

   //console.log('email/exportmany response: ' + JSON.stringify( response, null, 2));
   })
   .fail(function(response){
   alert('fail');
   console.log("fail");
   });
   }
   */

  function initEvents() {

    $('#email_view_all_starred').off().click(function () {
      console.log("clicked #email_view_all_starred");

      var email_id = _current_email_doc_id;

      // query email documents
      if (email_id) {
        newman_email_starred_request_all.requestService(newman_graph_email, email_id);
      }
      else {
        newman_email_starred_request_all.requestService(newman_graph_email);
      }

      // display email-tab
      newman_graph_email.displayUITab();

    });

  }


  return {
    'initEvents' : initEvents,
    'setStarredEmailDocumentList' : setStarredEmailDocumentList,
    'isEmailDocumentStarred' : isEmailDocumentStarred,
    'setEmailDocumentStarred' : setEmailDocumentStarred,
    'isEmailDocumentRead' : isEmailDocumentRead,
    'setEmailDocumentRead' : setEmailDocumentRead,
    'showEmailDocumentView' : showEmailDocumentView,
    'highlightDataTableRow' : highlightDataTableRow,
    'setCurrentEmailDocument' : setCurrentEmailDocument,
    'getCurrentEmailDocument' : getCurrentEmailDocument,
    'clearCurrentEmailDocument' : clearCurrentEmailDocument,
    'populateDataTable' : populateDataTable,
    'updateDataTableColumn' : updateDataTableColumn
  }
}());

