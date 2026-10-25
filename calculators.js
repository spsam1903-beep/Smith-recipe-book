/*
  Cookbook nutrition and price calculator.
  Approximate starter macro data for 1x of the four existing recipe versions.
  All amounts are editable. Ingredient prices are NEVER assumed or fetched live.
  Values are stored locally on the visitor's device, separate from GitHub.
*/
(() => {
"use strict";
const STORAGE_KEY="smith-cookbook-calculators-v1";
const DEFAULTS={
 "mcguires-potato-skins":[
 [640,16,145,1],[300,21,1,23],[600,42,3,48],[200,0,0,23],
 [120,0,0,14],[0,0,0,0],[2,0,.5,0],null
 ],
 "mcguires-potato-skins--higher-protein":[
 [640,16,145,1],[375,70,0,8],[170,12,0,14],[600,42,3,48],
 [100,18,6,0],[200,0,0,23],[120,0,0,14],[0,0,0,0],[2,0,.5,0]
 ],
 "rustic-wheelhouse-bolognese":[
 [1600,56,320,8],[855,63,0,66],[295,19,0,23],[240,0,0,28],
 [45,1,10,0],[25,.5,6,0],[6,.3,1,0],[13,.6,3,0],
 [30,1,7,0],[95,0,3,0],[125,5,25,1],[115,6,9,6],
 [270,2,2,29],null,[0,0,0,0],[0,0,0,0],null
 ],
 "rustic-wheelhouse-bolognese--higher-protein":[
 [1600,96,288,10],[800,91,0,44],[295,19,0,23],[240,0,0,28],
 [45,1,10,0],[25,.5,6,0],[6,.3,1,0],[13,.6,3,0],
 [30,1,7,0],[95,0,3,0],[125,5,25,1],[75,4,6,4],
 [85,12,4,2],[38,2,3,2],null,[0,0,0,0],[0,0,0,0],null
 ]
};
const FIELD_NAMES=["calories","protein","carbs","fat"];
function load(){
 try {
   const obj=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
   return obj && typeof obj==="object"&&!Array.isArray(obj)?obj:{};
 }catch(e){return {};}
}
let saved=load();
function persist(){
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));return true;}
 catch(e){return false;}
}
function make(tag,parent,cls,txt){
 const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;
 if(parent)parent.appendChild(n);return n;
}
function numInput(parent,label,val,step="0.1"){
 const l=make("label",parent,"calc-field");
 make("span",l,"",label);
 const input=make("input",l);
 input.type="number";input.min="0";input.step=step;input.inputMode="decimal";
 input.value=val===null||val===undefined?"":String(val);
 input.setAttribute("aria-label",label);
 return input;
}
function validNumber(value){
 if(value===null||value===undefined||String(value).trim()==="")return null;
 const n=Number(value);
 return Number.isFinite(n)&&n>=0&&n<=1000000?n:null;
}
function price(value){return "$"+value.toFixed(2);}
function quantity(value,whole=false){
 return new Intl.NumberFormat("en-US",{minimumFractionDigits:0,maximumFractionDigits:whole?0:1}).format(value);
}
function initialRows(recipe){
 const defaults=DEFAULTS[recipe.id]||[];
 return recipe.ingredients.map((name,index)=>{
  const v=defaults[index]||null;
  return {enabled:!!v,calories:v?v[0]:null,protein:v?v[1]:null,
   carbs:v?v[2]:null,fat:v?v[3]:null,cost:null,name};
 });
}
function recipeRows(recipe){
 const defaults=initialRows(recipe),prior=saved[recipe.id];
 if(!prior||!Array.isArray(prior.rows))return defaults;
 return defaults.map((d,i)=>{
  const row=prior.rows[i];
  if(!row||typeof row!=="object"||row.name!==d.name)return d;
  const data={...d,enabled:row.enabled!==undefined?!!row.enabled:d.enabled};
  for(const key of [...FIELD_NAMES,"cost"])
   if(Object.prototype.hasOwnProperty.call(row,key))data[key]=validNumber(row[key]);
  return data;
 });
}
function storeRows(recipe,rows,status){
 saved[recipe.id]={rows:rows.map(({name,enabled,calories,protein,carbs,fat,cost})=>({name,enabled,calories,protein,carbs,fat,cost}))};
 status.textContent=persist()?"Changes saved in this browser.":"Browser storage blocked; changes may not persist. Export a backup.";
}
window.attachRecipeCalculator=(original,detail,getSelectedRecipe,getMultiplier,getScaledIngredient)=>{
 const card=make("section",null,"calculator-panel");
 const head=make("div",card,"calculator-head");
 const headCopy=make("div",head);
 make("h3",headCopy,"","Nutrition & recipe cost");
 make("p",headCopy,"calculator-caption","Estimated macros per serving and per recipe, plus editable ingredient prices.");
 const summary=make("div",card,"calc-metrics");
 const actionArea=make("div",card,"calc-actions");
 const editButton=make("button",actionArea,"action","Edit ingredient numbers & prices");editButton.type="button";
 const details=make("div",card,"calc-editable");details.hidden=true;
 const help=make("p",card,"calc-help","Starter nutrition values are rough estimates, not verified labels. Optional/as-needed ingredients are excluded unless you include them. Prices must be entered manually for each ingredient's original (1×) amount—this is not connected to Wegmans. Actual nutrition and costs vary by brands and preparation.");
 const status=make("p",card,"calc-save-status","");status.setAttribute("aria-live","polite");
 const anchor=detail.querySelector(".columns");
 if(anchor)detail.insertBefore(card,anchor);else detail.appendChild(card);
 let currentId=null,rows=[],labels=[],table=null;
 function metric(title,text,sub){
  const block=make("div",summary,"calc-metric");
  make("div",block,"calc-metric-label",title);
  make("strong",block,"calc-metric-number",text);
  make("div",block,"calc-metric-sub",sub);
 }
 function show(){
  const recipe=getSelectedRecipe(),factor=Number(getMultiplier())||1;
  const serves=recipe.servings*factor;
  if(recipe.id!==currentId)rebuild();
  summary.replaceChildren();
  const included=rows.filter(x=>x.enabled);
  const absent=included.filter(x=>FIELD_NAMES.some(k=>x[k]===null));
  const totals={calories:0,protein:0,carbs:0,fat:0};
  for(const row of included)for(const k of FIELD_NAMES)totals[k]+=(row[k]||0)*factor;
  const note=absent.length?"Nutrition incomplete: fill "+absent.length+" included ingredient(s).":"Per serving · "+quantity(serves)+" servings";
  for(const [field,title,suffix] of [["calories","Calories","kcal"],["protein","Protein","g"],["carbs","Carbs","g"],["fat","Fat","g"]]){
   const n=totals[field]/serves;
   metric(title,absent.length?"—":quantity(n,field==="calories")+ (field==="calories"?"":" "+suffix),
     absent.length?"Some nutrition inputs are missing":(title==="Calories"?quantity(totals[field],true)+" kcal total":quantity(totals[field])+" g total"));
  }
  const missing=included.filter(x=>x.cost===null);
  const known=included.reduce((sum,x)=>sum+(x.cost||0),0)*factor;
  metric("Cost per serving",!included.length?"—":missing.length?"—":price(known/serves),
   !included.length?"Enter ingredient quantities and estimates":missing.length?"Prices missing for "+missing.length+" ingredient(s)":price(known)+" full recipe");
  const noteElement=make("p",summary,"calc-footnote",
   "At "+quantity(factor)+"× · "+quantity(serves)+" servings. "+(absent.length?"Nutrition estimate incomplete.":"Full recipe totals shown under each macro.")+
   (missing.length?" Known price subtotal: "+price(known)+" ("+(included.length-missing.length)+"/"+included.length+" priced).":"")
  );
  // Ingredient labels change with the serving-size slider, not the original 1x nutrition/price input basis.
  labels.forEach((node,i)=>node.textContent=getScaledIngredient(rows[i].name,factor));
 }
 function rebuild(){
  const recipe=getSelectedRecipe();
  currentId=recipe.id;rows=recipeRows(recipe);labels=[];
  details.replaceChildren();
  make("p",details,"calc-table-intro","Ingredient quantities below reflect your serving slider. Numbers you enter are for that ingredient's ORIGINAL 1× amount. The calculator scales them automatically.");
  const headers=make("div",details,"calc-column-head");
  for(const heading of ["Use","Ingredient","kcal","Protein (g)","Carbs (g)","Fat (g)","Cost ($)"])
    make("span",headers,"",heading);
  const list=make("div",details,"calc-ingredient-list");
  rows.forEach((data,index)=>{
   const row=make("div",list,"calc-ingredient-row");
   const include=make("label",row,"calc-included");
   const check=make("input",include);check.type="checkbox";check.checked=data.enabled;
   check.setAttribute("aria-label","Include "+data.name+" in nutrition and price totals");
   include.title="Include this ingredient in totals";
   const ingredient=make("div",row,"calc-ingredient-name");
   const name=make("span",ingredient,"",data.name);labels.push(name);
   const caps=[["calories","kcal"],["protein","Protein g"],["carbs","Carbs g"],["fat","Fat g"],["cost","Cost dollars"]];
   const inputs={};
   caps.forEach(([key,label])=>{
    const control=numInput(row,label,data[key],key==="cost"?"0.01":"0.1");
    inputs[key]=control;
    control.disabled=!data.enabled;
    control.addEventListener("change",()=>{
     const v=validNumber(control.value);
     if(control.value.trim()!==""&&v===null){
      status.textContent="Please enter a nonnegative number for "+label+".";
      control.value=data[key]===null?"":String(data[key]);return;
     }
     data[key]=v;storeRows(recipe,rows,status);show();
    });
   });
   check.addEventListener("change",()=>{
    data.enabled=check.checked;for(const k of Object.keys(inputs))inputs[k].disabled=!check.checked;
    storeRows(recipe,rows,status);show();
   });
  });
  const buttonRow=make("div",details,"calc-footer-actions");
  const reset=make("button",buttonRow,"action","Reset nutrition estimates for this version");
  reset.type="button";reset.onclick=()=>{
   if(!window.confirm("Reset this recipe version's nutrition and price entries? This cannot be undone."))return;
   delete saved[recipe.id];persist();currentId=null;rebuild();show();status.textContent="Reset to starter estimates; prices cleared.";
  };
  const tip=make("p",details,"calc-help","To price a 1× recipe, enter the cost of each ingredient quantity used—not the whole package price unless the recipe uses the entire package. If you don't use an ingredient, uncheck Use. Add your own food-label macros for accurate brand-specific values.");
 }
 editButton.addEventListener("click",()=>{
  details.hidden=!details.hidden;
  editButton.textContent=details.hidden?"Edit ingredient numbers & prices":"Hide ingredient editor";
 });
 rebuild();show();
 return {refresh:show};
};
})();
