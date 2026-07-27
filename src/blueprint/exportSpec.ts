/**
 * blueprint/exportSpec.ts
 *
 * Serialises every annotation on every screen to markdown.
 *
 * This is the artefact IT and DEV take away from the demo. It is generated from
 * `data/sections.ts` rather than maintained separately, so the running
 * prototype and the written specification cannot drift apart.
 *
 * No em-dashes in the output. See DESIGN.md section 10.
 */

import { roles, roleOrder, type RoleKey } from '../shell/roles';
import { sections, type Section } from '../data/sections';

/** Screen titles, keyed by route, so the export reads as a document. */
const screenOrder: string[] = [
  '/start',
  '/request',
  '/soil-test',
  '/quote',
  '/install',
  '/handover',
  '/home',
  '/system',
  '/invoices',
  '/contract',
  '/book',
  '/parts',
  '/messages',
  '/system/transfer',
  '/recommended',
  '/day',
  '/wo/:id',
  '/route',
  '/wo/:id/quote',
  '/wo/:id/safety',
  '/sp',
  '/sp/dispatch',
  '/sp/customers',
  '/sp/leads',
  '/sp/marcom',
  '/sp/inventory',
  '/sp/team',
  '/flo',
  '/network',
  '/network/:regionId',
  '/mix',
  '/adoption',
  '/benchmarking',
  '/readiness',
];

const bullet = (label: string, value: string): string => `- **${label}:** ${value}`;

const renderSection = (section: Section): string => {
  const number = String(section.callout).padStart(2, '0');
  const lines: string[] = [
    `#### ${number}. ${section.title}`,
    '',
    section.business,
    '',
    bullet('Primary user', section.primaryUser),
    bullet('System of record', section.systemOfRecord.join(', ')),
    bullet('Data direction', section.dataDirection),
    bullet('Integration', section.integration),
    bullet('Foundational block', section.bf.join(', ')),
    bullet('Phase', section.phase),
  ];

  if (section.privacy) {
    lines.push(bullet('Privacy, Law 25', section.privacy));
  }

  lines.push(
    bullet(
      'Open decision',
      section.openDecision ?? 'None. The path for this section is clear.',
    ),
  );

  return lines.join('\n');
};

/** Groups screens under the role that owns them, for a readable document. */
const roleForScreen = (screen: string): RoleKey => {
  const owning = sections.find((s) => s.screen === screen);
  return owning?.roles[0] ?? 'ptwe-global';
};

export const buildSpecMarkdown = (): string => {
  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;

  const blocked = sections.filter((s) => s.openDecision !== null);
  const privacy = sections.filter((s) => s.privacy !== undefined);

  const out: string[] = [
    '# Ecoflo Portal, specification export',
    '',
    `Generated from the prototype on ${stamp}. ${sections.length} annotated sections across ${screenOrder.length} screens.`,
    '',
    'This file is generated from the annotation layer that the prototype renders.',
    'It is not maintained by hand, so it cannot drift from what the build shows.',
    '',
    '## How to read this',
    '',
    'Each section carries a business line, which is what leadership reads, and a',
    'technical block, which is what IT and DEV expand. The numbers match the',
    'callouts shown on screen in Blueprint mode.',
    '',
    '## Summary',
    '',
    bullet('Sections annotated', String(sections.length)),
    bullet('Sections with an open decision', String(blocked.length)),
    bullet('Sections handling personal data', String(privacy.length)),
    bullet('Phase V1', String(sections.filter((s) => s.phase === 'V1').length)),
    bullet('Phase V2', String(sections.filter((s) => s.phase === 'V2').length)),
    bullet('Phase Later', String(sections.filter((s) => s.phase === 'Later').length)),
    '',
    '## Open decisions',
    '',
    'These are the questions the prototype deliberately leaves open. Each one',
    'changes what gets built, so none of them is a detail to settle later.',
    '',
  ];

  if (blocked.length === 0) {
    out.push('None recorded.', '');
  } else {
    for (const section of blocked) {
      out.push(`### ${section.title}`, '', `Screen \`${section.screen}\`.`, '', section.openDecision ?? '', '');
    }
  }

  out.push('## Screens', '');

  let currentRole: RoleKey | null = null;

  // Walk screens in journey order, opening a new role heading when it changes.
  for (const screen of screenOrder) {
    const forScreen = sections
      .filter((s) => s.screen === screen)
      .sort((a, b) => a.callout - b.callout);
    if (forScreen.length === 0) continue;

    const role = roleForScreen(screen);
    if (role !== currentRole) {
      currentRole = role;
      out.push(`### ${roles[role].label}`, '');
    }

    out.push(`#### Screen \`${screen}\``, '');
    for (const section of forScreen) {
      out.push(renderSection(section), '');
    }
  }

  out.push('## Roles', '');
  for (const key of roleOrder) {
    const role = roles[key];
    out.push(
      `### ${role.label}`,
      '',
      role.who,
      '',
      bullet('Viewport', role.viewport),
      bullet('Lands on', `\`${role.home}\``),
      bullet('Navigation', role.nav.map((n) => n.label).join(', ')),
      '',
    );
  }

  return out.join('\n');
};

/**
 * Hands the markdown to the browser as a download. No backend, so this is a
 * Blob and a synthetic click.
 */
export const downloadSpec = (): void => {
  const markdown = buildSpecMarkdown();
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'ecoflo-portal-spec.md';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
