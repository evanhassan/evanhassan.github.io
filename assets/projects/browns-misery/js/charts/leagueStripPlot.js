import {C,fmt,tooltip,svgBox,gridX,axisBottom,note} from '../shared/helpers.js';
const d3=window.d3;
const LOGO_CODE={LA:'lar',WAS:'wsh',GB:'gb',KC:'kc',NE:'ne',NO:'no',SF:'sf',TB:'tb',LV:'lv',LAC:'lac',JAX:'jax',ARI:'ari',ATL:'atl',BAL:'bal',BUF:'buf',CAR:'car',CHI:'chi',CIN:'cin',CLE:'cle',DAL:'dal',DEN:'den',DET:'det',HOU:'hou',IND:'ind',MIA:'mia',MIN:'min',NYG:'nyg',NYJ:'nyj',PHI:'phi',PIT:'pit',SEA:'sea',TEN:'ten'};
function logoUrl(team){return `https://a.espncdn.com/i/teamlogos/nfl/500/${LOGO_CODE[team]||team.toLowerCase()}.png`;}
function stackOffsets(rows){
 const buckets=d3.group(rows,d=>Math.round(d.misery_percentile));
 const order=[0,-18,18,-34,34,-50,50];
 buckets.forEach(group=>group.sort((a,b)=>String(a.team).localeCompare(String(b.team))).forEach((d,i)=>d._stackY=order[i]??((i%2?-1:1)*(18+8*i))));
 return rows;
}

export function render(sel,data,rankings){
 const root=d3.select(sel);root.selectAll('*').remove(); const opts=rankings.slice().sort((a,b)=>String(a.metric).localeCompare(String(b.metric))).slice(0,80);
 const ctrl=root.append('div').attr('class','control');ctrl.append('span').text('Metric');ctrl.append('select').selectAll('option').data(opts).join('option').attr('value',d=>d.variable).text(d=>d.metric);
 const chart=root.append('div').attr('class','chart');
 function draw(variable=opts[0].variable){
  const rows=stackOffsets(data.filter(d=>d.variable===variable)), spec=opts.find(d=>d.variable===variable); const box=svgBox(chart.node(),{height:270,margin:{top:44,right:42,bottom:50,left:42}}),{g,innerW,innerH}=box,t=tooltip(); const x=d3.scaleLinear().domain([0,100]).range([0,innerW]);
  gridX(g,x,innerH,5); g.append('line').attr('x1',x(50)).attr('x2',x(50)).attr('y1',0).attr('y2',innerH).attr('stroke',C.grid).attr('opacity',.65); g.append('text').attr('x',x(50)+5).attr('y',-10).attr('class','annotation').text('median');
  g.append('line').attr('x1',0).attr('x2',innerW).attr('y1',innerH/2).attr('y2',innerH/2).attr('stroke',C.line).attr('opacity',.35);
  g.selectAll('circle.logo-fallback').data(rows).join('circle').attr('class','logo-fallback').attr('cx',d=>x(d.misery_percentile)).attr('cy',d=>innerH/2+d._stackY).attr('r',d=>d.team==='CLE'?12:8).attr('fill',d=>d.team==='CLE'?C.accent:C.peer).attr('opacity',.16);
  g.selectAll('image.team-logo').data(rows).join('image').attr('class','team-logo').attr('href',d=>logoUrl(d.team)).attr('x',d=>x(d.misery_percentile)-(d.team==='CLE'?16:10)).attr('y',d=>innerH/2+d._stackY-(d.team==='CLE'?16:10)).attr('width',d=>d.team==='CLE'?32:20).attr('height',d=>d.team==='CLE'?32:20).attr('opacity',d=>d.team==='CLE'?1:.72).on('mousemove',(e,d)=>t.show(`<b>${d.team}</b><br>${spec.metric}<br>Raw: ${fmt.num(d.raw_value)}<br>Rank: ${fmt.rank(d.rank,32)}<br>Misery percentile: ${fmt.pct(d.misery_percentile)}`,e)).on('mouseleave',t.hide);
  axisBottom(g,x,innerH,5,d=>d);
  g.append('text').attr('x',0).attr('y',14).attr('fill',C.text).attr('font-size',14).attr('font-weight',700).text(spec.metric);
 }
 ctrl.select('select').on('change',e=>draw(e.target.value)); draw(); note(sel,'Each logo is one NFL franchise. Cleveland is highlighted; the vertical line marks the league median.');
}
