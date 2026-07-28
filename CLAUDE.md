# CLAUDE.md — Ecoflo Portal Prototype

## What this is

A high-fidelity, click-through prototype of the Ecoflo Portal. It serves two
audiences at once:

1. **PTWE leadership** needs to see and feel the product vision.
2. **IT and DEV** need to understand what gets built, where data lives, and what
   is still undecided.

It is therefore **a design document that happens to run**. Blueprint mode (see
DESIGN.md section 6) is how it serves the second audience without compromising
the first.

This is not a production build. No backend, no auth, no API calls, no database.
All data is mock and comes from `src/data/seedData.ts`.

---

## Working agreement

- **Present a to-do list and wait for validation before starting.** Do not begin
  writing components until the plan is approved.
- Flag anything that will consume significant time or tokens before doing it.
- Ask for confirmation on any decision with downstream impact.
- Work in two passes. Pass 1: every route, the design system, the full
  annotation layer, at medium fidelity. Pass 2: three hero screens to 100%.
- Hero screens are `client-owner/home`, `sp-technician/work-order/:id`, and
  `global/mix-tracker`. Do not polish anything else before these three are done.

---

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS, configured to read brand tokens as CSS custom properties
- React Router for client-side routing
- Recharts for charts
- react-simple-maps for the network map
- lucide-react, limited to the 14 icons in `src/ui/icons.ts`
- Fonts: Plus Jakarta Sans and IBM Plex Mono, from Google Fonts

Must run with `npm install && npm run dev`.

---

## Design system

**Read `DESIGN.md` before writing any component. It is normative.**

The short version: warm paper canvas, hairline borders, no shadows, typography
carries hierarchy, one accent per screen, 14 icons total, no emoji, no coloured
status dots, no staggered animation. Section 9 of DESIGN.md is a list of banned
patterns. Treat it as a lint rule.

Every colour, radius, font and spacing value comes from the active brand token
object. **No hex value appears in any component file.**

---

## Roles

Five roles, switched from a dropdown in the top bar. The same seed data feeds all
five. Switching role never reloads data, it re-renders it.

| Key | Label in switcher | Viewport |
|---|---|---|
| `client-prospect` | Client, before install | mobile |
| `client-owner` | Client, system owner | mobile |
| `sp-technician` | Service Point, technician | mobile |
| `sp-manager` | Service Point, manager | responsive |
| `ptwe-global` | PTWE Global | desktop |

This is a **role switcher, not an app switcher**. One shell, one nav pattern, one
design system, role-scoped navigation. That is the architectural argument the
prototype exists to make: a single converged authenticated surface, not three
separate portals.

### Device frame

When a mobile-first role is viewed at a viewport wider than 900px, render the app
inside a device frame centred on the canvas. Without it, a projected demo looks
like a stretched phone app. The frame is deliberate, not decorative. `ptwe-global`
and `sp-manager` at desktop width render full bleed with no frame.

---

## The golden thread

One customer, one system, one contract, one work order run through all five
roles. This is the most important thing in the prototype. Stakeholders stop
arguing about screens once they see the same record from five angles.

- `ACC-QC-004182` Sarah and Julien Lavoie, lakeside property, Eastern Townships
- `AST-QC-004182-1` Ecoflo Compact EC-5, installed May 2019
- `SC-2026-00871` Proactive Care contract, annual, active
- `WO-2026-0412` filter media replacement, scheduled, technician Marc Bouchard
- `SP-QC-EST` Service Point Estrie, Region Québec

`WO-2026-0412` must appear as:
- the "next visit" block on the client owner home
- a job card and full work order on the technician's day
- a scheduled job on the manager's dispatch board
- one completed unit inside the Global rollup after it closes

A second thread follows a prospect, `LEAD-2026-1187` Chloé Bergeron, from intake
through to quote approval.

---

## Naming

- Customers see **Service Point** and **your Service Point team**.
- Customers never see: work order, entitlement, asset, case, lead, opportunity.
  Those words live on internal surfaces only.
- The AI assistant is **Flo**. It is never called "AI assistant", never badged,
  and never given a sparkle icon. It answers, it cites its sources, it stays out
  of the way.

---

## Annotation layer

`src/data/sections.ts` holds one annotation per section. The schema is fixed. Do
not add free-text tooltips anywhere outside this file.

Each annotation renders in two registers:
- **Business line** always visible in the panel. One or two sentences, plain
  language, no system names. This is what leadership reads.
- **Technical block** collapsed by default. System of record, data direction,
  integration path, BF dependency, open decision, phase, privacy. This is what
  IT and DEV expand.

Blueprint mode reveals all callouts at once and enables **Export spec**, which
serialises every annotation to markdown. See DESIGN.md section 6.

---

## Screen inventory

34 screens. `P1` gets a full build in pass 1. `P2` gets route, layout skeleton
and its annotation, filled in during pass 2.

### client-prospect
| # | Screen | Route | Pass |
|---|---|---|---|
| 1 | Intake | `/start` | P1 |
| 2 | Request received, team assigned | `/request` | P1 |
| 3 | Soil test and report | `/soil-test` | P2 |
| 4 | Your solution and quote | `/quote` | P1 |
| 5 | Installation and project tracking | `/install` | P2 |
| 6 | Handover to owner | `/handover` | P2 |

