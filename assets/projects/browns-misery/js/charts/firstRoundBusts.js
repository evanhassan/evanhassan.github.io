import {C,fmt,tooltip,svgBox,gridX,axisBottom,axisLeft,note} from '../shared/helpers.js';
const d3=window.d3;
export function render(sel,data){
 const rows=data.slice().sort((a,b)=>b.first_round_out_within_3-a.first_round_out_within_3 || b.first_round_short_tenure_rate-a.first_round_short_tenure_rate).slice(0,14).reverse();
 const box=svgBox(sel,{height:450,margin:{top:16,right:88,bottom:48,left:58}}),{g,innerW,innerH}=box,t=tooltip();
 const x=d3.scaleLinear().domain([0,d3.max(rows,d=>d.first_round_out_within_3)]).nice().range([0,innerW]); const y=d3.scalePoint().domain(rows.map(d=>d.franchise_id)).range([0,innerH]).padding(.6);
 gridX(g,x,innerH,5); axisLeft(g,y); axisBottom(g,x,innerH,5);
 g.selectAll('line.bust-lolli').data(rows).join('line').attr('class','bust-lolli').attr('x1',0).attr('x2',d=>x(d.first_round_out_within_3)).attr('y1',d=>y(d.franchise_id)).attr('y2',d=>y(d.franchise_id)).attr('stroke',d=>d.franchise_id==='CLE'?C.accent:C.peer).attr('stroke-width',d=>d.franchise_id==='CLE'?2.6:1.4).attr('opacity',d=>d.franchise_id==='CLE'?1:.7);
 g.selectAll('circle').data(rows).join('circle').attr('cx',d=>x(d.first_round_out_within_3)).attr('cy',d=>y(d.franchise_id)).attr('r',d=>d.franchise_id==='CLE'?8:5).attr('fill',d=>d.franchise_id==='CLE'?C.accent:C.peer).on('mousemove',(e,d)=>t.show(`<b>${d.franchise_id}</b><br>${d.first_round_out_within_3} first-round bust-proxy picks<br>${d.first_round_picks} first-round picks sampled<br>${d3.format('.0%')(d.first_round_short_tenure_rate)} out within three years`,e)).on('mouseleave',t.hide);
 g.selectAll('text.val').data(rows).join('text').attr('x',d=>x(d.first_round_out_within_3)+10).attr('y',d=>y(d.franchise_id)+4).attr('fill',d=>d.franchise_id==='CLE'?C.text:C.muted).attr('font-size',12).text(d=>d.first_round_out_within_3);
 note(sel,'Definition: a first-round “bust” proxy is any first-round pick out of the league within three years in the nflverse draft data.');
}
