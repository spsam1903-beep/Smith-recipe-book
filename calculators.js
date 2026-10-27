/*
  Cookbook nutrition and price calculator.
  Editable starter macros for every recipe and preparation, based on approximate generic nutrition data.
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
,"family-quick-zucchini-bread": [
  [
   1310,
   36,
   274,
   4
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   6,
   0.1,
   2,
   0.1
  ],
  [
   1920,
   0,
   0,
   218
  ],
  [
   1548,
   0,
   400,
   0
  ],
  [
   216,
   19,
   1,
   15
  ],
  [
   65,
   5,
   12,
   1
  ],
  [
   2,
   0,
   0.5,
   0
  ],
  [
   25,
   0,
   1,
   0
  ],
  null
 ],
 "family-sugar-cookies-double": [
  [
   656,
   18,
   137,
   2
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   900,
   0,
   0,
   100
  ],
  [
   387,
   0,
   100,
   0
  ],
  [
   72,
   6,
   0,
   5
  ],
  [
   6,
   0.3,
   0.6,
   0.3
  ],
  [
   12,
   0,
   0.5,
   0
  ]
 ],
 "family-meatballs": [
  [
   1150,
   78,
   0,
   92
  ],
  [
   5,
   0.2,
   1,
   0
  ],
  [
   3,
   0.1,
   0.6,
   0.1
  ],
  [
   2,
   0.2,
   0.3,
   0
  ],
  [
   42,
   4,
   0.4,
   3
  ],
  [
   72,
   6,
   0,
   5
  ],
  [
   225,
   9,
   42,
   3
  ],
  null
 ],
 "family-black-bean-corn-salad": [
  [
   300,
   20,
   54,
   1
  ],
  [
   420,
   28,
   1,
   34
  ],
  [
   180,
   6,
   40,
   2
  ],
  [
   8,
   0.5,
   2,
   0
  ],
  [
   11,
   0.5,
   2.5,
   0
  ],
  [
   30,
   1,
   7,
   0
  ],
  [
   50,
   1,
   11,
   0
  ],
  [
   238,
   0,
   0,
   27,
   false
  ],
  [
   14,
   0.2,
   4,
   0
  ],
  [
   4,
   0.2,
   0.6,
   0.2
  ],
  [
   4,
   0.2,
   1,
   0
  ]
 ],
 "family-bulgogi-korean-bbq-beef": [
  [
   1150,
   157,
   0,
   56
  ],
  [
   35,
   5,
   4,
   0
  ],
  [
   480,
   0,
   0,
   54
  ],
  [
   5,
   0,
   1,
   0
  ],
  [
   209,
   0,
   54,
   0
  ],
  [
   24,
   1,
   5,
   0
  ],
  [
   1,
   0,
   0.2,
   0
  ],
  null
 ],
 "family-tomato-soup": [
  [
   238,
   0,
   0,
   27
  ],
  [
   9,
   0.5,
   2,
   0.1
  ],
  [
   6,
   0.2,
   1,
   0.3
  ],
  [
   215,
   10,
   43,
   2
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   1230,
   10,
   10,
   132
  ],
  null
 ],
 "recipe-tin-eats-naan": [
  [
   12,
   1.5,
   1.5,
   0.2
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   49,
   0,
   12.6,
   0
  ],
  [
   18,
   1,
   1.5,
   1
  ],
  [
   22,
   2,
   0.1,
   1.5
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   950,
   30,
   197,
   3
  ],
  [
   215,
   0.2,
   0,
   24
  ],
  [
   215,
   0.2,
   0,
   24
  ],
  [
   20,
   0,
   0,
   2.2,
   false
  ],
  null,
  null
 ],
 "recipe-tin-eats-naan--garlic-butter": [
  [
   12,
   1.5,
   1.5,
   0.2
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   49,
   0,
   12.6,
   0
  ],
  [
   18,
   1,
   1.5,
   1
  ],
  [
   22,
   2,
   0.1,
   1.5
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   950,
   30,
   197,
   3
  ],
  [
   215,
   0.2,
   0,
   24
  ],
  [
   215,
   0.2,
   0,
   24
  ],
  [
   3,
   0.1,
   0.7,
   0
  ],
  [
   20,
   0,
   0,
   2.2,
   false
  ],
  null,
  null
 ],
 "recipe-tin-eats-naan--cheese": [
  [
   12,
   1.5,
   1.5,
   0.2
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   49,
   0,
   12.6,
   0
  ],
  [
   18,
   1,
   1.5,
   1
  ],
  [
   22,
   2,
   0.1,
   1.5
  ],
  [
   0,
   0,
   0,
   0
  ],
  [
   950,
   30,
   197,
   3
  ],
  [
   215,
   0.2,
   0,
   24
  ],
  [
   215,
   0.2,
   0,
   24
  ],
  [
   600,
   42,
   3,
   46
  ],
  [
   20,
   0,
   0,
   2.2,
   false
  ]
 ]
};
const ESTIMATE_NOTES={
  "family-quick-zucchini-bread": "Totals cover both loaves. Nuts or raisins are excluded because the handwritten card allows either choice; enter nutrition for whichever you use.",
  "family-sugar-cookies-double": "Totals cover the full already-doubled batch. The original doesn't specify how many cookies it makes, so there is no per-cookie estimate.",
  "family-meatballs": "Assumes 1 lb raw 80%-lean ground chuck with no accounted-for fat loss. Retained fat can be lower after frying or baking; number of meatballs is unspecified.",
  "family-black-bean-corn-salad": "Uses drained canned beans/corn and Monterey Jack. Optional olive oil begins unchecked; turning it on adds about 238 kcal to the full 8-serving batch.",
  "family-bulgogi-korean-bbq-beef": "Based on 1½ lb sirloin (midpoint of 1–2 lb) and counting ALL of the marinade because the family instructions return it to the meat. Unquantified frying oil is excluded. Edit the beef and oil entries to match what you actually use.",
  "family-tomato-soup": "Assumes a 24-oz jar of regular tomato sauce and full-fat heavy cream. Yield wasn't given, so macros show the full batch.",
  "recipe-tin-eats-naan": "Includes the extra 2 tbsp finishing butter/ghee; the source's 223 kcal per plain naan excludes this finish. Optional skillet oil/toppings are unchecked.",
  "recipe-tin-eats-naan--garlic-butter": "Includes 2 tbsp garlic-infused finishing butter/ghee. The source's 223 kcal excludes finishing fat; optional skillet oil/toppings are unchecked.",
  "recipe-tin-eats-naan--cheese": "Includes 1½ cups of melting cheese (¼ cup per naan) and the finishing butter. Cheese nutrition differs by brand; optional skillet oil is unchecked."
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
  return {enabled:!!v&&v[4]!==false,calories:v?v[0]:null,protein:v?v[1]:null,
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
 const help=make("p",card,"calc-help","Nutrition values are rough estimates for each listed 1× ingredient amount, not verified labels. Unmeasured or optional ingredients are excluded where indicated. Prices are entered manually and not connected to Wegmans; nutrition and costs depend on brands and preparation.");
 const assumptions=make("p",card,"calc-help","");assumptions.hidden=true;
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
  assumptions.textContent=ESTIMATE_NOTES[recipe.id]||"";
  assumptions.hidden=!assumptions.textContent;
  const serves=recipe.yieldUnknown?null:recipe.servings*factor;
  const unit=recipe.yieldUnit||"serving";
  const perUnit=recipe.yieldUnit ? (unit.endsWith("s")?unit.slice(0,-1):unit) : "serving";
  if(recipe.id!==currentId)rebuild();
  summary.replaceChildren();
  const included=rows.filter(x=>x.enabled);
  const absent=included.filter(x=>FIELD_NAMES.some(k=>x[k]===null));
  const totals={calories:0,protein:0,carbs:0,fat:0};
  for(const row of included)for(const k of FIELD_NAMES)totals[k]+=(row[k]||0)*factor;
  for(const [field,title,suffix] of [["calories","Calories","kcal"],["protein","Protein","g"],["carbs","Carbs","g"],["fat","Fat","g"]]){
   const displayTitle=serves ? title+" / "+perUnit : title+" · batch total";
   const amount=serves?totals[field]/serves:totals[field];
   metric(displayTitle,!included.length||absent.length?"—":quantity(amount,field==="calories")+(field==="calories"?"":" "+suffix),
     !included.length?"No nutrition data entered yet":absent.length?"Some nutrition inputs are missing":
      (title==="Calories"?quantity(totals[field],true)+" kcal total":quantity(totals[field])+" g total"));
  }
  const missing=included.filter(x=>x.cost===null);
  const known=included.reduce((sum,x)=>sum+(x.cost||0),0)*factor;
  metric(serves?"Cost / "+perUnit:"Cost · batch total",
   !included.length||missing.length?"—":price(serves?known/serves:known),
   !included.length?"Enter nutrition and cost data for ingredients":missing.length?"Prices missing for "+missing.length+" ingredient(s)":price(known)+" full recipe");
  make("p",summary,"calc-footnote",
   "At "+quantity(factor)+"× · "+(recipe.yieldUnknown?"yield not specified":quantity(serves)+" "+unit)+". "+
   (!included.length?"Nutrition and cost estimates are not yet entered.":absent.length?"Nutrition estimate incomplete.":"Totals shown beneath each macro.")+
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
