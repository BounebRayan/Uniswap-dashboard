"use strict";(()=>{var e={};e.id=99,e.ids=[99],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},661:e=>{e.exports=require("sqlite3")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},8019:(e,t,r)=>{r.r(t),r.d(t,{config:()=>E,default:()=>c,routeModule:()=>S});var s={};r.r(s),r.d(s,{default:()=>l});var o=r(1802),a=r(7153),n=r(6249),i=r(661),u=r.n(i);async function l(e,t){if("GET"!==e.method)return t.status(405).json({message:"Method Not Allowed"});let r=e.query.version?e.query.version:"4",s=new(u()).Database("repositories"+r+".db");try{let e=e=>new Promise((t,r)=>{s.all(e,(e,s)=>{e?r(e):t(s)})}),r=`
      SELECT 
        contributor as name,
        count(*) as value
      FROM contributions group by contributor
      ORDER BY count(*) Desc
      LIMIT 3
    `,o=await e(r),a=`
      SELECT 
        fullname as name, 
        stars as value
      FROM repositories 
      ORDER BY stars DESC 
      LIMIT 3
    `,n=await e(a),i=`
      SELECT 
        COUNT(*) AS total_repositories,
        SUM(contributors) AS total_contributors,
        SUM(stars) AS total_stars,
        SUM(watchers) AS total_watchers,
        SUM(issues) AS total_issues,
        Sum(closed_issues) as total_closed_issues,
        SUM(pulls) AS total_pulls,
        SUM(forks) As total_forks,
        SUM(merges) AS total_merges,
        SUM(CASE WHEN owner_type = 'User' THEN 1 ELSE 0 END) AS total_user_repos,
        SUM(CASE WHEN owner_type = 'Organization' THEN 1 ELSE 0 END) AS total_org_repos
      FROM repositories
    `,u=await e(i);t.status(200).json({top_contributors:o,top_starred_repos:n,stats:u})}catch(e){console.error("Error fetching metrics:",e),t.status(500).json({message:"Internal Server Error"})}finally{await s.close()}}let c=(0,n.l)(s,"default"),E=(0,n.l)(s,"config"),S=new o.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/metrics",pathname:"/api/metrics",bundlePath:"",filename:""},userland:s})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=8019);module.exports=r})();