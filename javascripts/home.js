document.observe("dom:loaded", function() {
  var search_field = $('search');
  var search_label = $$('#search_area label').first();
  var clear_search = $$('#search_area img').first();
  var tweets = $('tweets');
  var body = $$('body').first();
  var json_search = new JSONSearch({
    fields: {
      title: 'infix',
      summary: 'word_prefix',
      content: 'word_prefix'
    },
    ranks: {
      title: 3,
      summary: 2,
      content: 1
    }
  });
  
  var search = function(e) {
    if (e && e.keyCode == 27) {
      clear();
    }
    var query = search_field.value;
    var results;
    if (query.blank()) {
      results = posts;
    } else {
      results = json_search.getResults(query, posts);
    }

    if (!query.blank()) {
      body.addClassName('searching');
      search_label.hide();
    } else {
      body.removeClassName('searching');
    }
    $('result_count').update('(' + results.length + ')');
    
    $('search_results').update(results.collect(function(post) {
      return('<li><a href="' + post.url + '">' + post.title + '</a><p>' + post.summary + '</p></li>');
    }).join(''));
  };
  
  if (search_field.value.blank()) {
    search_label.show();
  }

  search_field.observe('keyup', search);
  
  search_field.observe('focus', function(e) {
    search_label.hide();
  });

  search_field.observe('blur', function(e) {
    if (search_field.value.blank()) {
      search_label.show();
    }
  });

  var clear = function() {
    search_field.value = '';
    search_label.show();
    search();
    search_field.blur();
  }
  clear_search.observe('click', clear);
  search();
});
$('search_area').show();
