import {C,fmt,tooltip,svgBox,gridX,axisBottom,axisLeft,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data,summary){
 const box=svgBox(sel,{height:450,margin:{top:30,right:34,bottom:48,left:58}}),{g,innerW,innerH}=box,t=tooltip();
 const rows=data.slice().sort((a,b)=>a.rank-b.rank); const x=d3.scaleBand().domain(rows.map(d=>d.rank)).range([0,innerW]).padding(.2); const y=d3.scaleLinear().domain([0,d3.max(rows,d=>d.probability)]).nice().range([innerH,0]);
 gridX(g,d3.scaleLinear().domain([1,32]).range([0,innerW]),innerH,6);
 const area=d3.area().x(d=>x(d.rank)+x.bandwidth()/2).y0(innerH).y1(d=>y(d.probability)).curve(d3.curveMonotoneX);
 g.append('path').datum(rows).attr('d',area).attr('fill',C.accent).attr('opacity',.13);
 g.selectAll('line.prob').data(rows).join('line').attr('class','prob').attr('x1',d=>x(d.rank)+x.bandwidth()/2).attr('x2',d=>x(d.rank)+x.bandwidth()/2).attr('y1',innerH).attr('y2',d=>y(d.probability)).attr('stroke',C.accent).attr('stroke-width',2).attr('opacity',.75);
 g.selectAll('circle').data(rows).join('circle').attr('cx',d=>x(d.rank)+x.bandwidth()/2).attr('cy',d=>y(d.probability)).attr('r',4.5).attr('fill',C.accent).on('mousemove',(e,d)=>t.show(`<b>Rank ${d.rank}</b><br>${d3.format('.1%')(d.probability)} of random definitions`,e)).on('mouseleave',t.hide);
 axisBottom(g,x,innerH,0).call(d3.axisBottom(x).tickValues([1,3,5,10,15,20,32])); axisLeft(g,y).call(d3.axisLeft(y).ticks(4).tickFormat(d3.format('.0%')));
 note(sel,'Monte Carlo output is aggregated in Python before export: rank, frequency, probability. Lower rank = more miserable.');
}
