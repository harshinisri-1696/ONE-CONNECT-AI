import { DetectedNeed, NeedCategory } from '../types';

interface NeedRule {
  category: NeedCategory;
  label: string;
  keywords: string[];
  patterns: RegExp[];
  priorityKeywords: string[];
  defaultReasoning: string;
}

const NEED_RULES: NeedRule[] = [
  {
    category: 'education',
    label: 'Education & Scholarship Assistance',
    keywords: [
      'college', 'fees', 'tuition', 'school', 'scholarship', 'student', 'study',
      'university', 'marksheet', 'admission', 'degree', 'exam', 'books',
      'padhai', 'shiksha', 'chhatravritti', 'vidyarthi', 'kalloori', 'kalvi', 'padika'
    ],
    patterns: [
      /\b(college|school|tuition|fee|fees|study|studying|student|scholarship|degree|higher education)\b/i,
      /\b(chhatravritti|padhai|shiksha|vidyarthi|dakhila)\b/i,
      /\b(kalvi|kalloori|padipu|kattanam)\b/i
    ],
    priorityKeywords: ['struggling to pay', 'fees', 'scholarship', 'cannot pay college', 'dropout'],
    defaultReasoning: 'Identified student or educational financial support needs based on educational terms in the description.'
  },
  {
    category: 'financial_assistance',
    label: 'Direct Financial Assistance & Subsidies',
    keywords: [
      'financial', 'money', 'low income', 'poor', 'bpl', 'poverty', 'subsidy',
      'struggling', 'paisa', 'garib', 'aarthik', 'sahayata', 'dbt', 'cash', 'loan', 'fund',
      'panam', 'selavu', 'kadan', 'kashu', 'uthavi'
    ],
    patterns: [
      /\b(financial|money|fund|funds|cash|subsidy|aid|support|struggling to pay|low income|poverty|bpl)\b/i,
      /\b(aarthik|sahayata|paisa|garib|rozgar|tangi)\b/i,
      /\b(panam|uthavi|varumai|kadan|kashu)\b/i
    ],
    priorityKeywords: ['struggling', 'no money', 'low income', 'bpl', 'debt', 'urgent aid'],
    defaultReasoning: 'Identified household financial distress or requirement for government monetary subsidies.'
  },
  {
    category: 'employment',
    label: 'Employment & Job Support',
    keywords: [
      'job', 'unemployed', 'lost job', 'fired', 'layoff', 'work', 'hiring',
      'naukri', 'rozgar', 'berozgar', 'kam', 'vela', 'velai', 'vettai', 'employment', 'wage'
    ],
    patterns: [
      /\b(job|unemployed|unemployment|lost job|layoff|laid off|looking for job|jobless|work|wage)\b/i,
      /\b(naukri|berozgar|berojgar|rozgar|kam nahi)\b/i,
      /\b(velai|velaiilladha|vela)\b/i
    ],
    priorityKeywords: ['lost his job', 'lost job', 'unemployed', 'fired', 'no work', 'jobless'],
    defaultReasoning: 'Detected family member or individual job loss, unemployment, or need for wage employment.'
  },
  {
    category: 'skill_development',
    label: 'Vocational Skill Training & Certification',
    keywords: [
      'skill', 'training', 'learn', 'course', 'vocational', 'kaushal', 'prashikshan',
      'upskill', 'certificate', 'artisan', 'trade', 'payirchi', 'thiramai'
    ],
    patterns: [
      /\b(skill|skills|training|course|vocational|apprentice|learn trade|certification)\b/i,
      /\b(kaushal|prashikshan|hunnar)\b/i,
      /\b(payirchi|thiramai)\b/i
    ],
    priorityKeywords: ['skill training', 'vocational', 'learn course', 'placement'],
    defaultReasoning: 'Recognized potential benefit from government-sponsored technical skill development and certification.'
  },
  {
    category: 'healthcare',
    label: 'Healthcare & Medical Treatment Cover',
    keywords: [
      'health', 'medical', 'hospital', 'treatment', 'disease', 'illness', 'doctor',
      'surgery', 'medicine', 'ilaj', 'swasthya', 'aspatal', 'maruthuvam', 'udalnila'
    ],
    patterns: [
      /\b(health|hospital|medical|illness|treatment|surgery|doctor|medicine|ayushman)\b/i,
      /\b(swasthya|ilaj|dawa|aspatal|bimar|bimari)\b/i,
      /\b(maruthuvam|aabatharanji|udalnila|marunthu)\b/i
    ],
    priorityKeywords: ['surgery', 'hospital bills', 'critical illness', 'medical aid', 'treatment'],
    defaultReasoning: 'Identified need for hospitalization coverage, medical subsidy, or health insurance.'
  },
  {
    category: 'housing',
    label: 'Housing & Shelter Assistance',
    keywords: [
      'house', 'home', 'housing', 'shelter', 'kutcha', 'pucca', 'rent', 'homeless',
      'makan', 'ghar', 'awas', 'veedu', 'kudi'
    ],
    patterns: [
      /\b(house|housing|home|homeless|kutcha|pucca|shelter|rent|roof|pmay)\b/i,
      /\b(awas|makan|ghar|chhat|jhuggi)\b/i,
      /\b(veedu|kudi|iruipidom)\b/i
    ],
    priorityKeywords: ['homeless', 'kutcha house', 'no house', 'housing grant'],
    defaultReasoning: 'Detected requirement for permanent housing or residential construction subsidies.'
  },
  {
    category: 'agriculture',
    label: 'Agriculture, Farming & Rural Support',
    keywords: [
      'farmer', 'farming', 'agriculture', 'crop', 'land', 'seeds', 'tractor',
      'kisan', 'kheti', 'krishi', 'fasal', 'vivisayam', 'ulavar', 'nilam'
    ],
    patterns: [
      /\b(farmer|farming|agriculture|crop|landholding|kisan|cultivation|fertilizer)\b/i,
      /\b(kheti|krishi|fasal|khedut)\b/i,
      /\b(vivisayam|ulavar|nilam)\b/i
    ],
    priorityKeywords: ['kisan', 'crop loss', 'farmer debt', 'pm kisan'],
    defaultReasoning: 'Identified agrarian household needing crop support, input subsidies, or farmer income transfers.'
  },
  {
    category: 'women_welfare',
    label: 'Women Empowerment & Maternity Support',
    keywords: [
      'woman', 'women', 'mother', 'maternity', 'pregnant', 'girl', 'widow', 'female',
      'mahila', 'aurat', 'vidhwa', 'garbhvati', 'pen', 'pengal', 'thaai'
    ],
    patterns: [
      /\b(woman|women|mother|pregnant|pregnancy|maternity|widow|single mother|girl child)\b/i,
      /\b(mahila|aurat|vidhwa|garbhvati|mata)\b/i,
      /\b(pen|pengal|thaai|manaivi)\b/i
    ],
    priorityKeywords: ['pregnant', 'widow', 'maternity', 'women loan'],
    defaultReasoning: 'Identified gender-specific welfare, maternity benefit, or widow pension needs.'
  },
  {
    category: 'child_welfare',
    label: 'Child Welfare & Girl Child Security',
    keywords: [
      'child', 'children', 'baby', 'daughter', 'infant', 'girl child', 'sukanya',
      'bachha', 'beti', 'balika', 'kuzhandhai', 'magal'
    ],
    patterns: [
      /\b(child|children|daughter|baby|girl child|newborn|infant|ssy)\b/i,
      /\b(bachha|beti|balika|shishu)\b/i,
      /\b(kuzhandhai|magal|pen pillai)\b/i
    ],
    priorityKeywords: ['girl child', 'daughter education', 'sukanya'],
    defaultReasoning: 'Recognized child protection, newborn nutritional aid, or dedicated girl-child savings benefits.'
  },
  {
    category: 'senior_citizen_welfare',
    label: 'Senior Citizen Care & Old Age Pension',
    keywords: [
      'elderly', 'senior citizen', 'old age', 'grandfather', 'grandmother', 'retired',
      'pension', 'vridha', 'bujurg', 'dada', 'dadi', 'muthiyor', 'thatha', 'patti'
    ],
    patterns: [
      /\b(senior|elderly|old age|aged|grandfather|grandmother|grandparent|pensioner|60\+|70\+)\b/i,
      /\b(vridha|bujurg|dada|dadi|baba|pension)\b/i,
      /\b(muthiyor|thatha|patti|vayadhana)\b/i
    ],
    priorityKeywords: ['old age pension', 'elderly care', '70 years', 'senior'],
    defaultReasoning: 'Identified senior citizen requirements for retirement pension, geriatric care, and healthcare.'
  },
  {
    category: 'disability_support',
    label: 'Disability & Divyangjan Assistance',
    keywords: [
      'disabled', 'disability', 'handicapped', 'divyang', 'blind', 'deaf', 'udid',
      'wheelchair', 'viklang', 'maathuratha', 'oonam'
    ],
    patterns: [
      /\b(disabled|disability|divyang|handicapped|wheelchair|blind|deaf|udid|benchmark disability)\b/i,
      /\b(viklang|divyangjan)\b/i,
      /\b(oonam|maatruthiranal)\b/i
    ],
    priorityKeywords: ['disability certificate', 'divyang', 'wheelchair aid'],
    defaultReasoning: 'Identified need for assistive aids, disability pension, and Divyangjan identity certification.'
  },
  {
    category: 'entrepreneurship',
    label: 'Micro-Enterprise & Business Startup',
    keywords: [
      'business', 'startup', 'shop', 'self employed', 'enterprise', 'mudra', 'loan',
      'vyapar', 'dukan', 'khud ka kam', 'thozhil', 'vanigam'
    ],
    patterns: [
      /\b(business|startup|micro enterprise|shopkeeper|small business|self employed|trade|mudra)\b/i,
      /\b(vyapar|dukan|karobar|udyog)\b/i,
      /\b(thozhil|vanigam|suya thozhil)\b/i
    ],
    priorityKeywords: ['start business', 'mudra loan', 'expand shop', 'working capital'],
    defaultReasoning: 'Identified micro-enterprise establishment, collateral-free credit, or business growth needs.'
  },
  {
    category: 'social_security',
    label: 'Social Security & Unorganized Worker Protection',
    keywords: [
      'social security', 'insurance', 'life cover', 'accident', 'unorganized worker',
      'e-shram', 'bima', 'suraksha', 'padhukappu'
    ],
    patterns: [
      /\b(social security|insurance|pension|life insurance|accident cover|unorganized|e-shram)\b/i,
      /\b(bima|suraksha|eshram)\b/i,
      /\b(padhukappu|kapidu)\b/i
    ],
    priorityKeywords: ['unorganized sector', 'e-shram', 'accident insurance'],
    defaultReasoning: 'Detected need for social security coverage, unorganized worker welfare, or accident insurance.'
  }
];

export function detectNeedsFromText(text: string): {
  needs: DetectedNeed[];
  detectedLanguage: 'en' | 'hi' | 'ta';
  simplifiedSummary: string;
} {
  if (!text || text.trim().length === 0) {
    return {
      needs: [],
      detectedLanguage: 'en',
      simplifiedSummary: 'Please describe your situation to detect applicable welfare support areas.'
    };
  }

  const cleanText = text.toLowerCase();
  const detectedNeeds: DetectedNeed[] = [];

  // Simple language identification
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  const detectedLanguage = hasDevanagari ? 'hi' : hasTamil ? 'ta' : 'en';

  for (const rule of NEED_RULES) {
    let matchScore = 0;
    const matchedKeywords: string[] = [];

    // Pattern checking
    for (const pattern of rule.patterns) {
      if (pattern.test(cleanText)) {
        matchScore += 3;
      }
    }

    // Keyword checking
    for (const kw of rule.keywords) {
      if (cleanText.includes(kw.toLowerCase())) {
        matchScore += 1;
        if (!matchedKeywords.includes(kw)) {
          matchedKeywords.push(kw);
        }
      }
    }

    // Priority keywords checking
    let hasPriority = false;
    for (const pKw of rule.priorityKeywords) {
      if (cleanText.includes(pKw.toLowerCase())) {
        matchScore += 4;
        hasPriority = true;
        if (!matchedKeywords.includes(pKw)) {
          matchedKeywords.push(pKw);
        }
      }
    }

    if (matchScore > 0) {
      const confidence = Math.min(0.98, Math.max(0.45, 0.4 + matchScore * 0.08));
      const priority = hasPriority || matchScore >= 4 ? 'high' : matchScore >= 2 ? 'medium' : 'low';

      detectedNeeds.push({
        category: rule.category,
        label: rule.label,
        priority,
        reasoning: rule.defaultReasoning,
        keywords: matchedKeywords.slice(0, 5),
        confidence: Number(confidence.toFixed(2)),
        suggestedAction: `Check verified government schemes in ${rule.label}`
      });
    }
  }

  // Cross-need inference:
  // If student + struggling/fees -> automatically link to financial_assistance and education
  if (
    cleanText.includes('college') ||
    cleanText.includes('school') ||
    cleanText.includes('student') ||
    cleanText.includes('fees')
  ) {
    if (!detectedNeeds.some(n => n.category === 'education')) {
      detectedNeeds.push({
        category: 'education',
        label: 'Education & Scholarship Assistance',
        priority: 'high',
        reasoning: 'Inferred need for educational assistance based on college/student context.',
        keywords: ['education', 'student'],
        confidence: 0.92,
        suggestedAction: 'Explore merit and means-based student scholarships'
      });
    }
  }

  // If someone mentions job loss or father unemployed -> ensure employment + skill training + financial assistance
  if (
    cleanText.includes('job') ||
    cleanText.includes('lost') ||
    cleanText.includes('unemployed') ||
    cleanText.includes('berozgar') ||
    cleanText.includes('velai')
  ) {
    if (!detectedNeeds.some(n => n.category === 'employment')) {
      detectedNeeds.push({
        category: 'employment',
        label: 'Employment & Job Support',
        priority: 'high',
        reasoning: 'Identified household employment distress and wage work requirement.',
        keywords: ['employment', 'job search'],
        confidence: 0.9,
        suggestedAction: 'View public employment opportunities and wage schemes'
      });
    }
    if (!detectedNeeds.some(n => n.category === 'skill_development')) {
      detectedNeeds.push({
        category: 'skill_development',
        label: 'Vocational Skill Training & Certification',
        priority: 'medium',
        reasoning: 'Skill development programs can enhance family employability and provide stipends.',
        keywords: ['skill development', 'training'],
        confidence: 0.78,
        suggestedAction: 'Explore free PMKVY certifications with stipend'
      });
    }
  }

  // Sort by priority and confidence
  detectedNeeds.sort((a, b) => {
    const pRank = { high: 3, medium: 2, low: 1 };
    if (pRank[a.priority] !== pRank[b.priority]) {
      return pRank[b.priority] - pRank[a.priority];
    }
    return b.confidence - a.confidence;
  });

  const needLabels = detectedNeeds.map(n => n.label.split('&')[0].trim());
  const simplifiedSummary =
    detectedNeeds.length > 0
      ? `We identified ${detectedNeeds.length} support areas based on your situation: ${needLabels.join(', ')}.`
      : 'We could not detect a specific welfare category from your input. Please provide more context about your family, studies, employment, or healthcare needs.';

  return {
    needs: detectedNeeds,
    detectedLanguage,
    simplifiedSummary
  };
}
