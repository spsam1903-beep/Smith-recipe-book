
(() => {
"use strict";
const KEY="smith-cookbook-shopping-v1",storeUrl="https://www.wegmans.com/shop/categories";
const dpts=["Produce","Meat & Seafood","Dairy & Cheese","Frozen","Bakery","Pantry","Other"];
const $=id=>document.getElementById(id);
const notice=$("shop-status");let items=[];
const id=()=>String(Date.now())+"-"+Math.random().toString(36).slice(2);
try{const data=JSON.parse(localStorage.getItem(KEY)||"[]");
if(Array.isArray(data))items=data.filter(x=>x && typeof x.text==="string").map(x=>({id:String(x.id||id()),text:x.text,aisle:String(x.aisle||""),dept:dpts.includes(x.dept)?x.dept:"Other",done:!!x.done,source:String(x.source||"")}));}
catch(e){notice.textContent="Unable to load an old shopping list.";}
function say(t){notice.textContent=t;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items));}catch(e){say("Browser storage unavailable. Export a backup before closing.");}}
function element(tag,parent,cls,label){const e=document.createElement(tag);if(cls)e.className=cls;if(label!==undefined)e.textContent=label;parent.appendChild(e);return e;}
function category(t){t=t.toLowerCase();if(/potato|onion|carrot|celery|garlic|fresh tomato|parsley|basil/.test(t))return "Produce";
if(/beef|pork|bacon|sausage|chicken|shrimp/.test(t))return "Meat & Seafood";
if(/gouda|cream|milk|parmesan|cheese|butter/.test(t))return "Dairy & Cheese";
if(/frozen/.test(t))return "Frozen";if(/bread|rolls|baguette/.test(t))return "Bakery";return "Pantry";}
function add(text,source){text=text.trim();if(!text)return false;items.push({id:id(),text,dept:category(text),aisle:"",done:false,source:source||""});return true;}
function go(shopping){$("recipes-view").hidden=shopping;$("shopping-view").hidden=!shopping;
$("shopping-tab").classList.toggle("active",shopping);$("recipes-tab").classList.toggle("active",!shopping);
$("shopping-tab").setAttribute("aria-selected",String(shopping));$("recipes-tab").setAttribute("aria-selected",String(!shopping));if(shopping)render();}
$("recipes-tab").onclick=()=>go(false);$("shopping-tab").onclick=()=>go(true);
function copy(t){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(t).then(()=>say("Copied to clipboard."),()=>window.prompt("Copy:",t));else window.prompt("Copy:",t);}
function render(){
 const tobuy=$("shop-to-buy"),got=$("shop-got");tobuy.replaceChildren();got.replaceChildren();
 const open=items.filter(x=>!x.done);const closed=items.filter(x=>x.done);
 const sort=(a,b)=>(a.aisle||"zzz").localeCompare(b.aisle||"zzz",undefined,{numeric:true})||dpts.indexOf(a.dept)-dpts.indexOf(b.dept);
 open.sort(sort).forEach(x=>row(x,tobuy));closed.forEach(x=>row(x,got));
 $("shop-count").textContent=open.length+" left to get · "+closed.length+" checked off";$("shop-badge").textContent=items.length?"("+open.length+")":"";
 $("shop-empty").hidden=open.length>0;$("shop-got-section").hidden=closed.length===0;
}
function row(item,list){
 const li=element("li",list,item.done?"done":"");
 const cb=element("input",li);cb.type="checkbox";cb.checked=item.done;cb.setAttribute("aria-label","Purchased "+item.text);cb.onchange=()=>{item.done=cb.checked;save();render();};
 const name=element("input",li,"shop-name");name.type="text";name.value=item.text;name.maxLength=250;name.setAttribute("aria-label","Edit item");name.oninput=()=>{item.text=name.value;save();};
 const dept=element("select",li);dept.setAttribute("aria-label","Department");dpts.forEach(d=>{const opt=element("option",dept,"",d);opt.value=d;});dept.value=item.dept;dept.onchange=()=>{item.dept=dept.value;save();};
 const aisle=element("input",li,"shop-aisle");aisle.type="text";aisle.placeholder="Aisle / section";aisle.maxLength=80;aisle.value=item.aisle;aisle.setAttribute("aria-label","Aisle or section");aisle.oninput=()=>{item.aisle=aisle.value;save();};
 const actions=element("div",li,"actions");
 const cp=element("button",actions,"","Copy");cp.type="button";cp.title="Copy to Wegmans search";cp.onclick=()=>copy(item.text);
 const link=element("a",actions,"","Wegmans ↗");link.href=storeUrl;link.target="_blank";link.rel="noopener noreferrer";link.style.padding="8px";
 const del=element("button",actions,"","Remove");del.type="button";del.onclick=()=>{items=items.filter(x=>x.id!==item.id);save();render();};
 if(item.source)element("small",li,"source-note","From: "+item.source);
}
$("shop-form").onsubmit=e=>{e.preventDefault();const input=$("shop-input");if(add(input.value,"Manually added")){input.value="";save();render();say("Added item.");}};
$("shop-clear").onclick=()=>{const n=items.filter(x=>x.done).length;if(!n)return say("No checked-off items.");if(window.confirm("Remove "+n+" purchased items?")){items=items.filter(x=>!x.done);save();render();}};
$("shop-copy").onclick=()=>copy(items.filter(x=>!x.done).map(x=>"- "+x.text+(x.aisle?" ["+x.aisle+"]":"")).join("\n")||"List is empty.");
$("shop-export").onclick=()=>{const blob=new Blob([JSON.stringify({kind:KEY,items},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="cookbook-shopping-list.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);say("Backup exported.");};
$("shop-import").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{
const data=JSON.parse(await file.text());if(data.kind!==KEY||!Array.isArray(data.items))throw Error("Invalid backup");
if(!window.confirm("Replace the shopping list with this backup?"))return;
items=data.items.filter(x=>x&&typeof x.text==="string").map(x=>({id:id(),text:x.text,aisle:String(x.aisle||""),dept:dpts.includes(x.dept)?x.dept:"Other",done:!!x.done,source:String(x.source||"")}));
save();render();say("Backup imported.");}catch(err){say("Couldn't import that backup.");}finally{e.target.value="";}};
$("shop-print").onclick=()=>{document.body.classList.add("print-shop");window.print();};window.addEventListener("afterprint",()=>document.body.classList.remove("print-shop"));
window.addRecipeShopping=(list,source)=>{const n=list.filter(x=>add(x,source)).length;if(!n){say("No unchecked ingredients to add.");return false;}save();go(true);say("Added "+n+" ingredient"+(n===1?"":"s")+" from "+source+".");return true;};
render();
})();
