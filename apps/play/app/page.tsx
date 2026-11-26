'use client';

import { useEffect, useState } from 'react';
import { BookOpen, History } from 'lucide-react';
import { AppHeader, AppNavigation, AnswerInput, DailyChallengeCard, DailyChallengeHeader, DrawingCard, DrawingLoading, GameResult, HintButton, LanguageChallengeCard, LanguageSelector, NavigationCard, PlayerStats, PrimaryButton, TutorialGame, WeeklyProgressCalendar } from './components';
import { DrawingView } from '../../../packages/drawing-engine';
import { library } from '../../../packages/database/content';
import { dailyIndex, normalize } from '../../../packages/game-engine/index.mjs';
import { messages } from '../../../packages/i18n';
import trainingDrawingJson from '../../../content/training/bicycle.json';
import type { Drawing } from '../../../packages/drawing-schema';

const langs = { pt: '🇧🇷 Português', en: '🇺🇸 English', es: '🇪🇸 Español' } as const;
type Lang = keyof typeof langs;
type Screen = 'tutorial' | 'home' | 'game' | 'settings' | 'history' | 'ranking';
type Feedback = 'correct' | 'present' | 'absent';
type Attempt = { guess: string; feedback: Feedback[] };
type Result = { day: string; locale: Lang; wordLength: number; feedback: Feedback[]; drawing: Drawing; won: boolean; failed: boolean; points: number; answer: string | null };
type Game = { level: number; errors: number; attempts: Attempt[]; result?: Result };
type WeekStatus = 'resolved' | 'notResolved' | 'notPlayed' | 'future';

