/**
 * Utility to localize and translate clinical hair & eye assessment report contents
 * dynamically between English and Tamil so that switching language always displays
 * fully translated content even for pre-existing or cached reports.
 */

export interface EyeMetrics {
  colorStagesPassed?: number;
  colorStagesTotal?: number;
  colorPoints?: number;
  colorPointsTotal?: number;
  leftEyeScore?: number | null;
  rightEyeScore?: number | null;
  bothEyesScore?: number | null;
  readingStagesPerEye?: number;
  readingStagesTotal?: number;
  screenTime?: 'below1' | '1to3' | 'above3' | null;
  usingPhoneAtNight?: boolean;
  eyeIrritationDuringTest?: boolean;
  wateryEyesDuringTest?: boolean;
  headacheAfterScreenUse?: boolean;
  blurryVisionAfterProlongedUse?: boolean;
  symptomCount?: number;
}

export interface Consultation {
  level: 'none' | 'recommended' | 'mandatory';
  message: string;
}

export interface DiagnosticReport {
  title?: string;
  condition?: string;
  grade?: string;
  colorStatus?: string;
  overview?: string;
  clinicalFindings?: string[];
  dos?: string[];
  donts?: string[];
  recommendations?: string[];
  lifestyleGuidance?: string;
  disclaimer?: string;
  overallScore?: number;
  colorScore?: number;
  colorStagesPassed?: number;
  acuityScore?: number;
  maxAcuity?: number;
  leftEyeScore?: number | null;
  rightEyeScore?: number | null;
  bothEyesScore?: number | null;
  eyeMetrics?: EyeMetrics;
  consultation?: Consultation;
  [key: string]: any;
}

