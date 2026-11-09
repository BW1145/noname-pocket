import { ui, game, lib, get, _status } from "../../../../noname.js";

export function applyStarterContent(){
 if(lib.config.noname_pocket_content_initialized)return;
 const allowed=new Set([...Object.keys(lib.characterPack.standard||{}),...(lib.characterSort.mobile?.mobile_yijiang1||[])]);
 // The native group switches update this same per-mode ban list.
 const banned=Object.keys(lib.character).filter(name=>!allowed.has(name));
 game.saveConfig("identity_banned",banned);
 game.saveConfig("characters",["standard","mobile"]);
 game.saveConfig("noname_pocket_content_initialized",true);
}

export function modeHelp(){
 const mode=get.mode();
 const sub=get.config(mode+"_mode");
 const keys={tafang:"塔防模式",chess:"战棋模式",stone:"炉石模式",guozhan:"国战模式",doudizhu:"斗地主",versus:"对决模式",identity:({normal:"身份模式",zhong:"明忠模式",stratagem:"谋攻模式",purple:"3v3v2"}[sub]||"身份模式"),single:({changban:"血战长坂",wuxianhuoli:"无限火力"}[sub])};
 const key=keys[mode];let html=key&&lib.help[key];
 if(!html)return null;
 if(mode==="tafang")html='<div style="margin:10px">第一轮怎么操作</div><ul><li>在“招募”中选择武将，切到“布防”选择机关，留意剩余行动点。<li>点“完成”，再按照出现的提示选择机关与武将的放置位置。</ul>'+html;
 // The original versus/chess pages contain several submodes; show the current section.
 const wanted=mode==="versus"?({siguo:"同舟共济",two:"2v2",four:"4v4"}[sub]):mode==="chess"?({combat:"对阵模式",leader:"君主模式"}[sub]):null;
 if(wanted){const chunks=html.split(/(?=<div style="margin:10px">)/);html=chunks.find(s=>s.includes(wanted))||html;}
 return {key,html};
}
export function installModeHelp(){
 if(ui.nonamePocketHelp)return;
 const help=modeHelp();if(!help)return;
 ui.nonamePocketHelp=ui.create.system("玩法说明",()=>{
  const current=modeHelp();if(!current)return;
  const wasPaused=_status.paused2; if(!wasPaused)game.pause2();
  const dialog=ui.create.dialog(current.key,"hidden");
  dialog.addText(current.html,false);
  dialog.style.width="min(720px, calc(100% - 40px))";
  dialog.style.maxHeight="80%";
  const close=ui.create.div(".menubutton","关闭",dialog.content,()=>{dialog.close();if(!wasPaused)game.resume2();});
  close.style.position="relative";close.style.margin="12px auto";
  dialog.open();
 },true);
}
