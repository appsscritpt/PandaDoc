var access_token = 'ACCESS_TOKEN' 
function listDocuments(name) {

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
  return 'missed'
}
//'https://api.pandadoc.com/public/v1/templates?deleted=deleted&shared=false&q=q&tag=tag&count=count&page=page&folder_uuid=templates_folder_uuid' \
function listTemplates(name) {
  //name = "dssfdsdfsdfsdf"
 
  var updateOptions = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }                                   
  var response = UrlFetchApp.fetch("https://api.pandadoc.com/public/v1/templates", updateOptions)
  var responseJson = JSON.parse(response);
  for(var i = 0; i < responseJson.results.length;i++) {
       if(responseJson.results[i].name == name) {
            var card_id = responseJson.results[i].id
            return card_id
      }
  }
  return 'missed'
}
function updatePandaDocument(data,data1,products) {
  var docID = listDocuments(data[0])
  Logger.log('docId:' + docID)
  if (docID == 'missed' ) {
    return 'missed'
  }
  var payload = {};
  // BUILD VARIABLES TABLE
  payload.name = data[0]
  payload.tokens = []
  // VARIABLES IN DOCUMENT ARRAY
  var data2 = [['VARIABLE NAME',VARIABLE VALUE],
  ['VARIABLE NAME',VARIABLE VALUE] 
]
  for(var n = 0;n < data2.length;++n)
  {
    var token = {};
    if(data2[n][1])
    {
      token.name = data2[n][0]
      token.value = data2[n][1]
      payload.tokens.push(token)
    }
  }

  ////build pricing table array from products list
  payload.pricing_tables = [];
   var pt = {};
  pt.name = "PRICING TABLE NAME"; 
  pt.data_merge = true
  pt.options = {currency:"USD"};
  pt.sections = [];
  var section = {};
  section.title = "Products";
  section["default"] = true; 
  section.rows = [];
  // products is the same in your document
  var products = [[name1,qty1,price],[name3,qty,price],[name,qty,price]]
  for(var n=0;n < products.length;n++)
  {
    var row = {};
    row.data ={};
    if(products[n][0])
    {
      row.data.Name = products[n][0]; 
      //row.data.Description = products[n][1];
      row.data.QTY = products[n][1];
      row.data.Price = products[n][2];
      
      row.options = {}; // Options object is required
      section.rows.push(row);
    }
  }
  pt.sections.push(section);
  payload.pricing_tables.push(pt);
  var updateOptions = {
    'method': 'PATCH',
    'headers': {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    'payload': JSON.stringify(payload)
  };  
  try {                                  
  var response = UrlFetchApp.fetch("https://api.pandadoc.com/public/v1/documents/" + docID, updateOptions)
 
      
      var responseJson = JSON.parse(response)
      var docLink = "https://app.pandadoc.com/a/#/document/v1/editor/"+ responseJson.id
      
      return "updated"
  } catch(er) {
      Logger.log("on Error")
      return er.descripiton
  }
}
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function createPandaDocument(data,data1,products) {
  var payload = {};
  payload.name = data[0]
  payload.template_uuid = '<TEMPLATE ID>'  
  var recipient = {};
  recipient.email = data[1]  //email
  recipient.first_name = data[2]  //fname
  recipient.role = data[4] //Role
  payload.recipients = [];
  
  if ( recipient.email != "" ) 
  {
    payload.recipients.push(recipient);
  }
   var data2 = [
['Client.Address',data1[0]],['Recipient.FirstName',data1[1]],['Design.Fee',data1[2]],
['Todays.Date',Utilities.formatDate(new Date(),Session.getTimeZone(), "MM/dd/YYYY")]
]
  payload.tokens = []
  for(var n = 0;n < data2.length;++n)
  {
    var token = {}
    if(data2[n][1])
    {
      token.name = data2[n][0] 
      token.value = data2[n][1]
      payload.tokens.push(token)
    }
  }
 
  
  //build pricing table array from products list
  payload.pricing_tables = [];
   var pt = {};
  pt.name = "pricingtable1"; 
  pt.data_merge = true
  pt.options = {currency:"USD"};
  pt.sections = [];
  var section = {};
  section.title = "Products";
  section["default"] = true; 
  section.rows = [];
  // products are the same in your document
  var products = [[name,qty,price],[name,qty,price],[name,qty,price]]
  for(var n=0;n < products.length;n++)
  {
    var row = {};
    row.data ={};
    if(products[n][0])
    {
      row.data.Name = products[n][0]; 
      //row.data.Description = products[n][1];
      row.data.QTY = products[n][1];
      row.data.Price = products[n][2];
      
      row.options = {}; // Options object is required
      section.rows.push(row);
    }
  }
  pt.sections.push(section);
  payload.pricing_tables.push(pt);
  
    
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
      Logger.log(docLink)
      return 'created'
   } catch(er) {
     Logger.log(er)
      return er.descripiton
  }
}



