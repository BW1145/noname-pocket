import { ui, game, lib, get } from "../../../../noname.js";

// Keep the original controls, callbacks, dynamic visibility, and sibling-dependent blocks.
const groups = [
 ["sound", "声音", [
  ["音乐与音量", "background_music volumn_background import_music clear_background_music effectBGM_mb_caomao effectBGM_pot_weiyan"],
  ["音效与配音", "background_audio background_speak volumn_audio equip_audio repeat_audio jiubanshanghai jiubanlhyy jiubanpeiyin"]]],
 ["display", "画面", [
  ["布局与缩放", "theme menu_style control_style dhkmh layout splash_style player_height player_height_nova ui_zoom phonelayout mount_combine zwbjtz equipLayout custom_button custom_button_system_top custom_button_system_bottom custom_button_control_top custom_button_control_bottom radius_size"],
  ["背景与字体", "image_background image_background_random image_background_blur dynamicBackground name_font identity_font cardtext_font global_font suits_font font_format zitijiazai"],
  ["卡牌与手牌", "card_style cardback_style cardshape cardtempname cardPrettify cardAlternateNameVisible fold_card foldCardMinWidth equip_span hide_card_image seperate_control ssuispzdpx"],
  ["武将与皮肤", "change_skin change_skin_auto player_style border_style autoborder_count autoborder_start player_border hp_style buttoncharacter_style buttoncharacter_prefix outcropSkin outcropSkingdtz outcropSkingdtzxjk outcropSkingdtzpdk dynamicSkin dynamicSkinOutcrop dynamicSkin_random playerMarkStyle campIdentityImageMode bentipifu_gn"],
  ["信息与提示", "glow_phase turned_style link_style2 show_rarity right_range show_name show_sex show_group show_card_prompt hide_card_prompt_basic hide_card_prompt_equip show_phase_prompt show_phaseuse_prompt show_cardpile_number show_characternamepinyin show_skillnamepinyin biaojixiugai szn_weigongduilie kjspxs szn_shoupaishuxsxf szn_shoupaishangxian gainSkillsVisible notuoguanzhong jindutiao JDTS"],
  ["按钮与状态栏", "show_time show_time2 watchface show_time3 show_statusbar_android show_statusbar_ios show_round_menu show_favmode show_favourite_menu show_ban_menu show_replay show_playerids show_sortcard show_pause show_auto show_volumn show_cardpile show_handcardbutton show_giveup show_wuxie wuxie_right"],
  ["动画与效果", "low_performance blur_ui glass_ui damage_shake button_press jiu_effect animation skill_animation_type die_move target_shake jinengeffect gameAnimationEffect playerDieEffect playerLineEffect playerKillEffect cardUseEffect"]]],
 ["input", "操作", [
  ["确认与响应", "confirm_exit auto_confirm skip_shan unauto_choose wuxie_self tao_enemy"],
  ["触控与选牌", "enable_drag enable_dragline enable_touchdragline touchscreen swipe swipe_down swipe_up swipe_left swipe_right round_menu_func right_click mousewheel popequip filternode_button mark_identity_style remember_round_button remember_dialog"],
  ["速度与设备", "game_speed sync_speed speedupafterdie keep_awake enable_vibrate cursor_style"],
  ["资料查看与选将", "longpress_info right_info hover_all hover_handcard hoveration doubleclick_intro auto_popped_config show_charactercard show_favourite character_dialog_tool recent_character_number"],
  ["记录与暂停", "show_history pop_logv show_log clear_log log_highlight auto_popped_history transparent_dialog show_discardpile"],
  ["菜单与启动", "show_splash fold_mode"],
  ["表情与交互", "jiubanjhbq"]]],
 ["gameplay", "对局工具", [
  ["扩展规则", "lucky_star hujiashangxian hujiashixiao nuqishangxian guozhanmogai coinextraconfig"],
  ["牌堆与候选武将", "paiduiqiehuan houxuanwujiangshuxiugai"]]],
 ["characters", "资料与选将", []],
 ["maintenance", "数据与维护", [
  ["录像与保存", "video"],
  ["更新与扩展来源", "auto_check_update update_link extension_source show_extensionmaker show_extensionshare"],
  ["运行与诊断", "compatiblemode max_loadtime dev extension_alert fuck_sojson errstop eruda ssuishowFPS"]]],
];
const commonKeys = ["background_audio", "background_speak", "background_music", "volumn_audio", "volumn_background", "ui_zoom", "game_speed"];
// Each block keeps its original sibling order, including controls that expand dependent rows.
const customBlocks = {
 1:["input","设置搜索"], 2:["input","快捷菜单"], 3:["gameplay","身份人数配置"],
 4:["characters","电脑选将限制"],5:["characters","禁将"],6:["characters","禁卡"],
 7:["characters","武将资料卡"],8:["characters","卡牌资料卡"],9:["input","长按菜单"],
 10:["display","称号与性别"],11:["display","引文显示"],12:["maintenance","控制台"],
 13:["gameplay","控制角色"],14:["characters","自由选将搜索与筛选"],15:["gameplay","局内重新选将"],
 16:["gameplay","交换位置"],17:["gameplay","调整卡牌与手气卡"],18:["maintenance","导入与重启"],
 19:["maintenance","运行兼容"],20:["input","表情与快捷语音"],21:["gameplay","扩展对局模式"],
 22:["maintenance","效果测试"],23:["characters","收藏与最近"],24:["characters","禁用武将切换"]
};
const text = s => String(s || "").replace(/<[^>]*>/g, "").replace(/^[|•\s]+/, "").trim();

