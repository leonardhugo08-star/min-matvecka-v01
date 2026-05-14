import { useEffect, useMemo, useState } from 'react'
import {
  allergyChips,
  calculateShoppingBudget,
  choiceImageFor,
  choiceOptionsFor,
  createShoppingList,
  generateWeek,
  rawvaraOptions,
  replaceMeal,
  type MealTemplate,
  type PlannedMeal,
  type PlannerMode,
  type PlannerProfile,
} from './planner'

const storageKey = 'min-matvecka-scratch-dual-mode-v2'
const loadingMs = import.meta.env.MODE === 'test' ? 20 : 5000

type SavedState = PlannerProfile & { plan: PlannedMeal[] }
type ChoiceSession = { options: MealTemplate[]; index: number; yesIds: string[]; noIds: string[]; mode: 'meals' | 'rawvaror'; rawIndex: number }

const defaults: SavedState = {
  mode: 'lss',
  name: 'Solrosen',
  people: 4,
  liked: [],
  disliked: [],
  restrictions: '',
  days: 7,
  plan: [],
}

function loadState(): SavedState {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
  } catch {
    return defaults
  }
}

const copy = {
  lss: {
    button: 'LSS-boende',
    intro: 'Tydligt, pedagogiskt och enkelt att göra tillsammans med boende — men lika snabbt när personalen bara behöver få veckan klar.',
    nameLabel: 'Boendenamn',
    namePlaceholder: 'Ex. Solrosen',
    peopleLabel: 'Antal personer på boendet',
    restrictionLabel: 'Önskemål, allergier eller vardagsbehov',
    helper: 'Planera tillsammans när det finns tid och energi. Tryck skapa direkt när veckan snabbt måste bli ordnad.',
    outputNote: 'Tydlig personalvy + boendevy. Matsedel, enkla recept och inköpslista.',
  },
  family: {
    button: 'Familj hemma',
    intro: 'Snabbt, enkelt och varierande för familjer som vill slippa vardagsmatskaos.',
    nameLabel: 'Familjenamn',
    namePlaceholder: 'Ex. Myrenblom',
    peopleLabel: 'Antal personer hemma',
    restrictionLabel: 'Önskemål, allergier eller vardagsbehov',
    helper: 'Välj några favoriter, tryck skapa och få en varierad vecka med inköpslista.',
    outputNote: 'Familjevy. Middagar, snabba recept och lista för storhandling.',
  },
} satisfies Record<PlannerMode, Record<string, string>>

const demoScript = 'Hej, jag heter Potatis. Min Matvecka hjälper dig skapa en trygg och god matvecka på ungefär en minut. Välj om du planerar för ett LSS-boende eller en familj, skriv in antal personer och markera allergier, önskemål och vardagsbehov. Valen sparas till nästa gång, så när veckan behöver ordnas igen kan du bara trycka skapa. Då får du en ny matvecka med rätt val förifyllda, nya enkla recept och en färdig inköpslista. I appen finns hundratals enkla och goda recept, så veckan kan bli varierad utan att planeringen tar energi.'

const demoBullets = [
  'Välj LSS-boende eller Familj hemma.',
  'Spara allergier, önskemål och vardagsbehov till nästa gång.',
  'Skapa en ny vecka direkt med rätt val förifyllda.',
  'Få enkla recept, matsedel och inköpslista från hundratals rätter.',
]

function hasRestriction(text: string, chip: string) {
  return text.toLowerCase().split(',').map((part) => part.trim()).includes(chip.toLowerCase())
}

function toggleRestrictionText(text: string, chip: string) {
  const parts = text.split(',').map((part) => part.trim()).filter(Boolean)
  const exists = parts.some((part) => part.toLowerCase() === chip.toLowerCase())
  return exists ? parts.filter((part) => part.toLowerCase() !== chip.toLowerCase()).join(', ') : [...parts, chip].join(', ')
}

