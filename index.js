const express=require("express");

const bodyparser=require("body-parser");

const mongo=require("mongodb").MongoClient;

const url="mongodb+srv://aswin1310:rohitaswin@cluster0.jtzhd.mongodb.net/API_DB?retryWrites=true&w=majority";

const port=3000;

var mydb;

var app=express();

var router=express.Router();

app.use("/AOB",router);

router.use(bodyparser.urlencoded({extended:false}));

router.use(bodyparser.json());

mongo.connect(url,function(err,db){

if (err) throw err;

console.log("MongoDB Connceted");

mydb=db.db("API_DB");

});



app.get("/AOB",function(req,res){

	res.send("homepage");

});



router.get("/login",function(req,res){

res.send("welcome to Banking...!!");

});



router.get("/ViewTransaction",function(req,res){

var Account_Number=parseInt(req.query['acnumber']);

	var query={Transaction_Account_Number:Account_Number}

mydb.collection("Transaction").find(query,{projection:{_id:0}}).toArray(function(err,data)

{

	if(err) throw err;

	if(data=="")

	{

		res.send("NO Transaction History...")

	}

	else

	{

	res.json(data);

	}

});

});



router.put("/deposit/:accountnumber",function(req,res){

		var Account_Number=parseInt(req.params.accountnumber);

		var query={Account_Number:Account_Number}


		mydb.collection("AOB").findOne(query,{projection:{_id:0,Name:0,Mobile_Number:0,Password:0,Status:0}},function(err,data){

				if(data==null)
		
		{
		
			res.send("Account Not Found...");
		
		}
		
		else
		
		{
		
		var Amount=data.Amount
		
		var depositing_amount=req.body.amount;
	 	
	 	var getquery={Account_Number:Account_Number};
		
		var updatequery={$set:{Amount:Amount+depositing_amount}};
	 	
	 	mydb.collection("AOB").updateOne(getquery,updatequery,function(err,data){
	 	
	 	if(err) throw err;
	 	
	 	console.log("Amount Deposited");
	 	
	 	});
	 	
	 	var transQuery={Transaction_Account_Number:Account_Number,Amount:depositing_amount,Status:"CREDIT"};
	 	
	 	mydb.collection("Transaction").insertOne(transQuery,function(err){
	 	
	 	if(err) throw err;
	 	
	 	console.log("Transaction Added");
	 
	 	});

	 	
	 	 res.send("Amount Deposited");
	 
	 }
	
});


});

router.put("/withdraw/:accountnumber",function(req,res){

		var Account_Number=parseInt(req.params.accountnumber);

		var query={Account_Number:Account_Number}



		mydb.collection("AOB").findOne(query,{projection:{_id:0,Name:0,Account_Number:0,Mobile_Number:0,Password:0,Status:0}},function(err,data){
		
		if(data==null)
	
		{
			
			res.send("Account not found...");
		}
		else
		{

		var Amount=data.Amount;
		
		var withdraw_amount=req.body.amount;
	 	
	 	var getquery={Account_Number:Account_Number};
	 	
	 	var updatequery={$set:{Amount:Amount-withdraw_amount}};
	 	
	 	mydb.collection("AOB").updateOne(getquery,updatequery,function(err,data){
	 	
	 	if(err) throw err;
	 	
	 	console.log("Amount Withdrawed");
	 	
	 	var transQuery={Transaction_Account_Number:Account_Number,Amount:withdraw_amount,Status:"DEBIT"};
	 	
	 	mydb.collection("Transaction").insertOne(transQuery,function(err){
	 	
	 	if(err) throw err;
	 	
	 	console.log("Transaction Added");
	 });

	 });
	}
});
res.send("amount withdrawed");
});

router.get("/viewbalance/:accountnumber",function(req,res){
		var Account_Number=parseInt(req.params.accountnumber);
		
		var query={Account_Number:Account_Number}
		
		mydb.collection("AOB").findOne(query,{projection:{_id:0,Name:0,Mobile_Number:0,Password:0}},function(err,data){
		
			if(data==null)
			{
				res.send("Acoount Not Found...");
			}
			else
			{
		console.log("Account_Number:"+data.Account_Number);
		
		console.log("Balance:"+data.Amount);
		
		console.log("Status:"+data.Status);
		
		res.send("Account_Number:"+data.Account_Number+"<br>Balance:"+data.Amount+"<br>Status:"+data.Status);
	}
});

});



app.listen(port,function(){console.log("Server Is Running....!!!!");});
