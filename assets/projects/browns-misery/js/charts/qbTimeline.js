import {C,fmt,tooltip,svgBox,gridX,axisBottom,note} from '../shared/helpers.js';
const d3=window.d3;

export const QB_PALETTE=[
 '#5B8DB8', // steel blue
 '#D48A34', // burnt orange
 '#8E6BBE', // muted violet
 '#5F9F62', // green
 '#CDB64B', // mustard
 '#C45A78', // rose
 '#55A6A0', // teal
 '#C95045', // brick red
 '#8F9A4A', // olive
 '#A86F3D'  // copper
];
const QB_COLOR_OVERRIDES={
 'C.Keenum':'#E07A5F',
 'B.Hoyer':'#8E6BBE',
 'J.Delhomme':'#8B5A2B',
 'L.McCown':'#C95045',
 'J.McCown':'#4A2A16'
};

export function assignQbSegmentColors(rows){
 const totals=d3.rollups(rows,v=>d3.sum(v,d=>+d.starts),d=>d.qb_name).sort((a,b)=>b[1]-a[1]||String(a[0]).localeCompare(String(b[0])));
 const colorByQb=new Map(totals.map(([name],i)=>[name,QB_PALETTE[i%QB_PALETTE.length]]));
 Object.entries(QB_COLOR_OVERRIDES).forEach(([name,color])=>colorByQb.set(name,color));
 rows.forEach(d=>d._color=colorByQb.get(d.qb_name)||QB_PALETTE[0]);
 return rows;
}

export function render(sel,data){
 const rows=assignQbSegmentColors(data.filter(d=>d.starts>0).sort((a,b)=>a.season-b.season||b.starts-a.starts||String(a.qb_name).localeCompare(String(b.qb_name))));
 const years=Array.from(new Set(rows.map(d=>d.season))).sort((a,b)=>a-b);
 const box=svgBox(sel,{height:520,margin:{top:18,right:42,bottom:48,left:52}}),{g,innerW,innerH}=box,t=tooltip();
 const x=d3.scaleBand().domain(years).range([0,innerW]).padding(.16);
 const maxStarts=Math.max(16,d3.max(d3.rollups(rows,v=>d3.sum(v,d=>+d.starts),d=>d.season),d=>d[1])||16);
 const y=d3.scaleLinear().domain([0,maxStarts]).range([innerH,0]);
 gridX(g,d3.scaleLinear().domain(d3.extent(years)).range([0,innerW]),innerH,6);
 axisBottom(g,x,innerH,0).call(d3.axisBottom(x).tickValues(years.filter(y=>y%2===0)).tickFormat(d=>String(d).slice(2)));
 g.append('text').attr('x',-36).attr('y',-4).attr('class','annotation').text('starts');
 const by=d3.group(rows,d=>d.season);
 years.forEach(yr=>{
  let y0=innerH;
  (by.get(yr)||[]).sort((a,b)=>b.starts-a.starts||String(a.qb_name).localeCompare(String(b.qb_name))).forEach(d=>{
   const h=innerH-y(+d.starts);
   g.append('rect')
    .attr('x',x(yr)).attr('y',y0-h).attr('width',x.bandwidth()).attr('height',Math.max(1,h))
    .attr('fill',d._color).attr('stroke','#0B0B0B').attr('stroke-width',1.6).attr('shape-rendering','crispEdges').attr('opacity',.97)
    .on('mousemove',e=>t.show(`<b>${d.qb_name}</b><br>${yr}: ${d.starts} estimated starts`,e))
    .on('mouseleave',t.hide);
   y0-=h;
  });
 });
 note(sel,'Each quarterback keeps the same color across seasons. Starts are assigned to the passer with the most QB dropbacks in that game.');
}
