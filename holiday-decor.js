/* Smith Recipe Book holiday decor.
   Decorations are CSS + emoji, no network requests, and do not change recipes.
   Auto schedule: October Halloween, November Thanksgiving, December Christmas.
   Stored separately from the saved color theme and cookbook content. */
(() => {
  "use strict";
  const STORAGE="smith-recipe-book-holiday-decor-v1";
  const HOLIDAYS=new Set(["auto","none","halloween","thanksgiving","christmas"]);
  const designs={
    halloween:{
      icons:["🎃","👻","🐈‍⬛"],
      garland:["🎃","🦇","👻","🐈‍⬛","🎃","👻","🦇","🎃","🐈‍⬛","👻","🎃","🦇"],
      floaters:["🦇","✦","✨","🕸️","✦","🦇","✨"]
    },
    thanksgiving:{
      icons:["🍁","🦃","🍂"],
      garland:["🍁","🍂","🦃","🍁","🍂","🍁","🦃","🍂","🍁","🍂","🍁","🦃"],
      floaters:["🍂","🍁","✦","🍁","🍂","🍃","🍁"]
    },
    christmas:{
      icons:["⛄","🎄","☃️"],
      garland:["❄️","✧","⛄","❄️","🎄","❄️","⛄","✧","❄️","🎁","❄️","⛄"],
      floaters:["❄","✦","❄","✧","❄","✦","❄"]
    }
  };
  const positions=[
    [17,46,18,-18,.66],
    [32,36,20,14,.55],
    [55,43,17,-7,.72],
    [24,15,16,13,.55],
    [71,51,21,-12,.58],
    [44,10,15,18,.55],
    [76,25,18,2,.65]
  ];
  const root=document.documentElement;
  function holidayForDate(date=new Date()){
    const month=date.getMonth()+1;
    if(month===10)return "halloween";
    if(month===11)return "thanksgiving";
    if(month===12)return "christmas";
    return "none";
  }
  function getSavedMode(){
    try{
      const stored=localStorage.getItem(STORAGE);
      return HOLIDAYS.has(stored)?stored:"auto";
    }catch(e){return "auto";}
  }
  function setSavedMode(mode){
    try{localStorage.setItem(STORAGE,mode);}catch(e){/* Theme still works in this tab. */}
  }
  let selectedMode=getSavedMode();
  let current=null;
  function make(parent,tag,cls,text){
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(text!==undefined)node.textContent=text;
    parent.appendChild(node);
    return node;
  }
  function render(){
    const active=selectedMode==="auto"?holidayForDate():selectedMode;
    const mount=document.getElementById("holiday-decor");
    root.setAttribute("data-holiday",active);
    if(!mount)return;
    if(current===active)return;
    current=active;
    mount.replaceChildren();
    mount.hidden=active==="none";
    if(active==="none")return;
    const d=designs[active];
    make(mount,"div","holiday-aurora");
    const figures=make(mount,"div","holiday-figures");
    d.icons.forEach(icon=>make(figures,"span","holiday-figure",icon));
    const floaters=make(mount,"div","holiday-floaters");
    d.floaters.forEach((icon,i)=>{
      const floater=make(floaters,"span","holiday-floater",icon);
      const [top,right,size,angle,opacity]=positions[i];
      floater.style.setProperty("--holiday-top",top+"%");
      floater.style.setProperty("--holiday-right",right+"%");
      floater.style.setProperty("--holiday-size",size+"px");
      floater.style.setProperty("--holiday-tilt",angle+"deg");
      floater.style.setProperty("--holiday-opacity",String(opacity));
    });
    if(active==="christmas"){
      const cord=make(mount,"div","holiday-light-cord");
      const colors=["#f2bb58","#df6369","#5ac99b","#69b6f0"];
      for(let i=0;i<22;i++){
        const bulb=make(cord,"span","holiday-bulb");
        bulb.style.setProperty("--bulb-color",colors[i%4]);
        bulb.style.setProperty("--bulb-delay",(i%6*.36)+"s");
      }
    }
    const trim=make(mount,"div","holiday-trim");
    d.garland.forEach(icon=>make(trim,"span","",icon));
  }
  function init(){
    const dropdown=document.getElementById("holiday-decor-select");
    if(dropdown){
      dropdown.value=selectedMode;
      dropdown.addEventListener("change",()=>{
        const next=dropdown.value;
        if(!HOLIDAYS.has(next))return;
        selectedMode=next;
        setSavedMode(selectedMode);
        current=null;
        render();
      });
    }
    render();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden&&selectedMode==="auto"){current=null;render();}
  });
  window.addEventListener("pageshow",()=>{
    if(selectedMode==="auto"){current=null;render();}
  });
  window.SmithRecipeHolidayDecor={
    holidayForDate,
    getActive:()=>root.getAttribute("data-holiday"),
    getPreference:()=>selectedMode
  };
})();