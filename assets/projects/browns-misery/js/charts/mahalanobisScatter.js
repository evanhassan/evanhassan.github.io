import {C,fmt,tooltip,svgBox,gridX,axisBottom,axisLeft,note} from '../shared/helpers.js';
const d3=window.d3;
const LOGO_CODE={LA:'lar',WAS:'wsh',GB:'gb',KC:'kc',NE:'ne',NO:'no',SF:'sf',TB:'tb',LV:'lv',LAC:'lac',JAX:'jax',ARI:'ari',ATL:'atl',BAL:'bal',BUF:'buf',CAR:'car',CHI:'chi',CIN:'cin',CLE:'cle',DAL:'dal',DEN:'den',DET:'det',HOU:'hou',IND:'ind',MIA:'mia',MIN:'min',NYG:'nyg',NYJ:'nyj',PHI:'phi',PIT:'pit',SEA:'sea',TEN:'ten'};
function logoUrl(team){return `https://a.espncdn.com/i/teamlogos/nfl/500/${LOGO_CODE[team]||team.toLowerCase()}.png`;}

export function render(sel,payload){
 const data=payload.points, meta=payload.meta;
 const box=svgBox(sel,{height:540,margin:{top:20,right:76,bottom:62,left:66}}),{g,innerW,innerH}=box,t=tooltip();
 const x=d3.scaleLinear().domain(d3.extent(data,d=>d.x)).nice().range([0,innerW]); const y=d3.scaleLinear().domain(d3.extent(data,d=>d.y)).nice().range([innerH,0]);
 gridX(g,x,innerH,5); g.append('g').attr('class','grid').call(d3.axisLeft(y).ticks(5).tickSize(-innerW).tickFormat('')).select('.domain').remove();
 const cx=x(meta.x_mean), cy=y(meta.y_mean); const sx=Math.abs(x(meta.x_mean+1)-x(meta.x_mean)); const sy=Math.abs(y(meta.y_mean)-y(meta.y_mean+1)); const e=meta.ellipse||{eigvals:[1,1],angle_degrees:0};
 [1,2,3].forEach(r=>{g.append('ellipse').attr('cx',cx).attr('cy',cy).attr('rx',r*Math.sqrt(e.eigvals[0])*sx).attr('ry',r*Math.sqrt(e.eigvals[1])*sy).attr('transform',`rotate(${-e.angle_degrees},${cx},${cy})`).attr('fill','none').attr('stroke',r===1?C.grid:C.muted).attr('stroke-dasharray',r===1?'none':'3 5').attr('opacity',r===1?.5:.45);g.append('text').attr('x',innerW-44).attr('y',cy+(r-2)*18).attr('class','annotation').text(`${r} SD`)});
 g.append('circle').attr('cx',cx).attr('cy',cy).attr('r',3).attr('fill',C.muted); g.append('text').attr('x',cx+7).attr('y',cy-7).attr('class','annotation').text('average');
 g.selectAll('circle.logo-fallback').data(data).join('circle').attr('class','logo-fallback').attr('cx',d=>x(d.x)).attr('cy',d=>y(d.y)).attr('r',d=>d.franchise_id==='CLE'?13:9).attr('fill',d=>d.franchise_id==='CLE'?C.accent:C.peer).attr('opacity',.18);
 g.selectAll('image.team-logo').data(data).join('image').attr('class','team-logo').attr('href',d=>logoUrl(d.franchise_id)).attr('x',d=>x(d.x)-(d.franchise_id==='CLE'?17:12)).attr('y',d=>y(d.y)-(d.franchise_id==='CLE'?17:12)).attr('width',d=>d.franchise_id==='CLE'?34:24).attr('height',d=>d.franchise_id==='CLE'?34:24).attr('opacity',d=>d.franchise_id==='CLE'?1:.74).on('mousemove',(ev,d)=>t.show(`<b>${d.franchise_id}</b><br>${meta.x_col}: ${fmt.num(d.x)}<br>${meta.y_col}: ${fmt.num(d.y)}<br>Mahalanobis distance: ${fmt.num(d.mahalanobis_sd)} SD`,ev)).on('mouseleave',t.hide);
 const cle=data.find(d=>d.franchise_id==='CLE');
 axisBottom(g,x,innerH,5); axisLeft(g,y); g.append('text').attr('x',innerW/2).attr('y',innerH+48).attr('text-anchor','middle').attr('fill',C.muted).text(meta.x_col); g.append('text').attr('transform','rotate(-90)').attr('x',-innerH/2).attr('y',-48).attr('text-anchor','middle').attr('fill',C.muted).text(meta.y_col);
 note(sel,'Distance uses Mahalanobis distance from the league-average point across the two category z-scores; ellipses show 1/2/3 standard-deviation contours.');
}