const trainingDrawing = trainingDrawingJson as Drawing;
const fresh = (): Game => ({ level: 1, errors: 0, attempts: [] });
const day = () => new Date().toISOString().slice(0, 10);
const dateLocales: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
const langFlags: Record<Lang, string> = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' };
const challengeDate = (language: Lang) => new Intl.DateTimeFormat(dateLocales[language], { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${day()}T12:00:00Z`)).toUpperCase();
const toDate = (key: string) => new Date(`${key}T00:00:00Z`);
const dateKey = (date: Date) => date.toISOString().slice(0, 10);

function shareText(challenge: string, language: Lang, result: Result, attempts: Attempt[], level: number) {
  const attemptSquares = `${attempts.map((_, index) => index === attempts.length - 1 && result.won ? '🟩' : '🟥').join('')}${'⬛'.repeat(Math.max(0, 5 - attempts.length))}`;
  const layerCount = Math.max(0, level - 1);
  const layerSquares = `${'🟩'.repeat(layerCount)}${'⬛'.repeat(Math.max(0, 4 - layerCount))}`;
  return `✦ T R A Ç O S\nDesafio ${challenge} · ${langFlags[language]}\n\n🎯 ${result.won ? 'Mistério desvendado!' : 'Mistério não desvendado!'}\n\nTentativas: ${attempts.length}/5\n${attemptSquares}\n\nTraços extras: ${layerCount}/4\n${layerSquares}\n\n🏆 ${result.points}/100 pontos\n\nVocê consegue superar meu resultado?\nNem tudo precisa estar desenhado.`;
}

function getWeek(primary: Lang, games: Record<string, Game>, weekdays: string[]) {
  const today = day();
  const current = toDate(today);
  current.setUTCDate(current.getUTCDate() - current.getUTCDay());
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(current);
    date.setUTCDate(current.getUTCDate() + index);
    const key = dateKey(date);
    const game = games[`${key}:${primary}`];
    let status: WeekStatus = 'notPlayed';
    if (key > today) status = 'future';
    else if (game?.result?.won) status = 'resolved';
    else if (game?.result) status = 'notResolved';
    return { date: key, weekday: weekdays[index], number: date.getUTCDate(), status, current: key === today };
  });
}

function weekRange(days: { date: string }[], language: Lang) {
  const formatter = new Intl.DateTimeFormat(dateLocales[language], { day: 'numeric', month: 'short' });
  return `${formatter.format(toDate(days[0].date))} - ${formatter.format(toDate(days[6].date))}`;
}

function streakFor(primary: Lang, games: Record<string, Game>) {
  const today = day();
  let cursor = toDate(today);
  if (!games[`${today}:${primary}`]?.result?.won) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (games[`${dateKey(cursor)}:${primary}`]?.result?.won) { streak += 1; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  return streak;
}

export default function Page() {
  const [ui, setUi] = useState<Lang>('pt');
  const [primary, setPrimary] = useState<Lang>('pt');
  const [enabled, setEnabled] = useState<Lang[]>(['pt']);
  const [locale, setLocale] = useState<Lang>('pt');
  const [screen, setScreen] = useState<Screen>('home');
  const [games, setGames] = useState<Record<string, Game>>({});
  const [ready, setReady] = useState(false);
  const [guess, setGuess] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [tutorialStep, setTutorialStep] = useState(1);
  const [tutorialLevel, setTutorialLevel] = useState(1);
  const [tutorialPoints, setTutorialPoints] = useState(100);
  const [tutorialGuess, setTutorialGuess] = useState('');
  const [tutorialNotice, setTutorialNotice] = useState('');
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  const t = messages[ui];
  const key = `${day()}:${locale}`;
  const game = games[key] || fresh();
  const result = game.result;
  const attempts = game.attempts || [];
  const ended = Boolean(result?.won || result?.failed);
  const possiblePoints = Math.max(0, 100 - (game.level - 1) * 15 - game.errors * 5);
  const challengeNumberFor = (language: Lang) => `#${String(dailyIndex(day(), language, library.length) + 1).padStart(3, '0')}`;
  const challengeNumber = challengeNumberFor(locale);
  const primaryChallengeNumber = challengeNumberFor(primary);
  const primaryGame = games[`${day()}:${primary}`];
  const week = getWeek(primary, games, t.daysShort);
  const completedWeek = week.filter((item) => item.status === 'resolved').length;
  const completedGames = Object.entries(games).filter(([itemKey]) => itemKey.endsWith(`:${primary}`)).map(([, item]) => item).filter((item) => item.result?.won || item.result?.failed);
  const wins = completedGames.filter((item) => item.result?.won).length;
  const stats = { accuracy: completedGames.length ? Math.round((wins / completedGames.length) * 100) : 0, points: completedGames.reduce((sum, item) => sum + (item.result?.points || 0), 0), streak: streakFor(primary, games) };
  const additionalLanguages = enabled.filter((language) => language !== primary);
  const trainingAnswer = ({ pt: 'Bicicleta', en: 'Bicycle', es: 'Bicicleta' } as const)[ui];

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('tracos-prefs') || 'null');
      const completed = Boolean(prefs?.tutorialCompleted);
      if (prefs) { setUi(prefs.ui); setPrimary(prefs.primary); setEnabled(prefs.enabled); setLocale(prefs.primary); setTutorialCompleted(completed); setScreen('home'); }
      const saved = JSON.parse(localStorage.getItem('tracos-games') || '{}');
      const migrated = Object.fromEntries(Object.entries(saved).map(([itemKey, item]) => {
        const oldGame = item as Game;
        return [itemKey, oldGame.result && !oldGame.result.wordLength ? { level: oldGame.level || 1, errors: oldGame.errors || 0, attempts: [] } : { ...oldGame, attempts: oldGame.attempts || [] }];
      }));
      setGames(migrated);
    } catch {
      // Ignore malformed local demo data and start with clean preferences.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem('tracos-prefs', JSON.stringify({ ui, primary, enabled, tutorialCompleted }));
      localStorage.setItem('tracos-games', JSON.stringify(games));
    }
  }, [ready, ui, primary, enabled, tutorialCompleted, games]);

  async function request(level: number, errors: number, answer?: string) {
    setBusy(true); setNotice('');
    try {
      const response = await fetch('/api/challenge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale, level, errors, guess: answer }) });
      if (!response.ok) throw new Error('challenge request failed');
      const data: Result = await response.json();
      setGames((old) => { const previous = old[key] || fresh(); const nextAttempts = answer ? [...(previous.attempts || []), { guess: answer, feedback: data.feedback }] : (previous.attempts || []); return { ...old, [key]: { level, errors, attempts: nextAttempts, result: data } }; });
      if (answer && !data.won && !data.failed) setNotice(t.tryAgain);
      setGuess('');
    } catch { setNotice('Connection error / Tente novamente'); } finally { setBusy(false); }
  }

  useEffect(() => { if (ready && screen === 'game' && !result && !busy) void request(game.level, game.errors); }, [ready, screen, locale, result, busy]);

  const openTutorial = () => { setTutorialStep(1); setTutorialLevel(1); setTutorialPoints(100); setTutorialGuess(''); setTutorialNotice(''); setScreen('tutorial'); };
  const finishTutorial = () => { setTutorialCompleted(true); setScreen('home'); };
  const startRound = (language: Lang = primary) => { setLocale(language); setNotice(''); setScreen('game'); };
  const choose = (language: Lang) => { setLocale(language); setGuess(''); setNotice(''); setScreen('home'); };
  const submitGuess = () => { if (busy || guess.trim().length === 0 || attempts.length >= 5) return; void request(game.level, Math.min(5, game.errors + 1), guess); };
  const revealTutorial = () => { if (tutorialStep === 1) { setTutorialStep(2); setTutorialLevel(2); setTutorialPoints(85); } else if (tutorialStep === 2) { setTutorialLevel(3); setTutorialPoints(70); } };
  const submitTutorial = () => { if (normalize(tutorialGuess) === normalize(trainingAnswer)) { setTutorialStep(4); setTutorialNotice(''); } else setTutorialNotice(t.tutorialWrong); };
  const skipTutorial = () => finishTutorial();
  const copyShareText = async () => { if (result) await navigator.clipboard?.writeText(shareText(challengeNumber, locale, result, attempts, game.level)); };
  const tutorialLabels = { stepOne: t.tutorialStepOne, stepOneHint: t.tutorialStepOneHint, stepTwo: t.tutorialStepTwo, stepTwoHint: t.tutorialStepTwoHint, stepThree: t.tutorialStepThree, stepThreeHint: t.tutorialStepThreeHint, stepFour: t.tutorialStepFour, stepFourHint: t.tutorialStepFourHint, training: t.tutorialTraining, skip: t.tutorialSkip, continue: t.tutorialContinue, finish: t.finishTutorial, points: t.points, attempts: t.attempts, layer: t.layer, progressive: t.progressive, reveal: t.revealMore, allRevealed: t.allRevealed, answer: t.answer, typeAnswer: t.typeAnswer, confirm: t.confirm, correct: t.correct, share: t.share, back: t.back, noRanking: t.tutorialStepFourHint, progress: t.tutorialProgress, answerValue: trainingAnswer };

  return <main>
    <AppHeader onHelp={openTutorial} onSettings={() => setScreen('settings')} helpLabel={t.help} settingsLabel={t.settings} />

    {screen === 'tutorial' && <TutorialGame step={tutorialStep} level={tutorialLevel} points={tutorialPoints} drawing={trainingDrawing} guess={tutorialGuess} notice={tutorialNotice} labels={tutorialLabels} onGuess={setTutorialGuess} onReveal={revealTutorial} onContinue={() => setTutorialStep(3)} onSubmit={submitTutorial} onFinish={finishTutorial} onSkip={skipTutorial} />}

    {screen === 'home' && <>
      <DailyChallengeHeader date={challengeDate(ui)} title={t.homeTitle} subtitle={t.homeSubtitle} language={langs[primary]} challenge={primaryChallengeNumber} streak={stats.streak} labels={{ daysFollowed: `${t.days} ${t.streak}` }} />
      <WeeklyProgressCalendar days={week} range={weekRange(week, ui)} completed={completedWeek} total={7} labels={{ title: t.weekly, completed: t.weekCompleted, resolved: t.resolved, notResolved: t.notResolved, notPlayed: t.notPlayed, future: t.future, current: t.currentDay }} />
      <DailyChallengeCard challenge={`${t.challengeLabel} ${challengeNumber}`} language={langs[primary]} status={primaryGame?.result ? (primaryGame.result.won || primaryGame.result.failed ? t.resultDaily : t.continueDaily) : t.playDaily} title={t.dailyCardTitle} subtitle={t.dailyCardSubtitle} actionLabel={primaryGame?.result ? (primaryGame.result.won || primaryGame.result.failed ? t.resultDaily : t.continueDaily) : t.playDaily} onPlay={() => startRound(primary)} />
      <PlayerStats stats={stats} labels={{ accuracy: t.accuracy, points: t.totalPoints, streak: t.bestStreak }} />
      {additionalLanguages.length > 0 && <section className="additional-languages"><div className="section-heading"><h2>{t.additionalLanguages}</h2></div>{additionalLanguages.map((language) => { const extraGame = games[`${day()}:${language}`]; const extraFinished = extraGame?.result?.won || extraGame?.result?.failed; const extraAction = extraFinished ? t.resultDaily : extraGame?.result ? t.continueDaily : t.playDaily; return <LanguageChallengeCard key={language} language={langs[language]} status={extraFinished ? t.resultDaily : extraGame?.result ? t.continueDaily : t.availableChallenge} actionLabel={extraAction} onPlay={() => startRound(language)} />; })}</section>}
      <div className="navigation-cards"><NavigationCard icon={History} title={t.previousChallenges} description={t.previousChallengesHint} onClick={() => setScreen('history')} /><NavigationCard icon={BookOpen} title={t.howToPlay} description={t.howToPlayHint} onClick={openTutorial} /></div>
    </>}

    {screen === 'game' && <><DailyChallengeHeader date={challengeDate(ui)} title={t.dailyTitle} language={langs[locale]} challenge={challengeNumber} streak={stats.streak} labels={{ daysFollowed: `${t.days} ${t.streak}` }} /><DrawingCard points={possiblePoints} scoreLabel={t.points} errors={game.errors} attemptsLabel={t.attempts} level={game.level} layerLabel={t.layer} progressiveLabel={t.progressive} hint={!ended && <HintButton onClick={() => void request(Math.min(5, game.level + 1), game.errors)} disabled={busy || game.level >= 5} allRevealed={game.level >= 5} label={t.revealMore} disabledLabel={t.allRevealed} cost="-15 pts" />}>{result ? <DrawingView drawing={result.drawing} level={game.level} /> : <DrawingLoading />}</DrawingCard><section className="answer-section"><h2>{t.question}</h2><p className="answer-subtitle">{t.instructions}</p>{!ended && <AnswerInput value={guess} onChange={setGuess} onSubmit={submitGuess} disabled={busy || attempts.length >= 5} label={t.answer} placeholder={t.typeAnswer} />}{!ended && <PrimaryButton onClick={submitGuess} disabled={busy || guess.trim().length === 0 || attempts.length >= 5}>{t.confirm}</PrimaryButton>}{notice && <p className="notice error-notice" role="status">{notice}</p>}{ended && <GameResult answer={result?.answer || null} points={result?.points || 0} answerLabel={t.answer} pointsLabel={t.points} shareLabel={t.share} backLabel={t.back} onShare={copyShareText} onBack={() => setScreen('home')} />}</section></>}

    {screen === 'settings' && <section className="simple-screen"><h2>{t.settings}</h2><LanguageSelector label={t.interfaceLanguage} value={ui} onChange={(value) => setUi(value as Lang)} options={langs} /><LanguageSelector label={t.primaryLanguage} value={primary} onChange={(value) => { const language = value as Lang; setPrimary(language); setEnabled((old) => Array.from(new Set([...old, language]))); setLocale(language); }} options={langs} /><h3>{t.extraLanguages}</h3>{(Object.keys(langs) as Lang[]).map((language) => <label className="check" key={language}><input type="checkbox" checked={enabled.includes(language)} disabled={language === primary} onChange={(event) => setEnabled((old) => event.target.checked ? [...old, language] : old.filter((item) => item !== language))} />{langs[language]}</label>)}<button onClick={() => choose(primary)}>{t.back}</button><button className="secondary-button" onClick={openTutorial}>{t.tutorialLabel}</button></section>}
    {screen === 'history' && <section className="simple-screen"><h2>{t.history}</h2>{Object.entries(games).filter(([, item]) => item.result?.won || item.result?.failed).map(([itemKey, item]) => <p key={itemKey}>{itemKey} · {item.result?.points} {t.points}</p>)}{!Object.values(games).some((item) => item.result?.won || item.result?.failed) && <p>{t.noGames}</p>}</section>}
    {screen === 'ranking' && <section className="simple-screen"><h2>{t.ranking}</h2><p>{t.rankingUnavailable}</p></section>}

    <AppNavigation screen={screen} onHome={() => setScreen('home')} onHistory={() => setScreen('history')} onRanking={() => setScreen('ranking')} onProfile={() => setScreen('settings')} labels={{ home: t.home, history: t.history, ranking: t.ranking, profile: t.profile }} />
  </main>;
}
