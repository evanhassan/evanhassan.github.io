import {C,fmt,tooltip,svgBox,gridX,axisBottom,axisLeft,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data){
 const top=data.slice(0,15); const watson=data.find(d=>/Deshaun Watson/i.test(`${d.assets_received} ${d.assets_surrendered}`));
 const rows=(watson&&!top.includes(watson)?[...top,watson]:data.slice(0,16)).reverse(); const labels=rows.map(d=>`${d.year} ${d.decision_type}: ${String(d.assets_received).slice(0,46)}`);
 const box=svgBox(sel,{height:570,margin:{top:16,right:94,bottom:48,left:272}}),{g,innerW,innerH}=box,t=tooltip(); const x=d3.scaleLinear().domain([0,d3.max(rows,d=>d.standardized_pain_score)]).nice().range([0,innerW]), y=d3.scalePoint().domain(labels).range([0,innerH]).padding(.52);
 gridX(g,x,innerH,5); axisLeft(g,y); axisBottom(g,x,innerH,5);
 g.selectAll('line.personnel-lolli').data(rows).join('line').attr('class','personnel-lolli').attr('x1',0).attr('x2',d=>x(d.standardized_pain_score)).attr('y1',(d,i)=>y(labels[i])).attr('y2',(d,i)=>y(labels[i])).attr('stroke',d=>d.decision_type==='trade'?C.secondary:C.accent).attr('stroke-width',2.2).attr('opacity',.86);
 g.selectAll('circle').data(rows).join('circle').attr('cx',d=>x(d.standardized_pain_score)).attr('cy',(d,i)=>y(labels[i])).attr('r',d=>d.league_percentile>=95?8:6).attr('fill',d=>d.decision_type==='trade'?C.secondary:C.accent).on('mousemove',(e,d)=>t.show(`<b>${d.year} ${d.decision_type}</b><br>Received: ${d.assets_received}<br>Surrendered: ${d.assets_surrendered}<br>Expected value: ${fmt.num(d.expected_value)}<br>Realized value: ${fmt.num(d.realized_value)}<br>Pain score: ${fmt.num(d.standardized_pain_score)}<br>League percentile: ${fmt.pct(d.league_percentile)}`,e)).on('mouseleave',t.hide);
 g.selectAll('text.val').data(rows).join('text').attr('x',d=>x(d.standardized_pain_score)+10).attr('y',(d,i)=>y(labels[i])+4).attr('fill',C.muted).attr('font-size',12).text(d=>fmt.num(d.standardized_pain_score));
 g.append('text').attr('x',innerW-92).attr('y',16).attr('fill',C.accent).attr('font-size',12).text('draft');g.append('text').attr('x',innerW-92).attr('y',34).attr('fill',C.secondary).attr('font-size',12).text('trade');
 note(sel,'Cleveland-specific ranked personnel decisions; draft and trade pain are not mixed into a league-wide distribution in this view.');
}