const translationMap: Record<string, string> = {
  // Hair Conditions
  'Balanced Healthy Scalp': 'சீரான ஆரோக்கியமான உச்சந்தலை (Balanced Healthy Scalp)',
  'Pediculosis Capitis (Active Head Lice Infestation)': 'தலையிலுள்ள பேன் தொற்று (Pediculosis Capitis)',
  'Seborrheic Dermatitis / Micro-fungal Scalp Irritation': 'பொடுகு மற்றும் பூஞ்சை தொற்று (Seborrheic Dermatitis)',
  'Pityriasis Capitis (Flaking & Dandruff)': 'பொடுகு உதிர்தல் நிலை (Pityriasis Capitis)',
  'Xerosis Capitis (Dry Dehydrated Scalp Pruritus)': 'வறண்ட உச்சந்தலை அரிப்பு (Xerosis Capitis)',
  'Telogen Phase Stagnation (Reduced Follicular Vitality)': 'மெதுவான முடி வளர்ச்சி நிலை (Telogen Phase Stagnation)',
  'Hyper-seborrhea (Excess Sebum Production)': 'அதிகப்படியான எண்ணெய் சுரப்பு (Hyper-seborrhea)',

  // Hair Findings
  'Low lipid barrier with cuticular moisture deficiency.': 'ஈரப்பதக் குறைபாடு மற்றும் பாதுகாப்பு அடுக்கு பலவீனமாக உள்ளது.',
  'Active sebaceous glands producing surplus natural sebum.': 'உச்சந்தலையில் எண்ணெய் சுரப்பிகள் அதிகப்படியான சீபத்தை (எண்ணெய்) சுரக்கின்றன.',
  'Well-balanced epidermal moisture and lipid homeostasis.': 'உச்சந்தலையில் சரியான ஈரப்பதம் மற்றும் இயற்கை எண்ணெய் சமநிலை உள்ளது.',
  'Micro-circulation at hair papillae may require stimulation.': 'மயிர்க்கால்களில் ரத்த ஓட்டத்தைத் தூண்டுவது முடி வளர்ச்சிக்கு அவசியமாகலாம்.',
  'Robust anagen (active growth) follicular cycle observed.': 'சிறப்பான சுறுசுறுப்பான முடி வளர்ச்சி சுழற்சி (Anagen phase) காணப்படுகிறது.',
  'Standard steady hair turnover and renewal cycle.': 'சீரான இயல்பான முடி வளர்ச்சி மற்றும் புதுப்பித்தல் சுழற்சி காணப்படுகிறது.',
  'Malassezia yeast proliferation causing epidermal inflammation and itchy flaking.': 'மலாசீசியா (Malassezia) பூஞ்சை பெருக்கத்தால் உச்சந்தலையில் வீக்கம் மற்றும் அரிப்புடன் கூடிய பொடுகு உருவாகிறது.',
  'Mild superficial dead skin shed without active inflammatory pruritus.': 'அரிப்பற்ற லேசான மேலோட்டமான இறந்த தோல் செதில்கள் (பொடுகு) உதிர்தல்.',
  'Neuro-sensory scalp sensitivity or contact irritation from styling agents.': 'உச்சந்தலை உணர்திறன் அல்லது அழகு சாதனப் பொருட்களினால் ஏற்பட்ட ஒவ்வாமை/அரிப்பு.',
  'Parasitic ectoparasite presence requiring immediate mechanical & medicinal eradication.': 'உச்சந்தலையில் பேன் தொற்று காணப்படுவதால் உடனடி மருத்துவ மற்றும் இயந்திர வழி நீக்கம் அவசியம்.',

  // Hair Dos
  'Apply cold-pressed argan, coconut, or almond oil 1 hour before gentle hair wash.': 'முடி குளிப்பதற்கு 1 மணி நேரத்திற்கு முன் தேங்காய் எண்ணெய் அல்லது பாதாம் எண்ணெய் தடவவும்.',
  'Use a clarifying tea-tree or salicylic acid shampoo 2-3 times weekly.': 'டீ-ட்ரீ (Tea tree) அல்லது சாலிசிலிக் அமிலம் கொண்ட ஷாம்பூவை வாரத்திற்கு 2-3 முறை பயன்படுத்தவும்.',
  'Maintain gentle weekly cleansing and mild hydration.': 'வாரம் இருமுறை மென்மையான கூந்தல் தூய்மை மற்றும் பராமரிப்பைப் பின்பற்றவும்.',
  'Leave medicated shampoo on scalp for 3-5 minutes before rinsing.': 'மருத்துவ ஷாம்பூவை உச்சந்தலையில் 3-5 நிமிடங்கள் ஊறவைத்து பின்னர் அலசவும்.',
  'Keep scalp clean and properly dried after washing.': 'குளித்த பிறகு உச்சந்தலையை சுத்தமாகவும் உலர்ந்த நிலையிலும் வைத்திருக்கவும்.',
  'Wash all bed linens, pillowcases, and caps in hot water (>60°C).': 'படுக்கை விரிப்புகள், தலையணை உறைகள் மற்றும் தொப்பிகளை சூடான நீரில் (>60°C) துவைக்கவும்.',

  // Hair Donts
  'Avoid daily washing with sulfate-heavy clarifying shampoos.': 'சல்பேட் அதிகமுள்ள கடுமையான ஷாம்பூக்களை தினமும் பயன்படுத்துவதைத் தவிர்க்கவும்.',
  'Avoid heavy leave-in hair butters directly on the scalp surface.': 'உச்சந்தலை தோலின் மீது கனமான கிரீம்கள் அல்லது எண்ணெய்களை நேரடியாகப் பூசுவதைத் தவிர்க்கவும்.',
  'Avoid switching hair products excessively without need.': 'தேவையின்றி அடிக்கடி புதிய முடி தயாரிப்புகளை மாற்றுவதைத் தவிர்க்கவும்.',
  'Never scratch intensely with fingernails to prevent secondary bacterial folliculitis.': 'நகங்களால் உச்சந்தலையை பலமாக சொறிவதைத் தவிர்க்கவும், இல்லையெனில் பாக்டீரியா தொற்று ஏற்படலாம்.',
  'Avoid tying up wet hair for long durations.': 'ஈரமான முடியைக் கட்டிக் கொள்வதைத் தவிர்க்கவும்.',
  'Avoid very hot water showers; use lukewarm or cool water.': 'அதிக சூடான தண்ணீரில் தலைக்கு குளிப்பதைத் தவிர்த்து, மிதமான அல்லது குளிர்ந்த நீரைப் பயன்படுத்தவும்.',
  'Do not share combs, hairbrushes, towels, or headwear with family members.': 'சீப்பு, துண்டு அல்லது தொப்பிகளை மற்றவர்களுடன் பகிர்வதைத் தவிர்க்கவும்.',

  // Hair Recommendations
  'Stimulate roots with a 5-minute rosemary oil or scalp massage daily.': 'தினமும் 5 நிமிடங்கள் ரோஸ்மேரி எண்ணெய் அல்லது விரல்களால் உச்சந்தலையை மசாஜ் செய்து ரத்த ஓட்டத்தை தூண்டவும்.',
  'Incorporate biotin, zinc, and protein-rich foods (eggs, pulses, leafy greens).': 'பயோட்டின், துத்தநாகம் (Zinc) மற்றும் புரதம் நிறைந்த உணவுகளை (முட்டை, பருப்பு வகைகள், கீரைகள்) உணவில் சேர்க்கவும்.',
  'Use an anti-dandruff shampoo containing Ketoconazole (1-2%) or Zinc Pyrithione.': 'கீட்டோகோனசோல் (Ketoconazole 1-2%) அல்லது ஜிங்க் பைரித்தியோன் கொண்ட மருத்துவ ஷாம்பூவைப் பயன்படுத்தவும்.',
  'Weekly neem leaf rinse or mild anti-dandruff formulation.': 'வாரத்திற்கு ஒருமுறை வேப்பிலை தண்ணீர் அல்லது லேசான பொடுகு எதிர்ப்பு ஷாம்பூ கொண்டு அலசவும்.',
  'Soothe scalp with pure organic aloe vera gel cold compresses.': 'தூய சோற்றுக்கற்றாழை (Aloe Vera) ஜெல்லை உச்சந்தலையில் தடவி குளிர்ச்சியூட்டி அரிப்பை தணிக்கவும்.',
  'Apply a certified Permethrin 1% lotion or Dimethicone-based anti-lice lotion.': 'மருத்துவர் அங்கீகரித்த பெர்மெத்ரின் 1% லோஷன் அல்லது டைமெதிகோன் பேன் எதிர்ப்பு லோஷனைப் பயன்படுத்தவும்.',
  'Perform thorough wet-combing with a fine-toothed nit comb every 3 days for 2 weeks.': 'ஈரமான கூந்தலில் மெல்லிய பேன் சீப்பு கொண்டு 2 வாரங்களுக்கு 3 நாட்களுக்கு ஒருமுறை சீவி பேன் மற்றும் ஈறுகளை அகற்றவும்.',
  'Nourish roots weekly with natural herbal botanical extracts.': 'இயற்கை மூலிகை எண்ணெய்களைப் பயன்படுத்தி வாரத்திற்கு ஒருமுறை உச்சந்தலை மசாஜ் செய்யவும்.',

  // Eye Color Status
  'Mild Hue Discrimination Difficulty': 'லேசான வண்ண வேறுபாடு குறைபாடு',
  'Good Color Differentiation': 'நல்ல வண்ண வேறுபாடு உணர்தல் திறன்',
  'Superior Trichromatic Color Perception': 'சிறப்பான முப்பரிமாண வண்ண உணர்தல் திறன்',

  // Eye Vision Grade
  'Reduced Visual Acuity (Screen distance blurriness detected)': 'குறைந்த வாசிப்பு பார்வைத் திறன் (மங்கலான பார்வை கண்டறியப்பட்டது)',
  'Moderate Visual Acuity (Mild reading strain)': 'மிதமான வாசிப்பு பார்வைத் திறன் (லேசான கண் சோர்வு)',
  'Optimal High-Acuity Reading Precision': 'மிகச்சிறந்த தெளிவான வாசிப்பு பார்வைத் திறன்',
  'Excellent (20/20 Range)': 'மிகச்சிறந்த பார்வைத் திறன் (20/20 நிலை)',

  // Eye Findings
  'No corrective lenses currently utilized.': 'தற்போது பார்வைக் கண்ணாடிகள் எதுவும் பயன்படுத்தப்படவில்லை.',
  'Indications of tear-film instability or digital eye strain (DES / Dry Eye Syndrome).': 'கண்ணீர் படல நிலைத்தன்மையின்மை அல்லது டிஜிட்டல் திரை பயன்பாட்டினால் ஏற்படும் கண் வறட்சி / சோர்வு (Dry Eye Strain).',
  'Hyperopia (Farsightedness) or Presbyopia profile: Difficulty with near-field focus.': 'தூரப்பார்வை நிலை (Hyperopia / Presbyopia): அருகிலுள்ள பொருட்களைக் கூர்ந்து பார்ப்பதில் சிரமம்.',
  'Myopia (Nearsightedness) profile: Distant objects appear out of focus without corrective lenses.': 'கிட்டப்பார்வை நிலை (Myopia): கண்ணாடிகள் இன்றி தூரத்திலுள்ள பொருட்கள் மங்கலாகத் தெரிதல்.',

  // Eye Dos
  'Maintain an ergonomic viewing distance of at least 50-60 cm from monitors.': 'திரையிலிருந்து கண்களுக்கு குறைந்தது 50-60 செ.மீ தூர இடைவெளியைப் பராமரிக்கவும்.',
  'Blink deliberately and frequently during computer or phone usage.': 'கணினி அல்லது கைபேசி பயன்படுத்தும் போது அடிக்கடி கண்களை இமைக்கவும்.',
  'Schedule an annual comprehensive dilated eye examination with your optometrist.': 'வருடத்திற்கு ஒருமுறை கண் மருத்துவரிடம் விரிவான கண் பரிசோதனை செய்துகொள்ளவும்.',

  // Eye Donts
  'Avoid directing AC air vents, table fans, or heating directly onto your face.': 'ஏர் கண்டிஷனர் அல்லது மின்விசிறிக் காற்றை நேரடியாக முகத்தில் படும்படி வைப்பதைத் தவிர்க்கவும்.',
  'Do not wear expired contact lenses or skip updating spectacle prescriptions.': 'காலாவதியான காண்டாக்ட் லென்ஸ்களைப் பயன்படுத்துவதையோ, பார்வை மாற்றங்களை கவனிக்காமல் இருப்பதையோ தவிர்க்கவும்.',
  'Avoid using digital screens in completely dark rooms before sleeping.': 'தூங்குவதற்கு முன் முழுமையான இருட்டில் கைபேசி அல்லது கணினித் திரைகளைப் பார்ப்பதைத் தவிர்க்கவும்.',

  // Eye Recommendations
  'Follow the 20-20-20 rule: Every 20 minutes, gaze at something 20 feet away for 20 seconds.': '20-20-20 விதியைப் பின்பற்றவும்: ஒவ்வொரு 20 நிமிடங்களுக்கும், 20 அடி தொலைவில் உள்ள பொருளை 20 வினாடிகள் பார்க்கவும்.',
  'Use preservative-free lubricating artificial tear drops as recommended by an optometrist.': 'கண் மருத்துவர் பரிந்துரைத்தபடி பாதுகாப்பு மருந்துகள் அற்ற மாய்ஸ்ச்சரைசிங் கண் சொட்டு மருந்தைப் பயன்படுத்தவும்.',
  'Ensure optimal ambient lighting when reading books or working on laptops.': 'புத்தகங்களை வாசிக்கும் போதும் கணினியில் வேலை செய்யும் போதும் அறையில் போதிய வெளிச்சம் இருப்பதை உறுதிசெய்யவும்.',
  'Wear anti-reflective (AR) and blue-cut coated corrective spectacles during screen work.': 'திரை வேலைகளின் போது ஆண்டி-ரிஃப்ளெக்டிவ் (AR) மற்றும் நீல ஒளி வடிகட்டும் (Blue-cut) கண்ணாடிகளை அணியவும்.',
  'Take regular 5-minute visual breaks and include vitamin A & lutein-rich foods (carrots, spinach).': 'ஒவ்வொரு மணி நேரமும் 5 நிமிட ஓய்வு எடுக்கவும், வைட்டமின் A மற்றும் லூட்டீன் நிறைந்த உணவுகளை (கேரட், கீரை) உணவில் சேர்க்கவும்.',
  'Follow the 20-20-20 rule strictly and break screen use into sessions of under 2 hours.': '20-20-20 விதியைக் கடைவாகப் பின்பற்றவும் மற்றும் திரை பயன்பாட்டை 2 மணி இடங்களில் இடைவெளிக்கு உட்படுத்தவும்.',
  'If these symptoms persist, schedule a comprehensive dilated eye examination with an optometrist.': 'இந்த அறிகுறிகள் தொடர்ந்தால், ஒரு கண் மருத்துவரிடம் முழுமையான மெல்லிய கண் பரிசோதனை மேற்கொள்ளுமாறு அறிவுறுத்தப்படுகிறது.',

  // Eye consultation escalation
  'Your overall eye wellness index is low. It is mandatory to consult an appropriate eye doctor (Optometrist / Ophthalmologist) as soon as possible.':
    'உங்கள் ஒட்டுமொத்த கண் நலக் குறியீடு குறைவாக உள்ளது. உங்கள் கண் நலத்திற்கு உரிய மருத்துவரை (Optometrist / Ophthalmologist) கட்டாயமாகச் சந்திப்பது அவசியம்.',
  'Your overall eye wellness index is in the moderate range. We recommend consulting an eye doctor for a routine check-up.':
    'உங்கள் ஒட்டுமொத்த கண் நலக் குறியீடு சீரான நிலையில் உள்ளது. விதிவிலக்குக் கண் பரிசோதனைக்காக ஒரு கண் மருத்துவரைச் சந்திப்பது நல்லது.',
  'Your overall eye wellness index is in a healthy range. Keep maintaining your healthy screen habits.':
    'உங்கள் ஒட்டுமொத்த கண் நலக் குறியீடு சிறப்பாக உள்ளது. தொடர்ந்து ஆரோக்கியமான பழக்கங்களைப் பேணுங்கள்.',
  'This is mandatory: your overall eye wellness index is at or below 30. Please consult an optometrist or ophthalmologist without delay.':
    'இது கட்டாயமாகும்: உங்கள் ஒட்டுமொத்த கண் நலக் குறியீடு 30-ஐ விடக் குறைவாக உள்ளது. தயவுசெய்து கண் மருத்துவரை அணுகவும்.',
  'Your overall eye wellness index is at or below 60. We advise consulting an eye doctor for a detailed vision check.':
    'உங்கள் ஒட்டுமொத்த கண் நலக் குறியீடு 60-ஐ விடக் குறைவாக உள்ளது. ஒரு கண் மருத்துவரைச் சந்தித்து விதிவிலக்குப் பரிசோதனை செய்யுமாறு பரிந்துரைக்கிறோம்.',
  'Do not self-start medicated eye drops, steroid preparations, or contact lenses without advice from an eye doctor.':
    'மருத்துவர் ஆலோசனையின்றி சொஞ்சுகள், கண் மருந்துகள் அல்லது விழித்திரை மாதிரிகளை தானாகப் பயன்படுத்துவதைத் தவிர்க்கவும்.',
  'Avoid screen use in bed and switch off all displays at least one hour before sleep.':
    'படுக்கையில் திரை பயன்பாட்டைத் தவிர்த்து, தூக்கத்திற்கு முன் குறைந்தது ஒரு மணி நேரம் எல்லா திரைகளையும் அணைக்கவும்.',

  // Titles & Lifestyles
  'VitaSyn Scalp & Hair AI Health Report': 'VitaSyn முடி & உச்சந்தலை AI பரிசோதனை அறிக்கை',
  'VitaSyn Eye Wellness & Vision AI Report': 'VitaSyn கண் நலம் & பார்வை AI பரிசோதனை அறிக்கை',
  'Maintain hydration (2.5L water daily), prioritize zinc & biotin-rich foods, and get 7-8 hours of quality sleep for cell rejuvenation.': 'தினமும் போதுமான தண்ணீர் (2.5 லிட்டர்) அருந்தவும், வைட்டமின் E, இரும்புச்சத்து மற்றும் பயோட்டின் நிறைந்த உணவுகளை உட்கொள்ளவும்.',
  'Implement the 20-20-20 rule during screen sessions, stay hydrated, and ensure ambient room lighting matches display brightness.': 'ஒவ்வொரு 20 நிமிடங்களுக்கும் 20 அடி தொலைவில் உள்ள பொருளை 20 வினாடிகள் பார்க்கவும் (20-20-20 விதி). போதிய வெளிச்சத்தில் வேலை செய்யவும்.',
  'Disclaimer: This assessment is an AI-assisted wellness evaluation and does not replace in-person medical diagnosis. Consult a certified trichologist or dermatologist for persistent symptoms.': 'முக்கிய குறிப்பு: இது ஒரு AI வழிகாட்டல் மட்டுமே. தீவிர அறிகுறிகள் இருந்தால் தகுதிவாய்ந்த தோல் மருத்துவரை (Dermatologist) அணுகவும்.',
  'Disclaimer: This online visual screening is not a replacement for an in-person refraction or clinical exam by an optometrist or ophthalmologist.': 'முக்கிய குறிப்பு: இது ஒரு மெய்நிகர் ஆரம்பநிலை பரிசோதனை மட்டுமே. முழுமையான கண் பரிசோதனைக்கு கண் மருத்துவரை அணுகவும்.'
};

