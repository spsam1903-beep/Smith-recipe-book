/*
 * Unofficial read-only Wegmans product lookup, scoped to DeWitt (#30), Fayetteville NY.
 * Search uses Algolia's browser-exposed search-only credential (no account/login).
 * The endpoint and schema are not official public integration contracts and may change.
 * No account information, Shoppers Club tokens or private keys are used.
 * Shopping prices are for selected retail packages, not recipe-portion costs.
*/
(() => {
"use strict";
const STORE={number:"30",name:"DeWitt",street:"6789 E Genesee St, Fayetteville, NY 13066"};
const ALGOLIA="https://qgppr19v8v-dsn.algolia.net/1/indexes/*/queries";
const APP_ID="QGPPR19V8V";
const SEARCH_ONLY_KEY="9a10b1401634e9a6e55161c3a60c200d";
const SHOP_URL="https://www.wegmans.com/stores/dewitt-ny";
const $=id=>document.getElementById(id);
const grocery=()=>window.groceryUtils;
const matches=new Map();
const responseCache=new Map();
const $status=$("wg-status");
let running=false,callCount=0;
function showStatus(s){$status.textContent=s;}
function create(tag,parent,cls,txt){
 const node=document.createElement(tag);if(cls)node.className=cls;
 if(txt!==undefined)node.textContent=txt;if(parent)parent.appendChild(node);return node;
}
function currency(amount){return "$"+amount.toFixed(2);}
function asNumber(value){
 if(value===null||value===undefined||value==="")return null;
 const n=typeof value==="number"?value:Number(value);
 return Number.isFinite(n)&&n>=0&&n<=100000?n:null;
}
function getPrice(hit){
 const fields=[
  hit.price_inStore?.amount,hit.priceInStore?.amount,
  hit.pricing?.price_inStore?.amount,hit.pricing?.inStore?.amount
 ];
 for(const val of fields){const price=asNumber(val);if(price!==null)return price;}
 return null;
}
function getAisle(hit){
 const place=Array.isArray(hit.planogram)?hit.planogram[0]:hit.planogram;
 if(!place||typeof place!=="object")return "";
 const aisle=String(place.aisle??"").trim();
 const section=String(place.section??"").trim();
 return (aisle&&section&&section!==aisle)?aisle+" · "+section:aisle||section;
}
function product(hit){
 const id=hit.skuId??hit.productID??hit.productId??hit.objectID;
 if(!id)return null;
 return {
  id:String(id),name:String(hit.productName||hit.webProductDescription||hit.name||"Unnamed product"),
  brand:String(hit.consumerBrandName||""),packSize:String(hit.packSize||hit.size||""),
  aisle:getAisle(hit),price:getPrice(hit),storeNumber:STORE.number
 };
}
function queryOf(item){
 const parsed=grocery()?.parsed(item.text);
 let query=parsed?.name||item.text;
 query=query.split(",")[0].replace(/\([^)]*\)/g," ").replace(/\b(?:finely|freshly|diced|minced|shredded|melted|reserved|neutral)\b/gi," ")
  .replace(/\b(?:medium|small|large)\b/gi," ").replace(/\s+/g," ").trim();
 return query.slice(0,110);
}
function normalize(s){return String(s).toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();}
function quality(query,name){
 const q=normalize(query).split(" ").filter(x=>x.length>1), n=normalize(name).split(" ").filter(x=>x.length>1);
 if(!q.length||!n.length)return 0;
 const shared=q.filter(w=>n.includes(w)).length;
 return shared/q.length-(n.length>q.length?(n.length-q.length)*.035:0);
}
function uniqueHighConfidence(query,results){
 // Auto-accept only an exact product-name match that clearly outranks alternatives.
 // Most grocery queries have many brands/sizes and REQUIRE user confirmation.
 if(!results.length)return null;
 const q=normalize(query),ordered=results.map(x=>({...x,score:quality(query,x.name)})).sort((a,b)=>b.score-a.score);
 const leader=ordered[0];
 if(normalize(leader.name)===q&&leader.score>=.95&&
    (ordered.length===1||leader.score-ordered[1].score>=.2))return leader;
 return null;
}
async function search(query){
 const cacheKey=query.toLowerCase().trim();
 const cached=responseCache.get(cacheKey);
 if(cached&&Date.now()-cached.time<600000)return cached.results;
 if(!query)return [];
 if(typeof fetch!=="function")throw Error("This browser cannot request online catalog data.");
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),13000);
 try{
  const reply=await fetch(ALGOLIA,{
   method:"POST",headers:{
     "content-type":"application/json",
     "x-algolia-application-id":APP_ID,
     "x-algolia-api-key":SEARCH_ONLY_KEY
   },body:JSON.stringify({requests:[{
     indexName:"products",query,hitsPerPage:8,attributesToHighlight:[],
     filters:"storeNumber:30 AND fulfilmentType:instore AND excludeFromWeb:false AND isSoldAtStore:true"
   }]}),signal:controller.signal
  });
  if(!reply.ok)throw Error("Wegmans search returned "+reply.status);
  const data=await reply.json();
  if(!Array.isArray(data.results?.[0]?.hits))throw Error("Wegmans search returned an unexpected format.");
  const seen=new Set();
  const results=data.results[0].hits.map(product).filter(p=>{
   if(!p||seen.has(p.id))return false;seen.add(p.id);return true;
  });
  responseCache.set(cacheKey,{time:Date.now(),results});
  return results;
 }catch(err){
  if(err.name==="AbortError")throw Error("Wegmans lookup timed out.");
  throw err;
 }finally{clearTimeout(timeout);}
}
function saveAndRender(){grocery()?.save();grocery()?.refresh();updateSubtotal();}
function apply(item,p){
 const previous=item.wegmans;
 const isNew=previous?.id!==p.id;
 item.wegmans={id:p.id,name:p.name,packSize:p.packSize,
  aisle:p.aisle,price:p.price,checkedAt:new Date().toISOString(),storeNumber:STORE.number};
 if(p.aisle)item.aisle=p.aisle;
 if(p.price!==null && (isNew||item.priceSource!=="manual")){
  item.price=p.price;item.priceSource="wegmans";
 }
 saveAndRender();
 showStatus("Matched "+item.text+" with "+p.name+". "
   +(p.price===null?"Price unavailable.":"Pack price: "+currency(p.price)+". ")
   +(p.aisle?"Aisle: "+p.aisle+".":"Aisle unavailable."));
}
function choose(item,found){
 const dialog=$("wg-choose"),content=$("wg-choose-content");
 content.replaceChildren();
 create("h3",content,"","Choose a DeWitt Wegmans product");
 create("p",content,"wg-muted","Shopping list item: "+item.text+
  ". Confirm the correct brand and package; prices are for one selected package.");
 if(!found.length){
  create("p",content,"wg-muted","No matching products appeared in DeWitt's search catalog. Use Wegmans' website or enter the aisle/price yourself.");
 }else{
  const list=create("div",content,"wg-choices");
  for(const p of found){
   const row=create("div",list,"wg-choice");
   const desc=create("div",row,"wg-choice-copy");
   create("strong",desc,"",p.name);
   create("div",desc,"wg-muted",(p.brand?p.brand+" · ":"")+(p.packSize||"Package size not provided"));
   create("div",desc,"wg-small",
    (p.price===null?"Price not available":currency(p.price)+" per package")+
    " · "+(p.aisle?"Aisle "+p.aisle:"Aisle not available"));
   const button=create("button",row,"action","Use this");
   button.type="button";
   button.onclick=()=>{apply(item,p);dialog.close();};
  }
 }
 dialog.showModal();
}
async function lookup(item,opts={}){
 if(item.wegmans?.id && opts.refresh){
  const options=await search(item.wegmans.name||queryOf(item));
  const existing=options.find(x=>x.id===item.wegmans.id);
  if(existing){apply(item,existing);return "updated";}
  matches.set(item.id,options);return "needs-review";
 }
 const query=queryOf(item);
 const found=await search(query);
 matches.set(item.id,found);
 if(opts.auto){
  const confident=uniqueHighConfidence(query,found);
  if(confident){apply(item,confident);return "updated";}
  return "needs-review";
 }
 choose(item,found);
 return "review";
}
async function findItem(item){
 try{showStatus("Searching DeWitt Wegmans for "+item.text+"…");await lookup(item);}
 catch(e){showStatus("Could not retrieve DeWitt product data: "+e.message+" You can still use the Wegmans link or enter details manually.");}
}
function updateSubtotal(){
 const all=grocery()?.getItems().filter(x=>!x.done)||[];
 const priced=all.filter(x=>asNumber(x.price)!==null);
 const total=priced.reduce((sum,x)=>sum+(asNumber(x.price)||0)*(asNumber(x.packs)||1),0);
 $("wg-subtotal").textContent=
  priced.length? "Known subtotal: "+currency(total)+" · "+priced.length+"/"+all.length+" items priced"
  :"No priced shopping items yet.";
 $("wg-subnote").textContent="Per selected product package, not quantity of ingredient used in a recipe. "+
  (priced.length<all.length?"Unpriced items are excluded. ":"")+
  "Excludes tax, deposits, promotions and weight-based adjustments. Prices may change.";
}
function enhanceRow(item,li){
 const wrap=create("div",li,"wg-row");
 const match=create("div",wrap,"wg-match");
 const label=item.wegmans
  ? item.wegmans.name+(item.wegmans.packSize?" · "+item.wegmans.packSize:"")
  : "No product matched yet";
 create("div",match,"wg-product-label",label);
 const detail=item.wegmans
   ? (item.aisle?"Aisle/section: "+item.aisle+" · ":"")
      +(item.wegmans.checkedAt?"Checked "+new Date(item.wegmans.checkedAt).toLocaleDateString()+" · ":"")
      +(item.priceSource==="wegmans"?"Wegmans package price":"Custom price / no price")
   : "Select a real DeWitt product to see its aisle and shelf price.";
 create("div",match,"wg-muted",detail);
 const button=create("button",match,"action",matches.has(item.id)?"Review matches":item.wegmans?"Change product":"Find product");
 button.type="button";
 button.onclick=()=>{if(matches.has(item.id))choose(item,matches.get(item.id));else findItem(item);};
 const prices=create("div",wrap,"wg-price-group");
 const costLabel=create("label",prices,"wg-price-input","Package price ($)");
 const cost=create("input",costLabel);
 cost.type="number";cost.min="0";cost.max="100000";cost.step="0.01";
 cost.placeholder="—";cost.value=item.price===null||item.price===undefined?"":String(item.price);
 cost.setAttribute("aria-label","Package price for "+item.text);
 cost.onchange=()=>{
  const p=asNumber(cost.value);
  if(cost.value.trim()!==""&&p===null){showStatus("Enter a nonnegative package price.");cost.value=item.price===null?"":String(item.price);return;}
  item.price=p;item.priceSource=p===null?"":"manual";saveAndRender();
 };
 const packsLabel=create("label",prices,"wg-price-input","Packages");
 const count=create("input",packsLabel);
 count.type="number";count.step="1";count.min="1";count.max="100";
 count.value=String(item.packs||1);
 count.setAttribute("aria-label","Packages for "+item.text);
 count.onchange=()=>{
  const n=Number(count.value);
  if(!Number.isInteger(n)||n<1||n>100){count.value=String(item.packs||1);showStatus("Package count must be 1–100.");return;}
  item.packs=n;saveAndRender();
 };
 const estimate=asNumber(item.price)!==null
   ?currency(item.price*(Number(item.packs)||1))+" estimated"
   :"Price unknown";
 create("span",wrap,"wg-row-total",estimate);
}
window.wegmansEnhanceRow=enhanceRow;
const refreshButton=$("wg-refresh");
refreshButton.onclick=async()=>{
 if(running)return;
 running=true;refreshButton.disabled=true;
 let scanned=0,updated=0,errors=0,review=0;
 const items=grocery().getItems().filter(x=>!x.done).slice(0,30);
 if(!items.length){running=false;refreshButton.disabled=false;showStatus("Add an item to your shopping list first.");return;}
 try{
  for(const item of items){
   scanned++;
   showStatus("Checking DeWitt Wegmans "+scanned+"/"+items.length+": "+item.text);
   try{
    const result=await lookup(item,{auto:!item.wegmans,refresh:!!item.wegmans});
    if(result==="updated")updated++;else review++;
   }catch(e){errors++;if(errors>=3){showStatus("Wegmans lookup isn't available from this browser right now. Existing data is unchanged.");break;}}
   // Be considerate to retailer search service; cached searches do not issue another call.
   if(scanned<items.length)await new Promise(resolve=>setTimeout(resolve,300));
  }
 }finally{
  running=false;refreshButton.disabled=false;saveAndRender();
 }
 if(errors<3)showStatus(
  "DeWitt lookup complete: "+updated+" auto-updated, "+review+" need product selection"+
  (errors?", "+errors+" could not be checked (the lookup may be blocked).":".")+
  " Use Find product / Review matches on each row. Missing prices and aisles remain blank.");
};
const closeMatch=$("wg-close");
if(closeMatch)closeMatch.onclick=()=>$("wg-choose").close();
const open=$("wg-open-store");
open.href=SHOP_URL;
open.target="_blank";open.rel="noopener noreferrer";
grocery()?.refresh();
updateSubtotal();
window.wegmansLive={lookup,apply,search,product,updateSubtotal,store:STORE};
})();