module.exports=function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={exports:{},id:n,loaded:!1};return e[n].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){var n=r(15);e.exports=n.fromExpress(r(2))},function(e,t){e.exports=require("q")},function(e,t,r){function n(e,t){var r=e.webtaskContext,n=["AUTH0_DOMAIN","AUTH0_CLIENT_ID","AUTH0_CLIENT_SECRET","MAILCHIMP_API_KEY","MAILCHIMP_LIST_NAME","AUTH0_CONNECTION_NAME"],o=n.filter(function(e){return!r.data[e]});if(o.length)return t.status(400).send({message:"Missing settings: "+o.join(", ")});var s={TENANT_DOMAIN:e.webtaskContext.data.AUTH0_DOMAIN,USER_SEARCH_MGMT_TOKEN:e.access_token,MAILCHIMP_API_KEY:r.data.MAILCHIMP_API_KEY,MAILCHIMP_LIST_NAME:r.data.MAILCHIMP_LIST_NAME,AUTH0_CONNECTION_NAME:r.data.AUTH0_CONNECTION_NAME};i(s,function(e){return e?t.sendStatus(500).send("Error - please see logs for details"):t.status(200).send("All done!")})}function i(e,t){c(e).then(function(){return t()},function(e){return t(e)})}var o=r(9),s=o(),a=r(10),u=r(14),c=r(7),l=r(3),p=a({load:function(e,t,r,n,i){u.post(e).send({audience:t,grant_type:"client_credentials",client_id:r,client_secret:n}).type("application/json").end(function(e,t){e||!t.ok?i(null,e):i(t.body.access_token)})},hash:function(e){return e},max:100,maxAge:36e5});s.use(function(e,t,r){if("/meta"===e.path)return r();var n="https://"+e.webtaskContext.data.AUTH0_DOMAIN+"/oauth/token",i="https://"+e.webtaskContext.data.AUTH0_DOMAIN+"/api/v2/",o=e.webtaskContext.data.AUTH0_CLIENT_ID,s=e.webtaskContext.data.AUTH0_CLIENT_SECRET;p(n,i,o,s,function(t,n){return n?(console.error("Error getting access_token",n),r(n)):(e.access_token=t,void r())})}),s.get("/",n),s.post("/",n),s.get("/meta",function(e,t){t.status(200).send(l)}),e.exports=s},function(e,t){e.exports={codeUrl:"https://github.com/auth0/auth0-mailchimp-export",title:"Auth0 MailChimp Export",name:"auth0-mailchimp-export",version:"1.0.0",author:"auth0",description:"Allows Auth0 Customers to synchronize their Auth0 User base (those that have an email) with a MailChimp List",type:"cron",repository:"https://github.com/auth0/auth0-mailchimp-export",keywords:["auth0","mailchimp","user profile"],schedule:"0 */5 * * * *",secrets:{AUTH0_DOMAIN:{description:"This is the Auth0 Domain",required:!0},AUTH0_CLIENT_ID:{description:"This is the Client ID",required:!0},AUTH0_CLIENT_SECRET:{description:"This is the Client Secret",required:!0},MAILCHIMP_API_KEY:{description:"This is the MailChimp API Key associated with your MailChimp user account. eg. f1b0602xy124d85d8444a5d4e5eed-us14",required:!0},MAILCHIMP_LIST_NAME:{description:"This is the name of the MailChimp List you wish to export Auth0 User Profiles to. eg. Auth0-DBConn1",required:!0},AUTH0_CONNECTION_NAME:{description:"This is the Auth0 Connection name associated with the user profiles you wish to export",required:!0}}}},function(e,t,r){"use strict";var n=r(13),i=r(12),o=r(1),s=function(e,t,r,a){var u=e.TENANT_DOMAIN,c=e.USER_SEARCH_MGMT_TOKEN,l=e.AUTH0_CONNECTION_NAME,p=o.defer(),h={q:'identities.connection:"'+l+'"',search_engine:"v2",per_page:r,page:a},_={method:"GET",url:"https://"+u+"/api/v2/users",qs:h,headers:{"cache-control":"no-cache",authorization:"Bearer "+c}};return n(_,function(n,o,u){if(n)return p.reject(new Error(n));var c=JSON.parse(u);return c.length>0?(t=i.concat(t,c),p.resolve(s(e,t,r,a+1))):p.resolve(t)}),p.promise},a=function(e){return function(t){s(e,[],20,0).then(function(e){var r=e.length;return console.log("Total number of Auth0 users: "+r),t(null,e)},function(e){console.error("ERROR: "+e),t(e)})}};e.exports=a},function(e,t){"use strict";var r=function(e,t){var r=e.MAILCHIMP_LIST_NAME;return function(e,n){t.lists_list({filters:{list_name:r}},function(t,r){if(t)return console.error(t),n(t);var i=r.data[0],o=i.id;console.log("MailChimp list id: "+o);var s=i.name;return console.log("MailChimp list name: "+s),n(null,{mailChimpList:i,auth0Users:e})})}};e.exports=r},function(e,t){"use strict";var r=function(e,t){return function(e,r){var n=e.mailChimpList.id,i=e.auth0Users;t.lists_batch_subscribe({id:n,batch:i.map(function(e){var t=e.given_name||"",r=e.family_name||"";return e.user_metadata&&(t=e.user_metadata.firstName,r=e.user_metadata.lastName),{email:{email:e.email},email_type:"text",merge_vars:{FNAME:t,LNAME:r}}}),double_optin:!1,update_existing:!0,replace_interests:!0},function(t,n){return t?(console.error(t),r(t)):(console.log("Batch List update completed successfully"),r(null,e))})}};e.exports=r},function(e,t,r){"use strict";var n=r(11).MailChimpAPI,i=r(8),o=r(1),s=function(e){var t=e.MAILCHIMP_API_KEY;try{var s=new n(t,{version:"2.0"})}catch(e){return console.log(e.message)}var a=r(4)(e),u=r(5)(e,s),c=r(6)(e,s),l=o.defer();return i.waterfall([a,u,c],function(e){return e?(console.error(e),l.reject(new Error(e))):l.resolve()}),l.promise};e.exports=s},function(e,t){e.exports=require("async")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("lru-memoizer")},function(e,t){e.exports=require("mailchimp")},function(e,t){e.exports=require("ramda")},function(e,t){e.exports=require("request")},function(e,t){e.exports=require("superagent")},function(e,t){e.exports=require("webtask-tools")}]);