function translateText(text: string, lang: 'en' | 'ta'): string {
  if (!text) return '';
  if (lang !== 'ta') return text;

  // Exact match
  if (translationMap[text]) {
    return translationMap[text];
  }

  // Check dynamic Eye Findings. Note these are regenerated by the backend, so the
  // patterns must track the current wording ("index", 15 reading stages).
  // "Color differentiation index: X/10 stages completed (STATUS)."
  const colorMatch = text.match(/Color differentiation index:\s*(\d+)\/10 stages completed\s*\(([^)]+)\)/i);
  if (colorMatch) {
    const passed = colorMatch[1];
    const status = translationMap[colorMatch[2].trim()] || colorMatch[2];
    return `வண்ண வேறுபாடு கண்டறிதல் குறியீடு: 10 நிலைகளில் ${passed} நிலைகள் நிறைவு செய்யப்பட்டன (${status}).`;
  }

  // "Reading acuity index: X/15 word-size stages read clearly across 3 eye tests — ... (GRADE)."
  const acuityMatch = text.match(
    /Reading acuity index:\s*(\d+)\/15 word-size stages read clearly across 3 eye tests[^)]*\(([^)]+)\)/i
  );
  if (acuityMatch) {
    const read = acuityMatch[1];
    const grade = translationMap[acuityMatch[2].trim()] || acuityMatch[2];
    return `வாசிப்பு பார்வைத் திறன் குறியீடு: 3 கண் பரிசோதனைகளில் (இடது, வலது, இரு கண்களும்) 15 சொல் அளவு நிலைகளில் ${read} நிலைகள் தெளிவாக வாசிக்கப்பட்டன (${grade}).`;
  }

  // "Eye comparison: left X/5, right Y/5, both Z/5."
  const eyeCmpMatch = text.match(/Eye comparison:\s*left\s+(\d+)\/5,\s*right\s+(\d+)\/5(?:,\s*both\s+(\d+)\/5)?/i);
  if (eyeCmpMatch) {
    const [, l, r, b] = eyeCmpMatch;
    return `கண் ஒப்பீடு: இடது கண் ${l}/5, வலது கண் ${r}/5${b ? `, இரு கண்களும் ${b}/5` : ''}.`;
  }

  // "Overall eye wellness index: X/100. <consultation message>"
  const overallMatch = text.match(/Overall eye wellness index:\s*(\d+)\/100\.\s*([\s\S]+)$/i);
  if (overallMatch) {
    const idx = overallMatch[1];
    const rest = overallMatch[2].trim();
    let localized: string;
    if (rest.includes('mandatory') || rest.includes('is low')) {
      localized =
        'உங்கள் ஒட்டுமொத்த கண் நலக் குறியீடு குறைவாக உள்ளது. உங்கள் கண் நலத்திற்கு உரிய மருத்துவரை (Optometrist / Ophthalmologist) கட்டாயமாகச் சந்திப்பது அவசியம்.';
    } else if (rest.includes('moderate range') || rest.includes('routine check-up')) {
      localized =
        'உங்கள் ஒட்டுமொத்த கண் நலக் குறியீடு சீரான நிலையில் உள்ளது. விதிவிலக்குக் கண் பரிசோதனைக்காக ஒரு கண் மருத்துவரைச் சந்திப்பது நல்லது.';
    } else {
      localized =
        'உங்கள் ஒட்டுமொத்த கண் நலக் குறியீடு சிறப்பாக உள்ளது. தொடர்ந்து ஆரோக்கியமான பழக்கங்களைப் பேணுங்கள்.';
    }
    return `ஒட்டுமொத்த கண் நலக் குறியீடு: ${idx}/100. ${localized}`;
  }

  // Screen-time & symptom findings
  const symptomPatterns: { re: RegExp; ta: string }[] = [
    {
      re: /Prolonged screen exposure \(over 3 hours daily\)[^.]*\./i,
      ta: 'நீண்ட திரை நேரம் (3 மணிக்கு மேல்): கண் சோர்வு மற்றும் கண்புல்லின் தளர்வு அபாயம் அதிகம்.',
    },
    {
      re: /Moderate screen time \(1–3 hours daily\)[^.]*\./i,
      ta: 'மிதமான திரை நேரம் (1–3 மணி): இது பொதுவான வரம்புக்குள் இருந்தாலும் இடைவெளிகள் அவசியம்.',
    },
    {
      re: /Low screen exposure \(under 1 hour daily\)[^.]*\./i,
      ta: 'குறைந்த திரை நேரம் (1 மணிக்குக் குறைவு): கண் சோர்வு அபாயம் குறைவாக உள்ளது.',
    },
    {
      re: /Late-night phone use in bed[^.]*\./i,
      ta: 'படுக்கையில் இரவுப் பேசி பயன்பாடு: மங்கலான பார்வை, கண் வறட்சி மற்றும் உறக்கத்தின் தாக்கத்தை அதிகரிக்கிறது.',
    },
    {
      re: /Eye irritation reported during the test[^.]*\./i,
      ta: 'பரிசோதனை நேரத்தில் கண் எரிச்சல் அறிகுறிப்படுத்தப்பட்டது — கண்புல்ல் வலுவிழப்பு அல்லது அலர்ஜி காரணமாக இருக்கலாம்.',
    },
    {
      re: /Watering eyes during the test[^.]*\./i,
      ta: 'பரிசோதனை நேரத்தில் கண் நீர்த்தல் அறிகுறி — உலர்ந்த கண்ணைத் தூண்டும் திருப்பமுறு கண்ணீர் சுரப்பு.',
    },
    {
      re: /Headache after screen use[^.]*\./i,
      ta: 'திரை பயன்பாட்டிற்குப் பிறகு தலைவலி — கண் சோர்வு மற்றும் கழுத்து-தோள் தசைப் பாதிப்புடன் தொடர்புடையது.',
    },
    {
      re: /Blurred vision after prolonged use[^.]*\./i,
      ta: 'நீண்ட பயன்பாட்டிற்குப் பிறகு மங்கலான பார்வை — கண்புல்லின் தசைகள் தொடர்ந்து இறுக்கமாக இருப்பதால் கூடலாம்.',
    },
    {
      re: /A notable difference in reading performance between the left and right eye was observed\./i,
      ta: 'இடது மற்றும் வலது கண் வாசிப்பு மட்டங்களுக்கிடையே குறிப்பிடத்தக்க வேறுபாடு கண்டறியப்பட்டது.',
    },
  ];

  for (const { re, ta } of symptomPatterns) {
    if (re.test(text)) return ta;
  }

  // Check generic overview heuristic translation if it starts with "Based on your diagnostic inputs..."
  if (text.includes('Based on your diagnostic inputs') || text.includes('Scalp Vitality Score')) {
    return 'உங்கள் உச்சந்தலை மற்றும் முடி நிலையை ஆய்வு செய்ததில், குறிப்பிட்ட அறிகுறிகள் கண்டறியப்பட்டுள்ளன. வழக்கமான ஊட்டச்சத்து, மென்மையான இயற்கை எண்ணெய் பராமரிப்பு மற்றும் மருத்துவர் பரிந்துரைத்த முறையான சிகிச்சை மூலம் உங்கள் முடி ஆரோக்கியத்தை மேம்படுத்தலாம்.';
  }

  if (text.includes('Your digital visual acuity and color perception evaluation yielded')) {
    return 'உங்கள் கண்கள் பரிசோதனை முடிவுகள் ஆய்வு செய்யப்பட்டன. திரை பயன்பாட்டின் போது 20-20-20 விதியை தவறாமல் பின்பற்றி உங்கள் பார்வை நலனைப் பாதுகாத்துக் கொள்ளுங்கள்.';
  }
  return text;
}

export function localizeReport(report: DiagnosticReport | null | undefined, lang: 'en' | 'ta'): DiagnosticReport | null {
  if (!report) return null;
  if (lang !== 'ta') return report;

  return {
    ...report,
    title: translateText(report.title || '', lang),
    condition: translateText(report.condition || '', lang),
    grade: translateText(report.grade || '', lang),
    colorStatus: translateText(report.colorStatus || '', lang),
    overview: translateText(report.overview || '', lang),
    clinicalFindings: (report.clinicalFindings || []).map((f) => translateText(f, lang)),
    dos: (report.dos || []).map((d) => translateText(d, lang)),
    donts: (report.donts || []).map((d) => translateText(d, lang)),
    recommendations: (report.recommendations || []).map((r) => translateText(r, lang)),
    lifestyleGuidance: translateText(report.lifestyleGuidance || '', lang),
    disclaimer: translateText(report.disclaimer || '', lang),
    // Consultation notice carries its own server-side message per language, but
    // translate it here too so a language switch on an older record still works.
    consultation: report.consultation
      ? {
          level: report.consultation.level,
          message: translateText(report.consultation.message || '', lang),
        }
      : undefined,
  };
}
