import {C,fmt,tooltip,svgBox,gridX,axisBottom,axisLeft,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data){
 const cle=data.find(d=>d.franchise_id==='CLE');
 const rows=Object.keys(cle).filter(k=>k!=='franchise_id').map(k=>({category:k,value:+cle[k]})).sort((a,b)=>a.value-b.value);
 const box=svgBox(sel,{height:430,margin:{top:16,right:56,bottom:48,left:238}}),{g,innerW,innerH}=box,t=tooltip();
 const max=d3.max(rows,d=>Math.abs(d.value)); const x=d3.scaleLinear().domain([-max,max]).nice().range([0,innerW]); const y=d3.scalePoint().domain(rows.map(d=>d.category)).range([0,innerH]).padding(.62);
 gridX(g,x,innerH,5); g.append('line').attr('x1',x(0)).attr('x2',x(0)).attr('y2',innerH).attr('stroke',C.text).attr('stroke-opacity',.5);
 axisLeft(g,y); axisBottom(g,x,innerH,5);
 g.selectAll('line.bar').data(rows).join('line').attr('class','bar').attr('x1',x(0)).attr('x2',d=>x(d.value)).attr('y1',d=>y(d.category)).attr('y2',d=>y(d.category)).attr('stroke',d=>d.value>=0?C.accent:C.secondary).attr('stroke-width',8).attr('stroke-linecap','round').on('mousemove',(e,d)=>t.show(`<b>${d.category}</b><br>Cleveland z-score: ${fmt.signed(d.value)}<br>${d.value>=0?'Worse':'Better'} than league average`,e)).on('mouseleave',t.hide);
 g.selectAll('circle').data(rows).join('circle').attr('cx',d=>x(d.value)).attr('cy',d=>y(d.category)).attr('r',6).attr('fill',d=>d.value>=0?C.accent:C.secondary);
 g.selectAll('text.value').data(rows).join('text').attr('x',d=>x(d.value)+(d.value>=0?10:-10)).attr('y',d=>y(d.category)+4).attr('text-anchor',d=>d.value>=0?'start':'end').attr('fill',C.muted).attr('font-size',12).text(d=>fmt.signed(d.value));
 g.append('text').attr('x',x(0)+7).attr('y',-5).attr('class','annotation').text('league average');
 note(sel,'Category scores are standardized z-scores. Positive values mean Cleveland is more miserable than league average.');
}
