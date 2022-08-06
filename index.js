const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const {google} = require('googleapis');
const app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
const port = process.env.PORT? process.env.PORT: 3040;
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets'
});

app.get('/lista',async(req,res)=>{

  const client = await auth.getClient();
  const googleSheets = google.sheets({version:'v4',auth:client});
  const spreadsheetId = process.env.SHEET_ID
  const range = 'Hoja 1'
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  });
  const filas = crearData(getRows.data.values);
  console.log(filas);
  res.render('lista',{data:filas});
}); 

app.post('/',async(req,res)=>{
  const {paciente,lugarAtencion, sacerdote, fecha} = req.body;
  const client = await auth.getClient();
  const googleSheets = google.sheets({version:'v4',auth:client});
  const spreadsheetId = process.env.SHEET_ID
  const range = 'Hoja 1'
  const response = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [paciente,lugarAtencion,sacerdote,fecha]
      ]
    }
  })
  if(response){
    res.redirect('/lista');
  }
});

app.get('/',async(req,res)=>{
  res.render('index');
});
app.listen(port,()=>{
  console.log('running on port ' + port)
});

function crearData(data){
  const llaves = data[0]
  data.shift();
  const previewData= data 
  console.log(llaves);
  console.log(previewData);
  return previewData

}