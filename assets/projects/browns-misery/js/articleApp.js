import {load} from './shared/helpers.js';
import {render as metrics} from './charts/metricPercentiles.js';
import {render as category} from './charts/categoryProfile.js';
import {render as mahal} from './charts/mahalanobisScatter.js';
import {render as qb} from './charts/qbTimeline.js';
import {render as strip} from './charts/leagueStripPlot.js';

async function main(){
  const [rankings,cats,mahData,stats,qbs,stripData]=await Promise.all([
    load('cleveland_metric_rankings'),
    load('category_scores'),
    load('mahalanobis_scatter'),
    load('summary_stats'),
    load('qb_timeline'),
    load('metric_distribution')
  ]);
  const worst=document.querySelector('[data-stat="worstPct"]');
  if(worst) worst.textContent=`${stats.cleveland_rank_1_count}/${stats.metrics_total} metrics · ${stats.cleveland_rank_1_percent.toFixed(1)}%`;
  const sd=document.querySelector('[data-copy="sdHeadline"]');
  if(sd) sd.textContent=`As you can see, the Browns are ${stats.cleveland_sd_from_mean.toFixed(1)} standard deviations away from the mean, and in last.`;
  metrics('#chart-worst-list', rankings, {onlyWorst:true});
  metrics('#chart-metrics', rankings);
  category('#chart-category', cats);
  mahal('#chart-mahal', mahData);
  qb('#chart-qb', qbs);
  strip('#chart-strip', stripData, rankings);
}

main().catch(e=>{
  console.error(e);
  document.querySelector('.article-page')?.insertAdjacentHTML('beforeend', `<pre style="color:#8b1e16;white-space:pre-wrap">${e.stack}</pre>`);
});
