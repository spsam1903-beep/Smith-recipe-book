
(() => {
"use strict";
const KEY="smith-cookbook-shopping-v1",storeUrl="https://www.wegmans.com/shop/categories";
const dpts=["Produce","Meat & Seafood","Dairy & Cheese","Frozen","Bakery","Pantry","Other"];
const $=id=>document.getElementById(id);
const message=t=>{$("shop-status").textContent=t;};
const uuid=()=>String(Date.now())+"-"+Math.random().toString(36).slice(2);
const fractions={"½":.5,"¼":.25,"¾":.75,"⅓":1/3,"⅔":2/3,"⅛":.125,"⅜":.375,"⅝":.625,"⅞":.875};
const qPattern="(?:\\d+(?:\\.\\d+)?(?:\\s+[½¼¾⅓⅔⅛⅜⅝⅞])?|[½¼¾⅓⅔⅛⅜⅝⅞])";
const qtyRE=new RegExp("^("+qPattern+")(?:\\s*[–-]\\s*("+qPattern+"))?\\s+");
const units={
  cups:"cup",cup:"cup",tablespoon:"tbsp",tablespoons:"tbsp",tbsp:"tbsp",teaspoon:"tsp",teaspoons:"tsp",tsp:"tsp",
  pound:"lb",pounds:"lb",lbs:"lb",lb:"lb",ounces:"oz",ounce:"oz",oz:"oz",grams:"g",gram:"g",g:"g",
  kilograms:"kg",kilogram:"kg",kg:"kg",milliliters:"ml",milliliter:"ml",ml:"ml",liters:"l",liter:"l",l:"l",
  cloves:"clove",clove:"clove",slices:"slice",slice:"slice",cans:"can",can:"can",
  packages:"package",package:"package",bags:"bag",bag:"bag",bunches:"bunch",bunch:"bunch",
  sticks:"stick",stick:"stick",pieces:"piece",piece:"piece"
};
function parseQty(q){return q.split(/\s+/).reduce((sum,p)=>sum+(fractions[p]??Number(p)),0);}
function formatQty(n){if(!Number.isFinite(n))return "";const k=Math.floor(n),frac=n-k;if(frac<.01)return String(k);
  const poss=[[1,2,"½"],[1,4,"¼"],[3,4,"¾"],[1,3,"⅓"],[2,3,"⅔"],[1,8,"⅛"],[3,8,"⅜"],[5,8,"⅝"],[7,8,"⅞"]];
  let best="",diff=1;for(const [a,b,c] of poss){if(Math.abs(frac-a/b)<diff){best=c;diff=Math.abs(frac-a/b);}}
  return diff<.012?(k?k+" ":"")+best:String(Number(n.toFixed(2)));
}
function singular(w){
 if(w==="potatoes")return "potato";if(w==="tomatoes")return "tomato";if(w==="leaves")return "leaf";
 if(w.endsWith("ies")&&w.length>5)return w.slice(0,-3)+"y";
 if(w.endsWith("s")&&!w.endsWith("ss")&&!w.endsWith("us"))return w.slice(0,-1);
 return w;
}
function normalizedName(s){
 let text=String(s||"").trim().toLowerCase();
 const matched=text.match(qtyRE);if(matched)text=text.slice(matched[0].length);
 const words=text.split(/\s+/);if(units[words[0]])text=words.slice(1).join(" ");
 return text.split(",")[0].replace(/\([^)]*\)/g,"").replace(/^(?:of\s+|medium\s+|small\s+|large\s+)+/g,"")
  .replace(/\b(?:freshly|finely|roughly|optional)\b/g,"").replace(/[^a-z0-9 ]/g," ")
  .split(/\s+/).filter(Boolean).map(singular).join(" ").trim();
}
function parsed(text){
 let rest=String(text||"").trim(),q=rest.match(qtyRE);
 if(!q)return {count:null,unit:"",name:rest,key:normalizedName(rest)};
 let count=parseQty(q[1]), high=q[2]?parseQty(q[2]):null;
 rest=rest.slice(q[0].length);
 const word=rest.split(/\s+/)[0].toLowerCase().replace(/[.,]/g,"");
 const unit=units[word]||"";
 const name=unit?rest.slice(rest.indexOf(" ")+1):rest;
 return {count,high,unit,name,key:normalizedName(text)};
}
function build(p){const value=formatQty(p.count)+(p.high!==null?"–"+formatQty(p.high):"");
 const unit=p.unit?(value+" "+(p.unit==="clove"&&p.count!==1?"cloves":p.unit==="slice"&&p.count!==1?"slices":p.unit==="can"&&p.count!==1?"cans":p.unit==="bag"&&p.count!==1?"bags":p.unit==="package"&&p.count!==1?"packages":p.unit==="cup"&&p.count!==1?"cups":p.unit==="piece"&&p.count!==1?"pieces":p.unit)):(value);
 return unit+" "+p.name;
}
function guess(t){
 t=normalizedName(t);
 if(/potato|onion|carrot|celery|garlic|fresh tomato|parsley|basil|lemon/.test(t))return "Produce";
 if(/beef|pork|bacon|sausage|chicken|shrimp|steak/.test(t))return "Meat & Seafood";
 if(/gouda|cream|milk|parmesan|cheese|butter|egg/.test(t))return "Dairy & Cheese";
 if(/frozen/.test(t))return "Frozen";if(/bread|baguette|roll/.test(t))return "Bakery";return "Pantry";
}
function extraFields(x){
 const p=Number(x.price), packs=Number(x.packs);
 const wg=x.wegmans&&typeof x.wegmans==="object" ? x.wegmans : null;
 return {
  price:x.price===null||x.price===undefined||x.price===""||!Number.isFinite(p)||p<0?null:p,
  packs:Number.isFinite(packs)&&packs>0&&packs<=100?packs:1,
  priceSource:x.priceSource==="wegmans"?"wegmans":x.priceSource==="manual"?"manual":"",
  wegmans:wg&&String(wg.storeNumber)==="30"&&wg.id?{
   id:String(wg.id),name:String(wg.name||""),packSize:String(wg.packSize||""),
   price:typeof wg.price==="number"&&Number.isFinite(wg.price)&&wg.price>=0?wg.price:null,
   aisle:String(wg.aisle||""),checkedAt:String(wg.checkedAt||""),storeNumber:"30"
  }:null
 };
}
let items=[];
try{const val=JSON.parse(localStorage.getItem(KEY)||"[]");
 if(Array.isArray(val))items=val.filter(x=>x&&typeof x.text==="string").map(x=>({
  id:String(x.id||uuid()),text:x.text,dept:dpts.includes(x.dept)?x.dept:"Other",
  aisle:String(x.aisle||""),source:String(x.source||""),done:!!x.done,...extraFields(x)
 }));
}catch(e){message("Saved list could not be read. Existing backup files are unaffected.");}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items));}catch(e){message("Browser storage unavailable; export your list to keep it.");}}
function element(tag,parent,cls,label){const e=document.createElement(tag);if(cls)e.className=cls;if(label!==undefined)e.textContent=label;parent.appendChild(e);return e;}
function mergeInto(text,source,allowMerge=true){
 text=String(text||"").trim();if(!text)return "empty";
 const incoming=parsed(text);
 if(allowMerge){
  const existing=items.find(x=>!x.done && parsed(x.text).key===incoming.key && incoming.key &&
    parsed(x.text).unit===incoming.unit && incoming.count!==null &&
    parsed(x.text).count!==null);
  if(existing){
   const old=parsed(existing.text);
   {
    const combined={...old,count:old.count+incoming.count,high:(old.high===null&&incoming.high===null)?null:(old.high??old.count)+(incoming.high??incoming.count)};
    existing.text=build(combined);
    if(source&&!existing.source.split(" · ").includes(source))existing.source+=(existing.source?" · ":"")+source;
    return "merged";
   }
  }
  const plain=items.find(x=>!x.done&&incoming.count===null&&parsed(x.text).count===null&&parsed(x.text).key===incoming.key&&incoming.key);
  if(plain){if(source&&!plain.source.split(" · ").includes(source))plain.source+=(plain.source?" · ":"")+source;return "merged";}
 }
 items.push({id:uuid(),text,dept:guess(text),aisle:"",done:false,source:source||"",price:null,packs:1,priceSource:"",wegmans:null});
 return "added";
}
function go(view){
 const shopping=view==="shopping",pantry=view==="pantry";
 $("recipes-view").hidden=shopping||pantry;$("shopping-view").hidden=!shopping;
 $("pantry-view").hidden=!pantry;
 for(const tab of ["recipes","shopping","pantry"]){
  const active=tab===view;
  $(tab+"-tab").classList.toggle("active",active);
  $(tab+"-tab").setAttribute("aria-selected",String(active));
 }
 if(shopping)render();
 if(pantry&&window.pantryAPI)window.pantryAPI.render();
}
window.cookbookGo=go;
$("recipes-tab").onclick=()=>go("recipes");$("shopping-tab").onclick=()=>go("shopping");$("pantry-tab").onclick=()=>go("pantry");
function copy(t){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(t).then(()=>message("Copied to clipboard."),()=>window.prompt("Copy:",t));else window.prompt("Copy:",t);}
function render(){
 const tobuy=$("shop-to-buy"),got=$("shop-got");tobuy.replaceChildren();got.replaceChildren();
 const open=items.filter(x=>!x.done),closed=items.filter(x=>x.done);
 const mode=$("shop-sort")?.value||"department";
 open.sort((a,b)=>{
   if(mode==="name")return a.text.localeCompare(b.text);
   const byDept=dpts.indexOf(a.dept)-dpts.indexOf(b.dept);
   const byAisle=(a.aisle||"zzz").localeCompare(b.aisle||"zzz",undefined,{numeric:true});
   return mode==="aisle"?byAisle||byDept:byDept||byAisle;
 });
 let lastDept=null;
 for(const x of open){
   if(mode==="department" && lastDept!==x.dept){
     const heading=element("li",tobuy,"shop-group",x.dept);lastDept=x.dept;
   }
   row(x,tobuy);
 }
 closed.forEach(x=>row(x,got));
 $("shop-count").textContent=open.length+" left to get · "+closed.length+" checked off";
 $("shop-badge").textContent=items.length?"("+open.length+")":"";
 $("shop-empty").hidden=open.length>0;$("shop-got-section").hidden=closed.length===0;
 window.wegmansLive?.updateSubtotal();
}
function row(item,list){
 const li=element("li",list,item.done?"done":"");
 const cb=element("input",li);cb.type="checkbox";cb.checked=item.done;cb.setAttribute("aria-label","Purchased "+item.text);cb.onchange=()=>{item.done=cb.checked;save();render();};
 const name=element("input",li,"shop-name");name.type="text";name.value=item.text;name.maxLength=250;name.setAttribute("aria-label","Edit item");
 name.onchange=()=>{
 const updated=name.value.trim();
 if(!updated){items=items.filter(x=>x.id!==item.id);save();render();return;}
 if(updated!==item.text && item.wegmans){item.wegmans=null;if(item.priceSource==="wegmans"){item.price=null;item.priceSource="";}}
 item.text=updated;save();render();
};
 const dept=element("select",li);dept.setAttribute("aria-label","Department");
 dpts.forEach(d=>{const opt=element("option",dept,"",d);opt.value=d;});
 dept.value=item.dept;dept.onchange=()=>{item.dept=dept.value;save();render();};
 const aisle=element("input",li,"shop-aisle");aisle.type="text";aisle.placeholder="Aisle / section";aisle.maxLength=80;aisle.value=item.aisle;aisle.setAttribute("aria-label","Aisle or section");aisle.onchange=()=>{item.aisle=aisle.value;save();render();};
 const actions=element("div",li,"actions");
 const cp=element("button",actions,"","Copy");cp.type="button";cp.title="Copy item to search at Wegmans";cp.onclick=()=>copy(item.text);
 const link=element("a",actions,"","Wegmans ↗");link.href=storeUrl;link.target="_blank";link.rel="noopener noreferrer";link.style.padding="8px";
 if(window.pantryAPI){
   const have=element("button",actions,"","Have it");have.type="button";have.title="Move this item to your pantry";
   have.onclick=()=>{window.pantryAPI.add(item.text);item.done=true;save();render();message("Added to pantry and checked off.");};
 }
 const del=element("button",actions,"","Remove");del.type="button";del.onclick=()=>{items=items.filter(x=>x.id!==item.id);save();render();};
 if(item.source)element("small",li,"source-note","From: "+item.source);
 if(window.wegmansEnhanceRow)window.wegmansEnhanceRow(item,li);
}
$("shop-form").onsubmit=e=>{e.preventDefault();const input=$("shop-input");if(mergeInto(input.value,"Manually added")!=="empty"){input.value="";save();render();message("Item added to shopping list.");}};
$("shop-clear").onclick=()=>{const n=items.filter(x=>x.done).length;if(!n)return message("No checked-off items.");if(window.confirm("Remove "+n+" checked-off items?")){items=items.filter(x=>!x.done);save();render();}};
$("shop-copy").onclick=()=>copy(items.filter(x=>!x.done).map(x=>"- "+x.text+(x.aisle?" ["+x.aisle+"]":"")).join("\n")||"Shopping list is empty.");
$("shop-export").onclick=()=>{const blob=new Blob([JSON.stringify({kind:KEY,items},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="cookbook-shopping-list.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);message("Backup exported.");};
$("shop-import").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{
 const data=JSON.parse(await file.text());if(data.kind!==KEY||!Array.isArray(data.items))throw Error("Invalid backup");
 if(!window.confirm("Replace your shopping list with this backup?"))return;
 items=data.items.filter(x=>x&&typeof x.text==="string").map(x=>({id:uuid(),text:x.text,aisle:String(x.aisle||""),dept:dpts.includes(x.dept)?x.dept:"Other",done:!!x.done,source:String(x.source||""),...extraFields(x)}));
 save();render();message("Backup imported.");
}catch(err){message("Couldn't import that shopping list backup.");}finally{e.target.value="";}};
$("shop-print").onclick=()=>{document.body.classList.add("print-shop");window.print();};
window.addEventListener("afterprint",()=>document.body.classList.remove("print-shop"));
$("shop-sort").addEventListener("change",render);
$("shop-merge").onclick=()=>{
 const before=items.length,old=items.map(x=>({...x}));items=[];
 for(const x of old){if(x.done){items.push(x);continue;}
  const p=parsed(x.text);const target=items.find(y=>!y.done&&parsed(y.text).key===p.key&&parsed(y.text).unit===p.unit&&p.count!==null&&parsed(y.text).count!==null);
  if(!target){items.push(x);continue;}
  const cur=parsed(target.text),res={...cur,count:cur.count+p.count,high:(cur.high===null&&p.high===null)?null:(cur.high??cur.count)+(p.high??p.count)};
  target.text=build(res);if(x.source&&!target.source.includes(x.source))target.source+=(target.source?" · ":"")+x.source;
  if(!target.aisle&&x.aisle)target.aisle=x.aisle;
  if(!target.wegmans&&x.wegmans){target.wegmans=x.wegmans;target.price=x.price;target.priceSource=x.priceSource;target.packs=x.packs;}
 }
 save();render();message("Combined "+(before-items.length)+" duplicate item(s) with matching units.");
};
window.groceryUtils={normalize:normalizedName,parsed,guess,mergeInto,refresh:render,getItems:()=>items,save,extraFields};
window.addPantryShopping=(ingredient)=>{
 const result=mergeInto(ingredient,"Pantry restock");
 if(result!=="empty"){save();render();message(result==="merged"?"Restock item combined with your existing list.":"Pantry restock added to shopping list.");}
 return result!=="empty";
};
window.addRecipeShopping=(list,source)=>{
 let added=0,merged=0,skipped=0;
 for(const ingredient of list){
  if($("shop-skip-pantry").checked && window.pantryAPI?.hasIngredient(ingredient)){skipped++;continue;}
  const action=mergeInto(ingredient,source);
  if(action==="added")added++;if(action==="merged")merged++;
 }
 save();go("shopping");
 message(added+" added, "+merged+" combined with existing items"+(skipped?", "+skipped+" skipped (already in pantry)":"")+".");
 return list.length>0;
};
render();
})();
