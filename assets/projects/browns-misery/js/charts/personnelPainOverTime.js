import {C,fmt,tooltip,svgBox,gridY,axisBottom,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data){
 const rows=data.slice().sort((a,b)=>a.year-b.year), worst=data.slice().sort((a,b)=>b.standardized_pain_score-a.standardized_pain_score).slice(0,4);
 const box=svgBox(sel,{height:430,margin:{top:22,right:46,bottom:50,left:58}}),{g,innerW,innerH}=box,t=tooltip(); const x=d3.scaleLinear().domain(d3.extent(rows,d=>d.year)).nice().range([0,innerW]), y=d3.scaleLinear().domain([0,d3.max(rows,d=>d.standardized_pain_score)]).nice().range([innerH,0]);
 gridY(g,y,innerW,5); axisBottom(g,x,innerH,6,d3.format('d')); g.append('g').attr('class','axis').call(d3.axisLeft(y).ticks(5));
 g.selectAll('circle').data(rows).join('circle').attr('cx',d=>x(d.year)).attr('cy',d=>y(d.standardized_pain_score)).attr('r',d=>Math.max(4,Math.min(13,4+(d.league_percentile||50)/12))).attr('fill',d=>d.decision_type==='trade'?C.secondary:C.accent).attr('opacity',.72).on('mousemove',(e,d)=>t.show(`<b>${d.year} ${d.decision_type}</b><br>${d.assets_received}<br>Pain: ${fmt.num(d.standardized_pain_score)}<br>League percentile: ${fmt.pct(d.league_percentile)}`,e)).on('mouseleave',t.hide);
 worst.forEach(d=>g.append('text').attr('x',Math.min(innerW-130,x(d.year)+10)).attr('y',y(d.standardized_pain_score)-8).attr('fill',C.text).attr('font-size',11).text(`${d.year} ${String(d.assets_received).slice(0,20)}`));
 g.append('text').attr('x',innerW-92).attr('y',18).attr('fill',C.accent).attr('font-size',12).text('draft'); g.append('text').attr('x',innerW-92).attr('y',36).attr('fill',C.secondary).attr('font-size',12).text('trade');
 note(sel,'Bubble size scales with league percentile of transaction pain; labels are limited to the worst few decisions.');
}
