global.isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}
global.toArray = function (enu) {
  var arr = [];

  for (var i = 0, l = enu.length; i < l; i++)
  arr.push(enu[i]);

  return arr;
};

exports.number_format = function(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
};

exports.chunk = function(arrayChunk, chunkSize) {
  return [].concat.apply([],
    arrayChunk.map(function(elem,i) {
      return i%chunkSize ? [] : [arrayChunk.slice(i,i+chunkSize)];
    })
  );
}
exports.naturalSort = function(a, b, keyname, insensitive) {
  if( keyname ) {
    a = a[keyname];
    b = b[keyname];
  }
  var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
      sre = /(^[ ]*|[ ]*$)/g,
      dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
      hre = /^0x[0-9a-f]+$/i,
      ore = /^0/,
      i = function(s) { return insensitive && (''+s).toLowerCase() || ''+s },
      // convert all to strings strip whitespace
      x = i(a).replace(sre, '') || '',
      y = i(b).replace(sre, '') || '',
      // chunk/tokenize
      xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
      yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
      // numeric, hex or date detection
      xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
      yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
      oFxNcL, oFyNcL;
  // first try and sort Hex codes or Dates
  if (yD)
      if ( xD < yD ) return -1;
      else if ( xD > yD ) return 1;
  // natural sorting through split numeric strings and default strings
  for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
      // find floats not starting with '0', string or 0 if not defined (Clint Priest)
      oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
      oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
      // handle numeric vs string comparison - number < string - (Kyle Adams)
      if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
      // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
      else if (typeof oFxNcL !== typeof oFyNcL) {
          oFxNcL += '';
          oFyNcL += '';
      }
      if (oFxNcL < oFyNcL) return -1;
      if (oFxNcL > oFyNcL) return 1;
  }
  return 0;
}

// Utils
exports.scope = function( target, func ) {
  return function(){
    return func.apply( target, arguments ); 
  }
}
exports.chr = function(codePt) {
  if( codePt > 0xFFFF ) { 
    codePt -= 0x10000;
    return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
  }
  return String.fromCharCode(codePt);
}
exports.pad = pad = function( input, pad_length ) {
  return str_pad(input, pad_length, '0', 'STR_PAD_LEFT')
}
exports.str_pad = str_pad = function(input, pad_length, pad_string, pad_type) {
  var half = '',
    pad_to_go;

  var str_pad_repeater = function (s, len) {
    var collect = '',
      i;

    while (collect.length < len) {
      collect += s;
    }
    collect = collect.substr(0, len);

    return collect;
  };

  input += '';
  pad_string = pad_string !== undefined ? pad_string : ' ';

  if (pad_type != 'STR_PAD_LEFT' && pad_type != 'STR_PAD_RIGHT' && pad_type != 'STR_PAD_BOTH') {
    pad_type = 'STR_PAD_RIGHT';
  }
  if ((pad_to_go = pad_length - input.length) > 0) {
    if (pad_type == 'STR_PAD_LEFT') {
      input = str_pad_repeater(pad_string, pad_to_go) + input;
    } else if (pad_type == 'STR_PAD_RIGHT') {
      input = input + str_pad_repeater(pad_string, pad_to_go);
    } else if (pad_type == 'STR_PAD_BOTH') {
      half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
      input = half + input + half;
      input = input.substr(0, pad_length);
    }
  }

  return input;
}