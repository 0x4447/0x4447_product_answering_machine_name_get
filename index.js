let AWS = require('aws-sdk');

//
//  Create the DynamoDB object
//
let ddb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION
});

//
//  This function will get the name of the person calling.
//
exports.handler = (event) => {

    return new Promise(function(resolve, reject) {

        //
        //  1.  Get the Phone number that called us.
        //
        let phone_nr = event.Details.ContactData.CustomerEndpoint.Address;

        //
        //  2.  Prepare the query.
        //
        let params = {
            TableName: "0x4447_connect_sessions",
            Key: {
                id: phone_nr,
                type: 'basic'
            }
        };

        //
        //  3.  Execute the query.
        //
        ddb.get(params, function(error, data) {

            //
            //  1.  Check if there were any errors.
            //
            if(error)
            {
                console.info(params);
                return reject(error);
            }

            //
            //  2.  This variable will be holding the user name if we get
            //      one.
            //
            let name = null;

            //
            //  3.  Check if there was an order by converting the object in to
            //      an array and checking its length.
            //
            if(data.Item)
            {
                if(data.Item.name)
                {
                    //
                    //  1.  Save the name.
                    //
                    name = data.Item.name;
                }
            }

            //
            //  4.  We create a variable that will tell Connect flow if we got a
            //      name or not and by default we assume that we did not found a
            //      a name.
            //
            let did_we_get_a_name = false;

            //
            //  5.  Check if we got a name from the DB, and set the variable from
            //      above to true.
            //
            if(name)
            {
                did_we_get_a_name = true;
            }

            //
            //  6.  Prepare the object that needs to be returned to Connect
            //      so the flow knows what to do.
            //
            let result = {
                first_name: name,
                got_name: did_we_get_a_name,
                Phone_Nr: phone_nr,
                Caller_Type:'Client'
            };

            //
            //  ->  Tell Lambda that we are done working.
            //
            return resolve(result);

        });
    });
};