import {C,fmt,tooltip,svgBox,gridX,axisBottom,axisLeft,wrapText,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data,{onlyWorst=false}={}){
 const root=d3.select(sel);root.selectAll('*').remove();
 function groupedRows(rows){
  const counts=d3.rollup(rows,v=>v.length,d=>d.category);
  return rows.map(d=>({...d,display_category:(counts.get(d.category)<5?'Other':d.category)}));
 }
 data=groupedRows(data);
 const categorySeed=onlyWorst?groupedRows(data.filter(d=>d.cleveland_rank===1)):data;
 const cats=['All',...Array.from(new Set(categorySeed.map(d=>d.display_category)))];
 const ctrl=root.append('div').attr('class','control');ctrl.append('span').text('Filter');ctrl.append('select').selectAll('option').data(cats).join('option').text(d=>d);
 const chart=root.append('div').attr('class','chart');
 function draw(cat='All'){
  let rows=data.filter(d=>!onlyWorst||d.cleveland_rank===1);
  if(onlyWorst) rows=groupedRows(rows);
  if(cat!=='All')rows=rows.filter(d=>d.display_category===cat);
  rows=rows.sort((a,b)=>b.cleveland_percentile-a.cleveland_percentile).slice(0,onlyWorst?80:80).reverse();
  const box=svgBox(chart.node(),{height:Math.max(410,rows.length*32+72),margin:{top:18,right:112,bottom:46,left:280}}),{g,innerW,innerH}=box,t=tooltip();
  const x=d3.scaleLinear().domain([0,100]).range([0,innerW]); const y=d3.scalePoint().domain(rows.map(d=>d.metric)).range([0,innerH]).padding(.55);
  gridX(g,x,innerH,5); g.append('rect').attr('x',x(90)).attr('y',0).attr('width',innerW-x(90)).attr('height',innerH).attr('fill',C.accent).attr('opacity',.045);
  axisLeft(g,y).selectAll('text').call(wrapText,250); axisBottom(g,x,innerH,5,d=>d);
  g.append('text').attr('x',x(90)+5).attr('y',-5).attr('class','annotation').text('90th+ percentile');
  g.selectAll('line.row').data(rows).join('line').attr('class','row').attr('x1',0).attr('x2',innerW).attr('y1',d=>y(d.metric)).attr('y2',d=>y(d.metric)).attr('stroke',C.line).attr('opacity',.5);
  g.selectAll('circle').data(rows).join('circle').attr('cx',d=>x(d.cleveland_percentile)).attr('cy',d=>y(d.metric)).attr('r',d=>d.cleveland_percentile>=90?7:5).attr('fill',d=>d.cleveland_percentile>=90?C.accent:C.peer).on('mousemove',(e,d)=>t.show(`<b>${d.metric}</b><br>${d.display_category}${d.display_category==='Other'?` <span class="muted">(${d.category})</span>`:''}<br>CLE raw value: ${fmt.num(d.cleveland_raw_value)}<br>CLE league rank: ${fmt.rank(d.cleveland_rank,d.number_franchises_compared)}<br>Misery percentile: ${fmt.pct(d.cleveland_percentile)}`,e)).on('mouseleave',t.hide);
  g.selectAll('text.val').data(rows).join('text').attr('x',d=>Math.min(innerW+4,x(d.cleveland_percentile)+11)).attr('y',d=>y(d.metric)+4).attr('fill',d=>d.cleveland_percentile>=90?C.text:C.muted).attr('font-size',12).text(d=>`${Math.round(d.cleveland_percentile)} · ${fmt.rank(d.cleveland_rank,d.number_franchises_compared)}`);
  note(chart.node(),onlyWorst?'Cleveland-only view: metrics where CLE ranks #1 worst. Axis shows misery percentile where 100 = worst in league.':'Axis shows Cleveland misery percentile for each metric; 100 = worst in league. Hover for raw values and rank.');
 }
 ctrl.select('select').on('change',e=>draw(e.target.value)); draw();
}
