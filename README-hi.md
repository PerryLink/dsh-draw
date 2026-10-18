<div align="center">

# 🎨 dsh-draw

> 🧊 **2026-10-05 से फ़्रोज़न** — केवल वास्तविक खराबी ठीक होती है। नीचे दर्ज अधिक-अपनाए गए विकल्प को प्राथमिकता दें।
- **1024 स्टोर चैनल**: एक बार `npm i -g dsh1024`, फिर `dsh1024 plugin --profile web add dsh-draw` ([deepseek1024.com](https://deepseek1024.com) इंस्टॉल रैंकिंग में गिना जाता है)।

**DeepSeek Harness के लिए एकीकृत स्थिर-छवि निर्माण रूटिंग।**

*एक टूल, कई इंजन — स्वास्थ्य-सजग फ़ॉलबैक, टिकाऊ परिणाम, गिना हुआ उपयोग।*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-draw)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-draw.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-en.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-draw/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-draw/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-draw?label=version)](https://github.com/PerryLink/dsh-draw/releases)
[![npm version](https://img.shields.io/npm/v/dsh-draw)](https://www.npmjs.com/package/dsh-draw)
[![npm downloads](https://img.shields.io/npm/dm/dsh-draw)](https://www.npmjs.com/package/dsh-draw)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-draw?metric=downloads&lang=hi)](https://dshfind.com/hi/plugins/PerryLink/dsh-draw?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-draw
```


</div>

---


**📖 इकोसिस्टम नॉलेज बेस** — मापे गए आँकड़े, मार्केटिंग नहीं: [डेवलपमेंट गाइड · चयन डेटा · रखरखाव मानदंड](https://perrylink.github.io/dsh-plugin-guide/)।

<!-- star-cta -->

## इंस्टॉल और अनइंस्टॉल

- **git चैनल** (नवीनतम `main`): `dsh plugin --profile web add github:PerryLink/dsh-draw` — `prepare` स्क्रिप्ट केवल प्रोडक्शन निर्भरताओं से बिल्ड करती है।
- **npm चैनल** (प्रकाशित रिलीज़): `dsh plugin --profile web add dsh-draw`।
- **tarball चैनल**: इस रेपो में `pnpm pack`, फिर `dsh plugin --profile web add ./dsh-draw-<version>.tgz`।
- **अनइंस्टॉल**: `dsh plugin --profile web remove dsh-draw` (या प्रोफ़ाइल पैच से पंक्ति हटाएँ)।

> यदि pnpm इस पैकेज के लिए `ERR_PNPM_IGNORED_BUILDS` दिखाता है (esbuild का हानिरहित प्लेटफ़ॉर्म-बाइनरी सत्यापन), तो अपने `pnpm-workspace.yaml` में `allowBuilds: { esbuild: true }` जोड़ें — `dsh` CLI सटीक स्निपेट प्रिंट करता है।

## What is dsh-draw?

DeepSeek Harness के लिए एकीकृत स्थिर-छवि निर्माण रूटिंग।

एक टूल, कई इंजन — स्वास्थ्य-सजग फ़ॉलबैक, टिकाऊ परिणाम, गिना हुआ उपयोग।

![dsh-draw का टर्मिनल डेमो: dsh-draw — install, then ask the agent to draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-hero.png)

![Animated terminal demo of dsh-draw](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-demo.gif)

*वही रन, एनिमेटेड।*

## रखरखाव स्थिति: 🧊 फ़्रीज़

> **2026-10-05 से फ़्रीज़। कोई नई सुविधा नहीं।** यह पैकेज अभी भी काम करता है और **सेवानिवृत्त नहीं है**, पर अब इसमें नई सुविधाओं का काम नहीं होगा; केवल वास्तविक खराबी ठीक की जाएगी।

रखरखावकर्ताओं का मानना है कि इस क्षमता में **अधिक अपनाए गए विकल्प अब मौजूद हैं**, इसलिए प्रयास अन्यत्र स्थानांतरित किया गया। 2026-10-05 को मापी गई तुलना:

| | पैकेज | साप्ताहिक डाउनलोड |
|---|---|---|
| **यह पैकेज** | `dsh-draw` | 973 |
| अधिक अपनाया गया विकल्प | [`dsh-image-gen`](https://github.com/shanliuling/dsh-image-gen) | **7,216** |
| अन्य विकल्प | `@goodandready/dsh-image-gen` | 4,822 |

👉 **नए काम के लिए dsh-image-gen को प्राथमिकता दें।** मौजूदा इंस्टॉल बिना किसी बदलाव के काम करते रहेंगे।

*पूर्ण प्रमाण: `dsh-plugin-supersession-review-20261005.md`। पूरा पाठ [README.md](README.md) के **Maintenance status: 🧊 FROZEN** अनुभाग में।*

## ⭐ 如果它帮到了你

यह प्लगइन [DSH प्लगइन परिवार](https://github.com/PerryLink) का हिस्सा है (95 प्लगइन, सभी Apache-2.0)। अगर यह उपयोगी लगे, तो **एक स्टार दें** — इससे कोई सुविधा अनलॉक नहीं होती, पर अगला व्यक्ति इसे खोज में आसानी से पा लेता है।

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## Comparison

![dsh-draw का मापा गया तुलना चार्ट](https://raw.githubusercontent.com/PerryLink/dsh-draw/main/docs/assets/dsh-draw-evidence.png)

measured 2026-10-05 · from the README's FROZEN maintenance table (npm weekly downloads)

## संगतता

| सतह | स्थिति |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1` (`0.1.5-rc.2` के लिए घोषित संगतता) |
| Node | `^22.19.0 \|\| >=24.0.0` |
| इंजन | कोई भी OpenAI-संगत images एंडपॉइंट; OpenAI Images (`gpt-image-1`) और Zhipu CogView (`cogview-3-flash`) प्रीसेट |
| सतहें | Host `image_generate` टूल + वेब परिणाम कार्ड + Plugins सेटिंग टैब |

ब्राउज़र हिस्सा cordis `Context` और प्रकाशित क्लाइंट पैकेजों (`dsh-client-ui-slots`, `dsh-client-ui-settings`, `dsh-client-ui-tool`, `dsh-client-locale`, `dsh-client-connection`) पर चलता है; यह अब हटाए गए `dsh-client-runtime` पैकेज पर निर्भर नहीं करता (टूल-कॉल ब्लॉक स्थानीय संरचनात्मक अनुबंध से पढ़ा जाता है), इसलिए क्लाइंट सतह `0.1.2-rc.1` होस्ट के साथ भी मेल खाती है।
0.1.2-rc.1 (2026-09-02 को अनुकूलित): सत्र लिफ़ाफ़ा अपना ignorable फ़ील्ड केवल संग्रहीत-लॉग पठन संगतता के लिए रखता है - Session.append अभी भी इसे स्टैम्प नहीं कर सकता, इसलिए गेट व्यवहार अपरिवर्तित है। 2026-09-06 को dsh-v0.1.7-alpha.1 master checkout के विरुद्ध सत्यापित (पूर्ण गेट श्रृंखला + प्रोफ़ाइल इंस्टॉल स्मोक)।
0.1.6-alpha.2 (2026-09-18 को अनुकूलित): `Session.append` का तीसरा पैरामीटर केवल सरफ़ेस-योग्य प्रकारों के लिए होता है और वह `SurfaceIntent` है, कभी `ignorable` एनवेलप नहीं, इसलिए गैर-सरफ़ेस `draw/generated` इस लाइन पर अब भी नहीं लिखा जाता — कोटा प्रति-सत्र स्मृति में गिना जाता है और सत्र पुनः आरंभ पर रीसेट होता है। 2026-09-18 को सत्यापित (दोहरा typecheck + पूरी सूट + self-contained/artifacts/readme गेट)।
0.1.7-rc.2 (2026-10-04 को अनुकूलित): क्लाइंट `tool.call.toolview` अनुबंध ने अपने owner को तीन चरणों (`preparing` / `start` / `result`) में बाँट दिया, और अब keyed कार्ड तब भी भेजा जाता है जब आर्ग्युमेंट अभी स्ट्रीम हो रहे हों। इसलिए परिणाम कार्ड उन पूर्व चरणों के लिए अपनी इन-फ़्लाइट पंक्ति भी दिखाता है: भरा हुआ keyed सेल कभी होस्ट की सामान्य पंक्ति तक नहीं पहुँचता, इसलिए तैयारी के चरण को खाली उत्तर देने से पूरी स्ट्रीमिंग अवधि में वह पंक्ति खाली रह जाती थी। और कुछ नहीं बदला: तय हो चुका कार्ड, लेखा पंक्ति और पुनः-उत्पादन पहले जैसे ही व्यवहार करते हैं। 2026-09-23 को सत्यापित (दोहरा typecheck + पूरी सूट + नया host-contract गेट)।

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
dsh plugin --profile web add github:PerryLink/dsh-draw
```

```sh
# 1. बंडल को अपने प्रोफ़ाइल में इंस्टॉल करें
dsh plugin --profile web add github:PerryLink/dsh-draw

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
| परिणाम कार्ड (`tool.call.toolview`, key `image_generate`) | कॉल के हर चरण में: आर्ग्युमेंट स्ट्रीम होते समय इन-फ़्लाइट पंक्ति, और तय होने पर छवियाँ, इंजन/कोटा पंक्ति तथा एक-क्लिक regenerate (पूरा drawer पथ: कोटा + रूटिंग + ऑडिट) |
| सेटिंग टैब (Plugins → Image generation) | इंजन श्रृंखला, क्रेडेंशियल स्थिति, API कुंजी सेट/हटाएँ (क्रेडेंशियल संदर्भ), कनेक्टिविटी जाँच, कोटा सीमाएँ |

## अनुमतियाँ और डेटा

- **अनुमतियाँ**: प्लगइन केवल कॉन्फ़िगर किए इंजन एंडपॉइंट पर आउटबाउंड HTTPS कॉल करता है; बाकी सब केवल-पठन है। सेटिंग टैब का एकमात्र लेखन आधिकारिक `ctx.credentials` सीम पर क्रेडेंशियल सेट/हटाना है।
- **डेटा**: बनी छवियाँ आधिकारिक अटैचमेंट स्टोर से हार्नेस की अपनी नीति के तहत सहेजी जाती हैं। कोटा उपयोग `draw/generated` सत्र इवेंट से मोड़ा जाता है, साथ में उन होस्ट पर इन-मेमोरी फ़ॉलबैक लेजर से जो उन इवेंट को लॉग नहीं कर सकते — और कुछ संग्रहीत नहीं होता।
- **सत्र लॉग**: `draw/generated` इवेंट इंजन, मॉडल, मानकीकृत अनुरोध, बाइट योग और अटैचमेंट आईडी दर्ज करता है — ऑडिट तथ्य, कभी API कुंजियाँ नहीं। इवेंट तभी जोड़ा जाता है जब होस्ट उस प्रकार को जानता हो या `ignorable` एनवेलप स्वीकार करता हो (माउंट पर जांचा जाता है); rc.6/rc.7 होस्ट और एनवेलप-रहित `0.1.2-rc.1` होस्ट (जिसने एनवेलप हटा दिया और पढ़ने पर अज्ञात प्रकारों पर फेल-क्लोज़ करता है) पर पेलोड इन-मेमोरी फ़ॉलबैक लेजर में जाता है, इसलिए इमेज बनाने से सत्र अब दोबारा खुलने से इनकार नहीं करता।

## सुरक्षा सीमाएँ

- **क्रेडेंशियल संदर्भ, कभी शाब्दिक नहीं।** `apiKeyRef` एक पर्यावरण-चर का नाम है; क्रेडेंशियल जड़ा `baseUrl` लोड पर ज़ोर से विफल होता है।
- **सैनिटाइज़्ड प्रदर्शन।** URL, जाँच नोट और त्रुटि पाठ किसी भी प्रदर्शन या लॉग से पहले रिडैक्ट होते हैं (userinfo पासवर्ड, क्रेडेंशियल क्वेरी मान, bearer टोकन, JWT)।
- **कोटा खर्च से पहले।** जनरेशन और बाइट सीमाएँ इंजन कॉल से पहले और भंडारण से पहले जाँची जाती हैं; ख़त्म सत्र बिना क्रेडिट जलाए तेज़ी से विफल होते हैं।
- **ज़ोर से विफल, सोच-समझकर फ़ॉलबैक।** विकृत प्रतिक्रियाएँ संरचित त्रुटियाँ देती हैं; विफल इंजन अपनी cooldown सीमा के बाद छोड़ा जाता है, और थकी श्रृंखला सफलता का दिखावा करने के बजाय पूरा प्रयास रिकॉर्ड लौटाती है।

## ज्ञात सीमाएँ

- **केवल छवि मॉडल।** कोई वीडियो, ऑडियो या संपादन एंडपॉइंट नहीं; कोई विज़ुअल समझ नहीं।
- **इंजन संगतता।** इंजन को OpenAI `POST /images/generations` आकार बोलना चाहिए (base64 या URL डिलीवरी); प्रदाता-विशेष अतिरिक्त दायरे से बाहर हैं।
- **लागत-जागरूकता संरचनात्मक है।** प्लगइन कॉल और बाइट गिनता है, इंजन मूल्य नहीं जानता — लागत प्रशासन के लिए `dsh-budget` के साथ जोड़ें।
- **rc.6/rc.7, 0.1.2-rc.1 और 0.1.6-alpha.2 पर कोटा स्थायित्व।** जिन होस्ट का सत्र लॉग `draw/generated` को सुरक्षित रूप से नहीं रख सकता (स्थिर इवेंट श्वेतसूची, कोई `ignorable` एनवेलप नहीं; `0.1.2-rc.1` ने एनवेलप हटा दिया और पढ़ने पर अज्ञात इवेंट प्रकारों पर फेल-क्लोज़ करता है; `0.1.6-alpha.2` पर append का तीसरा पैरामीटर केवल सरफ़ेस प्रकारों के लिए है, इसलिए गैर-सरफ़ेस इवेंट चिह्नित नहीं हो सकता), कोटा इन-मेमोरी फ़ॉलबैक लेजर से जीवित सत्र में सटीक रहता है लेकिन पुनः आरंभ पर रीसेट हो जाता है; प्लगइन इवेंट सतह वाले होस्ट पर टिकाऊ लेखांकन फिर से शुरू होता है। पहला अस्वीकृत कमिट एक बार चेतावनी देता है, इसलिए गिरावट चुपचाप नहीं रहती।

## विकास

```sh
pnpm install        # node ^22.19 || >=24
pnpm run typecheck  # tsc: src + tests स्थानीय हार्नेस चेकआउट के विरुद्ध
pnpm run typecheck:ci  # tsc प्रकाशित 0.1.7-rc.2 फ़ेस के विरुद्ध (बिना paths)
pnpm test           # vitest: 19 spec फ़ाइलें (स्क्रिप्टेड ट्रांसपोर्ट, वास्तविक Context/Session/ToolRuntime)
pnpm run build      # tsc घोषणाएँ + tsdown बंडल (lib/)
pnpm run verify:self-contained  # निर्भरता स्पेक registry से हल होती हैं
pnpm run verify:host-contract   # host का tool-view अनुबंध अब भी इस प्लगइन की घोषणा से मेल खाता है
pnpm run verify:artifacts       # host ESM फ़ेस + typert मैनिफ़ेस्ट + ब्राउज़र बंडल + कॉन्फ़िग फ़ाइलें
pnpm pack           # प्रकाशित tarball
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `image-generation`, `openai-images`, `cogview`, `zhipu`, `text-to-image`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — निर्माता और मेंटेनर: इंजन रूटर, drawer, कोटा लेखा, Typert wire शब्दावली, ब्राउज़र आधा और पाँच-भाषा दस्तावेज़।
- [@Mohei-Muun](https://github.com/Mohei-Muun) — rc.7 होस्ट पर `draw/generated` सत्र-लॉग लोड विफलता की सूचना दी ([#2](https://github.com/PerryLink/dsh-draw/issues/2)), जिससे अनुकूली इवेंट गेट बना।

## PerryLink DSH Plugin Family

यह प्रोजेक्ट [PerryLink](https://github.com/PerryLink) के **87 सक्रिय रूप से अनुरक्षित** DeepSeek Harness प्लगइन में से एक है। पूरा परिवार **95** प्लगइन है — **5 फ़्रोज़न**, **3 सेवानिवृत्त** — और नीचे संक्षिप्त रखा गया है ताकि हर README की पहली स्क्रीन छोटी रहे। हर पंक्ति देखने के लिए इसे खोलें; कारण स्थिति कॉलम में है।

<details>
<summary>सभी 95 प्लगइन खोलें</summary>

| प्लगइन | एक पंक्ति | स्थिति |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** | 应急演练脚本核对（按阶段、响应分级、指挥与资源要素核对脚本齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** | 环评导则适用性核对（按要素、导则名称与执行标准核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** | 应急预案要素齐备性与条款级页码定位（依据 GB/T 29639-2020 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** | 作文量表评分核对（按评分项、原文定位与分值算术核对评分自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** | 证据清单齐备性核对（按待证事实与证据要素核对清单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** | 出口管制物项核对（按管制清单、最终用途与许可证核对台账齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics for DeepSeek Harness. |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** | FMEA 分析表要素齐备性与风险顺序数一致性核对（按公开的 FMEA 方法标准核对表内自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** | 预测准确率考核核对（按准确率、门槛与考核单价核对考核费用的算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Deterministic research reports for Chinese public mutual funds |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issues integration for DSH, every write gated by approval |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** | 公文流转与办理时限核对（按公开的公文处理规范核对环节完整性与时限，仅提示差异，不作出定性结论） |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** | 公文格式要素核对（按公开的党政机关公文格式标准核对版头与主体要素，仅提示差异，不作出定性结论） |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** | 劳动保护与安全防护用品配置表核对（按公开的配备标准核对品名规格与配置数量，仅提示差异，不作出定性结论） |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** | 危险化学品临界量与重大危险源辨识核对（按储存量与临界量核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** | HAZOP 分析表要素齐备性与偏差推导一致性核对（依据公开的危险与可操作性分析标准，仅提示差异，不作出定性结论） |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** | 安全隐患台账→《工贸企业重大事故隐患判定标准》（应急管理部令第10号）条款映射提示（仅提示差异，不作出定性结论） |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** | 商品归类层级一致性核对（按章、品目、子目与商品编号的层级关系核对自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** | ICD 合并编码与星剑号配对提示（依据 GB/T 14396-2016 与公开的 ICD 使用说明，仅提示差异，不作出定性结论） |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry research orchestration that seals its deliverables through this plugin's `ctx.researchReport.assemble` |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** | 法条引用与文书要素核对（按名称、条号、原文与效力状态核对引用可核验性，仅提示差异，不作出定性结论） |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** | Laya typed decisions (`noul`/`choice`/`score`) as a first-class Cordis service and model-visible tools |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** | 信用证单据条款核对（按单据种类、份数、期限与不符点核对交单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** | 能力差距与培养计划核对（按能力等级差、培养措施与完成期限核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base for DeepSeek Harness. |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local-model (Ollama) integration for DeepSeek Harness. |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions and rename over language servers |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking middleware: anonymize at the model boundary, restore at the display layer |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** | 病案首页形式质控与逻辑矛盾提示（依据国卫办医发〔2016〕24号等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** | 国家自然科学基金申请书形式审查与匿名化提示（依据《国家自然科学基金条例》与申请人导入的当年指南，仅提示差异，不作出定性结论） |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** | 护理记录时限、签名与评估表完整性校验（依据《病历书写基本规范》等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** | 原产地区域价值成分核对（按 RVC 定义式与门槛核对原产地判定自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** | 在线点评回复台账核对（按回复时限、问题分类与整改状态核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles-equivalent runtime style switching |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** | 试卷解析结构核对（按题型、答案、分值与 yotta 标识核对试卷结构自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code-style declarative allow/deny/ask permission rules with audit |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** | 行政许可办理核对（按申请材料、法定时限与决定记录核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** | 项目全流程文件链条核对（按环节先后与金额口径核对链条自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** | 起诉状要素齐备性核对（按诉请、事实、证据、法条四要素核对文书齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | One-package, one-corridor-index plugin upgrade skill: routes a repository to the matching closed corridor card |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** | 政策专报要素核对（按观点、依据、出处与建议核对专报齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** | 线损电量拆分与考核表核对（依据公开的线损计算口径，仅提示差异，不作出定性结论） |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** | 电力工作票要素齐备性与签发许可顺序核对（依据现行电力安全工作规程，仅提示差异，不作出定性结论） |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** | PPAP 提交要素齐备性核对（按公开的 PPAP 手册与提交等级核对要素齐备与版本填写，仅提示差异，不作出定性结论） |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** | 质疑与投诉期限核对（按公开的政府采购质疑投诉规定核对期限与台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** | 铁路施工天窗台账核对（按时间窗、时长算术与命令号核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>

## License

[Apache License 2.0](LICENSE) © 2026 dsh-draw contributors

### DSH Desktop मार्केट से इंस्टॉल करें

सभी PerryLink प्लगइन DSH Desktop के बिल्ट-इन मार्केट में देखे जा सकते हैं: **Market → Sources → add source → पेस्ट करें** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ चुनें**। इंस्टॉलेशन मार्केट के npm-identity सत्यापन और आपकी पुष्टि से ही होता है।
