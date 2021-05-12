var keylist="58dd3214eabcdefghijklmnopqrstuvwxyz123456789dfdfsfdsfdsg45745";
var temp=''

let generate = function generatepass(plength){
    temp=''
    for (i=0;i<plength;i++)
        temp+=keylist.charAt(Math.floor(Math.random()*keylist.length))
    return temp
}

module.exports= generate;