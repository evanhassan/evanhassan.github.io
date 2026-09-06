import {C,fmt,tooltip,svgBox,gridX,axisBottom,axisLeft,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data){
 const cats=Array.from(new Set(data.map(d=>d.category))), buckets=['1–3','4–10','11–20','21+'].filter(b=>data.some(d=>d.rank_bucket===b));
 const box=svgBox(sel,{height:520,margin:{top:20,right:112,bottom:52,left:238}}),{g,innerW,innerH}=box,t=tooltip(); const x=d3.scaleLinear().domain([0,d3.max(data,d=>d.avg_weight)]).nice().range([0,innerW]), y=d3.scalePoint().domain(cats).range([0,innerH]).padding(.62); const color=d3.scaleOrdinal().domain(buckets).range([C.accent,C.secondary,C.warn,C.peer]);
 gridX(g,x,innerH,5); axisLeft(g,y); axisBottom(g,x,innerH,5,d3.format('.0%'));
 cats.forEach(c=>g.append('line').attr('x1',0).attr('x2',innerW).attr('y1',y(c)).attr('y2',y(c)).attr('stroke',C.line).attr('opacity',.55));
 g.selectAll('circle').data(data).join('circle').attr('cx',d=>x(d.avg_weight)).attr('cy',d=>y(d.category)+(buckets.indexOf(d.rank_bucket)-(buckets.length-1)/2)*5).attr('r',6).attr('fill',d=>color(d.rank_bucket)).on('mousemove',(e,d)=>t.show(`<b>CLE rank ${d.rank_bucket}</b><br>${d.category}<br>Average category weight: ${d3.format('.1%')(d.avg_weight)}<br>Simulations: ${d.n}`,e)).on('mouseleave',t.hide);
 buckets.forEach((b,i)=>g.append('text').attr('x',innerW-90).attr('y',18+i*18).attr('fill',color(b)).attr('font-size',12).text(`CLE ${b}`));
 note(sel,'Grouped dots compare the average category weights in simulations where Cleveland ranks very poorly versus relatively better.');
}
