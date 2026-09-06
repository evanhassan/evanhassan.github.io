import {load} from './shared/helpers.js';
import {render as ranking} from './charts/miseryRanking.js';
import {render as metrics} from './charts/metricPercentiles.js';
import {render as mc} from './charts/monteCarloDistribution.js';
import {render as category} from './charts/categoryProfile.js';
import {render as heatmap} from './charts/seasonHeatmap.js';
import {render as qb} from './charts/qbTimeline.js';
import {render as collapse} from './charts/collapseChart.js';
import {render as strip} from './charts/leagueStripPlot.js';
import {render as cumulative} from './charts/cumulativeMisery.js';
import {render as sensitivity} from './charts/sensitivityChart.js';
import {render as robustness} from './charts/robustnessMatrix.js';
import {render as mahal} from './charts/mahalanobisScatter.js';
import {render as busts} from './charts/firstRoundBusts.js';

async function main(){
 const [summary,rankings,mcDist,cats,season,qbs,collapses,stripData,cum,sens,rob,mah,firstRound,stats]=await Promise.all([
  load('team_misery_summary'),load('cleveland_metric_rankings'),load('monte_carlo_distribution'),load('category_scores'),load('season_scores'),load('qb_timeline'),load('worst_collapses'),load('metric_distribution'),load('cumulative_misery'),load('sensitivity_weights'),load('robustness'),load('mahalanobis_scatter'),load('first_round_short_tenure'),load('summary_stats')]);
 const cle=summary.find(d=>d.franchise_id==='CLE');
 const set=(q,v)=>{const el=document.querySelector(q); if(el) el.textContent=v;};
 set('[data-stat="worstPct"]',`${stats.cleveland_rank_1_count}/${stats.metrics_total}`);
 set('[data-stat="worstPctLabel"]',`${stats.cleveland_rank_1_percent.toFixed(1)}% of underlying metrics are #1 worst`);
 set('[data-stat="sd"]',`${stats.cleveland_sd_from_mean.toFixed(1)} SD`);
 set('[data-copy="sdHeadline"]',`As you can see, the Browns are ${stats.cleveland_sd_from_mean.toFixed(1)} standard deviations away from the mean, and in last.`);
 ranking('#chart-ranking',summary);
 metrics('#chart-worst-list',rankings,{onlyWorst:true});
 metrics('#chart-metrics',rankings);
 mc('#chart-mc',mcDist,summary);
 category('#chart-category',cats);
 mahal('#chart-mahal',mah);
 busts('#chart-busts',firstRound);
 heatmap('#chart-heatmap',season);
 qb('#chart-qb',qbs);
 collapse('#chart-collapse',collapses);
 strip('#chart-strip',stripData,rankings);
 cumulative('#chart-cumulative',cum);
 sensitivity('#chart-sensitivity',sens);
 robustness('#chart-robustness',rob);
}
main().catch(e=>{console.error(e);document.body.insertAdjacentHTML('afterbegin',`<pre style="color:#d6a19d">${e.stack}</pre>`)});
