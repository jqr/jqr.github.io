var JSONSearch = function(options) {

  this.default_options = {
    fields: {},
    ranks: {},
    limit: null,
    offset: 0,
    case_sensitive: false
  };

  this.patterns = {
    infix: '.*$token.*',
    prefix: '^$token.*',
    exact: '^$token$',
    word: '\\b$token\\b',
    word_prefix: '\\b$token.*'
  };

  this.query_string = '';
  this.query_function = "1&&function(object) { var hits = 0, ranks_array = []; #{query_string} if (hits > 0) { return [(ranks_array.sort()[ranks_array.length - 1] || 0), hits, object]; } }";

  this.initialize(options);
};

JSONSearch.InstanceMethods = {
  initialize: function(options) {
    this.options = {};
    for(var property in this.default_options) {
      this.options[property] = this.default_options[property]
    };
    for(var property in options) {
      this.options[property] = options[property];
    }
    this.setAttributes(options);
    this.buildMatcherTemplates();
    this.buildQueryString();
  },

  setAttributes: function() {
    var args = ['fields', 'limit', 'offset', 'case_sensitive'];
    for(var i = 0; i < args.length; i++) {
      this[args[i]] = this.options[args[i]];
    };
    this.ranks = this.getRanks();
    this.fields_ordered_by_rank = this.fieldsOrderedByRank();
  },

  buildMatcherTemplates: function() {
    for(var property in this.patterns) {
      this[property + '_matcher'] = 'if(/' + this.patterns[property] + '/#{regex_options}.test(object["#{name}"])){hits++;ranks_array.push(ranks["#{name}"]);}';
    };
  },

  getRanks: function(object) {
    var ranks = {};
    for(var property in this.fields) {
      ranks[property] = (this.options.ranks && this.options.ranks[property] || 0);
    };
    return ranks;
  },

  // TODO if ranks are all 0 might just use the format order if supplied
  fieldsOrderedByRank: function() {
    var fields_ordered_by_rank = [];
    for(var property in this.ranks){
      fields_ordered_by_rank.push([this.ranks['property'], property]);
    };
    fields_ordered_by_rank = fields_ordered_by_rank.sort().reverse();
    for(var i = 0; i < fields_ordered_by_rank.length; i++) {
      fields_ordered_by_rank[i] = fields_ordered_by_rank[i][1];
    }
    return fields_ordered_by_rank;
  },

  buildQueryString: function() {
    var query_string_array = [], field;
    for(var i = 0; i < this.fields_ordered_by_rank.length; i++) {
      field = this.fields_ordered_by_rank[i];
      query_string_array.push(this.buildMatcher(field, this.fields[field]));
    }
    this.query_string = query_string_array.join('');
  },

  buildMatcher: function(name, pattern) {
    return this.subMatcher(this[pattern + '_matcher'], { name: name, regex_options: this.getRegexOptions() });
  },

  subMatcher: function(matcher, object) {
    var subbed_matcher = matcher;
    for(var property in object) {
      subbed_matcher = subbed_matcher.replace('#{' + property + '}', object[property], 'g')
    }
    return subbed_matcher;
  },

  subQueryString: function(token) {
    return this.query_string.replace(/\$token/g, this.regexEscape(token));
  },

  subQueryFunction: function(object) {
    var subbed_query_function;
    for(var property in object) {
      subbed_query_function = this.query_function.replace('#{' + property + '}', object[property], 'g')
    }
    return subbed_query_function;
  },

  //TODO add an options object to pass limit/offset.
  getResults: function(token, object) {
    object = this.evalJSON(object);
    if (!(object instanceof Array)) {
      object = [object];
    }
    var results, subbed_query_string = this.subQueryString(token);
    results = this.getFilteredResults(subbed_query_string, object);
    results = this.sortResults(results);
    results = this.limitResults(results);
    return this.cleanResults(results);
  },

  getFilteredResults: function(query_string, array) {
    var results = [], ranks = this.ranks, result, len = (array.length), query_string = (query_string || '');
    var query_function = eval(this.subQueryFunction({ query_string: query_string }));

    for(var i = 0; i < len; ++i) {
      if(result = query_function(array[i])) {
        results.push(result);
      }
    }
    return results;
  },

  sortResults: function(results) {
    return results.sort().reverse();
  },

  limitResults: function(results) {
    if (this.limit) {
      return results.slice(this.offset, (this.limit + this.offset));
    } else if (this.offset > 0) {
      return results.slice(this.offset, (results.length));
    } else {
      return results;
    }
  },

  cleanResults: function(results) {
    var clean_results = []; len = (results.length);
    for(var i = 0; i < len; ++i) {
      clean_results.push(results[i][2]);
    }
    return clean_results;
  },

  evalJSON: function(json) {
    if (typeof json == 'string') {
      try {
        json = eval('(' + json + ')');
      } catch(e) {
        throw new SyntaxError('Badly formed JSON string');
      }
    }
    return json;
  },

  getRegex: function(token, pattern) {
    return new RegExp(this.patterns[pattern].replace(/\$token/, this.regexEscape(token)), this.getRegexOptions());
  },

  getRegexOptions: function() {
    return (this.case_sensitive && '' || 'i');
  },

  regexEscape: function(string) {
    return String(string).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }
}

for(var property in JSONSearch.InstanceMethods) {
  JSONSearch.prototype[property] = JSONSearch.InstanceMethods[property]
}
delete JSONSearch.InstanceMethods;