function App() {
  const [state, setState] = useState<SavedState>(loadState)
  const [choiceSession, setChoiceSession] = useState<ChoiceSession | null>(null)
  const [isCooking, setIsCooking] = useState(false)
  const [isDemoPlaying, setIsDemoPlaying] = useState(false)
  const modeCopy = copy[state.mode]
  const plan = state.plan
  const shoppingList = useMemo(() => createShoppingList(plan, state.people), [plan, state.people])
  const budget = useMemo(() => calculateShoppingBudget(shoppingList, Math.max(1, plan.length || state.days), state.people), [shoppingList, plan.length, state.days, state.people])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state])

  function update(partial: Partial<SavedState>) {
    setState((current) => ({ ...current, ...partial }))
  }

  function chooseMode(mode: PlannerMode) {
    setChoiceSession(null)
    setState((current) => ({
      ...current,
      mode,
      days: 7,
      name: current.name || (mode === 'lss' ? 'Solrosen' : 'Familjen'),
      plan: [],
    }))
  }

  function withCooking(done: () => void) {
    setIsCooking(true)
    window.setTimeout(() => {
      done()
      setIsCooking(false)
      window.setTimeout(() => {
        const result = document.getElementById('resultat')
        if (typeof result?.scrollIntoView === 'function') {
          result.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 30)
    }, loadingMs)
  }

  function createPlan(selectedMealIds?: string[]) {
    setChoiceSession(null)
    withCooking(() => setState((current) => ({ ...current, plan: generateWeek(current, selectedMealIds) })))
  }

  function startChoosingTogether() {
    const options = choiceOptionsFor(state)
    setState((current) => ({ ...current, plan: [] }))
    setChoiceSession({ options, index: 0, yesIds: [], noIds: [], mode: 'meals', rawIndex: 0 })
  }

  function answerChoice(answer: 'yes' | 'no') {
    setChoiceSession((session) => {
      if (!session) return session
      if (session.mode === 'rawvaror') {
        const current = rawvaraOptions[session.rawIndex % rawvaraOptions.length]
        const token = `rawvara:${current.id}`
        setState((stateNow) => ({
          ...stateNow,
          liked: answer === 'yes' ? Array.from(new Set([...stateNow.liked, token])) : stateNow.liked.filter((id) => id !== token),
          disliked: answer === 'no' ? Array.from(new Set([...stateNow.disliked, token])) : stateNow.disliked.filter((id) => id !== token),
        }))
        return { ...session, rawIndex: session.rawIndex + 1 }
      }
      const current = session.options[session.index]
      const yesIds = answer === 'yes' ? [...session.yesIds, current.id] : session.yesIds
      const noIds = answer === 'no' ? [...session.noIds, current.id] : session.noIds
      if (yesIds.length >= state.days) {
        createPlan(yesIds)
        return null
      }

      const nextIndex = session.index + 1
      if (nextIndex >= session.options.length) {
        const nextOptions = choiceOptionsFor({ ...state, liked: yesIds, disliked: noIds })
        return { options: nextOptions, index: 0, yesIds, noIds, mode: 'meals', rawIndex: session.rawIndex }
      }

      return { ...session, index: nextIndex, yesIds, noIds }
    })
  }

  function swapMeal(dayIndex: number) {
    setState((current) => ({ ...current, plan: replaceMeal(current.plan, dayIndex, current) }))
  }

  async function sharePlan() {
    const text = `${displayName}s matvecka\n${plan.map((meal) => `${meal.day}: ${meal.title}`).join('\n')}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Min Matvecka', text })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      }
    } catch {
      // Sharing is optional; printing still works if the platform blocks share/clipboard.
    }
  }

  function reset() {
    window.localStorage.removeItem(storageKey)
    setChoiceSession(null)
    setIsCooking(false)
    setState(defaults)
  }

  function playDemo() {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (!('speechSynthesis' in window)) {
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(demoScript)
    utterance.lang = 'sv-SE'
    utterance.rate = 0.92
    utterance.pitch = 1.05
    utterance.onstart = () => setIsDemoPlaying(true)
    utterance.onend = () => setIsDemoPlaying(false)
    utterance.onerror = () => setIsDemoPlaying(false)
    window.speechSynthesis.speak(utterance)
  }

  const displayName = state.name.trim() || (state.mode === 'lss' ? 'Boendet' : 'Familjen')
  const currentChoice = choiceSession?.options[choiceSession.index]
  const currentRawvara = choiceSession ? rawvaraOptions[choiceSession.rawIndex % rawvaraOptions.length] : null
  const selectedRawvaror = state.liked.filter((id) => id.startsWith('rawvara:')).length
  const rejectedRawvaror = state.disliked.filter((id) => id.startsWith('rawvara:')).length
  const currentChoiceImage = currentChoice ? choiceImageFor(currentChoice) : null

  return (
    <main className="app-shell">
      <p className="brand-pill top-brand">minmatvecka.se · V0.2</p>
      <nav className="top-nav" aria-label="Huvudnavigation">
        <a href="#start">Start</a>
        <a href="#planera">Planera</a>
        <a href="#demo">Demo</a>
        <a href="#premium">Premium</a>
        <a href="#resultat">Matsedel</a>
        <a href="#inkop">Inköpslista</a>
      </nav>
      <section className="hero" id="start">
        <div className="hero-copy">
          <h1>Min Matvecka</h1>
          <p className="tagline">Blixtsnabb matplanering – med allt på ett ställe.</p>
          <p className="lead">
            Framtagen för barnfamiljer och LSS-boenden. Matsedel, enkla recept och inköpslista på samma ställe.
          </p>
          <div className="hero-actions" aria-label="Kom igång">
            <a className="hero-primary" href="#planera">Prova gratis</a>
            <button className="hero-secondary" type="button" onClick={playDemo}>Se demo</button>
          </div>
          <div className="proof-row" aria-label="Vad finns i Min Matvecka">
            <span><strong>500+</strong> vardagsrätter</span>
            <span><strong>Budgetkoll</strong> per vecka</span>
            <span><strong>Välj mat</strong> tillsammans</span>
          </div>
        </div>
        <div className="potatis-stage">
          <img src="mascot/marketing/m1-transparent.png" alt="Potatis hjälper dig planera veckan" />
          <div className="speech-bubble">{modeCopy.helper}</div>
        </div>
      </section>

      <section className="setup-panel" id="planera" aria-labelledby="setup-heading">
        <div className="section-title">
          <div>
            <h2 id="setup-heading">Skapa första matveckan</h2>
            <p>{modeCopy.intro}</p>
          </div>
          <button className="ghost" type="button" onClick={reset}>Rensa</button>
        </div>

        <div className="setup-step step-one">
          <div className="step-number" aria-hidden="true">1</div>
          <div className="step-body">
            <div className="setup-mode-tabs" aria-label="Välj typ">
              {(['lss', 'family'] as const).map((mode) => (
                <button
                  className={state.mode === mode ? 'selected' : ''}
                  type="button"
                  key={mode}
                  onClick={() => chooseMode(mode)}
                >
                  {copy[mode].button}
                </button>
              ))}
            </div>
            <div className="form-grid setup-basics">
              <label>
                {modeCopy.nameLabel}
                <input value={state.name} placeholder={modeCopy.namePlaceholder} onChange={(event) => update({ name: event.target.value })} />
              </label>
              <label>
                {modeCopy.peopleLabel}
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={state.people}
                  onChange={(event) => update({ people: Math.max(1, Number(event.target.value) || 1) })}
                />
              </label>
              <label>
                Dagar
                <select value={state.days} onChange={(event) => update({ days: Number(event.target.value) as 5 | 7 })}>
                  <option value="5">5 vardagar</option>
                  <option value="7">7 dagar</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="setup-step step-two">
          <div className="step-number" aria-hidden="true">2</div>
          <div className="step-body">
            <label className="wide">
              {modeCopy.restrictionLabel}
              <textarea
                value={state.restrictions}
                placeholder="Ex. laktosfri, glutenfri, inga nötter, mild mat, snabb vardag"
                onChange={(event) => update({ restrictions: event.target.value })}
              />
            </label>

            <div className="chip-panel" aria-label="Vanliga val">
              <p>Vanliga val</p>
              <div>
                {allergyChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={hasRestriction(state.restrictions, chip) ? 'chip selected' : 'chip'}
                    onClick={() => update({ restrictions: toggleRestrictionText(state.restrictions, chip) })}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!choiceSession && !isCooking && (
          <div className="setup-step step-three">
            <div className="step-number" aria-hidden="true">3</div>
            <div className="step-body">
              <div className="decision-actions" aria-label="Välj hur matveckan ska skapas">
                <button className="primary" type="button" onClick={() => createPlan()}>Skapa gratis matvecka</button>
                <button className="secondary-choice" type="button" onClick={startChoosingTogether}>Välj maträtter tillsammans</button>
              </div>
              <p className="free-preview-note">
                Gratis: 100 maträtter + demo. Premium låser upp 500+ maträtter, allergivänligt, inköpslista, veckobudget, PDF och sparade planer.
              </p>
            </div>
          </div>
        )}

        {choiceSession && currentChoice && !isCooking && (
          <section className="choice-panel" aria-live="polite" aria-label="Välj maträtter tillsammans">
            <div className="choice-tabs" role="group" aria-label="Välj typ av val">
              <button type="button" aria-pressed={choiceSession.mode === 'meals'} onClick={() => setChoiceSession((session) => session ? { ...session, mode: 'meals', options: choiceOptionsFor(state), index: 0 } : session)}>Färdiga rätter</button>
              <button type="button" aria-pressed={choiceSession.mode === 'rawvaror'} onClick={() => setChoiceSession((session) => session ? { ...session, mode: 'rawvaror' } : session)}>Råvaror</button>
            </div>
            <div className="choice-mascot">
              {choiceSession.mode === 'meals' && currentChoiceImage?.src
                ? <img src={currentChoiceImage.src} alt={`Tecknad bild av ${currentChoice.title}`} />
                : <img src="mascot/transparent/11a-a2-transparent.png" alt="Potatis visar nästa val" />}
            </div>
            <div className="choice-copy">
              {choiceSession.mode === 'meals' ? (
                <>
                  <p className="eyebrow">Alternativ {choiceSession.index + 1} av {choiceSession.options.length} · {choiceSession.yesIds.length}/{state.days} valda</p>
                  <h3>{currentChoice.title}</h3>
                  <p>{currentChoice.restaurantDescription}</p>
                  <div className="tags">{currentChoice.tags.map((tag) => <em key={tag}>{tag}</em>)}</div>
                </>
              ) : (
                <>
                  <p className="eyebrow">Råvaror styr förslagen · {selectedRawvaror} ja · {rejectedRawvaror} nej</p>
                  <h3>Gillar ni {currentRawvara?.label.toLowerCase()}?</h3>
                  <p>En enkel ja/nej-runda. Det bygger inte recept manuellt, men hjälper Potatis att välja bättre maträtter.</p>
                  <div className="tags"><em>råvara</em><em>stora knappar</em><em>LSS-vänligt</em></div>
                </>
              )}
              <div className="choice-buttons">
                <button className="no" type="button" onClick={() => answerChoice('no')}>Nej</button>
                <button className="yes" type="button" onClick={() => answerChoice('yes')}>Ja</button>
              </div>
            </div>
          </section>
        )}

        {isCooking && (
          <section className="cooking-panel" aria-live="polite" aria-label="Potatis lagar matveckan">
            <div className="pot-stir">
              <img src="mascot/transparent/11a-a5-transparent.png" alt="Potatis lagar matveckan" />
              <span className="steam steam-one" />
              <span className="steam steam-two" />
              <span className="steam steam-three" />
            </div>
            <div>
              <p className="eyebrow">Anpassar matveckan</p>
              <h3>Potatis blandar ihop en trygg vecka…</h3>
              <p>Jag tar hänsyn till antal dagar, allergier, önskemål och era JA/NEJ-val.</p>
            </div>
          </section>
        )}
      </section>

      <section className="demo-panel" id="demo" aria-labelledby="demo-heading">
        <div className="demo-mascot-card">
          <img src="mascot/transparent/11a-a2-transparent.png" alt="Potatis berättar om appen" />
          <span>{isDemoPlaying ? 'Potatis berättar…' : '30 sek Potatis-demo'}</span>
        </div>
        <div className="demo-copy">
          <p className="eyebrow">Se demo</p>
          <h2 id="demo-heading">Så funkar appen</h2>
          <p>
            En lugn 30-sekunders genomgång där Potatis visar hur appen sparar val,
            skapar nya veckor och ger recept och inköpslista utan omplanering varje gång.
          </p>
          <button className="demo-play" type="button" onClick={playDemo}>
            {isDemoPlaying ? 'Spelar demo…' : 'Spela Potatis-demo'}
          </button>
          <div className="demo-points">
            {demoBullets.map((bullet) => <span key={bullet}>{bullet}</span>)}
          </div>
        </div>
      </section>

      <section className="premium-panel" id="premium" aria-labelledby="premium-heading">
        <div className="premium-copy">
          <p className="eyebrow">Gratis först</p>
          <h2 id="premium-heading">Känn värdet innan du betalar.</h2>
          <p>
            Börja med en gratis veckomeny. När appen sparar tid på riktigt låser Premium upp vardagsfunktionerna som behövs varje vecka.
          </p>
        </div>
        <div className="plan-split" aria-label="Gratis och Premium">
          <article>
            <span className="plan-label">Gratis</span>
            <h3>100 maträtter + demo</h3>
            <ul>
              <li>Se hur planeringen fungerar</li>
              <li>Testa enklare veckoförslag</li>
              <li>Känn om appen passar boendet eller familjen</li>
            </ul>
          </article>
          <article className="premium-card">
            <span className="plan-label">Premium</span>
            <h3>49 kr/vecka · 499 kr/år</h3>
            <ul>
              <li>500+ maträtter och allergivänliga val</li>
              <li>Inköpslista, veckobudget och PDF</li>
              <li>Sparade planer och familje-/boendeprofil</li>
            </ul>
          </article>
        </div>
      </section>

      {plan.length > 0 && (
        <section className="result-panel" id="resultat" aria-live="polite">
          <div className="result-header">
            <div>
              <p className="eyebrow">{modeCopy.outputNote}</p>
              <h2>{displayName}s matvecka</h2>
              <p>
                {state.people} personer · {state.days} dagar · {state.restrictions || 'inga önskemål inskrivna'}
              </p>
            </div>
            <div className="result-actions">
              <img src="mascot/transparent/11a-a5-transparent.png" alt="Potatis säger att matveckan är klar" />
              <button type="button" onClick={sharePlan}>Dela</button>
              <button type="button" onClick={() => window.print()}>Skriv ut</button>
            </div>
          </div>

          <section className="printable" aria-labelledby="menu-heading">
            <h3 id="menu-heading">Veckomatsedel</h3>
            <div className="meal-grid wow-menu">
              {plan.map((meal, index) => (
                <article className={`meal-card dish-${meal.imageTone}`} data-testid={`meal-day-${index}`} key={`${meal.day}-${meal.id}`}>
                  <div className="dish-photo" aria-hidden="true">
                    {meal.image && <img src={meal.image} alt="" loading="lazy" />}
                    <span>{meal.title}</span>
                  </div>
                  <span>{meal.day}</span>
                  <h4>{meal.title}</h4>
                  <p>{meal.restaurantDescription}</p>
                  <small>{meal.ingredients.join(' · ')}</small>
                  <div className="tags">{meal.tags.map((tag) => <em key={tag}>{tag}</em>)}</div>
                  <button type="button" onClick={() => swapMeal(index)}>Byt maträtt</button>
                </article>
              ))}
            </div>
          </section>

          <section className="printable" aria-labelledby="recipe-heading">
            <h3 id="recipe-heading">Enkla recept</h3>
            <div className="recipe-grid">
              {plan.map((meal) => (
                <article className="recipe-card" key={`${meal.day}-${meal.id}-recipe`}>
                  <h4>{meal.day}: {meal.title}</h4>
                  <ol>{meal.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                </article>
              ))}
            </div>
          </section>

          <section className="printable shopping" id="inkop" aria-labelledby="shopping-heading">
            <div className="shopping-title">
              <div>
                <h3 id="shopping-heading">Inköpslista</h3>
                <p>Grov lista skalad för {state.people} personer. Justera efter aptit och lager.</p>
              </div>
              <img src="mascot/transparent/11a-a6-transparent.png" alt="Potatis hjälper med inköpslistan" />
            </div>
            <aside className="budget-summary" aria-label="Budgetsammanfattning">
              <strong>Ca {budget.totalSek} kr för veckan</strong>
              <span>Ca {budget.pricePerServingSek} kr/portion · {budget.label}</span>
              <small>{budget.note}</small>
              {budget.unpricedItems.length > 0 && <small>Ej prissatt/osäkert: {budget.unpricedItems.join(', ')}</small>}
            </aside>
            <div className="shopping-groups">
              {shoppingList.map((item) => (
                <label className="shopping-item" key={`${item.category}-${item.label}`}>
                  <input type="checkbox" />
                  <span>{item.label}</span>
                  <strong>{item.amount} {item.unit}</strong>
                  <small>{item.category}</small>
                </label>
              ))}
            </div>
            <p className="safety-note">Ansvarig person kontrollerar alltid allergier och specialkost innan inköp och servering.</p>
          </section>
        </section>
      )}
    </main>
  )
}

export default App
