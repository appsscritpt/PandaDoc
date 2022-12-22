function listDocuments(name) {
  var access_token = 'YOUR_ACCESS_TOKEN'  
  var updateOptions = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }                                   
  var response = UrlFetchApp.fetch("https://api.pandadoc.com/public/v1/documents", updateOptions)
  var responseJson = JSON.parse(response);
  for(var i = 0; i < responseJson.results.length;i++) {
       if(responseJson.results[i].name == name) {
            var card_id = responseJson.results[i].id
            return card_id
      }
  }
}

function updatePandaDocument(data,data1) {
  var docID = listDocuments(data[0])
  var payload = {};
  payload.name = data[0]
  payload.tokens = []
  for(var n = 0;n < data1.length;++n)
  {
    var token = {};
    if(data1[n][1])
    {
      token.name = data1[n][0]
      token.value = data1[n][1]
      payload.tokens.push(token)
    }
  }
  var access_token = 'YOUR_ACCESS_TOKEN'   
  var updateOptions = {
    'method': 'PATCH',
    'headers': {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    'payload': JSON.stringify(payload)
  };                                   
  var response = UrlFetchApp.fetch("https://api.pandadoc.com/public/v1/documents/" + docID, updateOptions)
  try {
      var responseJson = JSON.parse(response)
      var docLink = "https://app.pandadoc.com/a/#/document/v1/editor/"+ responseJson.id
      return "OK"
  } catch(er) {
      return err.descripiton
  }
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function createPandaDocument(data,data1) {
  var payload = {};
  payload.name = data[0]
  payload.template_uuid = 'YOUR_TEMPLATE_ID'
  var recipient = {};
  recipient.email = data[1]  //email
  recipient.first_name = data[2]  //fname
  recipient.role = data[4] //Role
  payload.recipients = [];
  
  if ( recipient.email != "" ) 
  {
    payload.recipients.push(recipient);
  }
  payload.tokens = []
  for(var n = 0;n < data1.length;++n)
  {
    var token = {}
    if(data1[n][1])
    {
      token.name = data1[n][0] 
      token.value = data1[n][1]
      payload.tokens.push(token)
    }
  }
  
  
  //build pricing table array from products list
  payload.pricing_tables = [];
   var pt = {};
  pt.name = "PricingTable1"; 
  pt.options = {currency:"USD"};
  pt.sections = [];
  var section = {};
  section.title = "Sample Section";
  section["default"] = true; 
  section.rows = [];
  var products = []
  for(var n=1;n < products.length;++n)
  {
    var row = {};
    row.data ={};
    if(products[n][0])
    {
      row.data.name = products[n][0]; 
      row.data.descripiton = products[n][1];
      row.data.price = products[n][2];
      row.data.qty = products[n][3];
      row.options = {}; // Options object is required
      section.rows.push(row);
    }
  }
  pt.sections.push(section);
  payload.pricing_tables.push(pt);
  
  var access_token = 'YOUR_ACCESS_TOKEN'   
  var createOptions = {
    'method': 'post',
    'headers': {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    'payload': JSON.stringify(payload)
  };
  try {                                    
      var response = UrlFetchApp.fetch( "https://api.pandadoc.com/public/v1/documents", createOptions);
      var responseJson = JSON.parse(response);
      var docLink = "https://app.pandadoc.com/a/#/document/v1/editor/"+ responseJson.id
      return docLink
   } catch(er) {
      return err.descripiton
  }
}


