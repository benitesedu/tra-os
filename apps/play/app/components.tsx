import { ArrowRight, CalendarDays, Check, CircleHelp, Flame, History, Home, LockKeyhole, Minus, Settings, Trophy, UserRound, WandSparkles, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { DrawingView } from '../../../packages/drawing-engine';
import type { Drawing } from '../../../packages/drawing-schema';

export function AppHeader({ onHelp, onSettings, helpLabel, settingsLabel }: { onHelp: () => void; onSettings: () => void; helpLabel: string; settingsLabel: string }) {
  return <header className="app-header">
    <div className="brand"><img src="/logo.svg" alt="Traços" /><strong>TRAÇOS</strong></div>
    <div className="header-actions">
      <button className="icon-button" onClick={onHelp} aria-label={helpLabel}><CircleHelp size={20} strokeWidth={1.8} /></button>
      <button className="icon-button" onClick={onSettings} aria-label={settingsLabel}><Settings size={20} strokeWidth={1.8} /></button>
    </div>
  </header>;
}

export function DailyChallengeHeader({ date, title, subtitle, language, challenge, streak, labels }: { date: string; title: string; subtitle?: string; language: string; challenge: string; streak: number; labels: { daysFollowed: string } }) {
  return <div className={`daily-header ${subtitle ? 'home-header' : ''}`}>
    <div className="daily-copy"><small>{date}</small><h1>{title}</h1>{subtitle && <p className="daily-subtitle">{subtitle}</p>}<div className="daily-meta"><span>{language}</span><span>{challenge}</span></div></div>
    <div className="streak-indicator" aria-label={`${streak} ${labels.daysFollowed}`}><Flame size={16} /><strong>{streak}</strong><small>{labels.daysFollowed}</small></div>
  </div>;
}

export function ScoreIndicator({ points, label }: { points: number; label: string }) {
  return <div className="score-indicator"><small>{label}</small><strong key={points}>{points}</strong><span>/ 100</span></div>;
}

export function AttemptsIndicator({ errors, label }: { errors: number; label: string }) {
  return <div className="attempts-indicator" aria-label={`${label}: ${5 - errors}`}><small>{label}</small><div>{Array.from({ length: 5 }, (_, index) => <span className={index < 5 - errors ? 'available' : ''} key={index} />)}</div></div>;
}

export function LayerProgress({ level, total = 5, label, progressiveLabel }: { level: number; total?: number; label: string; progressiveLabel: string }) {
  return <div className="layer-progress"><div className="progress-track" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>{Array.from({ length: total }, (_, index) => <span className={index < level ? 'filled' : ''} key={index} />)}</div><div className="progress-caption"><span>{label} {level} de {total}</span><span>{progressiveLabel}</span></div></div>;
}

export function DrawingCard({ children, points, scoreLabel, errors, attemptsLabel, level, layerTotal = 5, layerLabel, progressiveLabel, hint }: { children: ReactNode; points: number; scoreLabel: string; errors: number; attemptsLabel: string; level: number; layerTotal?: number; layerLabel: string; progressiveLabel: string; hint: ReactNode }) {
  return <section className="drawing-card"><div className="card-metrics"><ScoreIndicator points={points} label={scoreLabel} /><AttemptsIndicator errors={errors} label={attemptsLabel} /></div>{children}<LayerProgress level={level} total={layerTotal} label={layerLabel} progressiveLabel={progressiveLabel} />{hint && <><div className="card-divider" />{hint}</>}</section>;
}

export function DrawingLoading() {
  return <div className="drawing-loading" aria-label="Carregando desenho" role="status"><span /><span /><span /></div>;
}

export function AnswerInput({ value, onChange, onSubmit, disabled, label, placeholder }: { value: string; onChange: (value: string) => void; onSubmit: () => void; disabled: boolean; label: string; placeholder: string }) {
  return <div className="answer-field"><label className="sr-only" htmlFor="answer-input">{label}</label><input id="answer-input" className="answer-input" value={value} autoCapitalize="characters" autoComplete="off" spellCheck={false} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') onSubmit(); }} disabled={disabled} /></div>;
}

export function PrimaryButton({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: string }) {
  return <button className="primary-button" onClick={onClick} disabled={disabled}>{children}<ArrowRight size={18} strokeWidth={1.8} /></button>;
}

export function HintButton({ onClick, disabled, allRevealed, label, disabledLabel, cost }: { onClick: () => void; disabled: boolean; allRevealed: boolean; label: string; disabledLabel: string; cost: string }) {
  return <button className="hint-button" onClick={onClick} disabled={disabled}><WandSparkles size={18} strokeWidth={1.8} /><span>{allRevealed ? disabledLabel : label}</span>{!allRevealed && <strong>{cost}</strong>}</button>;
}

export function GameResult({ answer, points, answerLabel, pointsLabel, shareLabel, backLabel, onShare, onBack, showShare = true }: { answer: string | null; points: number; answerLabel: string; pointsLabel: string; shareLabel: string; backLabel: string; onShare: () => void; onBack: () => void; showShare?: boolean }) {
  return <div className="game-result"><p>{answerLabel}: <strong>{answer}</strong></p><strong className="result-points">{points} {pointsLabel}</strong>{showShare && <button onClick={onShare}>{shareLabel}</button>}<button className="secondary-button" onClick={onBack}>{backLabel}</button></div>;
}

export function AppNavigation({ screen, onHome, onHistory, onRanking, onProfile, labels }: { screen: string; onHome: () => void; onHistory: () => void; onRanking: () => void; onProfile: () => void; labels: { home: string; history: string; ranking: string; profile: string } }) {
  const items = [{ key: 'home', label: labels.home, icon: Home, action: onHome }, { key: 'history', label: labels.history, icon: History, action: onHistory }, { key: 'ranking', label: labels.ranking, icon: Trophy, action: onRanking }, { key: 'settings', label: labels.profile, icon: UserRound, action: onProfile }];
  return <footer className="app-footer"><nav className="bottom-nav">{items.map(({ key, label, icon: Icon, action }) => <button className={screen === key || (key === 'home' && screen === 'game') ? 'active' : ''} onClick={action} key={key}><Icon size={20} strokeWidth={1.7} /><span>{label}</span></button>)}</nav></footer>;
}

export function LanguageSelector({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: Record<string, string>; label: string }) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>{Object.entries(options).map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></label>;
}

type WeeklyStatus = 'resolved' | 'notResolved' | 'notPlayed' | 'future';
type WeeklyDay = { date: string; weekday: string; number: number; status: WeeklyStatus; current: boolean };

export function WeeklyProgressCalendar({ days, range, completed, total, labels }: { days: WeeklyDay[]; range: string; completed: number; total: number; labels: { title: string; completed: string; resolved: string; notResolved: string; notPlayed: string; future: string; current: string } }) {
  const statusIcon = { resolved: Check, notResolved: X, notPlayed: Minus, future: LockKeyhole };
  return <section className="weekly-card"><div className="section-heading"><div><h2>{labels.title}</h2><small>{range}</small></div><CalendarDays size={18} /></div><div className="week-days">{days.map((day) => { const Icon = statusIcon[day.status]; return <div className={`week-day ${day.status} ${day.current ? 'current' : ''}`} key={day.date} aria-label={`${day.weekday} ${day.number}: ${labels[day.status]}`}><span>{day.weekday}</span><strong>{day.number}</strong><Icon size={13} /></div>; })}</div><div className="week-summary"><span>{completed} / {total} {labels.completed}</span><span>{Math.round((completed / Math.max(total, 1)) * 100)}%</span></div><div className="week-progress"><span style={{ width: `${(completed / Math.max(total, 1)) * 100}%` }} /></div></section>;
}

export function DailyChallengeCard({ challenge, language, status, title, subtitle, actionLabel, onPlay }: { challenge: string; language: string; status: string; title: string; subtitle: string; actionLabel: string; onPlay: () => void }) {
  return <section className="daily-card"><div className="daily-card-top"><span>{challenge}</span><span>{language}</span></div><div className="abstract-drawing" aria-hidden="true"><svg viewBox="0 0 240 130" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M77 92 L108 36 L139 92 M92 64 H124 M108 36 V92" /><circle cx="108" cy="65" r="34" stroke="var(--tracos-primary)" strokeDasharray="2 7" opacity=".35" /><circle cx="108" cy="65" r="4" fill="var(--tracos-primary)" stroke="none" /><path d="M54 67h10m88 0h10M108 20v10M108 100v10" stroke="var(--tracos-primary)" opacity=".7" /></svg></div><h2>{title}</h2><p>{subtitle}</p><button className="primary-button" onClick={onPlay}>{actionLabel}<ArrowRight size={18} strokeWidth={1.8} /></button><small className="card-status">{status}</small></section>;
}

export function PlayerStats({ stats, labels }: { stats: { accuracy: number; points: number; streak: number }; labels: { accuracy: string; points: string; streak: string } }) {
  const items = [{ value: `${stats.accuracy}%`, label: labels.accuracy, icon: Check }, { value: stats.points, label: labels.points, icon: Trophy }, { value: stats.streak, label: labels.streak, icon: Flame }];
  return <section className="stats-grid">{items.map(({ value, label, icon: Icon }) => <div className="stat-card" key={label}><Icon size={17} /><strong>{value}</strong><small>{label}</small></div>)}</section>;
}

export function LanguageChallengeCard({ language, status, actionLabel, onPlay }: { language: string; status: string; actionLabel: string; onPlay: () => void }) {
  return <article className="language-card"><div><strong>{language}</strong><small>{status}</small></div><button className="icon-button" onClick={onPlay} aria-label={actionLabel}><ArrowRight size={18} /></button></article>;
}

export function NavigationCard({ icon: Icon, title, description, onClick }: { icon: typeof History; title: string; description: string; onClick: () => void }) {
  return <button className="navigation-card" onClick={onClick}><Icon size={19} /><span><strong>{title}</strong><small>{description}</small></span><ArrowRight size={17} /></button>;
}

export function TutorialProgress({ step, label }: { step: number; label: string }) {
  return <div className="tutorial-progress"><div>{Array.from({ length: 4 }, (_, index) => <span className={index < step ? 'filled' : ''} key={index} />)}</div><small>{step}/4 {label}</small></div>;
}

export type TutorialLabels = { stepOne: string; stepOneHint: string; stepTwo: string; stepTwoHint: string; stepThree: string; stepThreeHint: string; stepFour: string; stepFourHint: string; training: string; skip: string; continue: string; finish: string; points: string; attempts: string; layer: string; progressive: string; reveal: string; allRevealed: string; answer: string; typeAnswer: string; confirm: string; correct: string; share: string; back: string; noRanking: string; progress: string; answerValue: string };

export function TutorialGame({ step, level, points, drawing, guess, notice, labels, onGuess, onReveal, onContinue, onSubmit, onFinish, onSkip }: { step: number; level: number; points: number; drawing: Drawing; guess: string; notice: string; labels: TutorialLabels; onGuess: (value: string) => void; onReveal: () => void; onContinue: () => void; onSubmit: () => void; onFinish: () => void; onSkip: () => void }) {
  const titles = [labels.stepOne, labels.stepTwo, labels.stepThree, labels.stepFour];
  const hints = [labels.stepOneHint, labels.stepTwoHint, labels.stepThreeHint, labels.stepFourHint];
  const canReveal = step < 3 && level < 3;
  return <section className="tutorial-game"><div className="tutorial-top"><span>{labels.training}</span><button className="tutorial-skip" onClick={onSkip}>{labels.skip}</button></div><TutorialProgress step={step} label={labels.progress} /><h2>{titles[step - 1]}</h2><p className="tutorial-hint">{hints[step - 1]}</p><DrawingCard points={points} scoreLabel={labels.points} errors={0} attemptsLabel={labels.attempts} level={Math.min(level, 3)} layerTotal={3} layerLabel={labels.layer} progressiveLabel={labels.progressive} hint={canReveal ? <HintButton onClick={onReveal} disabled={false} allRevealed={false} label={labels.reveal} disabledLabel={labels.allRevealed} cost="-15 pts" /> : null}><DrawingView drawing={drawing} level={Math.min(level, 3)} /></DrawingCard>{step === 2 && level >= 3 && <PrimaryButton onClick={onContinue} disabled={false}>{labels.continue}</PrimaryButton>}{step === 3 && <><AnswerInput value={guess} onChange={onGuess} onSubmit={onSubmit} disabled={false} label={labels.answer} placeholder={labels.typeAnswer} /><PrimaryButton onClick={onSubmit} disabled={guess.trim().length === 0}>{labels.confirm}</PrimaryButton>{notice && <p className="notice error-notice" role="status">{notice}</p>}</>}{step === 4 && <div className="tutorial-result"><GameResult answer={labels.answerValue} points={points} answerLabel={labels.answer} pointsLabel={labels.points} shareLabel={labels.share} backLabel={labels.finish} onShare={() => undefined} onBack={onFinish} showShare={false} /><p className="tutorial-note">{labels.noRanking}</p></div>}</section>;
}
