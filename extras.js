
(() => {
"use strict";
const $=id=>document.getElementById(id);
const pantryKey="smith-cookbook-pantry-v1",reviewsKey="smith-cookbook-reviews-v1",shoppingKey="smith-cookbook-shopping-v1",calculatorKey="smith-cookbook-calculators-v1";
const makeId=()=>String(Date.now())+"-"+Math.random().toString(36).slice(2);
const places=["Pantry","Fridge","Freezer","Spice rack","Other"];
function el(tag,parent,cls,content){const e=document.createElement(tag);if(cls)e.className=cls;if(content!==undefined)e.textContent=content;parent.appendChild(e);return e;}
function read(key,defaultVal){try{const r=JSON.parse(localStorage.getItem(key)||"null");return r??defaultVal;}catch(e){return defaultVal;}}
function store(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(e){console.warn("Unable to save to browser storage",e);return false;}}
let notes=read(reviewsKey,{});if(!notes||typeof notes!=="object"||Array.isArray(notes))notes={};
let pantry=read(pantryKey,[]);if(!Array.isArray(pantry))pantry=[];
pantry=pantry.filter(x=>x&&typeof x.name==="string").map(x=>({
 id:String(x.id||makeId()),name:x.name,amount:String(x.amount||""),place:places.includes(x.place)?x.place:"Pantry",low:!!x.low
}));
function pantryMessage(text){$("pantry-status").textContent=text;}
function pantrySave(){if(!store(pantryKey,pantry))pantryMessage("Could not save in this browser. Try exporting a backup.");}
function normalized(s){return window.groceryUtils?.normalize(s)||String(s).trim().toLowerCase();}
function pantryHas(ingredient){
 const expected=normalized(ingredient);
 return expected!==""&&pantry.some(x=>!x.low&&normalized(x.name)===expected);
}
function addPantry(text,amount="",place="Pantry"){
 let name=String(text||"").trim();
 if(window.groceryUtils){
  const p=window.groceryUtils.parsed(name);
  if(p.count!==null)name=p.name.split(",")[0].trim();
 }
 if(!name)return false;
 const already=pantry.find(x=>normalized(x.name)===normalized(name));
 if(already){already.low=false;if(amount)already.amount=amount;pantrySave();renderPantry();return true;}
 pantry.push({id:makeId(),name,amount,place:places.includes(place)?place:"Pantry",low:false});
 pantrySave();renderPantry();return true;
}
function renderPantry(){
 const list=$("pantry-list");list.replaceChildren();
 const count=pantry.filter(p=>!p.low).length;
 $("pantry-count").textContent=count+" stocked · "+pantry.filter(p=>p.low).length+" running low";
 $("pantry-empty").hidden=pantry.length!==0;
 const ordered=[...pantry].sort((a,b)=>places.indexOf(a.place)-places.indexOf(b.place)||a.name.localeCompare(b.name));
 for(const item of ordered){
  const li=el("li",list,item.low?"low":"");
  const name=el("input",li,"pantry-name");name.type="text";name.value=item.name;name.maxLength=140;name.setAttribute("aria-label","Ingredient name");
  name.onchange=()=>{item.name=name.value.trim();if(!item.name){pantry=pantry.filter(p=>p.id!==item.id);}pantrySave();renderPantry();};
  const amount=el("input",li);amount.type="text";amount.value=item.amount;amount.placeholder="Amount on hand";amount.maxLength=110;amount.setAttribute("aria-label","Amount of "+item.name);
  amount.onchange=()=>{item.amount=amount.value;pantrySave();};
  const place=el("select",li);place.setAttribute("aria-label","Storage location");
  for(const p of places){const opt=el("option",place,"",p);opt.value=p;}
  place.value=item.place;place.onchange=()=>{item.place=place.value;pantrySave();renderPantry();};
  const lowLabel=el("label",li,"pantry-label","Low?");
  const low=el("input",lowLabel);low.type="checkbox";low.checked=item.low;low.setAttribute("aria-label","Running low on "+item.name);
  low.onchange=()=>{item.low=low.checked;pantrySave();renderPantry();};
  const actions=el("div",li,"actions");
  const getMore=el("button",actions,"","Buy more");getMore.type="button";getMore.onclick=()=>{
    if(window.addPantryShopping){window.addPantryShopping(item.name);window.cookbookGo?.("shopping");}
    else pantryMessage("Shopping list is unavailable.");
  };
  const del=el("button",actions,"","Remove");del.type="button";del.onclick=()=>{pantry=pantry.filter(x=>x.id!==item.id);pantrySave();renderPantry();};
 }
}
window.pantryAPI={add:addPantry,hasIngredient:pantryHas,render:renderPantry};
$("pantry-form").onsubmit=e=>{
 e.preventDefault();
 const name=$("pantry-input"),amount=$("pantry-amount"),place=$("pantry-place");
 if(addPantry(name.value,amount.value,place.value)){pantryMessage("Added to your pantry.");name.value="";amount.value="";name.focus();}
};
$("pantry-export").onclick=()=>{
 const output={format:"smith-cookbook-full-backup-v1",savedAt:new Date().toISOString(),
 shopping:read(shoppingKey,[]),reviews:notes,pantry,calculators:read(calculatorKey,{})};
 const b=new Blob([JSON.stringify(output,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(b),a=document.createElement("a");a.href=url;a.download="smith-recipe-book-backup.json";
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 pantryMessage("Complete backup downloaded: shopping list, ratings, notes, pantry, and macro/cost entries.");
};
$("pantry-import").onchange=async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{
  const data=JSON.parse(await file.text());
  if(data.format!=="smith-cookbook-full-backup-v1"||!Array.isArray(data.shopping)||!Array.isArray(data.pantry)||!data.reviews||typeof data.reviews!=="object")throw Error("Invalid backup");
  if(!window.confirm("Restore this backup? It will replace your current shopping list, notes, ratings, and pantry on this device."))return;
  const hasCalculators=Object.prototype.hasOwnProperty.call(data,"calculators");
  if(hasCalculators&&(!data.calculators||typeof data.calculators!=="object"||Array.isArray(data.calculators)))throw Error("Invalid calculator backup");
  const restoreKeys=hasCalculators?[shoppingKey,reviewsKey,pantryKey,calculatorKey]:[shoppingKey,reviewsKey,pantryKey];
  const prior=restoreKeys.map(k=>localStorage.getItem(k));
  try{
   if(!store(shoppingKey,data.shopping)||!store(reviewsKey,data.reviews)||!store(pantryKey,data.pantry)||
      (hasCalculators&&!store(calculatorKey,data.calculators)))throw Error("Browser storage unavailable");
  }catch(err){restoreKeys.forEach((k,i)=>prior[i]===null?localStorage.removeItem(k):localStorage.setItem(k,prior[i]));throw err;}
  window.location.reload();
 }catch(err){pantryMessage("This backup couldn't be restored.");}
 finally{e.target.value="";}
};
renderPantry();

// Ratings and personal recipe notes are stored on the device, never in public GitHub files.
const ratingText=n=>n?("★".repeat(n)+"☆".repeat(5-n)):"Not rated yet";
window.recipeCardBadge=(r,card)=>{
 const rating=Number(notes[r.id]?.rating||0);
 if(rating)el("span",card,"card-rating",ratingText(rating)+" · Your rating");
};
window.attachRecipeExtras=(r,detail,getSelectedRecipe)=>{
 const start=el("button",detail,"start-cooking","▶ Start step-by-step cooking mode");
 start.type="button";start.onclick=()=>openCooking(typeof getSelectedRecipe==="function"?getSelectedRecipe():r);
 const recipeColumns=detail.querySelector(".columns");if(recipeColumns)detail.insertBefore(start,recipeColumns);
 const panel=el("section",detail,"personal-panel");
 el("h3",panel,"","Your rating & cooking notes");
 el("p",panel,"personal-sub","Private to this browser. Keep tweaks and improvements for next time.");
 const stars=el("div",panel,"rating-stars"),caption=el("span",stars,"rating-caption");
 let current=notes[r.id]||{};
 const starButtons=[];
 function updateStars(){
  starButtons.forEach(([v,b])=>{b.classList.toggle("chosen",v<=Number(current.rating||0));b.setAttribute("aria-pressed",String(v===Number(current.rating||0)));});
  caption.textContent=current.rating?current.rating+" / 5 stars":"No rating";
 }
 for(let i=1;i<=5;i++){
  const b=el("button",stars,"","★");b.type="button";b.setAttribute("aria-label","Rate "+i+" stars");
  b.onclick=()=>{current.rating=i;notes[r.id]=current;store(reviewsKey,notes);updateStars();if(typeof draw==="function")draw();};
  starButtons.push([i,b]);
 }
 updateStars();
 const clear=el("button",panel,"action","Clear rating");clear.type="button";clear.style.margin="10px 0";
 clear.onclick=()=>{delete current.rating;notes[r.id]=current;store(reviewsKey,notes);updateStars();if(typeof draw==="function")draw();};
 const textarea=el("textarea",panel,"recipe-notes");textarea.placeholder="How did it turn out? Changes you made, substitutions, flavors to try next time…";
 textarea.value=current.text||"";textarea.setAttribute("aria-label","Personal notes for "+r.title);
 textarea.addEventListener("input",()=>{current.text=textarea.value;notes[r.id]=current;store(reviewsKey,notes);});
 const cooked=el("div",panel,"personal-lastcooked");
 const cookedLabel=el("span",cooked,"personal-sub",current.lastCooked?"Last made: "+current.lastCooked:"No cooking date recorded");
 const mark=el("button",cooked,"","I made this today");mark.type="button";
 mark.onclick=()=>{current.lastCooked=new Date().toLocaleDateString();notes[r.id]=current;store(reviewsKey,notes);cookedLabel.textContent="Last made: "+current.lastCooked;};
};

// Fullscreen-style focus mode with step navigation and a practical timer.
const cookDialog=$("cook-dialog");
const ct=$("cook-title"),stepText=$("cook-instruction"),stepNum=$("cook-step-number"),bar=$("cook-bar");
const back=$("cook-back"),forward=$("cook-next"),close=$("cook-close"),timerInput=$("timer-minutes");
const countdown=$("timer-countdown"),timerButton=$("timer-start"),resetButton=$("timer-reset");
let activeRecipe=null,stepIndex=0,endAt=0,secondsLeft=0,ticker=null,wakeLock=null;
function releaseWake(){if(wakeLock){wakeLock.release().catch(()=>{});wakeLock=null;}}
async function holdWake(){if("wakeLock" in navigator){try{wakeLock=await navigator.wakeLock.request("screen");}catch(e){/* optional */}}}
function resetTimer(){endAt=0;if(ticker){clearInterval(ticker);ticker=null;}secondsLeft=0;renderTimer();}
function suggested(step){
 const text=step||"";const m=text.match(/(\d+)(?:\s*[–-]\s*\d+)?\s*(hours?|hrs?|minutes?|mins?)\b/i);
 return m?Math.min(360,Number(m[1])*(m[2].toLowerCase().startsWith("h")?60:1)):5;
}
function formatTime(total){total=Math.max(0,Math.ceil(total));const h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;
 return h?(h+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")):String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
}
function renderTimer(){
 countdown.textContent=formatTime(endAt?Math.max(0,Math.ceil((endAt-Date.now())/1000)):secondsLeft || Math.round(Number(timerInput.value||5)*60));
 timerButton.textContent=endAt?"Pause timer":secondsLeft?"Resume timer":"Start timer";
 timerInput.disabled=!!endAt;
}
function tick(){
 if(!endAt)return;
 secondsLeft=Math.max(0,Math.ceil((endAt-Date.now())/1000));
 if(secondsLeft===0){endAt=0;if(ticker){clearInterval(ticker);ticker=null;}renderTimer();alert("Your cooking timer is finished!");return;}
 renderTimer();
}
function renderStep(resetSuggested=true){
 if(!activeRecipe)return;
 const steps=activeRecipe.steps,idx=stepIndex;
 ct.textContent=activeRecipe.title;
 stepNum.textContent="Step "+(idx+1)+" of "+steps.length;
 stepText.textContent=steps[idx];
 bar.style.width=((idx+1)/steps.length*100)+"%";
 back.disabled=idx===0;
 forward.textContent=idx===steps.length-1?"Finish cooking":"Next step →";
 if(resetSuggested && !endAt){secondsLeft=0;timerInput.value=String(suggested(steps[idx]));}
 renderTimer();
}
function openCooking(r){
 const switching=!activeRecipe||activeRecipe.id!==r.id;
 if(switching){resetTimer();stepIndex=0;}
 activeRecipe=r;renderStep(true);
 cookDialog.showModal();holdWake();
}
back.onclick=()=>{if(stepIndex>0){stepIndex--;renderStep(true);}};
forward.onclick=()=>{if(!activeRecipe)return;if(stepIndex<activeRecipe.steps.length-1){stepIndex++;renderStep(true);}else cookDialog.close();};
close.onclick=()=>cookDialog.close();
cookDialog.addEventListener("close",releaseWake);
timerInput.onchange=()=>{if(!endAt){secondsLeft=0;renderTimer();}};
timerButton.onclick=()=>{
 if(endAt){secondsLeft=Math.max(0,Math.ceil((endAt-Date.now())/1000));endAt=0;if(ticker){clearInterval(ticker);ticker=null;}renderTimer();return;}
 const mins=Number(timerInput.value);if(!Number.isFinite(mins)||mins<1||mins>360){alert("Choose a timer from 1 to 360 minutes.");return;}
 if(!secondsLeft)secondsLeft=Math.round(mins*60);
 endAt=Date.now()+secondsLeft*1000;
 if(ticker)clearInterval(ticker);
 ticker=setInterval(tick,1000);renderTimer();
};
resetButton.onclick=resetTimer;
for(const min of [1,5,10,15,30,60]){
 const b=el("button",$("timer-presets"),"timer-preset",min+" min");b.type="button";
 b.onclick=()=>{if(endAt){endAt=0;clearInterval(ticker);ticker=null;}timerInput.value=String(min);secondsLeft=0;renderTimer();};
}
if(typeof draw==="function")draw();
})();
