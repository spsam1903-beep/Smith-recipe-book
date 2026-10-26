/* Smith Recipe Book — US holiday decoration calendar.
   Holidays are for festive decor, not government observed-day schedules.
   Uses the browser's local calendar. Easter follows the Gregorian algorithm.
   Existing season colors and cookbook storage remain independent.
*/
(() => {
  "use strict";
  const STORAGE="smith-recipe-book-holiday-decor-v1";
  const designs={
    newyear:{
      label:"New Year's",icons:["🎉","🥂","🎆"],
      garland:["✨","🎊","⭐","🎆","🎉","✨","🎊","⭐","🎆","✨","🎉","⭐"],
      floaters:["✨","⭐","🎆","✦","🎊","✨","✧"],glow:"#c7a4555c",trim:"#b4925545"
    },
    mlk:{
      label:"Martin Luther King Jr. Day",icons:["🕊️","🤝","💛"],
      garland:["🕊️","✨","🤝","⭐","💛","🕊️","✨","🤝","⭐","💛","🕊️"],
      floaters:["✦","🕊️","✨","⭐","✧","✨","✦"],glow:"#c7aa8c59",trim:"#a9806743"
    },
    valentine:{
      label:"Valentine's Day",icons:["💌","💝","🌹"],
      garland:["💗","💕","🌹","💗","💌","💞","💗","🌹","💕","💌","💗","💕"],
      floaters:["💕","💗","✨","💞","✦","💝","💗"],glow:"#e47eaa66",trim:"#e38dac4b"
    },
    presidents:{
      label:"Presidents' Day",icons:["🇺🇸","🏛️","⭐"],
      garland:["⭐","🇺🇸","🎩","⭐","🏛️","🇺🇸","⭐","🎩","🇺🇸","⭐","🏛️"],
      floaters:["⭐","✦","✨","⭐","✧","⭐","✦"],glow:"#b8a4a25b",trim:"#9d72734a"
    },
    stpatricks:{
      label:"St. Patrick's Day",icons:["☘️","🌈","🍀"],
      garland:["🍀","☘️","🌈","🍀","✨","☘️","🍀","🌈","✨","☘️","🍀"],
      floaters:["🍀","✨","☘️","✧","🍀","⭐","☘️"],glow:"#69aa6559",trim:"#67a15d49"
    },
    easter:{
      label:"Easter",icons:["🐰","🥚","🐣"],
      garland:["🌷","🥚","🌼","🐣","🌷","🥚","🐰","🌼","🥚","🌷","🐣"],
      floaters:["🌸","🌷","✨","🥚","🌼","🌸","✨"],glow:"#c6a6ef62",trim:"#b5a6df4b"
    },
    earthday:{
      label:"Earth Day",icons:["🌎","🌱","🌿"],
      garland:["🌍","🌱","🌿","🌼","🌎","🌱","🍃","🌿","🌎","🌱","🌼"],
      floaters:["🌿","🍃","✨","🌱","🌿","🍃","✨"],glow:"#68ab9b53",trim:"#71b39342"
    },
    mothersday:{
      label:"Mother's Day",icons:["💐","🌷","💗"],
      garland:["🌸","💐","💗","🌷","🌼","🌸","💕","💐","🌷","🌼","💗"],
      floaters:["🌸","💞","🌼","🌷","✨","🌸","💕"],glow:"#d79ac563",trim:"#d59cbb4b"
    },
    memorial:{
      label:"Memorial Day",icons:["🇺🇸","🕊️","⭐"],
      garland:["🇺🇸","⭐","🕊️","🇺🇸","⭐","🌹","🇺🇸","⭐","🕊️","🇺🇸","⭐"],
      floaters:["⭐","✦","✨","🕊️","⭐","✧","⭐"],glow:"#8baac559",trim:"#6f8aaf49"
    },
    flagday:{
      label:"Flag Day",icons:["🇺🇸","⭐","🦅"],
      garland:["🇺🇸","⭐","🇺🇸","✨","⭐","🇺🇸","⭐","✨","🇺🇸","⭐","🇺🇸"],
      floaters:["⭐","✦","✨","⭐","✦","✨","⭐"],glow:"#81a2c759",trim:"#6088b445"
    },
    juneteenth:{
      label:"Juneteenth",icons:["⭐","🎉","🕊️"],
      garland:["⭐","🎉","✨","🕊️","⭐","🎊","⭐","✨","🎉","⭐","🕊️"],
      floaters:["⭐","✦","✨","🎊","⭐","✨","✧"],glow:"#c57d6f63",trim:"#b8797252"
    },
    fathersday:{
      label:"Father's Day",icons:["💙","🛠️","🎉"],
      garland:["💙","⭐","🎉","💙","🔧","⭐","💙","🎉","⭐","💙","✨"],
      floaters:["⭐","✨","💙","✦","⭐","✨","💙"],glow:"#8caeda55",trim:"#87a6d34a"
    },
    independence:{
      label:"Fourth of July",icons:["🇺🇸","🎆","🗽"],
      garland:["🇺🇸","⭐","🎆","🇺🇸","🎇","⭐","🗽","🇺🇸","🎆","⭐","🇺🇸"],
      floaters:["⭐","✨","🎆","✦","🎇","⭐","✨"],glow:"#8d9dd067",trim:"#ae7a8b55"
    },
    labor:{
      label:"Labor Day",icons:["🧰","🇺🇸","⭐"],
      garland:["⭐","🛠️","🇺🇸","⚙️","⭐","🧰","🇺🇸","⭐","🛠️","⚙️","⭐"],
      floaters:["⭐","⚙️","✨","✦","⭐","✨","⚙️"],glow:"#be9b6a59",trim:"#b68a6746"
    },
    octoberday:{
      label:"Indigenous Peoples' / Columbus Day",icons:["🌎","🍁","🌿"],
      garland:["🍁","🌎","🍂","🌿","🍁","🌎","🍂","🍁","🌿","🍂","🍁"],
      floaters:["🍁","🍂","✨","🌿","🍁","🍂","✨"],glow:"#ae914f59",trim:"#aa7e454a"
    },
    halloween:{
      label:"Halloween",icons:["🎃","👻","🐈‍⬛"],
      garland:["🎃","🦇","👻","🐈‍⬛","🎃","👻","🦇","🎃","🐈‍⬛","👻","🎃","🦇"],
      floaters:["🦇","✦","✨","🕸️","✦","🦇","✨"],glow:"#d5782f58",trim:"#7f411f50"
    },
    veterans:{
      label:"Veterans Day",icons:["🇺🇸","🎖️","⭐"],
      garland:["🇺🇸","⭐","🎖️","🇺🇸","⭐","🕊️","🇺🇸","⭐","🎖️","🇺🇸","⭐"],
      floaters:["⭐","✦","✨","⭐","🕊️","✨","✦"],glow:"#a2a9b95b",trim:"#8e9eac48"
    },
    thanksgiving:{
      label:"Thanksgiving",icons:["🍁","🦃","🍂"],
      garland:["🍁","🍂","🦃","🍁","🍂","🍁","🦃","🍂","🍁","🍂","🍁","🦃"],
      floaters:["🍂","🍁","✦","🍁","🍂","🍃","🍁"],glow:"#c7963e4b",trim:"#bb793a43"
    },
    christmas:{
      label:"Christmas",icons:["⛄","🎄","☃️"],
      garland:["❄️","✧","⛄","❄️","🎄","❄️","⛄","✧","❄️","🎁","❄️","⛄"],
      floaters:["❄","✦","❄","✧","❄","✦","❄"],glow:"#6caaae3f",trim:"#6a9b9540",lights:true
    }
  };
  const allowed=new Set(["auto","none",...Object.keys(designs)]);
  const root=document.documentElement;
  const positions=[
    [17,46,18,-18,.66],[32,36,20,14,.55],[55,43,17,-7,.72],
    [24,15,16,13,.55],[71,51,21,-12,.58],[44,10,15,18,.55],[76,25,18,2,.65]
  ];
  // Month is 1-12, weekday is 0 Sunday through 6 Saturday.
  function nthWeekday(year,month,weekday,n){
    const first=new Date(year,month-1,1).getDay();
    return 1+(weekday-first+7)%7+7*(n-1);
  }
  function lastWeekday(year,month,weekday){
    const last=new Date(year,month,0);
    return last.getDate()-(last.getDay()-weekday+7)%7;
  }
  // Gregorian computus (Anonymous Gregorian algorithm), handles early and late Easter.
  function easterSunday(year){
    const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4);
    const e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3);
    const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4;
    const l=(32+2*e+2*i-h-k)%7;
    const m=Math.floor((a+11*h+22*l)/451);
    const month=Math.floor((h+l-7*m+114)/31);
    const day=(h+l-7*m+114)%31+1;
    return new Date(year,month-1,day);
  }
  function deltaDays(date,year,month,day){
    return Math.round((Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())-
      Date.UTC(year,month-1,day))/86400000);
  }
  function near(date,year,month,day,before,after){
    const d=deltaDays(date,year,month,day);
    return d>=-before&&d<=after;
  }
  function holidayForDate(date=new Date()){
    const year=date.getFullYear(),month=date.getMonth()+1,day=date.getDate();
    // Keep Christmas through December 30; New Year's displays Dec 31-Jan 5.
    if((month===12&&day===31)||(month===1&&day<=5))return "newyear";
    if(month===1&&near(date,year,1,nthWeekday(year,1,1,3),2,1))return "mlk";
    if(month===2&&day>=8&&day<=14)return "valentine";
    if(month===2&&near(date,year,2,nthWeekday(year,2,1,3),2,1))return "presidents";
    if(month===3&&day>=11&&day<=17)return "stpatricks";
    // Easter can fall in March or April. A ten-day lead-in emphasizes the holiday.
    const easter=easterSunday(year);
    if(near(date,year,easter.getMonth()+1,easter.getDate(),10,1))return "easter";
    if(month===4&&day>=21&&day<=23)return "earthday";
    if(month===5&&near(date,year,5,nthWeekday(year,5,0,2),3,1))return "mothersday";
    if(month===5&&near(date,year,5,lastWeekday(year,5,1),5,1))return "memorial";
    if(month===6&&day>=12&&day<=15)return "flagday";
    if(month===6&&near(date,year,6,nthWeekday(year,6,0,3),2,1)&&day!==19)return "fathersday";
    if(month===6&&day>=17&&day<=20)return "juneteenth";
    if((month===6&&day>=30)||(month===7&&day<=7))return "independence";
    if(month===9&&near(date,year,9,nthWeekday(year,9,1,1),4,1))return "labor";
    if(month===10&&near(date,year,10,nthWeekday(year,10,1,2),1,1))return "octoberday";
    if(month===10)return "halloween";
    if(month===11&&day>=9&&day<=12)return "veterans";
    if(month===11)return "thanksgiving";
    if(month===12)return "christmas";
    return "none";
  }
  function savedMode(){
    try{
      const v=localStorage.getItem(STORAGE);
      return allowed.has(v)?v:"auto";
    }catch(e){return "auto";}
  }
  function persist(mode){
    try{localStorage.setItem(STORAGE,mode);}catch(e){/* Browser storage may be unavailable. */}
  }
  let selectedMode=savedMode(),current=null;
  function make(parent,tag,cls,content){
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(content!==undefined)node.textContent=content;
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
    mount.style.setProperty("--holiday-glow",d.glow);
    mount.style.setProperty("--holiday-trim-bg",d.trim);
    make(mount,"div","holiday-aurora");
    const figures=make(mount,"div","holiday-figures");
    d.icons.forEach(icon=>make(figures,"span","holiday-figure",icon));
    const floating=make(mount,"div","holiday-floaters");
    d.floaters.forEach((icon,index)=>{
      const [top,right,size,tilt,opacity]=positions[index%positions.length];
      const fl=make(floating,"span","holiday-floater",icon);
      fl.style.setProperty("--holiday-top",top+"%");
      fl.style.setProperty("--holiday-right",right+"%");
      fl.style.setProperty("--holiday-size",size+"px");
      fl.style.setProperty("--holiday-tilt",tilt+"deg");
      fl.style.setProperty("--holiday-opacity",String(opacity));
    });
    if(d.lights){
      const cord=make(mount,"div","holiday-light-cord");
      const colors=["#f2bb58","#df6369","#5ac99b","#69b6f0"];
      for(let k=0;k<22;k++){
        const bulb=make(cord,"span","holiday-bulb");
        bulb.style.setProperty("--bulb-color",colors[k%4]);
        bulb.style.setProperty("--bulb-delay",(k%6*.36)+"s");
      }
    }
    const trim=make(mount,"div","holiday-trim");
    d.garland.forEach(icon=>make(trim,"span","",icon));
    const choice=document.getElementById("holiday-decor-select");
    const auto=choice?.querySelector('option[value="auto"]');
    if(auto)auto.textContent="Automatic ("+(designs[holidayForDate()]?.label||"No decor")+")";
  }
  function init(){
    const select=document.getElementById("holiday-decor-select");
    if(select){
      select.value=selectedMode;
      select.addEventListener("change",()=>{
        const next=select.value;
        if(!allowed.has(next))return;
        selectedMode=next;
        persist(next);
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
    holidayForDate,easterSunday,nthWeekday,lastWeekday,
    getActive:()=>root.getAttribute("data-holiday"),
    getPreference:()=>selectedMode,
    listThemes:()=>Object.keys(designs)
  };
})();