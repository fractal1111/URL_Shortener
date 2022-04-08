const urlModel = require("../models/url")
const  { nanoid } = require('nanoid')
const redis = require('redis')
const { promisify } = require("util");
const { join } = require("path");

const isvalid = function(value) {
    if (typeof value == undefined || typeof value == null) { return false }
    if (typeof value == 'string' && value.trim().length == 0) { return false }
    return true

}
const re = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/





  
  
  
  //1. connect to the server
  //Connect to REDIS
const redisClient = redis.createClient(
    19886,
    "redis-19886.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("xapicwbmBH08woWLXobvn77txbrF6WUm", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });
  
 
  //2. use the commands :
  
  //Connection setup for redis
  
  const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
  const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
  









const posturl = async function (req, res) {


    try {
        if(Object.keys(req.body).length==0){
            return res.status(400).send({Status:false , msg:"Provide input"})}
        
            let longUrl = req.body.url

            
           
        if (! isvalid(longUrl) ) {
            return res.status(400).send({ Status: false, ERROR: "Please provide a url field and enter url" })
        }
        if(! re.test(longUrl)){return res.status(400).send({Status:false , msg:"Please provide a valid url"})}
        let redirectionUrl = longUrl.trim()


        let cachedUrlData = await GET_ASYNC(redirectionUrl)
        console.log(cachedUrlData)
        if(cachedUrlData){return res.status(200).send({Status:true , Data: JSON.parse(cachedUrlData)})}
        // let dupliUrl = await urlModel.findOne({longUrl:longUrl})
        // if(dupliUrl){return res.status(200).send({Status:true , msg:dupliUrl})}
   
        let urlCode = nanoid(5) //unique
        let short = urlCode.toLowerCase()
        

        shortUrl = 'localhost:3000/' + urlCode.toLowerCase()
        data = {longUrl:redirectionUrl , shortUrl:shortUrl, urlCode:short}

        let urlData = await urlModel.create(data)
       
        
        await SET_ASYNC(short,redirectionUrl) 
        
        await SET_ASYNC(redirectionUrl,JSON.stringify(urlData),"EX",30)  //to set expiry of cache
       
       

        return res.status(201).send({Status:true , msg:urlData})

        





    } catch (err) {
        return res.status(500).send({ Status: false, ERROR: err.message })
    }



}



const redUrl = async function(req,res){
    try{
        let urlCode = req.params.urlCode.toLowerCase().trim()
     
        let cahcedLongUrl = await GET_ASYNC(urlCode)
        console.log(cahcedLongUrl)
        if(cahcedLongUrl){return res.status(302).redirect(cahcedLongUrl)}
       
       
       
       
        console.log({urlCode:urlCode})
        let correctUrlcode = await urlModel.findOne({urlCode:urlCode})
        console.log(correctUrlcode)
     
        if(!correctUrlcode){
            return res.status(404).send({Status:false, msg:"URL not found. Please enter correct url code"})}

            return res.status(302).redirect( correctUrlcode.longUrl )





    }catch(err){

        return res.status(500).send({Status:false, ERROR:err.message})
    }

}

module.exports.posturl=posturl
module.exports.redUrl=redUrl