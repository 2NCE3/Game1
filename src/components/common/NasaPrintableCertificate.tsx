import React from 'react';
import { Printer, X } from 'lucide-react';
import { MissionState, MissionResources, MissionResultReport } from '../../types/mission';
import {
  MissionBrief, Destination, SpacecraftBus, LaunchVehicle,
  PowerSystem, CommsSystem, PropulsionSystem, TrajectoryOption, PayloadInstrument,
} from '../../types/mission';

interface NasaPrintableCertificateProps {
  state: MissionState;
  resources: MissionResources;
  result: MissionResultReport;
  brief?: MissionBrief;
  dest?: Destination;
  bus?: SpacecraftBus;
  rocket?: LaunchVehicle;
  power?: PowerSystem;
  comms?: CommsSystem;
  prop?: PropulsionSystem;
  traj?: TrajectoryOption;
  payloads: PayloadInstrument[];
  starCount: number;
  initialMode?: 'certificate' | 'report';
  onClose: () => void;
}

export const NasaPrintableCertificate: React.FC<NasaPrintableCertificateProps> = ({
  state, resources, result, brief, dest, bus, rocket, power, comms, prop, traj,
  payloads, starCount, initialMode = 'certificate', onClose,
}) => {
  const isCert = initialMode === 'certificate';
  const isSuccess = result.outcome === 'MISSION SUCCESS';
  const isPartial = result.outcome === 'PARTIAL SUCCESS';
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const docRef = `NASA-MF-2026-${(state.missionName || 'FLIGHT').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10)}`;
  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; }
          body * { visibility: hidden; }
          #nasa-print-doc, #nasa-print-doc * { visibility: visible; }
          #nasa-print-doc { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            margin: 0 !important; 
            padding: 30px !important; 
            background: white !important; 
            color: #0f172a !important; 
          }
          .fixed { position: absolute !important; top: 0 !important; left: 0 !important; height: auto !important; }
          .relative { position: static !important; }
          .print-hide { display: none !important; }
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
        <div className="relative w-full max-w-3xl my-4">
          {/* Toolbar */}
          <div className="print-hide flex items-center justify-between gap-3 mb-3 px-1">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{isCert ? '🎖️' : '📋'}</span>
              <div>
                <div className="font-mono text-sm font-bold text-white">{isCert ? 'Astronaut Certificate' : 'Mission Report'}</div>
                <div className="text-[11px] text-slate-400 font-mono">{isCert ? 'Printable PDF — official parchment' : 'Printable PDF — technical flight debrief'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-mono font-bold text-xs uppercase shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95">
                <Printer className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document */}
          <div id="nasa-print-doc" className="bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            {isCert ? (
              /* ─── CERTIFICATE ─── */
              <div style={{ padding: '40px 48px', border: '8px double #0b3d91', position: 'relative', minHeight: 560, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Watermark */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.04 }}>
                  <span style={{ fontSize: 200, fontWeight: 900, color: '#0b3d91', lineHeight: 1, userSelect: 'none' }}>NASA</span>
                </div>
                {/* Header */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#0b3d91', border: '3px solid #fc3d21', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'Georgia,serif', fontWeight: 900, fontSize: 12, color: 'white', letterSpacing: '-1px' }}>NASA</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, color: '#0b3d91', letterSpacing: '2px', textTransform: 'uppercase' }}>National Aeronautics and Space Administration</div>
                        <div style={{ fontSize: 8, fontFamily: 'monospace', color: '#64748b', letterSpacing: '1px', marginTop: 2 }}>Exploration Systems Directorate · Space Apps 2026</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#64748b', textAlign: 'right', lineHeight: 1.8 }}>
                      <div><strong>REF:</strong> {docRef}</div>
                      <div><strong>DATE:</strong> {currentDate}</div>
                      <div><strong>CLASS:</strong> UNCLASSIFIED</div>
                    </div>
                  </div>
                  <div style={{ borderBottom: '2px solid #0b3d91', marginBottom: 24 }} />
                  {/* Title */}
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#0b3d91', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 6 }}>★ Official NASA Cadet Flight Academy Citation ★</div>
                    <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>Certificate of Achievement</h1>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: '#475569', fontStyle: 'italic' }}>Junior Astronaut Wings — Awarded with Distinction</div>
                  </div>
                  {/* Citation */}
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>This is to certify that</div>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 900, color: '#0b3d91', borderBottom: '2px solid #0b3d91', display: 'inline-block', paddingBottom: 4, minWidth: 240, marginBottom: 12 }}>{state.missionName}</div>
                    <p style={{ fontFamily: 'Georgia,serif', fontSize: 12, color: '#334155', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
                      successfully designed, integrated, launched, and guided an interplanetary spacecraft to <strong style={{ color: '#0f172a' }}>{dest?.name}</strong>, completing all mission objectives and demonstrating exemplary aerospace engineering decision-making.
                    </p>
                  </div>
                  {/* Score row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 28 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Mission Score</div>
                      <div style={{ fontFamily: 'Georgia,serif', fontSize: 26, fontWeight: 900, color: '#0b3d91' }}>{result.overallScore}<span style={{ fontSize: 13, color: '#64748b' }}>/100</span></div>
                    </div>
                    <div style={{ width: 1, height: 48, background: '#cbd5e1' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>Cadet Rating</div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < starCount ? '#f59e0b' : '#e2e8f0'} stroke={i < starCount ? '#d97706' : '#cbd5e1'} strokeWidth="1">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div style={{ width: 1, height: 48, background: '#cbd5e1' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Outcome</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: isSuccess ? '#15803d' : isPartial ? '#92400e' : '#991b1b' }}>{result.outcome}</div>
                    </div>
                  </div>
                </div>
                {/* Signatures */}
                <div style={{ borderTop: '2px solid #0b3d91', paddingTop: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 40 }}>
                    {[['Commander Nova', 'Flight Operations Director'], ['Dr. H. Vance, NASA-JPL', 'Chief Systems Architect']].map(([name, title]) => (
                      <div key={name}>
                        <div style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: 14, color: '#1e293b', borderBottom: '1px solid #1e293b', paddingBottom: 2, marginBottom: 3, minWidth: 140 }}>{name}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>{title}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid #0b3d91', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 700, color: '#0b3d91', textAlign: 'center', lineHeight: 1.3 }}>OFFICIAL<br />SEAL</div>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#0b3d91', fontWeight: 700 }}>NASA MISSIONFORGE</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 7, color: '#94a3b8' }}>ARCHIVE VERIFIED · 2026</div>
                  </div>
                </div>
              </div>
            ) : (
              /* ─── MISSION REPORT ─── */
              <div style={{ padding: '32px 40px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, borderBottom: '2px solid #0b3d91', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0b3d91', border: '2px solid #fc3d21', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'Georgia,serif', fontWeight: 900, fontSize: 10, color: 'white' }}>NASA</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, color: '#0b3d91', letterSpacing: '2px', textTransform: 'uppercase' }}>National Aeronautics and Space Administration</div>
                      <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 900, color: '#0f172a', margin: '2px 0 0' }}>NASA Mission Archive &amp; Engineering Flight Report</h1>
                      <div style={{ fontSize: 8, fontFamily: 'monospace', color: '#64748b', letterSpacing: '1px' }}>Exploration Systems Directorate · Space Apps 2026</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#64748b', textAlign: 'right', flexShrink: 0, lineHeight: 1.8 }}>
                    <div><strong>REF:</strong> {docRef}</div><div><strong>DATE:</strong> {currentDate}</div>
                    <div><strong>TYPE:</strong> FLIGHT REPORT</div><div><strong>CLASS:</strong> UNCLASSIFIED</div>
                  </div>
                </div>
                {/* Verdict */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#0b3d91', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>Executive Flight Verdict</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: isSuccess ? '#15803d' : isPartial ? '#92400e' : '#991b1b' }}>{isSuccess ? '✓' : isPartial ? '⚠' : '✕'} {result.outcome}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569' }}>Overall Score: <strong style={{ color: '#0b3d91' }}>{result.overallScore}/100</strong></span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569' }}>Science: <strong style={{ color: '#7c3aed' }}>{result.scienceDataPercent}%</strong></span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#475569' }}>Destination: <strong style={{ color: '#0f172a' }}>{dest?.name}</strong></span>
                  </div>
                  <p style={{ fontSize: 11, color: '#334155', lineHeight: 1.65, margin: 0 }}>{result.summary}</p>
                </div>
                {/* Architecture */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#0b3d91', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginBottom: 8 }}>01. Spacecraft Architecture &amp; Flight Configuration</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5 }}>
                    {[
                      ['Objective', brief?.title || 'EXPLORATION'],
                      ['Destination', `${dest?.name} (${dest?.distance})`],
                      ['Spacecraft Bus', `${bus?.name} (${bus?.mass} kg)`],
                      ['Launch Vehicle', `${rocket?.name} (${rocket?.payloadCapacity?.toLocaleString()} kg)`],
                      ['Power System', `${power?.name} (${resources.powerGenerated}W)`],
                      ['Comms Link', `${comms?.name} (${comms?.dataRateMbps} Mbps)`],
                      ['Propulsion Δv', `${prop?.name} (${resources.deltaVAvailable} m/s)`],
                      ['Trajectory', `${traj?.name} (${traj?.riskModifier} risk)`],
                    ].map(([label, value]) => (
                      <div key={String(label)} style={{ padding: '5px 7px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3 }}>
                        <div style={{ fontSize: 7, fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                        <strong style={{ fontSize: 9, color: '#0f172a' }}>{value}</strong>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5, marginTop: 5 }}>
                    {[
                      { label: 'Total Mass', value: `${resources.totalMass.toLocaleString()} / ${resources.massLimit.toLocaleString()} kg`, pct: (resources.totalMass / resources.massLimit) * 100, color: resources.isOverMass ? '#dc2626' : '#0b3d91' },
                      { label: 'Budget', value: `$${resources.totalCost}M / $${resources.budgetLimit}M`, pct: (resources.totalCost / resources.budgetLimit) * 100, color: resources.isOverBudget ? '#dc2626' : '#16a34a' },
                      { label: 'Science Return', value: `${result.scienceDataPercent}% (${resources.totalScience} pts)`, pct: result.scienceDataPercent, color: '#7c3aed' },
                    ].map(({ label, value, pct, color }) => (
                      <div key={label} style={{ padding: '5px 7px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 9, marginBottom: 3 }}>
                          <span style={{ color: '#64748b' }}>{label}</span><strong style={{ color: '#0f172a' }}>{value}</strong>
                        </div>
                        <div style={{ height: 4, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: color, width: `${Math.min(100, pct)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Instruments */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#0b3d91', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginBottom: 8 }}>02. Scientific Instrumentation Package</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {payloads.length > 0 ? payloads.map(inst => (
                      <span key={inst.id} style={{ padding: '3px 7px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 3, fontFamily: 'monospace', fontSize: 9, color: '#334155' }}>
                        {inst.name} <strong style={{ color: '#0b3d91' }}>(+{inst.scienceValue} pts)</strong>
                      </span>
                    )) : <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#94a3b8', fontStyle: 'italic' }}>No science instruments installed.</span>}
                  </div>
                </div>
                {/* 5-category */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#0b3d91', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginBottom: 8 }}>03. Five-Category Aerospace Engineering Evaluation</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5 }}>
                    {[
                      { label: '1. Science Return', score: result.scientificReturnScore, color: '#7c3aed' },
                      { label: '2. Reliability', score: result.engineeringReliabilityScore, color: '#16a34a' },
                      { label: '3. Resource Eff.', score: result.resourceEfficiencyScore, color: '#d97706' },
                      { label: '4. Deep Comms', score: result.communicationScore, color: '#2563eb' },
                      { label: '5. Trajectory', score: result.trajectoryEfficiencyScore, color: '#0891b2' },
                    ].map(({ label, score, color }) => (
                      <div key={label} style={{ padding: '6px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3, fontFamily: 'monospace' }}>
                        <div style={{ fontSize: 7, color: '#64748b', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{score}</div>
                        <div style={{ fontSize: 8, color: '#94a3b8' }}>/ 100</div>
                        <div style={{ height: 3, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden', marginTop: 4 }}>
                          <div style={{ height: '100%', background: color, width: `${score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Debrief */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#0b3d91', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginBottom: 8 }}>04. Mission Debrief &amp; Lessons Learned</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <div style={{ padding: '8px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', marginBottom: 5 }}>✓ Nominal Subsystem Highlights</div>
                      <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#166534', lineHeight: 1.6 }}>
                        {result.whatWentWell.length > 0 ? result.whatWentWell.map((w, i) => <li key={i}>{w}</li>) : <li style={{ fontStyle: 'italic', listStyleType: 'none', marginLeft: -14 }}>No nominal systems survived degradation.</li>}
                      </ul>
                    </div>
                    <div style={{ padding: '8px 10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', marginBottom: 5 }}>⚠ Observed Anomalies &amp; Trade-offs</div>
                      <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#78350f', lineHeight: 1.6 }}>
                        {result.whatCouldImprove.length > 0 ? result.whatCouldImprove.map((c, i) => <li key={i}>{c}</li>) : <li style={{ fontStyle: 'italic', listStyleType: 'none', marginLeft: -14 }}>Flawless design. Minimal trade-off penalties detected!</li>}
                      </ul>
                    </div>
                  </div>
                  <div style={{ marginTop: 6, padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 700, color: '#0b3d91', textTransform: 'uppercase', marginBottom: 4 }}>★ Aerospace Engineering Trade-off Lesson</div>
                    <p style={{ fontSize: 10, color: '#334155', lineHeight: 1.65, margin: 0 }}>{result.criticalDecisionNote}</p>
                  </div>
                </div>
                {/* Signatures */}
                <div style={{ borderTop: '2px solid #0b3d91', paddingTop: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 32 }}>
                    {[['Commander Nova', 'Flight Operations Director'], ['Dr. H. Vance, NASA-JPL', 'Chief Systems Architect']].map(([name, title]) => (
                      <div key={name}>
                        <div style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: 12, color: '#1e293b', borderBottom: '1px solid #1e293b', paddingBottom: 2, marginBottom: 3, minWidth: 130 }}>{name}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: 7, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #0b3d91', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 6, fontWeight: 700, color: '#0b3d91', textAlign: 'center', lineHeight: 1.3 }}>OFFICIAL<br />SEAL</div>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: 7, color: '#0b3d91', fontWeight: 700 }}>NASA MISSIONFORGE · 2026</div>
                  </div>
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </>
  );
};
