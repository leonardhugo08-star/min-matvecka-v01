import { useEffect, useMemo, useState } from 'react'
import {
  createShoppingList,
  generateWeek,
  preferenceFoods,
  replaceMeal,
  type PlannedMeal,
  type PlannerMode,
  type PlannerProfile,
} from './planner'

const storageKey = 'min-matvecka-scratch-dual-mode-v1'

type SavedState = PlannerProfile & { plan: PlannedMeal[] }

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
    restrictionLabel: 'Specialkost, allergier eller konsistens',
    helper: 'Välj tillsammans när det finns tid och energi. Tryck skapa direkt när veckan bara måste bli ordnad.',
    outputNote: 'Tydlig personalvy + boendevy. Matsedel, enkla recept och inköpslista.',
  },
  family: {
    button: 'Familj hemma',
    intro: 'Snabbt, enkelt och varierande för familjer som vill slippa vardagsmatskaos.',
    nameLabel: 'Familjenamn',
    namePlaceholder: 'Ex. Myrenblom',
    peopleLabel: 'Antal personer hemma',
    restrictionLabel: 'Allergier, ogillar eller vardagsbehov',
    helper: 'Välj några favoriter, tryck skapa och få en varierad vecka med inköpslista.',
    outputNote: 'Familjevy. Middagar, snabba recept och lista för storhandling.',
  },
} satisfies Record<PlannerMode, Record<string, string>>

function App() {
  const [state, setState] = useState<SavedState>(loadState)
  const modeCopy = copy[state.mode]
  const plan = state.plan
  const shoppingList = useMemo(() => createShoppingList(plan, state.people), [plan, state.people])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state])

  function update(partial: Partial<SavedState>) {
    setState((current) => ({ ...current, ...partial }))
  }

  function chooseMode(mode: PlannerMode) {
    setState((current) => ({
      ...current,
      mode,
      days: 7,
      name: current.name || (mode === 'lss' ? 'Solrosen' : 'Familjen'),
      plan: [],
    }))
  }

  function togglePreference(id: string, value: 'yes' | 'no') {
    setState((current) => {
      const without = {
        liked: current.liked.filter((item) => item !== id),
        disliked: current.disliked.filter((item) => item !== id),
      }
      return {
        ...current,
        liked: value === 'yes' ? [...without.liked, id] : without.liked,
        disliked: value === 'no' ? [...without.disliked, id] : without.disliked,
        plan: current.plan,
      }
    })
  }

  function createPlan() {
    setState((current) => ({ ...current, plan: generateWeek(current) }))
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
    setState(defaults)
  }

  const displayName = state.name.trim() || (state.mode === 'lss' ? 'Boendet' : 'Familjen')
  const chosenCount = state.liked.length + state.disliked.length

  return (
    <main className="app-shell">
      <nav className="top-nav" aria-label="Huvudnavigation">
        <a href="#start">Start</a>
        <a href="#planera">Planera</a>
        <a href="#resultat">Matsedel</a>
        <a href="#inkop">Inköpslista</a>
      </nav>
      <section className="hero" id="start">
        <div className="hero-copy">
          <p className="brand-pill">minmatvecka.se · V0.1</p>
          <h1>Min Matvecka</h1>
          <p className="tagline">Planera tillsammans — eller få veckan klar direkt.</p>
          <p className="lead">
            Tydliga val för LSS-boenden. Snabba vardagsveckor för barnfamiljer. Matsedel, enkla recept och inköpslista på samma ställe.
          </p>
          <div className="mode-buttons" aria-label="Välj läge">
            {(['lss', 'family'] as const).map((mode) => (
              <button
                className={state.mode === mode ? 'selected' : ''}
                type="button"
                key={mode}
                onClick={() => chooseMode(mode)}
              >
                {copy[mode].button}
                <span>{mode === 'lss' ? 'tydligt · pedagogiskt · involverande' : 'snabbt · enkelt · varierande'}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="potatis-stage">
          <img src="mascot/marketing/m1-transparent.png" alt="Potatis hjälper dig planera veckan" />
          <p className="mascot-label">Maskot: M1 i hero · A1–A6 i appens hjälpsteg</p>
          <div className="speech-bubble">{modeCopy.helper}</div>
        </div>
      </section>

      <section className="setup-panel" id="planera" aria-labelledby="setup-heading">
        <div className="section-title">
          <div>
            <p className="eyebrow">{copy[state.mode].button}</p>
            <h2 id="setup-heading">Skapa första matveckan</h2>
          <p>{modeCopy.intro}</p>
          <p className="selection-status">Du har markerat {chosenCount} av {preferenceFoods.length} maträtter. Välj tillsammans om ni vill — eller skapa veckan direkt.</p>
        </div>
          <button className="ghost" type="button" onClick={reset}>Rensa</button>
        </div>

        <div className="form-grid">
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
          <label className="wide">
            {modeCopy.restrictionLabel}
            <textarea
              value={state.restrictions}
              placeholder="Ex. laktosfri, glutenfri, inga nötter, vill ha mild mat"
              onChange={(event) => update({ restrictions: event.target.value })}
            />
          </label>
        </div>

        <div className="preference-grid" aria-label="Matpreferenser">
          {preferenceFoods.map((food) => {
            const liked = state.liked.includes(food.id)
            const disliked = state.disliked.includes(food.id)
            return (
              <article className={`food-card ${liked ? 'liked' : ''} ${disliked ? 'disliked' : ''}`} key={food.id}>
                <img src={food.image} alt="" />
                <h3>{food.label}</h3>
                <div>
                  <button className={disliked ? 'no active' : 'no'} type="button" onClick={() => togglePreference(food.id, 'no')}>
                    {disliked ? 'Valt NEJ: ' : 'NEJ '}{food.label}
                  </button>
                  <button className={liked ? 'yes active' : 'yes'} type="button" onClick={() => togglePreference(food.id, 'yes')}>
                    {liked ? 'Valt JA: ' : 'JA '}{food.label}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <button className="primary" type="button" onClick={createPlan}>Skapa matvecka</button>
      </section>

      {plan.length > 0 && (
        <section className="result-panel" id="resultat" aria-live="polite">
          <div className="result-header">
            <div>
              <p className="eyebrow">{modeCopy.outputNote}</p>
              <h2>{displayName}s matvecka</h2>
              <p>
                {state.people} personer · {state.days} dagar · {state.restrictions || 'ingen specialkost inskriven'}
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
            <div className="meal-grid">
              {plan.map((meal, index) => (
                <article className="meal-card" data-testid={`meal-day-${index}`} key={`${meal.day}-${meal.id}`}>
                  <span>{meal.day}</span>
                  <h4>{meal.title}</h4>
                  <p>{meal.ingredients.join(' · ')}</p>
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
