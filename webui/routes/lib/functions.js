//globals

  var path = require('path');   
  var config_path=path.join(__dirname,'../../config/config.json');
  var config=require(config_path);


this.readStatus = function()
{
  var res;
  var fs=require('fs');
  res = fs.readFileSync(config.strStatusFile, 'utf8');
  if (res.match("TOR"))
    return "TOR";
  if (res.match("PRIVOXY"))
    return "PRIVOXY";
  if (res.match("DIRECT"))
    return "DIRECT";
  
  return "ERROR";
}

this.switchMode = function(modeNew)
{
   
   var execSync = require('child_process').execSync;
   script = execSync(config.strWrapper+" "+config.strCommand+" "+modeNew.toLowerCase());
   console.log("Called switchMode with parameter: ",modeNew);
   return script
   
  
}

this.changePassword = function(oldPass,newPass,confirmPass)
{
   path = require('path');   
   var pathToPass =path.join(__dirname,'../../config/user.json');
   var user=require(pathToPass);
   if (oldPass!=user.password)
   {
      throw "Wrong password!";
   }
   
   if (!isAscii(newPass))
   {
      throw "Password should contain only ASCII symbols"
   }

   if (newPass!=confirmPass)
   {
      throw "Passwords do not match!";
   }
   
   user.password=newPass;
   var fs = require('fs');
   var toFile = JSON.stringify(user);
   console.log(user);
   fs.truncateSync(pathToPass,0);
   fs.writeFileSync(pathToPass,toFile,"UTF-8",{'flags': 'w+'});    
    
}

this.reboot = function()
{
   
   var execSync = require('child_process').execSync;
   var reboot = execSync(config.strWrapper+" "+config.strReboot);
   console.log("Called reboot...");
     
}

this.shutdown = function()
{
   
   var execSync = require('child_process').execSync;
   var shutdown = execSync(config.strWrapper+" "+config.strShutdown);
   console.log("Called shutdown...");
     
}

this.sysInfo = function()
{

  var os = require('os');
  var ifaces = os.networkInterfaces();
  var interfaces=[];
  
 //collecting interfaces
 Object.keys(ifaces).forEach(function (ifname) {
  

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
      var single_interface = 
      {
       name:ifname,
       address:iface.address,
       netmask:iface.netmask,
       mac:iface.mac,
      }
      interfaces.push(single_interface);  
   });
 });


 var temperature = "Not supported ";
  if (doesExist(config.strTemperature))
  {
       var execSync = require('child_process').execSync;
       temperature = execSync(config.strWrapper+" "+config.strTemperature); 
  }
 
  
 var system_info = {
   
 network : interfaces,
 ram : os.freemem()/1024,
 systemLoad : os.loadavg(),
 hostName : os.hostname(),
 platform : os.platform(),
 arch : os.arch(),
 release: os.release(),
 cpuCount : os.cpus().length,
 cpuTemp : temperature
  
 };
 
 
 return system_info;

}

function isAscii(text)
{
  var ascii=/^[ -~\t\n\r]+$/;
  
  if(ascii.test(text))
    return true;
  
  return false;
}

function doesExist(path) {
  var fs=require('fs');
  try {
    fs.statSync(path)
    return true
  } catch(err) {
    return !(err && err.code === 'ENOENT');
  }
}

this.i2pAction = function(i2p)
{

   var execSync = require('child_process').execSync;
   script = execSync(config.strWrapper+" "+config.strI2PCtl+" "+i2p.toLowerCase());
   return "Command successfully passed to system";

}
    