There is **no configurator**. The customer never designs their own system. PTWE
does the soil test, the design and the quote. Screen 4 is a *recommendation
reveal*, not a wizard: here is the system we designed for your property, and here
is why. Same technical credibility, none of the homework.

### client-owner
| # | Screen | Route | Pass |
|---|---|---|---|
| 7 | Home | `/home` | P1 hero |
| 8 | My system | `/system` | P1 |
| 9 | Invoices and payment | `/invoices` | P2 |
| 10 | Maintenance contract | `/contract` | P2 |
| 11 | Book an appointment | `/book` | P1 |
| 12 | Parts store | `/parts` | P1 |
| 13 | Messages | `/messages` | P2 |
| 14 | Transfer ownership | `/system/transfer` | P2 |
| 15 | Recommended for your property | `/recommended` | P2 |

### sp-technician
| # | Screen | Route | Pass |
|---|---|---|---|
| 16 | My day | `/day` | P1 |
| 17 | Work order detail | `/wo/:id` | P1 hero |
| 18 | Route and schedule | `/route` | P2 |
| 19 | Field quote | `/wo/:id/quote` | P2 |
| 20 | Pre-job safety check | `/wo/:id/safety` | P2 |

### sp-manager
| # | Screen | Route | Pass |
|---|---|---|---|
| 21 | Service Point dashboard | `/sp` | P1 |
| 22 | Dispatch board | `/sp/dispatch` | P2 |
| 23 | Customers | `/sp/customers` | P2 |
| 24 | Leads | `/sp/leads` | P1 |
| 25 | MARCOM catalogue | `/sp/marcom` | P1 |
| 26 | Inventory | `/sp/inventory` | P1 |
| 27 | Team and capacity | `/sp/team` | P2 |

### shared, both SP roles
| # | Screen | Route | Pass |
|---|---|---|---|
| 28 | Flo | `/flo` | P1 |

### ptwe-global
| # | Screen | Route | Pass |
|---|---|---|---|
| 29 | Network overview | `/network` | P1 |
| 30 | Region and Service Point drill | `/network/:regionId` | P2 |
| 31 | Strategic mix tracker | `/mix` | P1 hero |
| 32 | Digital adoption and Flo analytics | `/adoption` | P1 |
| 33 | Benchmarking and alerts | `/benchmarking` | P2 |
| 34 | Service Point readiness | `/readiness` | P2 |

---

## Screen notes that matter

**7. Client home.** The dominant block answers one question: what happens next.
Forest background, one of only two places it appears. Next visit date, technician
name and photo, arrival state, and a single action. Below it, quiet rows: system,
contract, invoices. Nothing competes with the top block.

**12. Parts store.** Commerce sits behind `src/commerce/adapter.ts`. The platform
is **not decided**. The UI must not encode Shopify-specific or
Salesforce-Commerce-specific patterns. The annotation states the decision is open
and lists what changes under each option.

**17. Work order.** The operational credibility screen. Checklist, photo capture,
parts consumed, time capture, customer signature, and a visible offline state
indicator. The offline indicator matters: it tells the field audience that
somebody thought about a basement with no signal.

The technician's checklist output is **not** what the customer reads. A
plain-language visit summary is generated from it. Annotate that translation
layer explicitly, it is a real design decision and reviewers will ask.

**25. MARCOM catalogue.** Not a merch store. Order flow, custom fields, price,
order history, and a **campaign results tab** showing leads generated and
attributed back to the CRM. Without the closed loop it reads as shopping.

**26. Inventory.** Includes a consumption forecast derived from scheduled filter
media replacement jobs, and separates Service Point stock from truck stock.

**28. Flo.** Every answer cites its source documents inline. This is the whole
point: grounded retrieval, not a model guessing about septic regulations. Scope
is role-filtered, one instance shared by technician and manager.

**31. Mix tracker.** Service revenue share against the 35% target, at network,
region and Service Point level. Lead-versus-lag ranking around the target line.

**32. Adoption.** Portal activation rate, self-serve booking share, e-commerce
attach rate, Flo usage and unanswered questions. These are the digital KPIs the
VP Numeric Strategy is accountable for, which is why they get their own screen.

---

## Branding

Two complete brand token objects in `src/brands/`. Legacy is default. Switch with
`Alt+Shift+N` or the `?brand=next` URL parameter. The choice persists in
localStorage.

Every component reads CSS custom properties. Changing brand must require zero
component edits. If a brand switch breaks a component, that component has a
hardcoded value and it is a bug.

`brands/next.ts` ships with placeholder values matching legacy. It will be
overwritten when the brand guide lands. See `ASSETS.md`.

---

## Constraints

- Mock data only, all of it from `seedData.ts`. No real financial figures.
- No auth, no backend, no external API calls, no localStorage except the brand
  and Blueprint-mode preference.
- Accessible floor: visible keyboard focus, 4.5:1 body contrast, respects
  `prefers-reduced-motion`, all interactive elements reachable by keyboard.
- **No em-dashes in any UI copy, comment or annotation.**
