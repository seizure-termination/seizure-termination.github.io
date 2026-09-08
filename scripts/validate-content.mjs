import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=n=>JSON.parse(fs.readFileSync(new URL(`../src/data/${n}.json`,import.meta.url),'utf8'));
const papers=read('papers'),trials=read('trials'),topics=read('topics'),atlas=read('atlas'),methods=read('methods'),news=read('news');
const ids=xs=>new Set(xs.map(x=>x.id));const pids=ids(papers),tids=ids(trials),topicIds=ids(topics);
for(const [name,list] of Object.entries({papers,trials,topics,atlas,methods,news})){assert.equal(ids(list).size,list.length,`${name}: duplicate id`);for(const x of list){assert(x.id);assert(!JSON.stringify(x).includes('TODO'));}}
for(const p of papers){for(const key of ['titleZh','titleOriginal','year','journal','design','question','verifiedAt','verificationStatus'])assert(p[key],`${p.id}: missing ${key}`);assert(/^\d{7,9}$/.test(p.id));assert(/^\d{4}$/.test(p.year));assert(new URL(p.url).hostname==='pubmed.ncbi.nlm.nih.gov');assert(p.authors.length>0);assert(p.findings.length&&p.limitations.length);assert.equal(p.verificationStatus,'publishable');assert(['direct','supporting','context'].includes(p.relevanceTier));assert(p.studySystems.every(s=>['human','animal','exvivo','model','review'].includes(s)));assert(p.topicIds.every(id=>topicIds.has(id)));assert(p.relatedTrialIds.every(id=>tids.has(id)));if(p.figures?.length)assert.equal(p.fullTextAccess,'full-text');assert(/^\d{4}-\d{2}-\d{2}$/.test(p.verifiedAt));}
for(const t of trials){assert(/^NCT\d{8}$/.test(t.id));assert(t.primaryOutcomes.length);assert.equal(t.registry,'ClinicalTrials.gov');assert(t.primaryOutcomes.every(o=>o.measure&&o.timeFrame));assert(['ACTUAL','ESTIMATED'].includes(t.enrollment.type));assert(Number.isInteger(t.enrollment.count)&&t.enrollment.count>=0);assert(typeof t.resultsPosted==='boolean');assert(t.verifiedAt>=t.registryLastUpdatedAt);assert(t.relatedPaperIds.every(id=>pids.has(id)));assert(['direct','supporting','context'].includes(t.relevanceTier));assert(new URL(t.canonicalUrl).hostname==='clinicaltrials.gov');const raw=read('registry-verification')[t.id];assert.equal(t.statusRaw,raw.statusRaw);assert.deepEqual(t.primaryOutcomes,raw.primaryOutcomes);assert.equal(t.resultsPosted,raw.resultsPosted);assert.equal(t.registryLastUpdatedAt,raw.registryLastUpdatedAt);}
for(const t of topics)assert(t.paperIds.every(id=>pids.has(id)));
for(const m of methods)assert(m.paperIds.every(id=>pids.has(id)));
for(const n of news)assert(pids.has(n.paperId));
for(const a of atlas){assert.equal(a.dataOrigin,'simulation');assert(a.relatedPaperIds.every(id=>pids.has(id)));assert(a.permission.includes('不含患者数据'));}
for(const p of papers)for(const tid of p.relatedTrialIds)assert(trials.find(t=>t.id===tid).relatedPaperIds.includes(p.id));
console.log(`PASS: ${papers.length} papers, ${trials.length} trials, ${topics.length} topics, ${atlas.length} simulations; schema, citations and official trial fields verified.`);

const team=read('team');assert(team.publications.length>0);for(const entry of team.publications){assert(entry.includes('Ren L')&&/20\d\d/.test(entry),'Invalid PI bibliography');assert(!/forceFrameRate|className:|children:/.test(entry),'Script fragment in bibliography');}

const english=read('en/content');
for(const [kind,items] of Object.entries({papers,topics,methods,atlas,news})){assert.deepEqual(Object.keys(english[kind]).sort(),items.map(x=>x.id).sort(),`English ${kind} coverage`);for(const item of items)assert(!/[\u3400-\u9fff]/.test(JSON.stringify(english[kind][item.id])),`Untranslated English ${item.id}`);}
for(const p of papers){if(p.figures)assert.equal(english.figures[p.id]?.length,p.figures.length,`English figures: ${p.id}`);}
console.log('PASS: English content IDs and main figure/table coverage match Chinese records.');
