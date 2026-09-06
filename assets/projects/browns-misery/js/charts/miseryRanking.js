import {C,fmt,tooltip,svgBox,gridX,axisBottom,axisLeft,note} from '../shared/helpers.js';
const d3=window.d3;
const LOGO_CODE={LA:'lar',WAS:'wsh',GB:'gb',KC:'kc',NE:'ne',NO:'no',SF:'sf',TB:'tb',LV:'lv',LAC:'lac',JAX:'jax',ARI:'ari',ATL:'atl',BAL:'bal',BUF:'buf',CAR:'car',CHI:'chi',CIN:'cin',CLE:'cle',DAL:'dal',DEN:'den',DET:'det',HOU:'hou',IND:'ind',MIA:'mia',MIN:'min',NYG:'nyg',NYJ:'nyj',PHI:'phi',PIT:'pit',SEA:'sea',TEN:'ten'};
function logoUrl(team){return `https://a.espncdn.com/i/teamlogos/nfl/500/${LOGO_CODE[team]||team.toLowerCase()}.png`;}
export function render(sel,data){
 const rows=data.slice().sort((a,b)=>b.equal_weight_misery_score-a.equal_weight_misery_score);
 const box=svgBox(sel,{height:620,margin:{top:18,right:116,bottom:46,left:52}}),{g,innerW,innerH}=box,t=tooltip();
 const x=d3.scaleLinear().domain(d3.extent(rows,d=>d.equal_weight_misery_score)).nice().range([0,innerW]);
 const y=d3.scalePoint().domain(rows.map(d=>d.franchise_id)).range([0,innerH]).padding(.45);
 const avg=d3.mean(rows,d=>d.equal_weight_misery_score);
 gridX(g,x,innerH,5);
 g.append('line').attr('x1',x(avg)).attr('x2',x(avg)).attr('y2',innerH).attr('stroke',C.grid).attr('stroke-dasharray','3 5').attr('opacity',.8);
 g.append('text').attr('x',x(avg)+6).attr('y',-5).attr('class','annotation').text('league avg');
 g.selectAll('line.lolli').data(rows).join('line').attr('class','lolli').attr('x1',x(avg)).attr('x2',d=>x(d.equal_weight_misery_score)).attr('y1',d=>y(d.franchise_id)).attr('y2',d=>y(d.franchise_id)).attr('stroke',d=>d.franchise_id==='CLE'?C.accent:C.peer).attr('stroke-width',d=>d.franchise_id==='CLE'?2.8:1.2).attr('opacity',d=>d.franchise_id==='CLE'?1:.65);
 g.selectAll('circle.logo-fallback').data(rows).join('circle').attr('class','logo-fallback').attr('cx',d=>x(d.equal_weight_misery_score)).attr('cy',d=>y(d.franchise_id)).attr('r',d=>d.franchise_id==='CLE'?13:8).attr('fill',d=>d.franchise_id==='CLE'?C.accent:C.peer).attr('opacity',.16);
 g.selectAll('image.team-logo').data(rows).join('image').attr('class','team-logo').attr('href',d=>logoUrl(d.franchise_id)).attr('x',d=>x(d.equal_weight_misery_score)-(d.franchise_id==='CLE'?17:10)).attr('y',d=>y(d.franchise_id)-(d.franchise_id==='CLE'?17:10)).attr('width',d=>d.franchise_id==='CLE'?34:20).attr('height',d=>d.franchise_id==='CLE'?34:20).attr('opacity',d=>d.franchise_id==='CLE'?1:.76).on('mousemove',(e,d)=>t.show(`<b>${d.franchise_id}</b><br>Equal-weight misery score: ${fmt.num(d.equal_weight_misery_score)}<br>Rank: ${fmt.rank(d.equal_weight_rank,32)}<br>Median Monte Carlo rank: ${fmt.num(d.median_mc_rank)}`,e)).on('mouseleave',t.hide);
 axisLeft(g,y); axisBottom(g,x,innerH,5);
 g.selectAll('.axis .tick text').filter(d=>d==='CLE').attr('fill',C.accent).attr('font-weight',800);
 note(sel,'Equal-weight composite score; higher values indicate more misery. Cleveland is highlighted, peers are muted.');
}
