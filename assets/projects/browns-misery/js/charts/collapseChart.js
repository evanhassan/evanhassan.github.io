import {C,fmt,tooltip,svgBox,gridX,axisBottom,axisLeft,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data){
 const rows=data.slice(0,12).reverse(); const labels=rows.map(d=>`${String(d.gameday).slice(0,10)} vs ${d.opponent}`);
 const box=svgBox(sel,{height:490,margin:{top:16,right:76,bottom:48,left:190}}),{g,innerW,innerH}=box,t=tooltip();
 const x=d3.scaleLinear().domain([50,100]).range([0,innerW]), y=d3.scalePoint().domain(labels).range([0,innerH]).padding(.55);
 gridX(g,x,innerH,5); axisLeft(g,y); axisBottom(g,x,innerH,5,d=>d+'%');
 g.append('line').attr('x1',x(90)).attr('x2',x(90)).attr('y2',innerH).attr('stroke',C.warn).attr('stroke-dasharray','3 5').attr('opacity',.45);
 g.append('text').attr('x',x(90)+6).attr('y',-5).attr('class','annotation').text('90% win probability');
 g.selectAll('line.lolli').data(rows).join('line').attr('class','lolli').attr('x1',x(50)).attr('x2',d=>x(d.peak_wp*100)).attr('y1',(d,i)=>y(labels[i])).attr('y2',(d,i)=>y(labels[i])).attr('stroke',C.accent).attr('stroke-width',2);
 g.selectAll('circle').data(rows).join('circle').attr('cx',d=>x(d.peak_wp*100)).attr('cy',(d,i)=>y(labels[i])).attr('r',6).attr('fill',C.accent).on('mousemove',(e,d)=>t.show(`<b>${d.gameday} vs ${d.opponent}</b><br>Peak Browns WP before losing: ${fmt.pct(d.peak_wp*100)}<br>Final: CLE ${d.pf}, ${d.opponent} ${d.pa}`,e)).on('mouseleave',t.hide);
 rows.slice(-3).forEach((d,i)=>g.append('text').attr('x',Math.min(innerW-50,x(d.peak_wp*100)+10)).attr('y',y(labels[rows.indexOf(d)])+4).attr('fill',C.text).attr('font-size',12).text(fmt.pct(d.peak_wp*100)));
 note(sel,'Ranked Browns regular-season losses by maximum modeled win probability before the loss.');
}
