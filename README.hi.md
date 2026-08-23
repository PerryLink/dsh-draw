<div align="center">

# 🎨 dsh-draw

**DeepSeek Harness के लिए एकीकृत स्थिर-छवि निर्माण रूटिंग।**

*एक टूल, कई इंजन — स्वास्थ्य-सजग फ़ॉलबैक, टिकाऊ परिणाम, गिना हुआ उपयोग।*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh-plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-draw/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-draw/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-draw?label=version)](https://github.com/PerryLink/dsh-draw/releases)
[![npm version](https://img.shields.io/npm/v/dsh-draw)](https://www.npmjs.com/package/dsh-draw)
[![npm downloads](https://img.shields.io/npm/dm/dsh-draw)](https://www.npmjs.com/package/dsh-draw)

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

</div>

---

## संगतता

| सतह | स्थिति |
|---|---|
| Harness | DeepSeek Harness `0.1.1-rc.2` (`0.1.1-rc.2` के लिए घोषित संगतता) |
| Node | `^22.19.0 \|\| >=24.0.0` |
| इंजन | कोई भी OpenAI-संगत images एंडपॉइंट; OpenAI Images (`gpt-image-1`) और Zhipu CogView (`cogview-3-flash`) प्रीसेट |
| सतहें | Host `image_generate` टूल + वेब परिणाम कार्ड + Plugins सेटिंग टैब |

## आपको क्या मिलता है

`dsh-draw` हार्नेस को मानक पैरामीटरों (`prompt`/`size`/`count`/`quality`/`style`/`engine`) वाला एक एकीकृत `image_generate` टूल देता है, जो हर इंजन के लिए अनूदित होते हैं:

- **बहु-इंजन रूटिंग** — एक कॉन्फ़िग-चालित श्रृंखला (OpenAI Images, Zhipu CogView या कोई भी OpenAI-संगत एंडपॉइंट) ऊपर से नीचे चलती है, **स्वास्थ्य-सजग फ़ॉलबैक** के साथ: लगातार विफलताएँ इंजन को cooldown में डालती हैं और अगला स्वस्थ इंजन कॉल संभालता है।
- **टिकाऊ परिणाम** — बनी छवियाँ workspace अटैचमेंट के रूप में सहेजी जाती हैं (कॉन्टेंट-एड्रेस्ड, हार्नेस की अटैचमेंट नीति के तहत) और कैननिकल फ़ाइल संदर्भ के रूप में लौटती हैं।
- **कोटा लेखा** — प्रति-सत्र जनरेशन कॉल और छवि बाइट की सीमाएँ, टिकाऊ सत्र लॉग से मोड़कर निकाली जाती हैं और इंजन खर्च से पहले व भंडारण से पहले लागू होती हैं।
- **क्रेडेंशियल संदर्भ के रूप में** — इंजन API कुंजियाँ पर्यावरण-चर नाम हैं, जो हर कॉल पर आधिकारिक `ctx.credentials` सीम से हल होती हैं; असली कुंजियाँ न तो कॉन्फ़िग में रहती हैं, न लॉग में।
- **वेब सतहें** — बातचीत में परिणाम कार्ड (छवियाँ, इंजन, कोटा, एक-क्लिक regenerate) और Plugins सेटिंग टैब (इंजन श्रृंखला, क्रेडेंशियल स्थिति, जाँच, कोटा सीमाएँ)।

```text
मॉडल                           harness
  │ image_generate {prompt, ...} ──▶ सत्यापन ──▶ कोटा जाँच ──▶ रूटिंग
  │                                  openai ──(विफल)──▶ cogview ──▶ छवियाँ
  │ ◀── कैननिकल JSON + छवि ब्लॉक (टिकाऊ अटैचमेंट संदर्भ)
  │                       └── draw/generated सत्र इवेंट (कोटा + ऑडिट)
```

## त्वरित शुरुआत

```sh
# 1. बंडल को अपने प्रोफ़ाइल में इंस्टॉल करें
dsh plugin --profile web add "github:PerryLink/dsh-draw#main"

# या npm से (प्रकाशित रिलीज़)
dsh plugin --profile web add dsh-draw

# 2. इंजन कुंजियाँ क्रेडेंशियल संदर्भ (पर्यावरण-चर) के रूप में दें
#    OPENAI_API_KEY और/या ZHIPU_API_KEY — प्रोफ़ाइल पैच में कभी नहीं

# 3. पुनः आरंभ करें और पंक्ति सत्यापित करें
dsh --profile web --dump-config | grep -A2 'id: dsh-draw'
```

फिर एजेंट से चित्र बनवाएँ:

```
> सूर्यास्त में एक लाइटहाउस का 1536x1024 परिदृश्य बनाएँ, vivid शैली।
```

## इंस्टॉल और अनइंस्टॉल

- **git चैनल** (नवीनतम `main`): `dsh plugin --profile web add "github:PerryLink/dsh-draw#main"` — `prepare` स्क्रिप्ट केवल प्रोडक्शन निर्भरताओं से बिल्ड करती है।
- **npm चैनल** (प्रकाशित रिलीज़): `dsh plugin --profile web add dsh-draw`।
- **tarball चैनल**: इस रेपो में `pnpm pack`, फिर `dsh plugin --profile web add ./dsh-draw-<version>.tgz`।
- **अनइंस्टॉल**: `dsh plugin --profile web remove dsh-draw` (या प्रोफ़ाइल पैच से पंक्ति हटाएँ)।

> यदि pnpm इस पैकेज के लिए `ERR_PNPM_IGNORED_BUILDS` दिखाता है (esbuild का हानिरहित प्लेटफ़ॉर्म-बाइनरी सत्यापन), तो अपने `pnpm-workspace.yaml` में `allowBuilds: { esbuild: true }` जोड़ें — `dsh` CLI सटीक स्निपेट प्रिंट करता है।

## कॉन्फ़िगरेशन

सभी समायोजन Schemastery `Config` फ़ील्ड हैं (cordis.yml से बदले जा सकते हैं)। id-लक्षित ओवरराइड पूरी पंक्ति बदल देता है — ज़रूरत की हर कुंजी फिर से लिखें। `cordis.patch.yml` हर कुंजी को इनलाइन समझाता है।

| कुंजी | डिफ़ॉल्ट | अर्थ |
|---|---|---|
| `engines` | OpenAI + CogView प्रीसेट | क्रमबद्ध इंजन श्रृंखला, ऊपर से नीचे फ़ॉलबैक सहित; हर प्रविष्टि: `id`, `baseUrl` (बिना क्रेडेंशियल), `model`, `apiKeyRef` (पर्यावरण-चर नाम), `enabled`, `sizeMap`, `qualitySupported`, `styleSupported`, `responseFormat` (`b64_json`/`url`), `imageMediaType` |
| `defaultEngine` | `openai` | रूटर का पसंदीदा इंजन id; कॉन्फ़िगर किए इंजन का नाम होना चाहिए |
| `requestTimeoutMs` | `120000` | प्रति-जनरेशन HTTP टाइमआउट (1000..600000) |
| `maxImagesPerCall` | `4` | एक कॉल में छवियों की सीमा (1..10) |
| `maxPromptLength` | `4000` | प्रॉम्प्ट की वर्ण सीमा (1..32000) |
| `maxGenerationsPerSession` | `200` | प्रति-सत्र कॉल सीमा (1..100000) |
| `maxBytesPerSession` | `209715200` | प्रति-सत्र छवि-बाइट सीमा (1048576..4294967296) |
| `failureThreshold` | `2` | cooldown से पहले लगातार विफलताएँ (1..10) |
| `cooldownMs` | `60000` | सीमा पार करने पर इंजन cooldown (1000..3600000) |

आपके प्रोफ़ाइल पैच में ओवरराइड उदाहरण:

```yaml
- insert:
    - id: dsh-draw
      name: dsh-draw
      config:
        defaultEngine: cogview
        maxImagesPerCall: 2
```

## टूल और सतहें

| सतह | टिप्पणियाँ |
|---|---|
| `image_generate` | मानक पैरामीटर; कैननिकल JSON (इंजन/मॉडल/आकार, छवि संदर्भ, कोटा, फ़ॉलबैक झंडा, प्रयास) + छवि ब्लॉक लौटाता है |
| परिणाम कार्ड (`tool.call.toolview`, key `image_generate`) | छवियाँ, इंजन/कोटा पंक्ति, एक-क्लिक regenerate (पूरा drawer पथ: कोटा + रूटिंग + ऑडिट) |
| सेटिंग टैब (Plugins → Image generation) | इंजन श्रृंखला, क्रेडेंशियल स्थिति, API कुंजी सेट/हटाएँ (क्रेडेंशियल संदर्भ), कनेक्टिविटी जाँच, कोटा सीमाएँ |

## अनुमतियाँ और डेटा

- **अनुमतियाँ**: प्लगइन केवल कॉन्फ़िगर किए इंजन एंडपॉइंट पर आउटबाउंड HTTPS कॉल करता है; बाकी सब केवल-पठन है। सेटिंग टैब का एकमात्र लेखन आधिकारिक `ctx.credentials` सीम पर क्रेडेंशियल सेट/हटाना है।
- **डेटा**: बनी छवियाँ आधिकारिक अटैचमेंट स्टोर से हार्नेस की अपनी नीति के तहत सहेजी जाती हैं। कोटा उपयोग `draw/generated` सत्र इवेंट से मोड़ा जाता है, साथ में उन होस्ट पर इन-मेमोरी फ़ॉलबैक लेजर से जो उन इवेंट को लॉग नहीं कर सकते — और कुछ संग्रहीत नहीं होता।
- **सत्र लॉग**: `draw/generated` इवेंट इंजन, मॉडल, मानकीकृत अनुरोध, बाइट योग और अटैचमेंट आईडी दर्ज करता है — ऑडिट तथ्य, कभी API कुंजियाँ नहीं। इवेंट तभी जोड़ा जाता है जब होस्ट उस प्रकार को जानता हो या `ignorable` एनवेलप स्वीकार करता हो (माउंट पर जांचा जाता है); rc.6/rc.7 होस्ट पर पेलोड इन-मेमोरी फ़ॉलबैक लेजर में जाता है, इसलिए इमेज बनाने से सत्र अब दोबारा खुलने से इनकार नहीं करता।

## सुरक्षा सीमाएँ

- **क्रेडेंशियल संदर्भ, कभी शाब्दिक नहीं।** `apiKeyRef` एक पर्यावरण-चर का नाम है; क्रेडेंशियल जड़ा `baseUrl` लोड पर ज़ोर से विफल होता है।
- **सैनिटाइज़्ड प्रदर्शन।** URL, जाँच नोट और त्रुटि पाठ किसी भी प्रदर्शन या लॉग से पहले रिडैक्ट होते हैं (userinfo पासवर्ड, क्रेडेंशियल क्वेरी मान, bearer टोकन, JWT)।
- **कोटा खर्च से पहले।** जनरेशन और बाइट सीमाएँ इंजन कॉल से पहले और भंडारण से पहले जाँची जाती हैं; ख़त्म सत्र बिना क्रेडिट जलाए तेज़ी से विफल होते हैं।
- **ज़ोर से विफल, सोच-समझकर फ़ॉलबैक।** विकृत प्रतिक्रियाएँ संरचित त्रुटियाँ देती हैं; विफल इंजन अपनी cooldown सीमा के बाद छोड़ा जाता है, और थकी श्रृंखला सफलता का दिखावा करने के बजाय पूरा प्रयास रिकॉर्ड लौटाती है।

## ज्ञात सीमाएँ

- **केवल छवि मॉडल।** कोई वीडियो, ऑडियो या संपादन एंडपॉइंट नहीं; कोई विज़ुअल समझ नहीं।
- **इंजन संगतता।** इंजन को OpenAI `POST /images/generations` आकार बोलना चाहिए (base64 या URL डिलीवरी); प्रदाता-विशेष अतिरिक्त दायरे से बाहर हैं।
- **लागत-जागरूकता संरचनात्मक है।** प्लगइन कॉल और बाइट गिनता है, इंजन मूल्य नहीं जानता — लागत प्रशासन के लिए `dsh-budget` के साथ जोड़ें।
- **rc.6/rc.7 पर कोटा स्थायित्व।** जिन होस्ट का सत्र लॉग `draw/generated` को सुरक्षित रूप से नहीं रख सकता (स्थिर इवेंट श्वेतसूची, कोई `ignorable` एनवेलप नहीं), कोटा इन-मेमोरी फ़ॉलबैक लेजर से जीवित सत्र में सटीक रहता है लेकिन पुनः आरंभ पर रीसेट हो जाता है; प्लगइन इवेंट सतह वाले होस्ट पर टिकाऊ लेखांकन फिर से शुरू होता है।

## विकास

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests स्थानीय हार्नेस चेकआउट के विरुद्ध
pnpm run typecheck:ci  # tsc प्रकाशित 0.1.1-rc.2 फ़ेस के विरुद्ध (बिना paths)
pnpm test           # vitest: 107 टेस्ट, 16 टेस्ट फ़ाइलें (स्क्रिप्टेड ट्रांसपोर्ट, वास्तविक Context/Session/ToolRuntime)
pnpm run build      # tsc घोषणाएँ + tsdown बंडल (lib/)
pnpm run verify:self-contained  # निर्भरता स्पेक registry से हल होती हैं
pnpm run verify:artifacts       # host ESM फ़ेस + typert मैनिफ़ेस्ट + ब्राउज़र बंडल + कॉन्फ़िग फ़ाइलें
pnpm pack           # प्रकाशित tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — निर्माता और मेंटेनर: इंजन रूटर, drawer, कोटा लेखा, Typert wire शब्दावली, ब्राउज़र आधा और पाँच-भाषा दस्तावेज़।
- [@Mohei-Muun](https://github.com/Mohei-Muun) — rc.7 होस्ट पर `draw/generated` सत्र-लॉग लोड विफलता की सूचना दी ([#2](https://github.com/PerryLink/dsh-draw/issues/2)), जिससे अनुकूली इवेंट गेट बना।

## PerryLink DSH Plugin Family

यह प्रोजेक्ट [PerryLink](https://github.com/PerryLink) द्वारा अनुरक्षित [29 DeepSeek Harness प्लगइनों](https://github.com/PerryLink) में से एक है। अगर यह आपकी मदद करता है, तो बाकी भी करेंगे:

| Plugin | One-liner |
|---|---|
| [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) | अनुमोदन श्रृंखला पर दूसरे मॉडल से स्वतः-समीक्षा, डिफ़ॉल्ट रूप से असफल-बंद |
| [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) | Web UI साइडबार, संदेश और रुकावट के साथ स्थायी पृष्ठभूमि चाइल्ड एजेंट |
| [dsh-budget](https://github.com/PerryLink/dsh-budget) | DeepSeek Harness के लिए लागत प्रशासन: बजट, कार्बन और विलंबता एक पैनल में। |
| [dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) | Claude Code /rewind-समतुल्य: स्नैपशॉट, सत्र फोर्क, एक-बार पुनर्स्थापन |
| [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) | Claude Code सत्र, स्मृति, skills और CLAUDE.md को DSH में स्थानांतरित करें |
| [dsh-click](https://github.com/PerryLink/dsh-click) | DeepSeek Harness के लिए क्रॉस-प्लेटफ़ॉर्म नेटिव डेस्कटॉप नियंत्रण — Windows पहले। |
| [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) | Web कंपोज़र के लिए टर्मिनल-शैली इनपुट इतिहास: तीर, Ctrl+R खोज |
| [dsh-defend](https://github.com/PerryLink/dsh-defend) | DeepSeek Harness के लिए प्रॉम्प्ट-इंजेक्शन, जेलब्रेक और सीक्रेट-लीक रक्षा। |
| [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) | इंजीनियरिंग-अनुशासन गार्ड: आवश्यकताएँ पूछताछ, परीक्षण द्वार, विरोधी समीक्षा |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | DeepSeek Harness के लिए एकीकृत स्थैतिक-छवि निर्माण रूटिंग। |
| [dsh-fast](https://github.com/PerryLink/dsh-fast) | DeepSeek Harness के लिए केवल-पठन प्रदर्शन निदान। |
| [dsh-github](https://github.com/PerryLink/dsh-github) | DSH के लिए GitHub PR/issues एकीकरण, हर लेखन अनुमोदन-द्वारित |
| [dsh-library](https://github.com/PerryLink/dsh-library) | DeepSeek Harness के लिए स्थानीय दस्तावेज़ ज्ञानकोश। |
| [dsh-local-ai](https://github.com/PerryLink/dsh-local-ai) | DeepSeek Harness के लिए स्थानीय-मॉडल (Ollama) एकीकरण। |
| [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) | भाषा सर्वरों पर LSP निदान, फ़ॉर्मेटिंग, पूर्णता, कोड क्रियाएँ और नाम बदलना |
| [dsh-mask](https://github.com/PerryLink/dsh-mask) | DeepSeek Harness के लिए PII मास्किंग मिडलवेयर — मॉडल तक पहुँचने से पहले व्यक्तिगत डेटा अनाम करता है, प्रदर्शन परत पर बहाल करता है। |
| [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) | केवल-पठन MCP रनटाइम पैनल: /mcp कमांड + स्थिति, टूल और त्रुटियों वाला सेटिंग टैब |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | अनुमोदन-द्वारित क्रॉस-सत्र स्मृति: ctx.memory seam + SQLite + memory टूल |
| [dsh-observe](https://github.com/PerryLink/dsh-observe) | DeepSeek Harness के लिए OpenTelemetry और Langfuse अवलोकनीयता निर्यातक। |
| [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) | Claude Code outputStyles-समतुल्य रनटाइम शैली स्विचिंग |
| [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) | Claude Code-शैली घोषणात्मक allow/deny/ask अनुमति नियम, ऑडिट के साथ |
| [dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide) | माँग-पर एजेंट स्किल के रूप में प्लगइन-विकास ज्ञानकोश |
| [dsh-score](https://github.com/PerryLink/dsh-score) | DeepSeek Harness प्लगइनों के लिए बहु-आयामी गुणवत्ता स्कोरिंग। |
| [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) | Web साइडबार में सत्र पिन करें, स्थायी क्रम के साथ |
| [dsh-session-sync](https://github.com/PerryLink/dsh-session-sync) | DeepSeek Harness के लिए क्रॉस-डिवाइस सत्र सिंक — आपके सत्र स्टोर का एक समर्पित git मिरर। |
| [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) | सुरक्षा-ऑडिट स्किल पैक: सीक्रेट स्कैन, निर्भरता और आपूर्ति-श्रृंखला समीक्षा |
| [dsh-talk](https://github.com/PerryLink/dsh-talk) | DeepSeek Harness के लिए आवाज़-प्रथम सत्र लूप: बोलें और उत्तर सुनें। |
| [dsh-test-drive](https://github.com/PerryLink/dsh-test-drive) | DeepSeek Harness प्लगइनों के लिए पृथक इंस्टॉल-और-स्मोक परीक्षण। |
| [dsh-translate](https://github.com/PerryLink/dsh-translate) | DeepSeek Harness के लिए वेंडर पैरामीटर अनुवाद और नियतात्मक JSON मरम्मत। |

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors
