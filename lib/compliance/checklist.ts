// lib/compliance/checklist.ts

export type ComplianceCategory =
  | 'deposit_protection'
  | 'safety_certificates'
  | 'right_to_rent'
  | 'fees_and_deposits'
  | 'prescribed_information'
  | 'unfair_terms'
  | 'licensing'
  | 'redress_and_cmp'
  | 'notice_and_eviction';

export interface ComplianceRule {
  id: string;
  category: ComplianceCategory;
  title: string;
  jurisdiction: 'england' | 'wales' | 'both';
  summary: string;
  whatToCheck: string;
  legalBasis: string;
}

export const COMPLIANCE_CHECKLIST: ComplianceRule[] = [
  {
    id: 'deposit-protection-scheme',
    category: 'deposit_protection',
    title: 'Deposit protected in an approved scheme',
    jurisdiction: 'both',
    summary:
      'Any tenancy deposit must be placed in a government-approved scheme (DPS, MyDeposits, or TDS) within 30 days of receipt.',
    whatToCheck:
      'Does the agreement name a specific approved deposit protection scheme and state the deposit amount? Flag if no scheme is named, if the deposit exceeds statutory caps, or if there is no mechanism described for protecting it.',
    legalBasis: 'Housing Act 2004, ss.212–215',
  },
  {
    id: 'deposit-cap',
    category: 'fees_and_deposits',
    title: 'Deposit does not exceed the statutory cap',
    jurisdiction: 'england',
    summary:
      "Security deposit is capped at 5 weeks' rent (or 6 weeks if annual rent exceeds £50,000).",
    whatToCheck:
      'Calculate weekly rent from the stated rent and compare the deposit amount against the 5/6-week cap.',
    legalBasis: 'Tenant Fees Act 2019, s.3 and Schedule 1',
  },
  {
    id: 'holding-deposit-cap',
    category: 'fees_and_deposits',
    title: "Holding deposit does not exceed one week's rent",
    jurisdiction: 'england',
    summary: "A holding deposit cannot exceed one week's rent.",
    whatToCheck:
      "If a holding deposit is mentioned, check it does not exceed one week's rent.",
    legalBasis: 'Tenant Fees Act 2019, s.2',
  },
  {
    id: 'banned-fees',
    category: 'fees_and_deposits',
    title: 'No prohibited fees charged to the tenant',
    jurisdiction: 'england',
    summary:
      'Fees for referencing, inventory checks, "administration", credit checks, professional cleaning (beyond a fair usage clause), or renewal are generally banned.',
    whatToCheck:
      "Scan for any clause charging the tenant a fee outside the permitted list (rent, capped deposit, capped holding deposit, default fees for late rent/lost keys within statutory limits, early termination at the tenant's request).",
    legalBasis: 'Tenant Fees Act 2019, s.1 and Schedule 1',
  },
  {
    id: 'gas-safety',
    category: 'safety_certificates',
    title: 'Gas Safety Certificate (CP12) referenced',
    jurisdiction: 'both',
    summary:
      'Landlords must have a valid annual Gas Safety Certificate and provide it to the tenant before or at the start of the tenancy.',
    whatToCheck:
      'Does the agreement or its schedule confirm a current CP12 was provided? Flag if there is no reference to gas safety compliance where the property has gas appliances.',
    legalBasis: 'Gas Safety (Installation and Use) Regulations 1998, reg.36',
  },
  {
    id: 'eicr',
    category: 'safety_certificates',
    title: 'Electrical Installation Condition Report (EICR)',
    jurisdiction: 'england',
    summary:
      'A satisfactory EICR (renewed at least every 5 years) must be obtained and a copy given to the tenant.',
    whatToCheck:
      'Look for confirmation an EICR has been carried out and supplied. Flag if absent or if the last inspection date referenced is more than 5 years old.',
    legalBasis:
      'Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020',
  },
  {
    id: 'epc',
    category: 'safety_certificates',
    title: 'Energy Performance Certificate (EPC) rating E or above',
    jurisdiction: 'both',
    summary:
      'Properties must generally have an EPC rating of E or above to be lawfully let, and the EPC must be provided to the tenant.',
    whatToCheck:
      'Check whether an EPC rating is referenced and whether it meets the minimum E rating (unless a registered exemption is cited).',
    legalBasis:
      'Energy Efficiency (Private Rented Property) (England and Wales) Regulations 2015',
  },
  {
    id: 'how-to-rent-guide',
    category: 'prescribed_information',
    title: '"How to Rent" guide provided',
    jurisdiction: 'england',
    summary:
      'The current version of the government "How to Rent" guide must be given to the tenant at the start of the tenancy — required for a valid Section 21.',
    whatToCheck:
      'Does the agreement confirm the guide was provided, and is there a date/version reference?',
    legalBasis:
      'Deregulation Act 2015, s.35 / Assured Shorthold Tenancy Notices and Prescribed Requirements (England) Regulations 2015',
  },
  {
    id: 'right-to-rent',
    category: 'right_to_rent',
    title: 'Right to Rent checks carried out',
    jurisdiction: 'england',
    summary:
      "Landlords/agents must check and retain evidence of every adult occupier's right to rent in the UK.",
    whatToCheck:
      'Does the agreement or onboarding paperwork reference Right to Rent checks having been completed for all named tenants?',
    legalBasis: 'Immigration Act 2014, Part 3',
  },
  {
    id: 'smoke-co-alarms',
    category: 'safety_certificates',
    title: 'Smoke and carbon monoxide alarms',
    jurisdiction: 'both',
    summary:
      'A smoke alarm on every storey used as living accommodation, and a CO alarm in any room with a solid fuel appliance (and, in England from Oct 2022, any room with a fixed combustion appliance).',
    whatToCheck:
      'Look for confirmation alarms are fitted and tested at the start of the tenancy.',
    legalBasis:
      'Smoke and Carbon Monoxide Alarm (England) Regulations 2015 (as amended 2022)',
  },
  {
    id: 'unfair-terms-repairs',
    category: 'unfair_terms',
    title: "No unlawful shifting of the landlord's repairing obligations",
    jurisdiction: 'both',
    summary:
      'Clauses making the tenant responsible for structural repairs, or repairs to installations for gas/water/electricity/heating, are void.',
    whatToCheck:
      'Flag any clause requiring the tenant to maintain structure, exterior, or the installations for supply of utilities/heating/water, beyond fair wear-and-tear or damage they caused.',
    legalBasis: 'Landlord and Tenant Act 1985, s.11 (non-excludable)',
  },
  {
    id: 'unfair-terms-general',
    category: 'unfair_terms',
    title: 'No significantly imbalanced or penalty-style clauses',
    jurisdiction: 'both',
    summary:
      "Terms causing a significant imbalance to the tenant's detriment, or disproportionate financial penalties, can be unfair and unenforceable.",
    whatToCheck:
      'Flag clauses like: disproportionate fixed "penalty" fees for late rent beyond a reasonable daily interest rate, blanket bans on statutory rights (e.g. purporting to prevent complaints to the council), or one-sided break/termination rights only for the landlord.',
    legalBasis: 'Consumer Rights Act 2015, Part 2 (unfair terms)',
  },
  {
    id: 'retaliatory-eviction',
    category: 'notice_and_eviction',
    title: 'Section 21 validity prerequisites',
    jurisdiction: 'england',
    summary:
      "A Section 21 notice is invalid if the deposit isn't protected/prescribed information served, the EPC/Gas Safety Certificate/How to Rent guide weren't provided, or if served within 6 months of certain improvement/emergency remedial notices.",
    whatToCheck:
      'Cross-reference the deposit, safety certificate, and How to Rent findings above — if any failed, note that this would currently block a valid Section 21 notice.',
    legalBasis: 'Deregulation Act 2015, s.33 and s.36',
  },
  {
    id: 'client-money-protection',
    category: 'redress_and_cmp',
    title: 'Letting agent Client Money Protection (CMP)',
    jurisdiction: 'england',
    summary:
      'Letting agents holding client money must belong to an approved CMP scheme.',
    whatToCheck:
      'If a letting agent is party to the agreement, check for a CMP scheme reference/certificate number.',
    legalBasis:
      'Client Money Protection Schemes for Property Agents (Requirement to Belong to a Scheme etc.) Regulations 2019',
  },
  {
    id: 'redress-scheme',
    category: 'redress_and_cmp',
    title: 'Letting agent redress scheme membership',
    jurisdiction: 'england',
    summary:
      'Letting agents must belong to a government-approved redress scheme (e.g. The Property Ombudsman or PRS).',
    whatToCheck:
      'If a letting agent is party to the agreement, check for a redress scheme reference.',
    legalBasis: 'Enterprise and Regulatory Reform Act 2013, s.83–84',
  },
  {
    id: 'selective-hmo-licensing',
    category: 'licensing',
    title: 'Selective / HMO licensing',
    jurisdiction: 'both',
    summary:
      'If the property is in a selective licensing area, or is a licensable HMO, the landlord must hold a valid licence.',
    whatToCheck:
      'This cannot usually be confirmed from the agreement text alone — flag it as "needs manual verification against the local authority licensing register" rather than guessing, unless a licence number is explicitly stated in the document.',
    legalBasis: 'Housing Act 2004, Parts 2 and 3',
  },
];

export function getChecklistForJurisdiction(
  jurisdiction: 'england' | 'wales'
): ComplianceRule[] {
  return COMPLIANCE_CHECKLIST.filter(
    (rule) => rule.jurisdiction === 'both' || rule.jurisdiction === jurisdiction
  );
}
