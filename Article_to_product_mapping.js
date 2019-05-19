const axios = require("axios");
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
//const req = require('request');

// Create a connection to database
const config =
{
    userName: 'username', //update me
    password: 'password', //update me
    server: 'server', //update me
    options:
    {
        database: 'database', //update me
        encrypt: true
    }
}
const connection = new Connection(config);

// attempt to connect and execute queries if connection goes through
connection.on('connect', function(err)
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            queryDatabase()
        }
    }
);

function queryDatabase()
{
    console.log('Reading rows from the Table...');

    // Read all rows from table
    const request = new Request(
        "select top 100 ORDER_ID from ikeadp.IDSS_RIX_TEST where ORDER_ID<>'' and SALE_DT='2018-11-28T00:00:00' and GA_CTY_CODE='FR' ",
        function(err, rowCount, rows)
        {
            console.log(rowCount + 'row(s) returned');
            process.exit();
        }
    );
    
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
            getOrder(column.value);
        });
    });
    connection.execSql(request);
}

function getOrder(orderId) 
{
    const url = "API" + orderId;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log(url);

    const getData = async url => {
        try {
            const response = await axios.get(url, {headers: {'Accept': 'application/hal+json',
            'X-User-Id': 'user id', //update me
            'X-IBM-Client-Id': 'client-id', //update me
            'X-IBM-Client-Secret': 'client-secret', //update me
            'Accept-Language': 'language'}}) //update me
                .then(res => console.log(JSON.stringify(res.data)));
            const data = res.data;
            console.log(data);
            console.log(url);
        } catch (error) {
            console.log(error);
        }
    }
    getData(url);
};

