import {C,fmt,tooltip,svgBox,axisBottom,axisLeft,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data){
 const years=Array.from(new Set(data.map(d=>d.season))).sort((a,b)=>a-b), cats=Array.from(new Set(data.map(d=>d.category)));
 const box=svgBox(sel,{height:640,margin:{top:18,right:32,bottom:76,left:132}}),{g,innerW,innerH}=box,t=tooltip();
 const x=d3.scaleBand().domain(cats).range([0,innerW]).padding(.08), y=d3.scaleBand().domain(years).range([0,innerH]).padding(.04);
 const color=d3.scaleDiverging([-2.5,0,2.5],d3.interpolateRgbBasis([C.secondary,'#182018',C.accent]));
 g.selectAll('rect').data(data).join('rect').attr('x',d=>x(d.category)).attr('y',d=>y(d.season)).attr('width',x.bandwidth()).attr('height',y.bandwidth()).attr('fill',d=>color(Math.max(-2.5,Math.min(2.5,d.score)))).attr('stroke',C.bg).attr('stroke-width',1).on('mousemove',(e,d)=>t.show(`<b>${d.season}</b><br>${d.category}: ${fmt.signed(d.score)} z${d.rank?`<br>League rank: ${d.rank}`:''}`,e)).on('mouseleave',t.hide);
 axisLeft(g,y).call(d3.axisLeft(y).tickSize(0).tickValues(years.filter(y=>y%2===0))); axisBottom(g,x,innerH,0).selectAll('text').attr('transform','rotate(-28)').attr('text-anchor','end').attr('dx','-.4em').attr('dy','.2em');
 g.append('text').attr('x',innerW-4).attr('y',-6).attr('text-anchor','end').attr('class','annotation').text('darker blue = less pain · green = more pain');
 note(sel,'Season heatmap uses annual Cleveland loss-rate and point-differential pain z-scores; hover cells for exact season values.');
}