export function organizeSettings(options, extensions, characters) {
 const nav = options.firstChild, right = options.lastChild;
 const original = [...nav.children];
 const sections = new Map(), rows = new Map(), homes = new Map(), groupNodes = new Map();
 const lookup = new Map();
 for(const [id,,items] of groups)for(const [title,keys]of items)for(const key of keys.split(" "))lookup.set(key,[id,title]);
 function group(id,title) {
  const key=id+"/"+title;
  if(groupNodes.has(key))return groupNodes.get(key);
  const parent=sections.get(id), box=ui.create.div("",parent);
  const heading=ui.create.div(".config.more",title+' <div>⌄</div>',box);
  const body=ui.create.div("",box);
  // Expand one named group at a time; the first group starts open.
  body.hidden=parent.children.length>1;
  heading.classList.toggle("on",!body.hidden);
  heading.listen(function(){body.hidden=!body.hidden;heading.classList.toggle("on",!body.hidden);});
  const entry={heading,body,open(){body.hidden=false;heading.classList.add("on");}};
  groupNodes.set(key,entry);return entry;
 }
 for(const [id]of groups)sections.set(id,ui.create.div(""));
 const sourcePages=original.filter(n=>["general","appearence","view","audio"].includes(n.mode));
 for(const source of sourcePages){
  for(const node of [...source.link.children]){
   const key=node._link?.config?._name;
   if(!key)continue;
   const target=lookup.get(key);
   // Preserve unlisted dynamic controls together with their original source page.
   const dest=target||["maintenance","运行与诊断"];
   group(...dest).body.appendChild(node);rows.set(key,node);
  }
 }
 for(const pack of [...extensions.firstChild.children]){
  if(!pack.link||!pack.mode?.startsWith("extension_"))continue;
  const name=pack.mode.slice(10);
  if(!["十周年UI","手杀ui","搬运自用"].includes(name))continue;
  const nodes=[...pack.link.children];
  if(name==="搬运自用"){
   let block=[];let target=null;
   const flush=()=>{if(target&&block.length){const body=group(...target).body;for(const n of block)body.appendChild(n);}block=[];};
   for(const node of nodes){
    const key=node._link?.config?._name?.slice((pack.mode+"_").length);
    const match=key?.match(/^byzyfgx(\d+)$/);
    if(match){flush();target=customBlocks[Number(match[1])]||null;}
    if(key==="kzjmsf") { node.style.display="none"; block.push(node); continue; }
    if(key==="zyykzjmsf") { group("display","自定义缩放").body.appendChild(node); continue; }
    if(target)block.push(node);
    else if(["byzy_zxgn","byzy_ziyuzile","byzy_shoupaikeshi","byzy_wjtjgn","byzy_hdygewdhh","byzy_zyysppd","byzy_jhycwz"].includes(key))group("gameplay","自娱自乐与局内工具").body.appendChild(node);
   }
   flush();
  }else{
   for(const node of nodes){
    const key=node._link?.config?._name?.slice((pack.mode+"_").length);
    if(key==="zidonghuanfu"){node.style.display="none";continue;}
    const dest=lookup.get(key);
    if(dest){group(...dest).body.appendChild(node);rows.set(pack.mode+"_"+key,node);}
   }
  }
 }
 // Common settings borrow the very same native nodes; returning restores their category slots.
 const common=ui.create.div("");
 for(const key of commonKeys){const node=rows.get(key);if(node){const anchor=document.createComment(key);node.before(anchor);homes.set(key,anchor);}}
 function restoreCommon(){for(const[key,anchor]of homes)anchor.after(rows.get(key));}
 const saved=lib.config.playcase_settings_category;
 nav.replaceChildren();right.replaceChildren();
 const search=document.createElement("input");search.type="search";search.placeholder="搜索设置";search.setAttribute("aria-label","搜索设置");
 Object.assign(search.style,{width:"calc(100% - 20px)",margin:"8px 10px",boxSizing:"border-box",fontSize:"14px"});nav.appendChild(search);
 let active=null;
 function select(button,page,id){
  restoreCommon();if(active)active.classList.remove("active");right.replaceChildren();
  if(id==="common")for(const key of commonKeys){const row=rows.get(key);if(row)common.appendChild(row);}
  right.appendChild(page);button?.classList.add("active");active=button;
  if(id)game.saveConfig("playcase_settings_category",id);
 }
 const buttons=new Map();
 function button(id,title,page){const node=ui.create.div(".menubutton.large",title,nav);node.mode=id;node.link=page;node.listen(()=>{search.value="";select(node,page,id);});buttons.set(id,node);return node;}
 button("common","常用",common);
 for(const[id,title]of groups){if(sections.get(id).childElementCount)button(id,title,sections.get(id));}
 for(const node of original){
  if(sourcePages.includes(node))continue;
  if(node.mode==="others"){
   const body=group("maintenance","数据导入、导出与重置").body;
   if(node.link)body.appendChild(node.link);
   continue;
  }
  const b=ui.create.div(".menubutton.large",node.innerHTML,nav);b.mode=node.mode;b.link=node.link;
  b._initLink=()=>{if(!node.link)node._initLink();b.link=node.link;};
  b.listen(()=>{search.value="";b._initLink();select(b,b.link,node.mode);});buttons.set(node.mode,b);
 }
 const records=[];
 for(const [path,entry]of groupNodes){const [id,title]=path.split("/");for(const row of entry.body.querySelectorAll(".config")){
  const cfg=row._link?.config;if(!cfg||cfg.clear)continue;
  records.push({id,title,row,entry,name:text(cfg.name),description:text(typeof cfg.intro==="string"?cfg.intro:"")});
 }}
 // Index native pack and subgroup switches, including disabled content.
 const packRecords=[];
 for(const pack of characters.firstChild.children){
  const id=pack.mode;if(!id||id.startsWith("mode_"))continue;
  const members=Object.keys(lib.characterPack[id]||{}), splits=lib.characterSort[id]||{};
  const entries=[[null,members],...Object.entries(splits)];
  for(const [sub,list] of entries){
   const title=text(lib.translate[sub||id+"_character_config"]||sub||id);
   const terms=list.flatMap(name=>[name,lib.translate[name]||"",lib.translate[name+"_prefix"]||""]).join(" ");
   packRecords.push({name:title,members:list,keywords:title+" "+terms,status(){const banned=lib.config[get.mode()+"_banned"]||[];const count=list.filter(n=>!banned.includes(n)).length;return !lib.config.characters.includes(id)||!count?"未启用":count===list.length?"已启用":count+"/"+list.length+"启用";},open(){
    ui.click.menuTab("武将");
    if(!pack.link)pack._initLink();
    for(const sibling of characters.firstChild.children)sibling.classList.remove("active");pack.classList.add("active");characters.lastChild.replaceChildren(pack.link);ui.updateCharacterPackMenu.forEach(update=>update());
    const target=[...pack.link.querySelectorAll(".config")].find(n=>n._link?.config?._name===(sub||id))||pack.link.querySelector(".config");
    target?.scrollIntoView({block:"center"});
   }});
  }
 }
 search.addEventListener("input",()=>{
  const query=search.value.trim();if(!query){const id=buttons.has(saved)?saved:"common";buttons.get(id)._initLink?.();select(buttons.get(id),buttons.get(id).link,id);return;}
  const results=ui.create.div("");select(null,results);
  const matches=records.filter(r=>(r.name+" "+r.description).includes(query));
  const packs=packRecords.filter(r=>r.keywords.toLowerCase().includes(query.toLowerCase()));
  for(const item of packs){const hits=item.members.filter(n=>(n+" "+(lib.translate[n]||"")).toLowerCase().includes(query.toLowerCase())).slice(0,4).map(n=>lib.translate[n]||n);const row=ui.create.div(".config",item.name+" · "+item.status()+(hits.length?" · "+hits.join("、"):""),results);row.style.height="auto";row.style.whiteSpace="normal";row.listen(item.open);}
  for(const item of matches){const node=ui.create.div(".config",item.name+' <small style="opacity:.65">· '+item.title+'</small>',results);node.listen(()=>{search.value="";select(buttons.get(item.id),sections.get(item.id),item.id);item.entry.open();item.row.scrollIntoView({block:"center"});});}
  if(!matches.length&&!packs.length)ui.create.div(".config","没有找到对应设置",results);
 });
 const initial=buttons.has(saved)?saved:"common";buttons.get(initial)._initLink?.();select(buttons.get(initial),buttons.get(initial).link,initial);
}
