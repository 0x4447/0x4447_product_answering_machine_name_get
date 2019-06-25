let AWS = require('aws-sdk');

//
//	Create the DynamoDB object
//
let dynamodb = new AWS.DynamoDB({
	apiVersion: '2012-08-10',
	region: 'us-east-1'
});

//
//  This function will get the name of the person calling
//
exports.handler = (event, context, callback) => {

    //
    //  1.  Get the Phone number that called us
    //
    let phone_nr = event.Details.ContactData.CustomerEndpoint.Address;

	//
	//	2.	Prepare the query
	//
	let params = {
		Key: {
			"phone_nr": {
				S: phone_nr
			}
		},
		TableName: "0x4447_connect_sessions"
	};

	//
	//	3.	Execute the query
	//
	dynamodb.getItem(params, function(error, data) {

		//
		//	1.	Check if there were any errors
		//
		if(error)
		{
			console.log(error);
		}

		//
		//	2.	This variable will be holding the user name if we get
		//		one
		//
		let name = null;

		//
		//	3.	Check if there was an order by converting the object in to
		//		an array and checking its length
		//
		if(Object.keys(data).length)
		{
			if(data.Item.name)
			{
				//
				//	1.	Save the name
				//
				name = data.Item.name.S;
			}
		}

		//
		//	4.	We create a varible that will tell Connect flow if we got a
		//		name or not and by default we asume that we did not found a
		//		a name
		//
		let did_we_get_a_name = false;

		//
		//	5.	Check if we got a name from the DB, and set the variable from
		//		above to true.
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
        //  ->  Tell Lmabda that we are done working
        //
        callback(null, result);

	});
};

+16122559972