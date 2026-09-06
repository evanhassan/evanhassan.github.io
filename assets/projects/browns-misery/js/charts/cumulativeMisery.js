import {C,fmt,tooltip,svgBox,gridX,gridY,axisBottom,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data){
 const teams=Array.from(new Set(data.map(d=>d.franchise_id))); const box=svgBox(sel,{height:480,margin:{top:18,right:70,bottom:48,left:56}}),{g,innerW,innerH}=box,t=tooltip();
 const x=d3.scaleLinear().domain(d3.extent(data,d=>d.season)).range([0,innerW]), y=d3.scaleLinear().domain(d3.extent(data,d=>d.cumulative_misery)).nice().range([innerH,0]), line=d3.line().x(d=>x(d.season)).y(d=>y(d.cumulative_misery)).curve(d3.curveMonotoneX);
 gridX(g,x,innerH,6); gridY(g,y,innerW,5); axisBottom(g,x,innerH,6,d3.format('d')); g.append('g').attr('class','axis').call(d3.axisLeft(y).ticks(5));
 teams.forEach(tm=>{const dd=data.filter(d=>d.franchise_id===tm).sort((a,b)=>a.season-b.season); const path=g.append('path').datum(dd).attr('fill','none').attr('stroke',tm==='CLE'?C.accent:C.peer).attr('stroke-width',tm==='CLE'?3.2:1.35).attr('opacity',tm==='CLE'?1:.72).attr('d',line); const last=dd[dd.length-1]; g.append('text').attr('x',x(last.season)+5).attr('y',y(last.cumulative_misery)+4).attr('fill',tm==='CLE'?C.accent:C.muted).attr('font-size',11).attr('font-weight',tm==='CLE'?800:400).text(tm)});
 [{yr:1999,txt:'expansion return'},{yr:2017,txt:'0-16'},{yr:2020,txt:'brief playoff reset'}].forEach(a=>{g.append('line').attr('x1',x(a.yr)).attr('x2',x(a.yr)).attr('y1',0).attr('y2',innerH).attr('stroke',C.grid).attr('stroke-dasharray','2 6').attr('opacity',.35);g.append('text').attr('x',x(a.yr)+4).attr('y',18).attr('class','annotation').text(a.txt)});
 note(sel,'Cumulative annual z-score proxy from regular-season loss rate and point differential; selected comparison franchises only.');
}
