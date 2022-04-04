const urlModel = require("../models/url")
const  { nanoid } = require('nanoid')

const isvalid = function(value) {
    if (typeof value == undefined || typeof value == null) { return false }
    if (typeof value == 'string' && value.trim().length == 0) { return false }
    return true

}
const re = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

const posturl = async function (req, res) {


    try {
        if(Object.keys(req.body).length==0){
            return res.status(400).send({Status:false , msg:"Provide input"})}
        
            let longUrl = req.body.url
        if (! isvalid(longUrl) ) {
            return res.status(400).send({ Status: false, ERROR: "Please provide a url field and enter url" })
        }
        if(! re.test(longUrl)){return res.status(400).send({Status:false , msg:"Please provide a valid url"})}

    urlCode= nanoid()
        console.log(urlCode)

        shortUrl = 'localhost:3000/' + urlCode
        data = {longUrl:longUrl , shortUrl:shortUrl, urlCode:urlCode}

        let urlData = await urlModel.create(data)
        return res.status(201).send({Status:true , msg:urlData})

        





    } catch (err) {
        return res.status(500).send({ Status: false, ERROR: err.message })
    }



}



const redUrl = async function(req,res){
    try{
        let urlCode = req.params.urlCode
        let correctUrlcode = await urlModel.findOne({urlCode:urlCode})
        if(!correctUrlcode){
            return res.status(404).send({Status:true, msg:"URL not found. Please enter correct url code"})}

            return res.status(302).redirect(correctUrlcode.longUrl)





    }catch(err){

        return res.status(500).send({Status:false, ERROR:err.message})
    }

}

module.exports.posturl=posturl
module.exports.redUrl=redUrl