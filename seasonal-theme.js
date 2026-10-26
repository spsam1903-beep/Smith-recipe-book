/*
 Smith Recipe Book seasonal themes.
 Uses device month (Northern Hemisphere meteorological seasons) in Automatic mode.
 Manual preference is saved locally, separately from recipe, shopping, pantry and cost data.
 No network calls or permissions required.
*/
(() => {
 "use strict";
 const KEY="smith-recipe-book-seasonal-theme-v1";
 const allowed=new Set(["auto","spring","summer","fall","winter"]);
 const root=document.documentElement;
 const seasons={
   spring:{name:"Spring",header:"#34533e"},
   summer:{name:"Summer",header:"#234e63"},
   fall:{name:"Fall",header:"#332b26"},
   winter:{name:"Winter",header:"#253b51"}
 };
 function calendarSeason(date=new Date()){
   const m=date.getMonth()+1;
   if(m>=3&&m<=5)return "spring";
   if(m>=6&&m<=8)return "summer";
   if(m>=9&&m<=11)return "fall";
   return "winter";
 }
 function readPreference(){
   try{const v=localStorage.getItem(KEY);return allowed.has(v)?v:"auto";}
   catch(e){return "auto";}
 }
 function storePreference(value){
   try{localStorage.setItem(KEY,value);}
   catch(e){/* Browsers with disabled storage can still change themes this session. */}
 }
 let preference=readPreference();
 function apply(){
   const current=preference==="auto"?calendarSeason():preference;
   root.setAttribute("data-season",current);
   root.setAttribute("data-theme-mode",preference);
   const themeMeta=document.querySelector('meta[name="theme-color"]');
   if(themeMeta)themeMeta.setAttribute("content",seasons[current].header);
   const picker=document.getElementById("season-theme-select");
   if(picker){
     picker.value=preference;
     const auto=picker.querySelector('option[value="auto"]');
     if(auto)auto.textContent="Automatic ("+seasons[calendarSeason()].name+")";
   }
   const note=document.getElementById("season-theme-note");
   if(note)note.textContent=preference==="auto"?"Automatic · "+seasons[current].name:seasons[current].name+" theme";
   return current;
 }
 function bindControls(){
   const picker=document.getElementById("season-theme-select");
   if(picker){
     picker.value=preference;
     picker.addEventListener("change",()=>{
       const next=picker.value;
       if(!allowed.has(next))return;
       preference=next;storePreference(next);apply();
     });
   }
   apply();
 }
 apply(); // Set colors before the remainder of the page loads, avoiding a theme flash.
 if(document.readyState==="loading"){
   document.addEventListener("DOMContentLoaded",bindControls);
 }else bindControls();
 // Re-evaluate automatic season when returning to a tab after a date boundary.
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&preference==="auto")apply();});
 window.SmithRecipeThemes={getSeason:calendarSeason,getActive:()=>root.getAttribute("data-season"),getPreference:()=>preference};
})();
